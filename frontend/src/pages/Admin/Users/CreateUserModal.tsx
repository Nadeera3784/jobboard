import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../components/Form/Form";
import { useCreateLocation } from '../../../hooks/Locations/useCreateLocation';
import { Button } from "../../../components/Form/Button";
import { Input } from "../../../components/Form/Input"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/Dialog/Dialog"
import { CreateCategorySchema } from "../../../schemas";
import HttpStatus from '../../../constants/HttpStatus';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/Form/Select";

export const CreateUserModal = ({ refresh }: { refresh: () => void }) => {

    const { response, process } = useCreateLocation();

    const form = useForm<z.infer<typeof CreateCategorySchema>>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            name: "",
        },

    });

    const onSubmit = async (values: z.infer<typeof CreateCategorySchema>) => {
        const validatedFields = CreateCategorySchema.safeParse(values);

        if (!validatedFields.success) {
            toast.warning("Something went wrong, Please try again later");
            return;
        }
        await process(validatedFields.data);
        if (response.status_code === HttpStatus.OK) {
            form.reset();
            toast.success('Category created successfully!');
            refresh();
        } else {
            toast.warning("Something went wrong, Please try again later");
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
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2"
                        >
                            <div className="grid grid-cols-2 gap-4">
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
                                        <FormMessage
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
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
                                        <FormMessage
                                        />
                                    </FormItem>
                                )}
                            />
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
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
                                        <FormMessage
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                disabled={response.loading}
                                                onValueChange={field.onChange} defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage
                                        />
                                    </FormItem>
                                )}
                            />


                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button
                                    disabled={response.loading}
                                    type="submit"
                                >
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
    )
}