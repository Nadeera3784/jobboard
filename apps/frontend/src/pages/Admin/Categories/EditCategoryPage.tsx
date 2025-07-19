import { useEffect, useState } from 'react';
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
import { CreateCategorySchema as UpdateCategorySchema } from '../../../schemas';
import { HttpStatus } from '../../../constants';
import { Intercom } from '../../../utils';

export const EditCategoryPage = () => {
  let { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof UpdateCategorySchema>>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      name: '',
      status: '',
    },
  });

  const onInit = async () => {
    try {
      setLoading(true);
      const response = await Intercom.get(`/categories/${id}`);
      if (response.data.statusCode === HttpStatus.OK) {
        setLoading(false);
        form.reset({
          name: response?.data?.data?.name,
          status: response?.data?.data?.status,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.warning('Something went wrong, Please try again later');
    }
  };

  const onUpdate = async (params: object, id: string) => {
    try {
      setLoading(true);
      const response = await Intercom.put(`/categories/${id}`, params);
      if (response.data.statusCode === HttpStatus.OK) {
        toast.success(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.warning('Something went wrong, Please try again later');
    }
  };

  const onSubmit = async (values: z.infer<typeof UpdateCategorySchema>) => {
    const validatedFields = UpdateCategorySchema.safeParse(values);
    if (!validatedFields.success) {
      toast.warning('Something went wrong, Please try again later');
      return;
    }
    if (id) {
      await onUpdate(values, id);
    }
  };

  useEffect(() => {
    onInit();
  }, [id]);

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
            <div className="flex items-center space-x-2">
              <Link to="/admin/categories">
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
                {!loading && (
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
                                disabled={loading}
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
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                disabled={loading}
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
                      <Button disabled={loading} type="submit">
                        {loading && (
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
