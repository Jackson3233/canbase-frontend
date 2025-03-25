'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, MapPin, Clock, Calendar, Briefcase, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { useMediaQuery } from "usehooks-ts";
import { BreadCrumb, Sidebar } from '@/layout';

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

export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isToggle, setIsToggle] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openUpdates, setOpenUpdates] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    setIsToggle(false);
  }, [isMobile]);

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

  const mainContent = (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
            <p className="mt-2 text-gray-600">Find your next opportunity</p>
          </div>
          <Button 
            onClick={fetchJobs} 
            variant="outline" 
            disabled={loading}
            className="hover:shadow-md transition-all"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh Listings
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <span className="inline-block mt-1 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {job.type}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600 mb-6 line-clamp-2">{job.description}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{job.hr} {job.hrUnit}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(job.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{job.type}</span>
                  </div>
                </div>
                <Link href={`/job-listings/${job._id}`} className="w-full">
                  <Button 
                    variant="default" 
                    className="w-full bg-green-500 group-hover:bg-green-600 transition-colors"
                  >
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && !loading && !error && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Jobs Available</h3>
            <p className="mt-2 text-gray-500">Check back later for new opportunities</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading && jobs.length === 0) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative bg-[#F5F5F5]">
      <Sidebar
        isMobile={isMobile}
        isToggle={isToggle}
        setIsToggle={setIsToggle}
        setOpenFeedback={setOpenFeedback}
        setOpenUpdates={setOpenUpdates}
      />
      <div className="relative max-w-[1440px] w-full h-full min-h-screen flex flex-col pl-28 pr-5 pt-8 tablet:pl-5 tablet:pt-5 mobile:pt-3">
        <BreadCrumb setIsToggle={setIsToggle} />
        <div className="flex-1 flex flex-col">
          {mainContent}
        </div>
      </div>
    </div>
  );
}