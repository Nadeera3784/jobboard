import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/Form/Form';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';
import { HttpStatus } from '../../constants';
import { Spinner } from '../../components/Icons';
import { useState, useEffect } from 'react';
import { Intercom, cacheJwtToken } from '../../utils';

const TwoFactorSchema = z.object({
  secondFactorCode: z
    .string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

export const TwoFactorAuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const tempToken = location.state?.tempToken;

  useEffect(() => {
    if (!tempToken) {
      navigate('/auth');
    }
  }, [tempToken, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const form = useForm<z.infer<typeof TwoFactorSchema>>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: {
      secondFactorCode: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof TwoFactorSchema>) => {
    if (!tempToken) {
      toast.error('Session expired. Please log in again.');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const response = await Intercom.post(
        '2fa/auth',
        {
          secondFactorCode: parseInt(values.secondFactorCode),
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        },
      );

      if (response.status === HttpStatus.OK) {
        const { redirect_identifier, access_token } = response.data.data;
        cacheJwtToken(access_token);
        navigate(`/${redirect_identifier}`);
        toast.success('Two-factor authentication successful!');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Invalid verification code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!tempToken) {
      toast.error('Session expired. Please log in again.');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const response = await Intercom.post(
        '2fa/resend',
        {},
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        },
      );

      if (response.status === HttpStatus.OK) {
        toast.success(
          response.data.message || 'Verification code resent successfully',
        );
        setResendCooldown(60);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to resend code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!tempToken) {
    return null;
  }

  return (
    <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <div className="p-5 lg:p-6 flex-grow w-full">
        <div className="sm:p-5 lg:px-10 lg:py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Two-Factor Authentication
            </h1>
            <p className="text-gray-600">
              Please enter the 6-digit verification code sent to your email
              address.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="secondFactorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        type="text"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full px-4 py-4 leading-6 space-x-2 font-semibold"
                  disabled={loading}
                >
                  {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Verify Code
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-black hover:text-gray-600 underline disabled:text-gray-400 disabled:cursor-not-allowed"
                    disabled={loading || resendCooldown > 0}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Didn't receive the code? Resend"}
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
        <Link className="font-medium text-black hover:text-gray-400" to="/auth">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
