import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UpdatesPropsInterface } from "@/types/component";

// Updated interface to match Mongoose schema
interface UpdateData {
  _id: string;
  versionNumber: string;
  releaseDate: string;
  subtitle: string;
  newFeatures: Array<{
    key: string;
    value: string;
  }>;
  improvements: Array<{
    key: string;
    value: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const Updates = ({ openUpdates, setOpenUpdates }: UpdatesPropsInterface) => {
  const [updateData, setUpdateData] = useState<UpdateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdateData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/getUpdateLog');
        if (response.data.success) {
          setUpdateData(response.data.data);
        } else {
          setError('Failed to fetch update data');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching update data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (openUpdates) {
      fetchUpdateData();
    }
  }, [openUpdates]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={openUpdates} onOpenChange={setOpenUpdates}>
      <DialogContent className="max-w-xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
        <div className="flex flex-col items-center space-y-3 py-5 bg-[#F8F8F8]">
          <Image
            src="/assets/images/logo.svg"
            width={38}
            height={38}
            alt="logo"
          />
          <p className="text-center tablet:text-sm">Versionshinweise</p>
        </div>
        
        <div className="max-h-[700px] overflow-y-auto px-6 mobile:px-3">
          {loading ? (
            <div className="py-8 text-center">Laden...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : updateData && (
            <div className="flex flex-col space-y-3 py-3 border-b">
              <div className="relative rounded-md shadow">
                <div className="absolute inset-0 size-full overflow-hidden rounded-md">
                  <Image
                    className="rounded-md blur-[1px]"
                    src="/assets/images/seed.png"
                    fill={true}
                    sizes="100%"
                    alt="launch"
                  />
                </div>
                <div className="relative p-4">
                  {updateData.subtitle && 
                  <h1 className="text-2xl font-bold text-white">
                    {updateData.subtitle}
                  </h1>
                  }
                  <div className="text-sm text-white">
                    Version {updateData.versionNumber} - {formatDate(updateData.releaseDate)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3 px-4 pb-8">
                {/* <p className="tablet:text-sm">
                  Euer System wird kontinuierlich weiter entwickelt.
                </p> */}

                <div className="flex flex-col space-y-3">
                  {updateData.newFeatures.length > 0 && (
                    <div className="flex flex-col space-y-2">
                      <Badge className="w-fit h-fit p-1 text-xs text-custom font-medium whitespace-nowrap bg-customforeground rounded-md">
                        Neue Features
                      </Badge>
                      <ul>
                        {updateData.newFeatures.map((feature, index) => (
                          <li key={index}>
                            <span className="font-bold">{feature.key}: </span>
                            {feature.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {updateData.improvements.length > 0 && (
                    <div className="flex flex-col space-y-2">
                      <Badge className="w-fit flex items-center space-x-2 p-1.5 leading-[8px] bg-violet-100 rounded-md">
                        <RefreshCcw color="#744CE6" size={16} />
                        <p className="text-xs text-[#744CE6] font-medium whitespace-nowrap">
                          Verbesserungen
                        </p>
                      </Badge>
                      <ul>
                        {updateData.improvements.map((improvement, index) => (
                          <li key={index}>
                            <span className="font-bold">{improvement.key}: </span>
                            {improvement.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Updates;