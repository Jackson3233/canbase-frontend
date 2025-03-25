"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { CreditCard, LogOut, MoreVertical, Plus } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { roleActions } from "@/store/reducers/roleReducer";
import { membersActions } from "@/store/reducers/membersReducer";
import { createRole, deleteRole, updateRole } from "@/actions/role";
import ProfileInput from "@/components/basic/ProfileInput";
import Color from "@/components/basic/Color";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colorData } from "@/constant/colors";
import { RemoveRoleFormSchema, RoleFormSchema } from "@/constant/formschema";
import {
  clubAcademyAccessData,
  clubChatAccessData,
  clubCommunityFeedAccessData,
  clubEventAccessData,
  clubFinanceAccessData,
  clubGrowAccessData,
  clubMembersMembersAccessData,
  clubMembersMenuAccessData,
  clubMembersRoleAccessData,
  clubSettingManangeAccessData,
  clubSettingMenuAccessData,
  dashboardAccessData,
} from "@/constant/roles";
import { getAvatarLetters, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";

const MemberRolePage = () => {
  const dispatch = useAppDispatch();
  const { members } = useAppSelector((state) => state.members);
  const { role } = useAppSelector((state) => state.role);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();

  const [currentRole, setCurrentRole] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<string>("light");
  const [search, setSearch] = useDebounceValue("", 500);
  const [roleMembers, setRoleMembers] = useState<string[]>([]);
  const [functions, setFunctions] = useState<string[]>([]);

  const removeRoleForm = useForm<z.infer<typeof RemoveRoleFormSchema>>({
    resolver: zodResolver(RemoveRoleFormSchema),
    defaultValues: {
      rolename: "",
    },
  });
  const roleForm = useForm<z.infer<typeof RoleFormSchema>>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: {
      rolename: "",
      roledesc: "",
    },
  });

  useEffect(() => {
    if (!open) {
      setCurrentRole(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (currentRole) {
      const pickedRole = role.filter((f) => f.roleID === currentRole)[0];

      setColor(pickedRole.rolecolor);
      setRoleMembers(pickedRole.users);
      setFunctions(pickedRole.functions);

      roleForm.reset({
        rolename: pickedRole.rolename,
        roledesc: pickedRole.roledesc,
      });
    } else {
      setColor("light");
      setRoleMembers([]);
      setFunctions([]);

      roleForm.reset({ rolename: "", roledesc: "" });
    }
  }, [currentRole, members, role, roleForm]);

  const toggleRoleMember = (param: string) => {
    if (roleMembers.includes(param)) {
      setRoleMembers(roleMembers.filter((f) => f !== param));
    } else {
      setRoleMembers([...roleMembers, param]);
    }
  };

  const toggleFunction = (param: string) => {
    if (functions.includes(param)) {
      setFunctions(functions.filter((f) => f !== param));
    } else {
      setFunctions([...functions, param]);
    }
  };

  const onRemoveSubmit = async (data: z.infer<typeof RemoveRoleFormSchema>) => {
    if (
      data.rolename === role.filter((f) => f.roleID === currentRole)[0].rolename
    ) {
      setLoading(true);

      const result = await deleteRole({ roleID: currentRole });

      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });

      setLoading(false);

      if (result.success) {
        dispatch(roleActions.setRole({ role: result.role }));
        dispatch(membersActions.setMembers({ members: result.members }));

        setOpen(false);
        setCurrentRole(undefined);
      }
    } else {
      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: "Bitte korrekt eingeben!",
      });
    }
  };

  const onRoleSubmit = async (data: z.infer<typeof RoleFormSchema>) => {
    setLoading(true);

    let result;
    if (currentRole) {
      const formData = {
        ...data,
        roleID: currentRole,
        rolecolor: color,
        users: roleMembers,
        functions: functions,
      };

      result = await updateRole(formData);
    } else {
      const formData = {
        ...data,
        rolecolor: color,
        users: roleMembers,
        functions: functions,
      };

      result = await createRole(formData);
    }

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(roleActions.setRole({ role: result.role }));
      dispatch(membersActions.setMembers({ members: result.members }));

      setVisible(false);
      setCurrentRole(undefined);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <div className="ml-0 m-3">
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={() => setVisible(true)}
            disabled={
              user?.role !== "owner" &&
              !user?.functions?.includes("club-members-role-add")
            }
  >
            <Plus className="w-3 h-3" />
            <span className="text-xs">Erstellen</span>
          </Button>
        </div>
        <Card className="max-w-[1440px] w-full">
        {!visible ? (
          <CardContent className="flex flex-col p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tablet:text-xl">Rollen</h1>
                  <p className="pt-2 text-sm text-content mobile:text-xs">
                    Hier kannst du die Rollen des Mitglieds bearbeiten.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-10 pb-10 tablet:space-y-7 tablet:pb-7 mobile:spcae-y-5 mobile:pb-5">
              <div className="flex flex-col">
                {role.map((item, key) => {
                  return (
                    <div
                      className="flex justify-between items-center space-x-5 px-10 py-5 border-b tablet:px-7 mobile:px-5 mobile:py-3"
                      key={key}
                    >
                      <div className="w-full flex items-center space-x-4 tablet:space-x-2">
                        <div
                          className={cn(
                            "min-w-4 h-4 rounded-full tablet:min-w-3 tablet:h-3",
                            colorData.filter(
                              (f) => f.name === item.rolecolor
                            )[0].bgColor
                          )}
                        />
                        <div className="flex flex-col space-y-2 tablet:space-y-1">
                          <p className="text-lg font-semibold tablet:text-base">
                            {item.rolename}
                          </p>
                          <p className="text-sm text-content tablet:text-xs">
                            {item.roledesc === ""
                              ? "Keine Beschreibung."
                              : item.roledesc}
                          </p>
                          <p className="text-sm text-content tablet:text-xs">
                            {item.users.length}/{members.filter(m => m.status === 'active').length} Mitglied/er
                          </p>
                        </div>
                      </div>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-56 text-sm"
                            align="end"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setVisible(true);
                                setCurrentRole(item.roleID);
                              }}
                              disabled={
                                user?.role !== "owner" &&
                                !user?.functions?.includes(
                                  "club-members-role-edit"
                                )
                              }
                            >
                              <div className="flex justify-between items-center">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Bearbeiten
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setOpen(true);
                                setCurrentRole(item.roleID);
                              }}
                              disabled={
                                user?.role !== "owner" &&
                                !user?.functions?.includes(
                                  "club-members-role-delete"
                                )
                              }
                            >
                              <div className="flex justify-between items-center text-destructive">
                                <LogOut className="w-4 h-4 mr-2" />
                                Löschen
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                          <h1 className="text-lg font-semibold px-10 mt-10 tablet:text-base tablet:px-7 tablet:mt-7 mobile:text-sm mobile:px-5 mobile:mt-5">
                            Bist Du wirklich sicher?
                          </h1>
                          <div className="flex flex-col space-y-10 p-10 tablet:p-7 tablet:space-y-7 mobile:p-5 mobile:space-y-5">
                            <p className="text-content text-sm mobile:text-xs">
                              Wenn Du diese Rolle löschen möchtest, gib bitte
                              den Rollennamen ein und bestätige den löschen
                              Button.
                            </p>
                            <Form {...removeRoleForm}>
                              <form
                                className="w-full flex justify-between items-center space-x-5"
                                onSubmit={removeRoleForm.handleSubmit(
                                  onRemoveSubmit
                                )}
                              >
                                <ProfileInput
                                  form={removeRoleForm.control}
                                  flag="other"
                                  id="rolename"
                                  placeholder="Name der Rolle"
                                />
                                <div className="flex space-x-3">
                                  <Button
                                    className="h-10 px-4 mobile:px-2"
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                  >
                                    Abbrechen
                                  </Button>
                                  <Button
                                    className="h-10 px-4 mobile:px-2"
                                    type="submit"
                                    variant="destructive"
                                  >
                                    {loading ? (
                                      <ClipLoader
                                        aria-label="loader"
                                        data-testid="loader"
                                        color="white"
                                        size={16}
                                      />
                                    ) : (
                                      <span className="text-sm">Löschen</span>
                                    )}
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Rolle anlegen oder bearbeiten
              </h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                Gruppiere Berechtigungen durch Rollen und weise sie den
                Clubmitgliedern zu.
              </p>
            </div>
            <Form {...roleForm}>
              <form onSubmit={roleForm.handleSubmit(onRoleSubmit)}>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <ProfileInput
                    form={roleForm.control}
                    id="rolename"
                    title="Name*"
                    content="Wie soll die Rolle heißen?"
                    placeholder="Name"
                  />
                  <ProfileInput
                    form={roleForm.control}
                    id="roledesc"
                    title="Beschreibung"
                    content="Was ist der Zweck dieser Rolle?"
                    placeholder="Beschreibung"
                  />
                  <div className="flex justify-between tablet:flex-col">
                    <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                      <p className="font-medium mobile:text-sm">Farbe</p>
                      <p className="text-sm text-content mobile:text-xs">
                        Markiere die Rolle mit einer Farbe, um sie schnell zu
                        erkennen.
                      </p>
                    </div>
                    <div className="w-full flex flex-wrap gap-1 mobile:justify-center">
                      {colorData.map((item, key) => (
                        <Color
                          key={key}
                          colorName={item.name}
                          bgColor={item.bgColor}
                          borderColor={item.borderColor}
                          active={item.name === color}
                          setColor={setColor}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <div className="flex flex-col space-y-2">
                    <p className="font-medium mobile:text-sm">
                      Mitglieder ({roleMembers.length}/{members.filter(m => m.status === 'active').length} mit dieser Rolle)
                    </p>
                    <p className="text-sm text-content mobile:text-xs">
                      Welche Mitglieder sollen diese Rolle erhalten?
                    </p>
                  </div>
                  <Input
                    className="max-w-md w-full"
                    placeholder="Suchen"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="flex flex-col space-y-3">
                    {members
                      .filter(
                        (f) =>
                          f.status === "active" &&
                          f.username
                            ?.toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((item, key) => {
                        return (
                          <div
                            className="w-full flex justify-between items-center"
                            key={key}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex justify-center items-center">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage
                                    src={
                                      (process.env
                                        .NEXT_PUBLIC_UPLOAD_URI as string) +
                                      item.avatar
                                    }
                                    alt="avatar"
                                  />
                                  <AvatarFallback className="text-sm">
                                    {getAvatarLetters(item.username)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex flex-col">
                                <p className="font-semibold text-sm mobile:text-xs mobile:break-all">
                                  {item.username}
                                </p>
                                <p className="text-sm text-content mobile:text-xs mobile:break-all">
                                  {item.email}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={roleMembers.includes(item._id as string)}
                              onCheckedChange={() =>
                                toggleRoleMember(item._id as string)
                              }
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <div className="flex flex-col space-y-2">
                    <p className="font-medium mobile:text-sm">Dashboard</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Mit dieser Berechtigung kannst du entscheiden welche
                      Ansicht der Kacheln im Dashboard Mitglieder sehen können
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {dashboardAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <div className="flex flex-col space-y-2">
                    <p className="font-medium mobile:text-sm">
                      Mitgliederverwaltung
                    </p>
                    <p className="text-sm text-content mobile:text-xs">
                      Mit dieser Berechtigung können Mitglieder die
                      Einstellungen der Mitglieder sehen und verwalten
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {clubMembersMenuAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col space-y-3 px-10 py-5 border-b tablet:px-7 mobile:p-5">
                  {clubMembersMembersAccessData.map((item, key) => {
                    return (
                      <div
                        className="w-full flex justify-between items-center"
                        key={key}
                      >
                        <div className="flex flex-col mr-2">
                          <p className="text-sm font-medium mobile:text-xs">
                            {item.title}
                          </p>
                          <p className="text-sm text-content mobile:text-xs">
                            {item.content}
                          </p>
                        </div>
                        <Switch
                          checked={functions.includes(item.name)}
                          onCheckedChange={() => toggleFunction(item.name)}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col space-y-3 px-10 py-5 border-b tablet:px-7 mobile:p-5">
                  {clubMembersRoleAccessData.map((item, key) => {
                    return (
                      <div
                        className="w-full flex justify-between items-center"
                        key={key}
                      >
                        <div className="flex flex-col mr-2">
                          <p className="text-sm font-medium mobile:text-xs">
                            {item.title}
                          </p>
                          <p className="text-sm text-content mobile:text-xs">
                            {item.content}
                          </p>
                        </div>
                        <Switch
                          checked={functions.includes(item.name)}
                          onCheckedChange={() => toggleFunction(item.name)}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <div className="flex flex-col space-y-2">
                    <p className="font-medium mobile:text-sm">Chat</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Mit dieser Berechtigung können Mitglieder Chat Kanäle
                      verwaltung etc.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {clubChatAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <div className="flex flex-col space-y-2">
                    <p className="font-medium mobile:text-sm">Community</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Mit dieser Berechtigung können Mitglieder die
                      Canbase-Community verwalten
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {clubCommunityFeedAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <p className="font-medium mobile:text-sm">Finanzen</p>
                  <div className="flex flex-col space-y-3">
                    {clubFinanceAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <div className="flex flex-col space-y-2">
                    <p className="font-medium mobile:text-sm">Grow-Control</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Mit diesen Berechtigungen können Mitglieder Grow-Control
                      verwalten bzw. einsehen.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {clubGrowAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <p className="font-medium mobile:text-sm">Ereignisse</p>
                  <div className="flex flex-col space-y-3">
                    {clubEventAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 border-b tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <div className="flex flex-col space-y-2">
                    <p className="font-medium mobile:text-sm">Einstellungen</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Mit dieser Berechtigung können Mitglieder die
                      Einstellungen des Clubs sehen, bearbeiten und löschen
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {clubSettingMenuAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col space-y-3 px-10 py-5 border-b tablet:px-7 mobile:p-5">
                  {clubSettingManangeAccessData.map((item, key) => {
                    return (
                      <div
                        className="w-full flex justify-between items-center"
                        key={key}
                      >
                        <div className="flex flex-col mr-2">
                          <p className="text-sm font-medium mobile:text-xs">
                            {item.title}
                          </p>
                          <p className="text-sm text-content mobile:text-xs">
                            {item.content}
                          </p>
                        </div>
                        <Switch
                          checked={functions.includes(item.name)}
                          onCheckedChange={() => toggleFunction(item.name)}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col space-y-6 px-10 py-5 tablet:space-y-3 tablet:px-7 mobile:p-5">
                  <p className="font-medium mobile:text-sm">Academy</p>
                  <div className="flex flex-col space-y-3">
                    {clubAcademyAccessData.map((item, key) => {
                      return (
                        <div
                          className="w-full flex justify-between items-center"
                          key={key}
                        >
                          <div className="flex flex-col mr-2">
                            <p className="text-sm font-medium mobile:text-xs">
                              {item.title}
                            </p>
                            <p className="text-sm text-content mobile:text-xs">
                              {item.content}
                            </p>
                          </div>
                          <Switch
                            checked={functions.includes(item.name)}
                            onCheckedChange={() => toggleFunction(item.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 p-10 tablet:p-7 mobile:justify-evenly mobile:p-5">
                  <Button
                    className="h-10 px-4 mobile:px-2"
                    type="button"
                    variant="outline"
                    onClick={() => setVisible((prev) => !prev)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                    type="submit"
                  >
                    {loading ? (
                      <ClipLoader
                        aria-label="loader"
                        data-testid="loader"
                        color="white"
                        size={16}
                      />
                    ) : (
                      <span className="text-sm">Speichern</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        )}
        </Card>
      </div>
    </div>
  );
};

export default MemberRolePage;
