import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef } from 'react';
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
import { User, UpdateUserSettingsType } from '../../types';

const companySettingsSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  about: z.string().optional(),
  country: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  comments: z.boolean().optional(),
  candidates: z.boolean().optional(),
  offers: z.boolean().optional(),
  pushNotifications: z.enum(['everything', 'email', 'nothing']).optional(),
});

type CompanySettingsFormData = z.infer<typeof companySettingsSchema>;

interface CompanySettingsFormProps {
  user: User | null;
  onSubmit: (data: UpdateUserSettingsType, imageFile?: File) => Promise<void>;
  isLoading: boolean;
}

export const CompanySettingsForm = ({ user, onSubmit, isLoading }: CompanySettingsFormProps) => {
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        user?.image?.value || null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CompanySettingsFormData>({
        resolver: zodResolver(companySettingsSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            about: user?.about || '',
            country: user?.country || 'United States',
            streetAddress: user?.streetAddress || '',
            city: user?.city || '',
            state: user?.state || '',
            zip: user?.zip || '',
            comments: user?.comments || false,
            candidates: user?.candidates || false,
            offers: user?.offers || false,
            pushNotifications: (user?.pushNotifications as 'everything' | 'email' | 'nothing') || 'email',
        },
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
                alert('Please select a valid image file (PNG, JPEG, JPG, or WebP)');
                return;
            }
            
            // Validate file size (1MB)
            if (file.size > 1000000) {
                alert('File size must be less than 1MB');
                return;
            }
            
            setSelectedImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangePhoto = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (data: CompanySettingsFormData) => {
        const updateData: UpdateUserSettingsType = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            about: data.about,
            country: data.country,
            streetAddress: data.streetAddress,
            city: data.city,
            state: data.state,
            zip: data.zip,
            comments: data.comments,
            candidates: data.candidates,
            offers: data.offers,
            pushNotifications: data.pushNotifications,
        };
        await onSubmit(updateData, selectedImageFile || undefined);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Company Profile
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                This information will be displayed publicly so be careful what
                                you share.
                            </p>
                        </div>

                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="about"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                About Company
                                            </FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={3}
                                                    className="max-w-lg shadow-sm block w-full focus:ring-black focus:border-black sm:text-sm border border-gray-300 rounded-md"
                                                    placeholder="Write a few sentences about your company."
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="photo"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Company Logo
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="flex items-center">
                                        <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Company Logo"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <svg
                                                    className="h-full w-full text-gray-300"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            )}
                                        </span>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            aria-label="Upload company logo"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleChangePhoto}
                                            className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                        >
                                            Change
                                        </button>
                                    </div>
                                    {selectedImageFile && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Selected: {selectedImageFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Company Information
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Use a permanent address where you can receive mail.
                            </p>
                        </div>
                        <div className="space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                Company Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="organization"
                                                    className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                Email address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    autoComplete="email"
                                                    className="block max-w-lg w-full shadow-sm focus:ring-black focus:border-black sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                Phone
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    autoComplete="tel"
                                                    className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                Country / Region
                                            </FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    autoComplete="country"
                                                    className="max-w-lg block focus:ring-black focus:border-black w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                                >
                                                    <option value="United States">United States</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="Mexico">Mexico</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="streetAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                Street address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="street-address"
                                                    className="block max-w-lg w-full shadow-sm focus:ring-black focus:border-black sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                City
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                State / Province
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <FormField
                                    control={form.control}
                                    name="zip"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                ZIP / Postal
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="postal-code"
                                                    className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200 pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Notifications
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                We'll always let you know about important changes, but you
                                pick what else you want to hear about.
                            </p>
                        </div>
                        <div className="space-y-6 sm:space-y-5 divide-y divide-gray-200">
                            <div className="pt-6 sm:pt-5">
                                <div role="group" aria-labelledby="label-email">
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                                        <div>
                                            <div
                                                className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                                                id="label-email"
                                            >
                                                By Email
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:col-span-2">
                                            <div className="max-w-lg space-y-4">
                                                <div className="relative flex items-start">
                                                    <div className="flex items-center h-5">
                                                        <FormField
                                                            control={form.control}
                                                            name="comments"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={field.value}
                                                                            onChange={field.onChange}
                                                                            className="focus:ring-black h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label
                                                            htmlFor="comments"
                                                            className="font-medium text-gray-700"
                                                        >
                                                            Comments
                                                        </label>
                                                        <p className="text-gray-500">
                                                            Get notified when someone posts a comment on a
                                                            job posting.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="relative flex items-start">
                                                        <div className="flex items-center h-5">
                                                            <FormField
                                                                control={form.control}
                                                                name="candidates"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={field.value}
                                                                                onChange={field.onChange}
                                                                                className="focus:ring-black h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="ml-3 text-sm">
                                                            <label
                                                                htmlFor="candidates"
                                                                className="font-medium text-gray-700"
                                                            >
                                                                Candidates
                                                            </label>
                                                            <p className="text-gray-500">
                                                                Get notified when a candidate applies for a
                                                                job.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="relative flex items-start">
                                                        <div className="flex items-center h-5">
                                                            <FormField
                                                                control={form.control}
                                                                name="offers"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={field.value}
                                                                                onChange={field.onChange}
                                                                                className="focus:ring-black h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="ml-3 text-sm">
                                                            <label
                                                                htmlFor="offers"
                                                                className="font-medium text-gray-700"
                                                            >
                                                                Offers
                                                            </label>
                                                            <p className="text-gray-500">
                                                                Get notified when a candidate accepts or
                                                                rejects an offer.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 sm:pt-5">
                                <div role="group" aria-labelledby="label-notifications">
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                                        <div>
                                            <div
                                                className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                                                id="label-notifications"
                                            >
                                                Push Notifications
                                            </div>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <div className="max-w-lg">
                                                <p className="text-sm text-gray-500">
                                                    These are delivered via SMS to your mobile phone.
                                                </p>
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-center">
                                                        <FormField
                                                            control={form.control}
                                                            name="pushNotifications"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <input
                                                                            type="radio"
                                                                            name={field.name}
                                                                            value="everything"
                                                                            checked={field.value === "everything"}
                                                                            onChange={field.onChange}
                                                                            className="focus:ring-black h-4 w-4 text-indigo-600 border-gray-300"
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <label
                                                            htmlFor="push-everything"
                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                        >
                                                            Everything
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FormField
                                                            control={form.control}
                                                            name="pushNotifications"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <input
                                                                            type="radio"
                                                                            name={field.name}
                                                                            value="email"
                                                                            checked={field.value === "email"}
                                                                            onChange={field.onChange}
                                                                            className="focus:ring-black h-4 w-4 text-indigo-600 border-gray-300"
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <label
                                                            htmlFor="push-email"
                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                        >
                                                            Same as email
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FormField
                                                            control={form.control}
                                                            name="pushNotifications"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <input
                                                                            type="radio"
                                                                            name={field.name}
                                                                            value="nothing"
                                                                            checked={field.value === "nothing"}
                                                                            onChange={field.onChange}
                                                                            className="focus:ring-black h-4 w-4 text-indigo-600 border-gray-300"
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <label
                                                            htmlFor="push-nothing"
                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                        >
                                                            No push notifications
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}; 