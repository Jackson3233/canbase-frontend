import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, User, Building2, Settings } from 'lucide-react';

interface ActivityLog {
  type: 'user' | 'club' | 'system';
  message: string;
  timestamp: string;
}

const ActivityLogPanel = () => {
  // In a real app, this would come from the API
  const logs: ActivityLog[] = [
    {
      type: 'user',
      message: 'New user registered: John Doe',
      timestamp: new Date().toISOString()
    },
    {
      type: 'club',
      message: 'Club status updated: FC Bayern to "verified"',
      timestamp: new Date().toISOString()
    },
    {
      type: 'system',
      message: 'System maintenance scheduled',
      timestamp: new Date().toISOString()
    }
  ];

  const getIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'club':
        return <Building2 className="w-4 h-4 text-green-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 rounded-lg border transition-colors hover:bg-gray-50"
              >
                {getIcon(log.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityLogPanel;