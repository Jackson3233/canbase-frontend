"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Pencil, Trash2, Eye, Search,EllipsisVertical } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

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

type FilterState = {
  search: string;
  type: string | "all";  
  location: string | "all";  
};

const OwnerJobsDashboard = () => {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<FilterState>({
    search: '',
    type: 'all',
    location: 'all'
  });
  
  const router = useRouter();
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/job/all');
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      setError('Failed to fetch jobs');
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobs();
  }, []);

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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         job.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || job.type === filters.type;
    const matchesLocation = filters.location === 'all' || job.location === filters.location;
    return matchesSearch && matchesType && matchesLocation;
  });

  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
  const uniqueTypes = Array.from(new Set(jobs.map(job => job.type)));

  const clearFilters = () => {
    setFilters({ search: '', type: 'all', location: 'all' });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      FULL_TIME: 'bg-blue-100 text-blue-800',
      PART_TIME: 'bg-green-100 text-green-800',
      CONTRACT: 'bg-purple-100 text-purple-800',
      TEMPORARY: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 w-full max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="text-muted-foreground mt-2">Create and manage your job listings</p>
        </div>
        <Link href="/jobs/create" passHref>
          <Button size="lg" className="shadow-sm bg-[#8d3379]">
            <Plus className="mr-2 h-5 w-5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="grid gap-4 md:grid-cols-12 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

          {/* Job Type Filter */}
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type?.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select
            value={filters.location}
            onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        {/* Clear Filters Button */}
        <div className="md:col-span-1">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="w-full"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Card key={job._id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                  <Badge className={getTypeColor(job.type)}>
                    {job?.type?.replace('_', ' ')}
                  </Badge>
                </div>
          
                <Button onClick={() => router.push(`/jobs/${job._id}/proposals`)} className='bg-transparent hover:bg-grey-300 text-gray-600 shadow-none'>
                        <Eye className="h-4 w-4 mr-2" />
                        View proposals
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => router.push(`/jobs/${job._id}/edit`)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(job._id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                {job.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Location</p>
                  <p>{job?.location}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Hours</p>
                  <p>{job?.hr} {job?.hrUnit?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Start Date</p>
                  <p>{new Date(job?.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" className="mt-1">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          {jobs.length === 0 ? (
            <>
              <p className="text-xl text-muted-foreground mb-4">No jobs posted yet</p>
              <Link href="/jobs/create" passHref>
                <Button variant="outline">
                  Create your first job posting
                </Button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-xl text-muted-foreground mb-4">No jobs match your filters</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OwnerJobsDashboard;