import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/Form/Form';
import { useCreateUser } from '../../../hooks/Users/useCreateUser';
import { Button } from '../../../components/Form/Button';
import { Input } from '../../../components/Form/Input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/Dialog/Dialog';
import { CreateUserSchema } from '../../../schemas';
import {
  HttpStatus,
  UserStatusConstants,
  RoleConstants,
} from '../../../constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/Form/Select';

export const CreateUserModal = ({ refresh }: { refresh: () => void }) => {
  const { response, process } = useCreateUser();

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      status: '',
      role: '',
      image: new File([], ''),
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    const validatedFields = CreateUserSchema.safeParse(values);

    if (!validatedFields.success) {
      toast.warning('Something went wrong, Please try again later');
      return;
    }

    await process(validatedFields.data);

    if (response.status_code === HttpStatus.OK) {
      form.reset();
      toast.success('User created successfully!');
      refresh();
    } else {
      toast.warning('Something went wrong, Please try again later');
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            New User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
            <DialogDescription> Create a new user</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid grid-cols-2 gap-4 mb-3">
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
                          type="email"
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          disabled={response.loading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={RoleConstants.USER}>
                              User
                            </SelectItem>
                            <SelectItem value={RoleConstants.ADMIN}>
                              Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                          placeholder="********"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={response.loading}
                          placeholder="********"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          disabled={response.loading}
                          type="file"
                          // onChange={e =>
                          //   field.onChange(
                          //     e.target.files ? e.target.files[0] : null,
                          //   )
                          // }
                          onChange={(event) =>
                            onChange(event.target.files && event.target.files[0])
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserStatusConstants.ACTIVE}>
                              Active
                            </SelectItem>
                            <SelectItem value={UserStatusConstants.INACTIVE}>
                              Inactive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
                <Button disabled={response.loading} type="submit">
                  {response.loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
