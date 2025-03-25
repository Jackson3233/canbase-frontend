import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import StatsOverview from "./StatsOverview";
import ActivityLogPanel from "./ActivityLogPanel";
import ClubDetailDialog from "./ClubDetailDialog";
import { Club, User, UpdateLog } from "@/types/types";
import UpdateLogDialog from "./UpdateLogDialog";
import { UserDetailDialog } from "./UserDetailDialog";


const api = axios.create({
  baseURL: "http://localhost:5000/api/admin",
  timeout: 5000,
});

// Define the possible status types
type badgeStatusType = "default" | "verify" | "license";

// Define the props interface
interface StatusBadgeProps {
  status: badgeStatusType;
}

// Define the possible status types
type userStatusType = "active" | "pending" | "inactive";

// Define the props interface
interface UserStatusBadgeProps {
  status: userStatusType;
}

// Define the type for Improvement
interface Improvement {
  key: string;
  value: string;
}

// Define the type for Feature
interface Feature {
  key: string;
  value: string;
}

const SuperAdminDashboard = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [owners, setOwners] = useState<User[]>([]);
  const [updateLog, setUpdateLog] = useState<UpdateLog | null | undefined>(
    null
  );
  const [loading, setLoading] = useState({
    clubs: true,
    users: true,
    owners: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clubsResponse, usersResponse, ownersResponse, updateLogResponse] =
        await Promise.all([
          api.get("/getClubList"),
          api.get("/getAllUsers"),
          api.get("/getClubOwners"),
          api.get("/getUpdateLog"),
        ]);

      if (clubsResponse.data.success) {
        setClubs(clubsResponse.data.data);
      }
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.data);
      }
      if (ownersResponse.data.success) {
        setOwners(ownersResponse.data.data);
      }
      if (updateLogResponse.data.success) {
        setUpdateLog(updateLogResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      // Type assertion to handle the unknown type
      const errorMessage = (error as Error).message || "An error occurred";

      toast({
        title: "Error fetching data",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading({
        clubs: false,
        users: false,
        owners: false,
      });
    }
  };

  const handleUserDeactivate = async (userId: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Invalid user ID provided",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, users: true }));

      const response = await api.post("/deactiveUser", { _id: userId });

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, status: "pending" } : user
          )
        );

        toast({
          title: "Success",
          description: "User has been deactivated successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to deactivate user");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);

      let errorMessage = "An error occurred"; // Default error message

      // Type guard to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
      } else if (error instanceof Error) {
        errorMessage = error.message; // Fallback for general errors
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusStyles = {
      default: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Default",
      },
      verify: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "In Gründung",
      },
      license: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Lizensierter Verein",
      },
    };

    const style = statusStyles[status] || statusStyles.default;

    return (
      <Badge className={`${style.bg} ${style.text} px-2 py-1 rounded-md`}>
        {style.label}
      </Badge>
    );
  };

  const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100",
        text: "text-green-700",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      },
      inactive: {
        bg: "bg-red-100",
        text: "text-red-700",
      },
    };

    const { bg, text } = statusConfig[status] || statusConfig.active; // Fallback to active

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full ${bg} ${text}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
        {/* Capitalize status */}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <StatsOverview
        totalUsers={users.length}
        activeUsers={users.filter((u) => u.status === "active").length}
        totalClubs={clubs.length}
        clubOwners={owners.length}
        pendingClubs={clubs.filter((c) => c.clubStatus === "verify").length}
        loading={loading}
      />

      <div className="mt-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="logs">Activity</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Member ID</TableHead>
                        <TableHead>2FA Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading.users ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow
                            key={user._id}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <TableCell className="font-medium">
                              {user.username}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.memberID}</TableCell>
                            <TableCell>{user.two_fa_status}</TableCell>
                            <TableCell>{user.role || "—"}</TableCell>
                            <TableCell>
                              <UserStatusBadge
                                status={user.status as userStatusType}
                              />
                            </TableCell>
                            <TableCell className="space-x-2">
                              <UserDetailDialog user={user} />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUserDeactivate(user._id)}
                                className="transition-colors hover:bg-red-600"
                              >
                                Deactivate
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clubs">
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Club Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading.clubs ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Loading clubs...
                          </TableCell>
                        </TableRow>
                      ) : (
                        clubs.map((club) => (
                          <TableRow
                            key={club.No}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <TableCell>{club.No}</TableCell>
                            <TableCell className="font-medium">
                              {club.clubName}
                            </TableCell>
                            <TableCell>
                              <StatusBadge
                                status={club.clubStatus as badgeStatusType}
                              />
                            </TableCell>
                            <TableCell>{club.userCount}</TableCell>
                            <TableCell className="space-x-2">
                              <ClubDetailDialog
                                club={club}
                                api={api}
                                onClubUpdate={fetchData}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <ActivityLogPanel />
          </TabsContent>

          <TabsContent value="updates">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">System Updates</h3>
                  <UpdateLogDialog api={api} currentLog={updateLog} />
                </div>

                {updateLog && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xl font-bold">
                          {updateLog.subtitle ||
                            "Version " + updateLog.versionNumber}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Released on{" "}
                          {new Date(updateLog.releaseDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {updateLog.newFeatures &&
                        updateLog.newFeatures.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">New Features</h5>
                            <ul className="space-y-2">
                              {updateLog.newFeatures.map(
                                (feature: Feature, index: number) => (
                                  <li key={index}>
                                    <span className="font-bold">
                                      {feature.key}:{" "}
                                    </span>
                                    {feature.value}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {updateLog.improvements &&
                        updateLog.improvements.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Improvements</h5>
                            <ul className="space-y-2">
                              {updateLog.improvements.map(
                                (improvement: Improvement, index: number) => (
                                  <li key={index}>
                                    <span className="font-bold">
                                      {improvement.key}:{" "}
                                    </span>
                                    {improvement.value}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {!updateLog && !loading.clubs && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No update log available.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Click the &apos;Manage Update Log&apos; button to create
                      one.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
