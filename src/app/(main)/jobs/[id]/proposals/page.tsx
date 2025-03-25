"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, User, Calendar, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Proposal = {
  _id: string;
  userId: {
    _id: string;
    username: string; 
    email: string;
  };
  proposalText: string;
  createdAt: string;
};

type Job = {
  _id: string;
  title: string;
};

export default function JobProposalsPage({ params }: { params: { id: string } }) {
  const [proposals, setProposals] = React.useState<Proposal[]>([]);
  const [job, setJob] = React.useState<Job | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    fetchJobAndProposals();
  }, [params.id]);

  const fetchJobAndProposals = async () => {
    try {
      setLoading(true);
      const [jobResponse, proposalsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/job/detail/${params.id}`),
        fetch(`http://localhost:5000/api/job/proposals/${params.id}`)
      ]);

      const jobData = await jobResponse.json();
      const proposalsData = await proposalsResponse.json();

      if (jobData.success && proposalsData.success) {
        setJob(jobData.data);
        setProposals(proposalsData.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch proposals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string = 'Anonymous User') => {
    return name
      .split(/[\s_-]/) 
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
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
          <h1 className="text-3xl font-bold tracking-tight">
            Proposals for {job?.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {proposals.length} {proposals.length === 1 ? 'proposal' : 'proposals'} received
          </p>
        </div>

        {proposals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <User className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No proposals yet</p>
              <p className="text-sm text-muted-foreground">
                When candidates submit proposals, they&apos;ll appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
           {proposals.map((proposal) => (
  <Card key={proposal._id} className="p-6">
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10">
        <AvatarFallback className='bg-[#eedeea]'>
          {getInitials(proposal.userId?.username || proposal.userId?.email || 'AU')}
        </AvatarFallback>
      </Avatar>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {proposal.userId?.username || proposal.userId?.email || 'Anonymous User'}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3 w-3 mr-1" />
                    {proposal.userId?.email || 'No email provided'}
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-sm">{proposal.proposalText}</p>
            </div>
          </div>
        </Card>
      ))}
          </div>
        )}
      </div>
    </div>
  );
}