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
import { useSharedPostApi } from '../../hooks/useSharedPostApi';
import { HttpStatus } from '../../constants';
import { Spinner } from '../../components/Icons';
import { useAppContext } from '../../contexts/AppContext';

export const LoginPage = () => {
  const { response, process } = useSharedPostApi();
  const { setPermission, setToken } = useAppContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      toast.warning('Something went wrong, Please try again later');
      return;
    }

    process('authentication/signin', validatedFields.data);

    if (response.status_code == HttpStatus.BAD_REQUEST) {
      toast.warning('The email address or password is incorrect. Please retry');
    }

    setPermission(response?.data?.redirect_identifier);
    setToken(response?.data?.access_token);

    navigate(`/admin`);
  };

  return (
    <div className="py-6 lg:py-0 w-full md:w-8/12 lg:w-6/12 xl:w-4/12 relative">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold inline-flex items-center mb-1 space-x-3">
          <svg
            className="hi-solid hi-cube-transparent inline-block w-8 h-8 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
              clipRule="evenodd"
            />
          </svg>
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
                        <Input
                          {...field}
                          disabled={response.loading}
                          type="email"
                        />
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
                        <Input
                          {...field}
                          disabled={response.loading}
                          type="password"
                        />
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
                    disabled={response.loading}
                  >
                    Sign In
                    {response.loading && (
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
            {' '}
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
