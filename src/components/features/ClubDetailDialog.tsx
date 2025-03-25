import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Globe, Link } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Club {
  _id: string;
  clubname?: string;
  website?: string;
  email?: string;
  phone?: string;
  street?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  description?: string;
  prevent_info?: string;
  info_members?: string;
  discord?: string;
  tiktok?: string;
  youtube?: string;
  twitch?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  imprint?: string;
  maxUser?: number;
  minAge?: number;
  lat?: number;
  lng?: number;
  avatar?: string;
  badge?: string;
}

interface ClubDetailDialogProps {
  club: Club;
  onClubUpdate: () => void;
  api: any;
}
interface ClubNote {
  ClubId: string;
  content: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const ClubDetailDialog: React.FC<ClubDetailDialogProps> = ({ club, onClubUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [clubData, setClubData] = useState<Club>(club);
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      // Add all club fields to formData
      Object.entries(clubData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch('http://localhost:5000/api/admin/editClub', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Club information updated successfully",
        });
        onClubUpdate();
        setIsEditing(false);
      } else {
        throw new Error(data.msg || 'Failed to update club');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update club information",
        variant: "destructive",
      });
    }
  };

  const handleAddNote = async () => {
    try {
      console.log("Adding note:", note);  // Log the note being sent
      const { data } = await axios.post<{
        success: boolean;
        data: ClubNote;
        message?: string;
      }>('http://localhost:5000/api/admin/addClubNote', {
        clubId: club._id,
        content: note
      });
      console.log("Response:", data);  // Log the response from the server
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Note added successfully",
        });
        setNote('');
      } else {
        throw new Error(data.message || 'Failed to add note');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add note",
        variant: "destructive",
      });
      console.error("Error adding note:", error); 
    }
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="transition-colors hover:bg-green-50 hover:text-green-600"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {clubData.clubname}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Club Name</Label>
                    <Input
                      value={clubData.clubname}
                      onChange={(e) => setClubData(prev => ({...prev, clubname: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={clubData.email || ''}
                      onChange={(e) => setClubData(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={clubData.website || ''}
                      onChange={(e) => setClubData(prev => ({...prev, website: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={clubData.description || ''}
                      onChange={(e) => setClubData(prev => ({...prev, description: e.target.value}))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span>{clubData.email || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Website:</span>
                    <span>{clubData.website || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Description:</span>
                    <span>{clubData.description || '—'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Street</Label>
                    <Input
                      value={clubData.street || ''}
                      onChange={(e) => setClubData(prev => ({...prev, street: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={clubData.city || ''}
                      onChange={(e) => setClubData(prev => ({...prev, city: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input
                      value={clubData.postcode || ''}
                      onChange={(e) => setClubData(prev => ({...prev, postcode: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={clubData.country || ''}
                      onChange={(e) => setClubData(prev => ({...prev, country: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Users</Label>
                    <Input
                      type="number"
                      value={clubData.maxUser || ''}
                      onChange={(e) => setClubData(prev => ({...prev, maxUser: parseInt(e.target.value)}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Age</Label>
                    <Input
                      type="number"
                      value={clubData.minAge || ''}
                      onChange={(e) => setClubData(prev => ({...prev, minAge: parseInt(e.target.value)}))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address:</span>
                    <span>{[clubData.street, clubData.city, clubData.postcode, clubData.country].filter(Boolean).join(', ') || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Users:</span>
                    <span>{clubData.maxUser || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Min Age:</span>
                    <span>{clubData.minAge || '—'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Link className="w-4 h-4" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Discord</Label>
                    <Input
                      value={clubData.discord || ''}
                      onChange={(e) => setClubData(prev => ({...prev, discord: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={clubData.instagram || ''}
                      onChange={(e) => setClubData(prev => ({...prev, instagram: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter</Label>
                    <Input
                      value={clubData.twitter || ''}
                      onChange={(e) => setClubData(prev => ({...prev, twitter: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input
                      value={clubData.facebook || ''}
                      onChange={(e) => setClubData(prev => ({...prev, facebook: e.target.value}))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discord:</span>
                    <span>{clubData.discord || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Instagram:</span>
                    <span>{clubData.instagram || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Twitter:</span>
                    <span>{clubData.twitter || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Facebook:</span>
                    <span>{clubData.facebook || '—'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Club Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Note</Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter note content..."
                />
                <Button 
                  onClick={handleAddNote}
                  disabled={!note.trim()}
                >
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Club
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClubDetailDialog;