import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { User } from 'lucide-react';

export const UserDetailDialog = ( user: any ) => {
    const formatDate = (dateString: any) => {
      return dateString ? new Date(dateString).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : '-';
    };
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {user.username}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member ID:</span>
                  <span>{user.memberID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span>{user.role || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span>{user.status || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">2FA Status:</span>
                  <span>{user.two_fa_status}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dates & Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Register Date:</span>
                  <span>{formatDate(user.registerDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since:</span>
                  <span>{formatDate(user.memberdate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Login:</span>
                  <span>{formatDate(user.last_login)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Password Change:</span>
                  <span>{formatDate(user.last_password_change)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
