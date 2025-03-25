import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Activity } from "lucide-react";

interface StatsOverviewProps {
  totalUsers: number;
  activeUsers: number;
  totalClubs: number;
  clubOwners: number;
  pendingClubs: number;
  loading: {
    users: boolean;
    clubs: boolean;
    owners: boolean;
  };
}

// Define the props for StatCard
interface StatCardProps {
  title: string;
  value: number | string; // value can be a number or a string (for pending clubs)
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Type for React components that accept SVG props
  className?: string; // Optional className
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalUsers,
  activeUsers,
  totalClubs,
  clubOwners,
  pendingClubs,
  loading,
}) => {
  // Define StatCard as a functional component with props
  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    className,
  }) => (
    <Card
      className={`transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-900">
          {title}
        </CardTitle>
        <Icon className="w-5 h-5 text-[#00C978]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#00C978]">
          {loading.clubs ? "..." : value}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-6 lg:row-span-2">
        <Card className="h-full transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00C978]" />
              User Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-[#00C978]">
                {loading.users ? "..." : totalUsers}
              </div>
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {loading.owners ? "..." : clubOwners}
                  </div>
                  <div className="text-sm text-gray-500">Club Owners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {loading.users ? "..." : activeUsers}
                  </div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-6">
        <StatCard
          title="Total Clubs"
          value={totalClubs}
          icon={Building2}
          className="h-full"
        />
      </div>

      <div className="col-span-12 lg:col-span-6">
        <StatCard
          title="Pending Verifications"
          value={`${pendingClubs} clubs`}
          icon={Activity}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default StatsOverview;
