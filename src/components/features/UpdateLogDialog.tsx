import React, { useState } from 'react';
import { Activity, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface UpdateItem {
  _id?: string;
  key: string;
  value: string;
}

interface UpdateLog {
  _id?: string;
  versionNumber: string;
  releaseDate: string;
  subtitle: string;
  newFeatures: UpdateItem[];
  improvements: UpdateItem[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UpdateLogDialogProps {
  api: any;
  currentLog?: any;
}

const UpdateLogDialog: React.FC<UpdateLogDialogProps> = ({ api, currentLog }) => {
  const [logData, setLogData] = useState<UpdateLog>(currentLog || {
    versionNumber: '',
    releaseDate: new Date().toISOString().split('T')[0],
    subtitle: '',
    newFeatures: [{ key: '', value: '' }],
    improvements: [{ key: '', value: '' }],
  });
  
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Prepare data for backend
      const cleanedData = {
        ...logData,
        // Keep _id if it exists
        ...(logData._id && { _id: logData._id }),
        // Filter out empty entries but preserve _id if they exist
        newFeatures: logData.newFeatures
          .filter(item => item.key || item.value)
          .map(({ key, value, _id }) => ({ 
            ...((_id && { _id }) || {}),
            key, 
            value 
          })),
        improvements: logData.improvements
          .filter(item => item.key || item.value)
          .map(({ key, value, _id }) => ({ 
            ...((_id && { _id }) || {}),
            key, 
            value 
          })),
      };
      
      await api.post('/editUpdateLog', cleanedData);
      toast({
        title: "Success",
        description: "Update log saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save update log",
        variant: "destructive",
      });
    }
  };

  const handleFeatureChange = (index: number, field: 'key' | 'value', value: string) => {
    setLogData(prev => {
      const newFeatures = [...prev.newFeatures];
      newFeatures[index] = { 
        ...newFeatures[index], 
        [field]: value 
      };
      return { ...prev, newFeatures };
    });
  };

  const handleImprovementChange = (index: number, field: 'key' | 'value', value: string) => {
    setLogData(prev => {
      const newImprovements = [...prev.improvements];
      newImprovements[index] = { 
        ...newImprovements[index], 
        [field]: value 
      };
      return { ...prev, improvements: newImprovements };
    });
  };

  const addFeature = () => {
    setLogData(prev => ({
      ...prev,
      newFeatures: [...prev.newFeatures, { key: '', value: '' }]
    }));
  };

  const addImprovement = () => {
    setLogData(prev => ({
      ...prev,
      improvements: [...prev.improvements, { key: '', value: '' }]
    }));
  };

  const removeFeature = (index: number) => {
    setLogData(prev => ({
      ...prev,
      newFeatures: prev.newFeatures.filter((_, i) => i !== index)
    }));
  };

  const removeImprovement = (index: number) => {
    setLogData(prev => ({
      ...prev,
      improvements: prev.improvements.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="transition-colors hover:bg-blue-50 hover:text-blue-600"
        >
          <Activity className="w-4 h-4 mr-2" />
          Manage Update Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Log Management</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Version Number</Label>
              <Input
                value={logData.versionNumber}
                onChange={(e) => setLogData(prev => ({...prev, versionNumber: e.target.value}))}
                placeholder="e.g., 1.0.0"
              />
            </div>
            <div className="space-y-2">
              <Label>Release Date</Label>
              <Input
                type="date"
                value={logData.releaseDate.split('T')[0]}
                onChange={(e) => setLogData(prev => ({...prev, releaseDate: e.target.value}))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={logData.subtitle}
              onChange={(e) => setLogData(prev => ({...prev, subtitle: e.target.value}))}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>New Features</Label>
              <Button variant="outline" size="sm" onClick={addFeature}>
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            <div className="space-y-3">
              {logData.newFeatures.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature.key}
                    onChange={(e) => handleFeatureChange(index, 'key', e.target.value)}
                    placeholder="Feature title"
                    className="w-1/3"
                  />
                  <Input
                    value={feature.value}
                    onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                    placeholder="Feature description"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Improvements</Label>
              <Button variant="outline" size="sm" onClick={addImprovement}>
                <Plus className="w-4 h-4 mr-2" />
                Add Improvement
              </Button>
            </div>
            <div className="space-y-3">
              {logData.improvements.map((improvement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={improvement.key}
                    onChange={(e) => handleImprovementChange(index, 'key', e.target.value)}
                    placeholder="Improvement title"
                    className="w-1/3"
                  />
                  <Input
                    value={improvement.value}
                    onChange={(e) => handleImprovementChange(index, 'value', e.target.value)}
                    placeholder="Improvement description"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImprovement(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Save Update Log
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLogDialog;