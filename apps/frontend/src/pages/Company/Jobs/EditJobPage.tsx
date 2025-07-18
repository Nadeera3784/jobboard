import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2, MoveLeft } from 'lucide-react';
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

export const EditJobPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [remote, setRemote] = useState([]);

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

  const fetchJobData = async () => {
    if (!id) {
      toast.error('Job ID is required');
      navigate('/company/jobs');
      return;
    }

    try {
      setInitialLoading(true);
      const response = await httpClient.get(`/jobs/${id}`);
      if (response.data.statusCode === HttpStatus.OK) {
        const job = response.data.data;
        form.reset({
          name: job.name || '',
          description: job.description || '',
          category: job.category || '',
          location: job.location || '',
          remote: job.remote || '',
          job_type: job.job_type || '',
          experience_level: job.experience_level || '',
          status: job.status || 'Active',
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch job data';
      toast.error(errorMessage);
      if (error.response?.status === 403) {
        navigate('/company/jobs');
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await httpClient.get(`/app/shared/filters`);
      if (response.data.statusCode === HttpStatus.OK) {
        setLocations(response.data.data.location);
        setCategories(response.data.data.category);
        setJobTypes(response.data.data.job_type);
        setExperienceLevels(response.data.data.experience_level);
        setRemote(response.data.data.remote);
      }
    } catch (error) {
      toast.warning('Failed to load form options');
    }
  };

  const onUpdate = async (params: object) => {
    try {
      setLoading(true);
      const response = await httpClient.put(`/jobs/${id}`, params);
      if (response.data.statusCode === HttpStatus.OK) {
        toast.success(response.data.message);
        navigate('/company/jobs');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update job';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof CreateJobSchema>) => {
    const validatedFields = CreateJobSchema.safeParse(values);
    if (!validatedFields.success) {
      toast.warning('Please check all required fields');
      return;
    }
    await onUpdate(values);
  };

  useEffect(() => {
    fetchFilters();
    fetchJobData();
  }, [id]);

  if (initialLoading) {
    return (
      <div className="bg-gray-100">
        <div className="container p-4 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Edit Job</h2>
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
                              placeholder="Job title"
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
                              placeholder="Job description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                                value={field.value}
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
                                value={field.value}
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
                                value={field.value}
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
                                value={field.value}
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
                                value={field.value}
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
                                value={field.value}
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
                    </div>
                    <div className="flex space-x-4">
                      <Button disabled={loading} type="submit">
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update Job
                      </Button>
                      <Link to="/company/jobs">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
