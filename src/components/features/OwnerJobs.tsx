'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react";

type Job = {
  _id: string;
  title: string;
  description: string;
  hr: number;
  hrUnit: string;
  location: string;
  startDate: string;
  type: string;
  proposals?: Proposal[];
};

type Proposal = {
  _id: string;
  userId: string;
  proposalText: string;
  createdAt: string;
};

const OwnerJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [open, setOpen] = useState(false);
  const [showProposals, setShowProposals] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/job/all');
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async (jobId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/job/proposals/${jobId}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
      
      const data = await response.json();
      if (data.success) {
        setProposals(data.data);
      }
    } catch (error) {
      console.error('Fetch proposals error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch proposals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      const url = isEditMode 
        ? `http://localhost:5000/api/job/edit/${selectedJob?._id}`
        : 'http://localhost:5000/api/job/create';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: `Job ${isEditMode ? 'updated' : 'created'} successfully`,
        });
        fetchJobs();
        setSelectedJob(null);
        setIsEditMode(false);
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} job`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/job/delete/${jobId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Job deleted successfully",
        });
        fetchJobs();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsEditMode(true);
    setOpen(true); 
  };

  const handleViewProposals = (jobId: string) => {
    setShowProposals(jobId);
    fetchProposals(jobId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <Button onClick={() => {
          setIsEditMode(false);
          setSelectedJob(null);
          setOpen(true); 
        }}>
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>{isEditMode ? 'Edit Job' : 'Post a New Job'}</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        placeholder="Job Title"
        required
        defaultValue={selectedJob?.title}
      />
      <Textarea
        name="description"
        placeholder="Job Description"
        required
        defaultValue={selectedJob?.description}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="hr"
          type="number"
          placeholder="Hours"
          required
          defaultValue={selectedJob?.hr}
        />
        <Select name="hrUnit" defaultValue={selectedJob?.hrUnit || "per_week"}>
          <SelectTrigger>
            <SelectValue placeholder="Hour Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="per_week">Per Week</SelectItem>
            <SelectItem value="per_month">Per Month</SelectItem>
            <SelectItem value="total">Total</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Input
        name="location"
        placeholder="Location"
        required
        defaultValue={selectedJob?.location}
      />
      <Input
        name="startDate"
        type="date"
        required
        defaultValue={selectedJob?.startDate?.split('T')[0]}
      />
      <Select name="type" defaultValue={selectedJob?.type || "part_time"}>
        <SelectTrigger>
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="part_time">Part Time</SelectItem>
          <SelectItem value="full_time">Full Time</SelectItem>
          <SelectItem value="temporary">Temporary</SelectItem>
        </SelectContent>
      </Select>
      <DialogClose asChild>
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Save Changes' : 'Post Job'}
        </Button>
      </DialogClose>
    </form>
  </DialogContent>
</Dialog>


        {/* Proposals Dialog */}
       <Dialog open={!!showProposals} onOpenChange={() => setShowProposals(null)}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                <DialogTitle>Job Proposals</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : proposals.length === 0 ? (
                    <p className="text-center text-gray-500">No proposals yet</p>
                ) : (
                    proposals.map((proposal) => (
                    <Card key={proposal._id}>
                        <CardContent className="pt-6">
                        <p className="text-sm">{proposal.proposalText}</p>
                        <div className="mt-2 text-xs text-gray-500">
                            Submitted on: {new Date(proposal.createdAt).toLocaleDateString()}
                        </div>
                        </CardContent>
                    </Card>
                    ))
                )}
                </div>
            </DialogContent>
            </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="truncate">{job.title}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewProposals(job._id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(job._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
              <div className="mt-4 space-y-1">
                <p className="text-sm">Location: {job?.location}</p>
                <p className="text-sm">Hours: {job?.hr} {job?.hrUnit?.replace('_', ' ')}</p>
                <p className="text-sm">Start Date: {new Date(job?.startDate).toLocaleDateString()}</p>
                <p className="text-sm">Type: {job?.type?.replace('_', ' ')}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnerJobs;