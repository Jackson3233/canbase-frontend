"use client";

import { Suspense } from "react";
import { Factory, Info, Mail, ShieldAlert } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { SubTabs, SubTabsContent, SubTabsList, SubTabsTrigger } from "@/components/ui/subtab";
import { OverviewLayoutPropsInterface } from "@/types/page";

const OverviewLayout = ({
  intro,
  info,
  policy,
  contact,
}: OverviewLayoutPropsInterface) => {
  const { club } = useAppSelector((state) => state.club);

  return (
    <>
      <Suspense fallback={<></>}>
        <SubTabs defaultValue="intro">
          <div className="w-full border-b border-gray-100 px-4">
            <SubTabsList>
              <SubTabsTrigger value="intro">
                <div className="flex items-center space-x-2">
                  <Factory className="w-3.5 h-3.5" />
                  <p className="text-sm">Club</p>
                </div>
              </SubTabsTrigger>
              {club?.info_members && (
                <SubTabsTrigger value="info">
                  <div className="flex items-center space-x-2">
                    <Info className="w-3.5 h-3.5" />
                    <p className="text-sm">
                      Information für Mitglieder
                    </p>
                  </div>
                </SubTabsTrigger>
              )}
              {club?.prevent_info && (
                <SubTabsTrigger value="policy">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <p className="text-sm">
                      Jugendschutz & Prävention
                    </p>
                  </div>
                </SubTabsTrigger>
              )}
              <SubTabsTrigger value="contact">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5" />
                  <p className="text-sm">Kontakt</p>
                </div>
              </SubTabsTrigger>
            </SubTabsList>
          </div>
          <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
            <SubTabsContent value="intro">{intro}</SubTabsContent>
            {club?.info_members && (
              <SubTabsContent value="info">{info}</SubTabsContent>
            )}
            {club?.prevent_info && (
              <SubTabsContent value="policy">{policy}</SubTabsContent>
            )}
            <SubTabsContent value="contact">{contact}</SubTabsContent>
          </div>
        </SubTabs>
      </Suspense>
    </>
  );
};

export default OverviewLayout;
