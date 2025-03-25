"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateJobPage() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const jobData = {
      title: formData.get('title'),
      description: formData.get('description'),
      hr: Number(formData.get('hr')),
      hrUnit: formData.get('hrUnit'),
      location: formData.get('location'),
      startDate: formData.get('startDate'),
      type: formData.get('type'),
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/job/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Job created successfully",
        });
        router.push('/jobs');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <div className="container max-w-4xl mx-auto py-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Job</h1>
            <p className="text-muted-foreground mt-1">Post a new job opportunity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  name="title"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  placeholder="Describe the role, responsibilities, and requirements"
                  required
                  className="min-h-[200px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hours</label>
                  <Input
                    name="hr"
                    type="number"
                    placeholder="Number of hours"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hour Unit</label>
                  <Select name="hrUnit" defaultValue="per_week">
                    <SelectTrigger>
                      <SelectValue placeholder="Select hour unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per_week">Per Week</SelectItem>
                      <SelectItem value="per_month">Per Month</SelectItem>
                      <SelectItem value="total">Total</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  name="location"
                  placeholder="e.g. Remote, New York, London"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  name="startDate"
                  type="date"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Type</label>
                <Select name="type" defaultValue="full_time">
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Job Posting
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}