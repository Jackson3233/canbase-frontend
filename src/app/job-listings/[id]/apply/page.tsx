'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, ArrowLeft, Briefcase, Clock, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppSelector } from "@/store/hook";
import JobLayout from '../../joblayout';

type Job = {
  _id: string;
  title: string;
};

export default function ApplyJob() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.user);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
  });

  useEffect(() => {
    fetchJobDetails();
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: Job }>(`/job/detail/${params.id}`);
      if (response.data.success) {
        setJob(response.data.data);
      } else {
        throw new Error('Failed to fetch job details');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch job details';
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your proposal",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const proposalText = formData.get('proposalText');

    if (!proposalText || typeof proposalText !== 'string') {
      toast({
        title: "Invalid Submission",
        description: "Please write your proposal before submitting",
        variant: "destructive",
      });
      return;
    }

    if (charCount < 100) {
      toast({
        title: "Proposal Too Short",
        description: "Please write at least 100 characters to ensure a quality proposal",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/job/proposal/send', {
        jobId: params.id,
        proposalText,
        userId: user._id
      });

      if (response.data.success) {
        toast({
          title: "Proposal Submitted!",
          description: "Your proposal has been successfully sent to the client",
        });
        router.push('/job-listings');
      }
    } catch (error) {
      let errorMessage = 'Failed to submit proposal';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.errors?.[0] || 
                      error.message;
      }
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Job not found'}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <JobLayout>
    <div className="container mx-auto p-6 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 flex items-center hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Job Listings
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">{job.title}</CardTitle>
          </div>
          <CardDescription className="text-base">
            Create a compelling proposal that highlights your expertise and explains why you&apos;re the perfect fit for this role.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Tips for a Strong Proposal
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Carefully read the job description and requirements</li>
              <li>• Highlight relevant experience and specific examples</li>
              <li>• Explain why you&apos;re interested in this particular role</li>
              <li>• Keep your proposal clear, professional, and error-free</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="proposalText" className="text-sm font-medium">
                Your Proposal
              </label>
              <Textarea
                id="proposalText"
                name="proposalText"
                placeholder="Introduce yourself and explain why you're the best candidate for this position..."
                required
                className="min-h-[300px] resize-y"
                onChange={handleTextChange}
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Minimum 100 characters</span>
                <span className={charCount < 100 ? "text-destructive" : "text-primary"}>
                  {charCount} characters
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
                className="w-32"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || charCount < 100}
                className="w-32"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </JobLayout>
  );
}