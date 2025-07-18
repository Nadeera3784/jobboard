import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MoveLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { Textarea } from '../../../components/Form/Textarea';
import { Button } from '../../../components/Form/Button';
import { httpClient } from '../../../utils';
import { HttpStatus } from '../../../constants';
import { CreateJobSchema } from '../../../schemas';
import { FilterOption } from '../../../types';
import appStateStore from '../../../store';

export const CreateJobPage = () => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [remote, setRemote] = useState([]);
  const { user } = appStateStore(state => state);

  const form = useForm<z.infer<typeof CreateJobSchema>>({
    resolver: zodResolver(CreateJobSchema),
    defaultValues: {
      name: '',
      status: '',
      location: '',
      category: '',
      remote: '',
      job_type: '',
      experience_level: '',
      description: '',
    },
  });

  const onInit = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(`/app/shared/filters`);
      if (response.data.statusCode === HttpStatus.OK) {
        setLocations(response.data.data.location);
        setCategories(response.data.data.category);
        setJobTypes(response.data.data.job_type);
        setExperienceLevels(response.data.data.experience_level);
        setRemote(response.data.data.remote);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.warning('Something went wrong, Please try again later');
    }
  };

  const onCreate = async (params: object) => {
    try {
      setLoading(true);
      const response = await httpClient.post(`/jobs`, params);
      if (response.data.statusCode === HttpStatus.OK) {
        form.reset();
        toast.success(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.warning('Something went wrong, Please try again later');
    }
  };

  const onSubmit = async (values: z.infer<typeof CreateJobSchema>) => {
    const validatedFields = CreateJobSchema.safeParse(values);
    if (!validatedFields.success) {
      toast.warning('Something went wrong, Please try again later');
      return;
    }
    values.user = user?._id;
    await onCreate(values);
  };

  const generateDescription = async (params: {
    jobTitle: string;
    additionalInfo?: string;
  }): Promise<string | null> => {
    try {
      setAiLoading(true);
      const response = await httpClient.post(
        `/jobs/generate-description`,
        params,
      );

      if (response.data.statusCode === HttpStatus.OK) {
        toast.success(response.data.message);
        return response.data.data.description;
      } else {
        toast.warning('Failed to generate job description');
        return null;
      }
    } catch (error: any) {
      console.error('Error generating job description:', error);
      toast.warning(
        error.response?.data?.message ||
          'Something went wrong while generating job description. Please try again later',
      );
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    const jobTitle = form.getValues('name');
    if (!jobTitle) {
      toast.warning('Please enter a job title first');
      return;
    }

    const currentDescription = form.getValues('description');
    const description = await generateDescription({
      jobTitle,
      additionalInfo: currentDescription || undefined,
    });

    if (description) {
      form.setValue('description', description);
    }
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
            <div className="flex items-center space-x-2">
              <Link to="/company/jobs">
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
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={5}
                                disabled={loading}
                                placeholder=""
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              onClick={handleGenerateDescription}
                              disabled={loading || aiLoading}
                            >
                              {aiLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                              )}
                              Generate With AI
                            </Button>
                          </div>
                          <div className="ml-5 text-xs text-muted-foreground">
                            AI will use any existing description content as
                            additional context. You can add notes before
                            generating.
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  disabled={loading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((option: FilterOption) => (
                                      <SelectItem
                                        key={option._id}
                                        value={option._id}
                                      >
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="remote"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Remote</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  disabled={loading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Remote" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {remote.map((option: FilterOption) => (
                                      <SelectItem
                                        key={option._id}
                                        value={option._id}
                                      >
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="job_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job type</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  disabled={loading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Job Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {jobTypes.map((option: FilterOption) => (
                                      <SelectItem
                                        key={option._id}
                                        value={option._id}
                                      >
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-3">
                        <FormField
                          control={form.control}
                          name="experience_level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience Level</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  disabled={loading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Experience Level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {experienceLevels.map(
                                      (option: FilterOption) => (
                                        <SelectItem
                                          key={option._id}
                                          value={option._id}
                                        >
                                          {option.name}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  disabled={loading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Location" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {locations.map((option: FilterOption) => (
                                      <SelectItem
                                        key={option._id}
                                        value={option._id}
                                      >
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
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
                                    <SelectItem value="Active">
                                      Active
                                    </SelectItem>
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
                      </div>
                      <Button disabled={loading} type="submit">
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create
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
