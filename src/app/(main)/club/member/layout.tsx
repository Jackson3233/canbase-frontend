"use client";

import { Suspense, useEffect } from "react";
import { Shapes, ShieldCheck, Ticket, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { membersActions } from "@/store/reducers/membersReducer";
import { membershipActions } from "@/store/reducers/membershipReducer";
import { roleActions } from "@/store/reducers/roleReducer";
import { questionActions } from "@/store/reducers/questionReducer";
import { getMembers } from "@/actions/member";
import { SubTabs, SubTabsContent, SubTabsList, SubTabsTrigger } from "@/components/ui/subtab";
import { MemberLayoutPropsInterface } from "@/types/page";

const MemberLayout = ({
  manage,
  invite,
  fee,
  role,
}: MemberLayoutPropsInterface) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      const result = await getMembers();

      if (result.success) {
        dispatch(membersActions.setMembers({ members: result.members }));
        dispatch(roleActions.setRole({ role: result.role }));
        dispatch(
          membershipActions.setMembership({ membership: result.membership })
        );
        dispatch(questionActions.setQuestion({ question: result.question }));
      }
    })();
  }, [dispatch]);

  return (
    <Suspense fallback={<></>}>
      <SubTabs
        defaultValue={
          user?.role === "owner" ||
          user?.functions?.includes("club-members-menu-members")
            ? "manage"
            : user?.functions?.includes("club-members-menu-invite")
            ? "invite"
            : user?.functions?.includes("club-members-menu-membership")
            ? "fee"
            : "role"
        }
      >
        <div className="w-full border-b border-gray-100 px-4">
          <SubTabsList>
            {(user?.role === "owner" ||
              user?.functions?.includes("club-members-menu-members")) && (
              <SubTabsTrigger value="manage">
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5" />
                  <p className="text-sm">Mitglieder</p>
                </div>
              </SubTabsTrigger>
            )}
            {(user?.role === "owner" ||
              user?.functions?.includes("club-members-menu-invite")) && (
              <SubTabsTrigger value="invite">
                <div className="flex items-center space-x-2">
                  <Shapes className="w-3.5 h-3.5" />
                  <p className="text-sm">Mitglieder einladen</p>
                </div>
              </SubTabsTrigger>
            )}
            {(user?.role === "owner" ||
              user?.functions?.includes("club-members-menu-membership")) && (
              <SubTabsTrigger value="fee">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-3.5 h-3.5" />
                  <p className="text-sm">Mitgliedsbeiträge</p>
                </div>
              </SubTabsTrigger>
            )}
            {(user?.role === "owner" ||
              user?.functions?.includes("club-members-menu-role")) && (
              <SubTabsTrigger value="role">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <p className="text-sm">Rollen</p>
                </div>
              </SubTabsTrigger>
            )}
          </SubTabsList>
        </div>
        <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
          <SubTabsContent value="manage">{manage}</SubTabsContent>
          <SubTabsContent value="invite">{invite}</SubTabsContent>
          <SubTabsContent value="fee">{fee}</SubTabsContent>
          <SubTabsContent value="role">{role}</SubTabsContent>
        </div>
      </SubTabs>
    </Suspense>
  );
};

export default MemberLayout;
