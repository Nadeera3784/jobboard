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
import { CreateCategorySchema } from '../../../schemas';
import { HttpStatus } from '../../../constants';
import { useState } from 'react';
import { Intercom } from '../../../utils';

export const CreateLocationModal = ({ refresh }: { refresh: () => void }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
    },
  });

  const onCreate = async (params: object) => {
    try {
      setLoading(true);
      const response = await Intercom.post(`/locations`, params);
      if (response.data.statusCode === HttpStatus.OK) {
        form.reset();
        toast.success(response.data.message);
        refresh();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.warning('Something went wrong, Please try again later');
    }
  };

  const onSubmit = async (values: z.infer<typeof CreateCategorySchema>) => {
    const validatedFields = CreateCategorySchema.safeParse(values);
    if (!validatedFields.success) {
      toast.warning('Something went wrong, Please try again later');
      return;
    }
    await onCreate(validatedFields.data);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Location
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Location</DialogTitle>
            <DialogDescription> Create a new location</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
                <Button disabled={loading} type="submit">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
