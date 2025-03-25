'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Job = {
  _id: string;
  title: string;
  description: string;
  hr: number;
  hrUnit: string;
  location: string;
  startDate: string;
  type: string;
};

const JoinerJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.user);
  console.log("User object:", user);

  // Axios instance with default config
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: Job[] }>('/job/all');
      if (response.data.success) {
        setJobs(response.data.data);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch jobs';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProposalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedJobId || !user?._id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a proposal",
        variant: "destructive",
      });
      return;
    }
  
    const formData = new FormData(event.currentTarget);
    const proposalText = formData.get('proposalText');
  
    if (!proposalText || typeof proposalText !== 'string') {
      toast({
        title: "Error",
        description: "Please enter a proposal",
        variant: "destructive",
      });
      return;
    }
  
    const proposalData = {
      jobId: selectedJobId,
      proposalText,
      userId: user._id
    };
  
    try {
      setProposalLoading(true);
      const response = await api.post('/job/proposal/send', proposalData);
  
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Proposal submitted successfully",
        });
        setDialogOpen(false);
        setSelectedJobId(null);
      }
    } catch (error) {
      let errorMessage = 'Failed to submit proposal';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.errors?.[0] || 
                      error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProposalLoading(false);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Jobs</h1>
        <Button onClick={fetchJobs} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job._id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center gap-4">
                <span className="truncate">{job.title}</span>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedJobId(job._id)}
                    >
                      <Send className="mr-2 h-4 w-4" /> Apply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit Proposal for {job.title}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProposalSubmit} className="space-y-4">
                      <Textarea
                        name="proposalText"
                        placeholder="Write your proposal here..."
                        required
                        className="min-h-[200px]"
                      />
                      <Button
                        type="submit"
                        disabled={proposalLoading}
                        className="w-full"
                      >
                        {proposalLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Submit Proposal
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-500 mb-4">{job.description}</p>
              <div className="space-y-2">
                <p className="text-sm flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{job.location}</span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="font-medium">Hours:</span>
                  <span>
                    {job.hr} {job.hrUnit}
                  </span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="font-medium">Start Date:</span>
                  <span>{new Date(job.startDate).toLocaleDateString()}</span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span>{job.type}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default JoinerJobs;
