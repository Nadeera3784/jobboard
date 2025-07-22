import { Link, useNavigate } from 'react-router-dom';
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
import { LoginSchema } from '../../schemas';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';
import { HttpStatus } from '../../constants';
import { Spinner } from '../../components/Icons';
import { useState } from 'react';
import { Intercom, cacheJwtToken } from '../../utils';
import Logo from '../../assets/images/logo.png';

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    try {
      const response = await Intercom.post('authentication/signin', values);
      if (response.status === HttpStatus.OK) {
        const responseData = response.data.data;
        if (responseData.requires_2fa) {
          navigate('/auth/2fa', {
            state: {
              tempToken: responseData.temp_token,
            },
          });
          toast.success(
            responseData.message ||
              'Please check your email for the verification code',
          );
        } else {
          const { redirect_identifier, access_token } = responseData;
          cacheJwtToken(access_token);
          navigate(`/${redirect_identifier}`);
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error('The email address or password is incorrect. Please retry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 lg:py-0 w-full md:w-8/12 lg:w-6/12 xl:w-4/12 relative">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold inline-flex items-center mb-1 space-x-3">
          <img className="inline-block w-10 h-10" alt="logo" src={Logo} />
          <span>JobBoard</span>
        </h1>
        <p className="text-gray-500">
          Welcome, please sign in to your dashboard
        </p>
      </div>
      <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
        <div className="p-5 lg:p-6 flex-grow w-full">
          <div className="sm:p-5 lg:px-10 lg:py-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loading} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loading} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full px-4 py-4 leading-6  space-x-2 font-semibold"
                    disabled={loading}
                  >
                    Sign In
                    {loading && (
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                  </Button>
                  <div className="space-y-2 sm:flex sm:items-center sm:justify-between sm:space-x-2 sm:space-y-0 mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="border border-gray-200 rounded h-4 w-4 text-black focus:ring-none focus-visible:outline-non"
                      />
                      <span className="ml-2">Remember me</span>
                    </label>
                    <Link
                      to="forgot-password"
                      className="inline-block text-black hover:text-gray-600"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
          Don’t have an account yet?
          <Link
            className="font-medium text-black hover:text-gray-400"
            to="register"
          >
            Join us today
          </Link>
        </div>
      </div>
      <div className="text-sm text-gray-500 text-center mt-6">
        <a
          className="font-medium text-black hover:text-indigo-400"
          href="https://google.com"
          target="_blank"
        >
          JobBoard
        </a>{' '}
        by{' '}
        <a
          className="font-medium text-black hover:text-indigo-400"
          href="https://google.com"
          target="_blank"
        >
          nadeera
        </a>
      </div>
    </div>
  );
};
