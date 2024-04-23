import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/Form/Form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/Form/Select';
import { Input } from '../../../components/Form/Input';
import { Button } from '../../../components/Form/Button';
import { UpdateUserSchema } from '../../../schemas';
import { useGetUserById } from '../../../hooks/Users/useGetUserById';
import { useUpdateUser } from '../../../hooks/Users/useUpdateUser';
import { HttpStatus } from '../../../constants';

export const EditUserPage = () => {
  let { id } = useParams<{ id: string }>();

  const { response, process } = useGetUserById();
  const { response: updateResponse, process: processUpdate } = useUpdateUser();

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: '',
      image: '',
      role: '',
    },
  });

  const onInit = async () => {
    if (id !== undefined) {
      await process({ id: id });
      form.reset({
        name: response?.data.name,
        email: response?.data?.email,
        phone: response?.data?.phone,
        status: response?.data?.status,
        image: response?.data?.image,
        role: response?.data?.role,
      });
    }
  };

  useEffect(() => {
    onInit();
  }, [id, response?.status]);

  const onSubmit = async (values: z.infer<typeof UpdateUserSchema>) => {
    const validatedFields = UpdateUserSchema.safeParse(values);
    if (!validatedFields.success) {
      toast.warning('Something went wrong, Please try again later');
      return;
    }
    if (id) {
      await processUpdate(validatedFields.data, id);
    }

    if (updateResponse.status || updateResponse.status_code === HttpStatus.OK) {
      toast.success('User updated successfully!');
    } else {
      toast.warning('Something went wrong, Please try again later');
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Users</h2>
            <div className="flex items-center space-x-2">
              <Link to="/admin/users">
                <Button variant="default">
                  <MoveLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-8">
          <div className="space-y-4 lg:space-y-8">
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
              <div className="space-y-4">
                {!response.loading && (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-2"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={response.loading}
                                placeholder=""
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                placeholder=""
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={response.loading}
                                placeholder=""
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={response.loading}
                                type="file"
                                accept="image/*"
                                onChange={event =>
                                  onChange(
                                    event.target.files && event.target.files[0],
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                disabled={response.loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="InActive">
                                    InActive
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button disabled={updateResponse.loading} type="submit">
                        {updateResponse.loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
