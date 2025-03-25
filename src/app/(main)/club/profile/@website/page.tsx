"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { clubActions } from "@/store/reducers/clubReducer";
import { updateGeneral } from "@/actions/club";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const ClubWebsitePage = () => {
  const dispatch = useAppDispatch();
  const { club } = useAppSelector((state) => state.club);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    console.log('Club Data:', club);
    console.log('Current is_public status:', club?.is_public);
    // Setze den initialen Status auf false, wenn er nicht explizit true ist
    setIsPublic(club?.is_public === true);
    
    if (typeof window !== 'undefined' && club?.clubID) {
      const url = `${window.location.origin}/club/public/${club.clubID}`;
      console.log('Generated URL:', url);
      setPublicUrl(url);
    }
  }, [club]);

  const handleWebsiteActivation = async () => {
    try {
      setLoading(true);
      const newPublicState = !isPublic;
      console.log('Current isPublic:', isPublic);
      console.log('Setting is_public to:', newPublicState);

      const result = await updateGeneral({
        is_public: newPublicState
      });

      console.log('API Response:', result);
      console.log('Returned club data:', result.club);
      console.log('New is_public status:', result.club?.is_public);

      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });

      if (result.success) {
        setIsPublic(newPublicState);
        dispatch(clubActions.setClub({ club: result.club }));
        console.log('State updated. New isPublic:', newPublicState);
      } else {
        // Wenn der API-Call fehlschlägt, setzen wir den State zurück
        console.error('Failed to update website status:', result);
        toast({
          className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
          variant: "destructive",
          description: "Fehler beim Aktualisieren des Website-Status",
        });
      }
    } catch (error) {
      console.error('Error updating website status:', error);
      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        variant: "destructive",
        description: "Fehler beim Aktualisieren des Website-Status",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <Card className="w-full my-8">
        <CardContent className="p-0">
          <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
            <h1 className="text-2xl font-semibold tablet:text-xl">
              Club-Website
            </h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Aktiviere die öffentliche Website deines Clubs und teile sie mit deinen Mitgliedern
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center space-x-2 px-10 py-5 border-b tablet:px-7 mobile:p-5">
              <div className="flex flex-col text-left">
                <p className="font-medium">Website aktivieren</p>
                <p className="text-content font-normal text-sm">
                  Schalte die öffentliche Website für deinen Club frei
                </p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={handleWebsiteActivation}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col space-y-3 px-10 py-5 tablet:px-7 mobile:p-5">
              <div className="flex flex-col text-left">
                <p className="font-medium">Website URL</p>
                <p className="text-content font-normal text-sm">
                  Hier findest du den Link zu deiner Club-Website
                </p>
                {isPublic ? (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-stone-50 p-2">
                    <a 
                      className="hover:underline" 
                      href={publicUrl}
                      rel="noreferrer noopener" 
                      target="_blank"
                    >
                      {publicUrl}
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(publicUrl)}
                      className="group relative rounded-full transition-colors duration-300 hover:bg-stone-50"
                      title="In Zwischenablage kopieren"
                      type="button"
                    >
                      <div className="grid size-4 place-items-center transition-opacity duration-300 opacity-100">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth="1.5" 
                          stroke="currentColor" 
                          aria-hidden="true" 
                          data-slot="icon" 
                          className="text-color-secondary size-4"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aktiviere zuerst die Website, um den Link zu sehen
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubWebsitePage;
