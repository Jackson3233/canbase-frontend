"use client";

import { getPublicClub } from "@/actions/club";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Home, BadgeCheck, Info, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PublicClub {
  clubname: string;
  badge?: string;
  avatar?: string;
  city?: string;
  users?: number;
  maxUser?: number;
  clubStatus?: string;
  description?: string;
}

export default function PublicClubPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [club, setClub] = useState<PublicClub | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getPublicClub(params.id);
      console.log('Club Data:', result);
      if (result.success) {
        setClub(result.club);
        // Update page title when club data is loaded
        document.title = `${result.club.clubname} - Canbase`;
      }
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Laden...</div>;
  }

  if (!club) {
    return <div className="flex justify-center items-center min-h-screen">Club nicht gefunden</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-4">
        <Card className="max-w-[1440px] w-full overflow-hidden rounded-3xl">
          <AspectRatio className="border-b border-[#D9D9D9]" ratio={4 / 1}>
            {!club.badge ? (
              <div className="w-full h-full flex justify-center items-center bg-[#F8F8F8]">
                <Home className="w-10 h-10 text-content mobile:w-6 mobile:h-6" />
              </div>
            ) : (
              <Image
                className="object-cover"
                src={process.env.NEXT_PUBLIC_UPLOAD_URI + club.badge}
                fill={true}
                alt={club.clubname}
              />
            )}
          </AspectRatio>
          <CardContent className="relative p-6">
            {/* Avatar mit negativem margin, damit er über das Banner ragt */}
            <div className="absolute -top-16 left-8">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage
                  src={club.avatar ? process.env.NEXT_PUBLIC_UPLOAD_URI + club.avatar : undefined}
                  alt={club.clubname}
                />
                <AvatarFallback className="text-4xl">{club.clubname[0]}</AvatarFallback>
              </Avatar>
            </div>
            
            {/* Club Info mit Padding-left für den Avatar */}
            <div className="mt-20 pl-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{club.clubname}</h1>
                <div className="flex flex-wrap gap-3">
                  {club?.clubStatus === "verify" && (
                    <>
                      <Badge className="w-fit p-1.5 text-xs text-[#D5B100] leading-[8px] bg-[#D5B100]/25 rounded-md">
                        In Gründung
                      </Badge>
                    </>
                  )}
                  {club?.clubStatus === "license" && (
                    <>
                      <Badge className="w-fit flex items-center space-x-1 p-1.5 leading-[8px] bg-[#00C978]/25 rounded-md">
                        <BadgeCheck
                          className="w-3 h-3 text-white"
                          fill="#00C978"
                        />
                        <p className="text-xs text-[#19A873]">
                          Lizensierter Verein
                        </p>
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              <Badge
                className="w-fit px-2 py-1.5 text-sm leading-[8px] mb-4"
                variant="secondary"
              >
                {club?.users}/{club?.maxUser} Mitglieder
              </Badge>
              {club.city && (
                <div className="flex items-center text-gray-600 mb-8">
                  <Home className="w-4 h-4 mr-2" />
                  <span>{club.city}</span>
                </div>
              )}
              
              <Tabs defaultValue="info" className="w-full mb-6">
                <TabsList className="mb-4 bg-transparent gap-1">
                  <TabsTrigger 
                    value="info" 
                    className="flex items-center gap-2 px-4 py-3 hover:bg-[#19A873]/25 hover:text-[#19A873] data-[state=active]:bg-[#19A873]/25 data-[state=active]:text-[#19A873] data-[state=active]:px-4 data-[state=active]:py-3 rounded-md border-transparent shadow-none transition-colors"
                  >
                    <Info className="w-5 h-5" />
                    <div className="flex flex-col text-left">
                      <span className="whitespace-nowrap">Club Info</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="fees" 
                    className="flex items-center gap-2 px-4 py-3 hover:bg-[#19A873]/25 hover:text-[#19A873] data-[state=active]:bg-[#19A873]/25 data-[state=active]:text-[#19A873] data-[state=active]:px-4 data-[state=active]:py-3 rounded-md border-transparent shadow-none transition-colors"
                  >
                    <CreditCard className="w-5 h-5" />
                    <div className="flex flex-col text-left">
                      <span className="whitespace-nowrap">Mitgliedsbeiträge</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="mt-0">
                  <div className="space-y-4">
                    {/* Club Info Content */}
                    <div 
                      className="text-lg text-content tablet:text-base mobile:text-sm prose prose-stone max-w-none"
                      dangerouslySetInnerHTML={{ __html: club?.description || '' }}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="fees" className="mt-0">
                  <div className="space-y-4">
                    {/* Mitgliedsbeiträge Content */}
                    <p>Informationen zu Mitgliedsbeiträgen</p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={() => router.push(`/joinclub?clubID=${params.id}`)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white shadow h-10 px-4 bg-black hover:bg-black/90 mobile:w-full"
              >
                <span className="text-sm">Jetzt Mitglied werden</span>
              </Button>
            </div>
          </CardContent>
          <div className="flex-0 text-color-secondary relative flex w-full flex-wrap rounded-b border-t border-stone-200 bg-stone-100 py-2">
            <div className="flex flex-1 items-center justify-center">
              <a className="group flex flex-wrap items-center justify-center gap-2 rounded px-6 py-2 text-center text-sm hover:bg-black/10" href="https://canbase.de" target="_blank">
                <span className="flex items-center text-gray-500">Clubverwaltung mit</span>
                <span className="flex items-center">
                  <Image 
                    src="/assets/canbase-logo.svg"
                    alt="Canbase Logo"
                    width={85}
                    height={20}
                    className="grayscale group-hover:grayscale-0"
                  />
                </span>
              </a>
            </div>
            <div className="shrink-0">
              <div className="group grid place-items-center hover:bg-canbase-100 px-4 rounded-br-sm cursor-pointer h-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="group-hover:text-canbase-500 inline h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
