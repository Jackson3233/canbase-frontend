"use client";

import { Suspense, useEffect } from "react";
import {
  FileText,
  Home,
  Landmark,
  Paintbrush,
  Settings,
  Globe,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { questionActions } from "@/store/reducers/questionReducer";
import Welcome from "./welcome";
import {
  SubTabs,
  SubTabsContent,
  SubTabsList,
  SubTabsTrigger,
} from "@/components/ui/subtab";
import { getQuestion } from "@/actions/question";
import { ClubLayoutPropsInterface } from "@/types/page";

const ClubLayout = ({
  edit, website, general, design, document, question, authorities
}: ClubLayoutPropsInterface) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      const result = await getQuestion();

      if (result.success) {
        dispatch(questionActions.setQuestion({ question: result.question }));
      }
    })();
  }, [dispatch]);

  return (
    <>
      <Suspense fallback={<></>}>
        <SubTabs defaultValue="edit"
          // defaultValue={
          //   user?.role === "owner" ||
          //   user?.functions?.includes("club-settings-menu-profile")
          //     ? "profile"
          //     : user?.functions?.includes("club-settings-menu-general")
          //     ? "general"
          //     : user?.functions?.includes("club-settings-menu-design")
          //     ? "design"
          //     : user?.functions?.includes("club-settings-menu-documents")
          //     ? "document"
          //     : user?.functions?.includes("club-settings-menu-questions")
          //     ? "question"
          //     : "website"
          // }
        >
          <div className="w-full border-b border-gray-100 px-4">
            <SubTabsList>
              {(user?.role === "owner" ||
                user?.functions?.includes("club-settings-menu-profile")) && (
                <SubTabsTrigger value="edit">
                  <div className="flex items-center space-x-2">
                    <Home className="w-3.5 h-3.5" />
                    <p className="text-sm">Profil</p>
                  </div>
                </SubTabsTrigger>
              )}
              {(user?.role === "owner" ||
                user?.functions?.includes("club-settings-menu-website")) && (
                <SubTabsTrigger value="website">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5" />
                    <p className="text-sm">Website</p>
                  </div>
                </SubTabsTrigger>
              )}
              {(user?.role === "owner" ||
                user?.functions?.includes("club-settings-menu-general")) && (
                <SubTabsTrigger value="general">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-3.5 h-3.5" />
                    <p className="text-sm">Allgemein</p>
                  </div>
                </SubTabsTrigger>
              )}
              {(user?.role === "owner" ||
                user?.functions?.includes("club-settings-menu-design")) && (
                <SubTabsTrigger value="design">
                  <div className="flex items-center space-x-2">
                    <Paintbrush className="w-3.5 h-3.5" />
                    <p className="text-sm">Design</p>
                  </div>
                </SubTabsTrigger>
              )}
              {(user?.role === "owner" ||
                user?.functions?.includes("club-settings-menu-documents")) && (
                <SubTabsTrigger value="document">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5" />
                    <p className="text-sm">Dokumente</p>
                  </div>
                </SubTabsTrigger>
              )}
              {(user?.role === "owner" ||
                user?.functions?.includes("club-settings-menu-questions")) && (
                <SubTabsTrigger value="question">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5" />
                    <p className="text-sm">Clubfragen</p>
                  </div>
                </SubTabsTrigger>
              )}
              {(user?.role === "owner" ||
                user?.functions?.includes("club-settings-menu-questions")) && (
                <SubTabsTrigger value="authorities">
                  <div className="flex items-center space-x-2">
                    <Landmark className="w-3.5 h-3.5" />
                    <p className="text-sm">Behörden</p>
                  </div>
                </SubTabsTrigger>
              )}
            </SubTabsList>
          </div>
          <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
            <SubTabsContent value="edit">{edit}</SubTabsContent>
            <SubTabsContent value="website">{website}</SubTabsContent>
            <SubTabsContent value="general">{general}</SubTabsContent>
            <SubTabsContent value="design">{design}</SubTabsContent>
            <SubTabsContent value="document">{document}</SubTabsContent>
            <SubTabsContent value="question">{question}</SubTabsContent>
            <SubTabsContent value="authorities">{authorities}</SubTabsContent>
          </div>
        </SubTabs>
      </Suspense>
      <Welcome />
    </>
  );
};

export default ClubLayout;