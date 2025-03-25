"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Dropzone from "react-dropzone";
import ClipLoader from "react-spinners/ClipLoader";
import {
  ChevronLeft,
  Images,
  LogOut,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { membersActions } from "@/store/reducers/membersReducer";
import { roleActions } from "@/store/reducers/roleReducer";
import {
  getMember,
  removeQuestion,
  updateMember,
  updateMemberMembership,
  updateMemberRole,
  updateMemberSEPA,
  updateQuestion,
} from "@/actions/member";
import ProfileInput from "@/components/basic/ProfileInput";
import AddressInput from "@/components/basic/AddressInput";
import TextGroup from "@/components/basic/TextGroup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { MemberFormSchema, SEPAFormSchema } from "@/constant/formschema";
import { colorData } from "@/constant/colors";
import {
  getAvatarLetters,
  getCleanDate,
  getCleanDateTime,
  isEmpty,
} from "@/lib/functions";
import { cn } from "@/lib/utils";
import { generateUsername } from "@/lib/username";

const MemberInfoPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.role);
  const { user } = useAppSelector((state) => state.user);
  const { membership } = useAppSelector((state) => state.membership);
  const { question } = useAppSelector((state) => state.question);

  const router = useRouter();

  const { toast } = useToast();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sepaLoading, setSEPALoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [openDlg, setOpenDlg] = useState(false);
  const [formSchema, setFormSchema] = useState<any>();
  const [questionID, setQuestionID] = useState<string>();
  const [avatar, setAvatar] = useState<any>();
  const [tempAvatar, setTempAvatar] = useState<any>();
  const [removeAvatar, setRemoveAvatar] = useState<any>(false);
  const [member, setMember] = useState<any>();
  const [memberships, setMemberships] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  const form = useForm<z.infer<typeof MemberFormSchema>>({
    resolver: zodResolver(MemberFormSchema),
    defaultValues: {
      username: "",
      birth: new Date(),
      email: "",
      phone: "",
      street: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      bio: "",
      ageVerify: false,
    },
  });
  const sepaform = useForm<z.infer<typeof SEPAFormSchema>>({
    resolver: zodResolver(SEPAFormSchema),
    defaultValues: {
      IBAN: "",
      BIC: "",
      mandate_refer: "",
      mandate_sign: undefined,
    },
  });
  const textForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [question.filter((f) => f._id === questionID)[0]?._id]: "",
    },
  });
  const arrayForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [question.filter((f) => f._id === questionID)[0]?._id]: [],
    },
  });

  useEffect(() => {
    (async () => {
      const result = await getMember({ memberID: params.id });

      if (result.success) {
        setMember(result.member);
        setMemberships(
          result.member.memberships ? result.member.memberships : []
        );

        const roledata = result.member.clubrole.map((item: any) => item.roleID);
        setRoles(roledata);

        !isEmpty(result.member.avatar) &&
          setAvatar(process.env.NEXT_PUBLIC_UPLOAD_URI + result.member.avatar);

        form.reset(result.member);
        form.setValue(
          "ageVerify",
          result.member?.verifycontent !== "nicht verifiziert"
        );

        sepaform.reset(result.member);
      }
    })();
  }, [form, sepaform, params.id]);

  useEffect(() => {
    const currentQuestion = question.filter((f) => f._id === questionID)[0];

    if (
      currentQuestion?.questiontype === "short" ||
      currentQuestion?.questiontype === "long" ||
      currentQuestion?.questiontype === "single"
    ) {
      !currentQuestion?.required
        ? setFormSchema(
            z.object({
              [currentQuestion?._id]: z.string().optional().or(z.literal("")),
            })
          )
        : setFormSchema(
            z.object({
              [currentQuestion?._id]: z
                .string()
                .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
            })
          );

      textForm.reset({
        [currentQuestion?._id]: member?.question.filter(
          (f: any) => f.questionID === questionID
        )[0]?.answer[0],
      });
    }

    if (currentQuestion?.questiontype === "multiple") {
      !currentQuestion?.required
        ? setFormSchema(
            z.object({
              [currentQuestion?._id]: z.string().optional().or(z.literal("")),
            })
          )
        : setFormSchema(
            z.object({
              [currentQuestion?._id]: z
                .string()
                .array()
                .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
            })
          );

      arrayForm.reset({
        [currentQuestion?._id]: [
          ...member?.question.filter((f: any) => f.questionID === questionID)[0]
            ?.answer,
        ],
      });
    }

    if (currentQuestion?.questiontype === "number") {
      !currentQuestion?.required
        ? setFormSchema(
            z.object({
              [currentQuestion?._id]: z.coerce.number().optional(),
            })
          )
        : setFormSchema(
            z.object({
              [currentQuestion?._id]: z.coerce
                .number()
                .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
            })
          );

      textForm.reset({
        [currentQuestion?._id]: member?.question.filter(
          (f: any) => f.questionID === questionID
        )[0]?.answer[0],
      });
    }
  }, [textForm, arrayForm, question, questionID]);

  const handleBefore = () => {
    if (isEdit) {
      setIsEdit((prev) => !prev);

      if (!isEmpty(member?.avatar)) {
        setAvatar(process.env.NEXT_PUBLIC_UPLOAD_URI + member.avatar);
      } else {
        setAvatar(undefined);
      }
    } else {
      router.push("/club/member");
    }
  };

  const toggleCheckbox = (param: string) => {
    if (memberships.includes(param)) {
      setMemberships(memberships.filter((m) => m !== param));
    } else {
      setMemberships([...memberships, param]);
    }
  };

  const toggleSwitch = (param: string) => {
    if (roles.includes(param)) {
      setRoles(roles.filter((r) => r !== param));
    } else {
      setRoles([...roles, param]);
    }
  };

  const handleEditQuestion = (questionID: string) => {
    setQuestionID(questionID);

    setOpenDlg(true);
  };

  const handleRemoveQuestion = async (questionID: string) => {
    const result = await removeQuestion({
      memberID: params.id,
      questionID: questionID,
    });

    toast({
      className:
        "fixed top-4 right-4 w-[350px] break-all mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(membersActions.setMembers({ members: result.members }));

      setMember(result.member);
    }
  };

  const onSubmit = async (data: z.infer<typeof MemberFormSchema>) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      value !== undefined && formData.append(key, value as string);
    });

    formData.append("avatar", avatar);
    formData.append("memberID", params.id);
    formData.append("removeAvatar", removeAvatar);

    const result = await updateMember(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(membersActions.setMembers({ members: result.members }));

      setMember(result.member);
      !isEmpty(result.member.avatar) &&
        setAvatar(process.env.NEXT_PUBLIC_UPLOAD_URI + result.member.avatar);

      setLoading(false);
      setIsEdit((prev) => !prev);
    }
  };

  const onSEPASubmit = async (data: z.infer<typeof SEPAFormSchema>) => {
    setSEPALoading(true);

    const result = await updateMemberSEPA({ memberID: params.id, ...data });

    toast({
      className:
        "fixed top-4 right-4 w-[350px] break-all mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(membersActions.setMembers({ members: result.members }));

      setMember(result.member);

      setSEPALoading(false);
      setIsEdit((prev) => !prev);
    }
  };

  const handleMembership = async () => {
    setMembershipLoading(true);

    const result = await updateMemberMembership({
      memberID: params.id,
      membershipIDs: memberships,
    });

    toast({
      className:
        "fixed top-4 right-4 w-[350px] break-all mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(membersActions.setMembers({ members: result.members }));

      setMember(result.member);
      !isEmpty(result.member.avatar) &&
        setAvatar(process.env.NEXT_PUBLIC_UPLOAD_URI + result.member.avatar);

      setMembershipLoading(false);
      setIsEdit((prev) => !prev);
    }
  };

  const handleRole = async () => {
    setRoleLoading(true);

    const result = await updateMemberRole({
      memberID: params.id,
      roleIDs: roles,
    });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setRoleLoading(false);

    if (result.success) {
      dispatch(membersActions.setMembers({ members: result.members }));
      dispatch(roleActions.setRole({ role: result.role }));

      setMember(result.member);
      !isEmpty(result.member.avatar) &&
        setAvatar(process.env.NEXT_PUBLIC_UPLOAD_URI + result.member.avatar);

      setIsEdit((prev) => !prev);
    }
  };

  const handleQuestion = async (data: any) => {
    const result = await updateQuestion({
      memberID: params.id,
      question: data,
    });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(membersActions.setMembers({ members: result.members }));
      dispatch(roleActions.setRole({ role: result.role }));

      setMember(result.member);

      setOpenDlg((prev) => !prev);
    }
  };

  const generateMandateReference = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    const mandateRef = `${year}${month}${day}${hours}${minutes}${seconds}${random}`;
    sepaform.setValue('mandate_refer', mandateRef);
  };

  const generateRandomUsername = () => {
    const newUsername = generateUsername();
    form.setValue("username", newUsername);
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <div className="flex items-center space-x-2">
          <Button
            className="h-auto w-fit flex items-center space-x-2 rounded-2xl"
            variant="outline"
            onClick={handleBefore}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="text-xs">Zurück</span>
          </Button>
          {!isEdit && (
            <Button
              className="h-auto w-fit rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
              disabled={
                user?.role !== "owner" &&
                !user?.functions?.includes("club-members-members-edit")
              }
            >
              <span className="text-xs">Bearbeiten</span>
            </Button>
          )}
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl	font-semibold tablet:text-xl">
                {member?.username}
              </h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                {params.id}
              </p>
            </div>
            {!isEdit ? (
              <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                <div className="w-36 h-36 my-5 mobile:self-center">
                  {avatar === undefined ? (
                    <div className="h-full w-full flex justify-center items-center rounded-full bg-[#F8F8F8]">
                      <p>{getAvatarLetters(member?.username)}</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full overflow-hidden rounded-full">
                      <Image
                        className="object-cover"
                        src={avatar}
                        fill={true}
                        sizes="100%"
                        alt="avatar"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <TextGroup title="Name" value={member?.username ?? ""} />
                  <TextGroup title="E-Mail" value={member?.email ?? ""} />
                  <TextGroup title="Telefon" value={member?.phone ?? ""} />
                  <TextGroup
                    title="Adresse"
                    value={`${member?.street ?? ""} ${member?.address ?? ""} ${
                      member?.postcode ?? ""
                    } ${member?.city ?? ""} ${member?.country ?? ""}`}
                  />
                  <TextGroup
                    title="Geburtsdatum"
                    value={member?.birth ? getCleanDate(member?.birth, 2) : ""}
                  />
                  <TextGroup
                    type="last"
                    title="Notiz"
                    value={member?.bio ?? ""}
                  />
                </div>
                <h1 className="mt-14 text-2xl	font-semibold tablet:mt-7 tablet:text-xl">
                  Mitgliedschaft
                </h1>
                <div className="flex flex-col">
                  <TextGroup title="Mitgliedsnummer" value={params.id} />
                  <TextGroup title="Status">
                    <div className="w-full">
                      {member?.status === "active" && (
                        <Badge className="w-fit h-fit p-1.5 text-xs text-[#19A873] leading-[8px] bg-[#00C978]/25 rounded-md">
                          Aktiv
                        </Badge>
                      )}
                      {member?.status === "inactive" && (
                        <Badge className="w-fit h-fit p-1.5 text-xs text-[#BD4C4D] leading-[8px] bg-[#FEF0F2] rounded-md">
                          Inaktiv
                        </Badge>
                      )}
                    </div>
                  </TextGroup>
                  <TextGroup
                    title="Angefragt am"
                    value={
                      member?.memberdate
                        ? getCleanDate(member?.memberdate, 2)
                        : ""
                    }
                  />
                  <TextGroup
                    title="Alterverifikation"
                    value={member?.verifycontent ?? ""}
                  />
                  <TextGroup type="last" title="Rollen">
                    <div className="w-full flex flex-wrap gap-1">
                      {member?.clubrole?.map((item: any, key: string) => (
                        <Badge
                          className="w-fit flex space-x-1 p-2 border border-[#E7E7E7]"
                          key={key}
                          variant="secondary"
                        >
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              colorData.filter(
                                (f) => f.name === item.rolecolor
                              )[0].bgColor
                            )}
                          />
                          <p className="text-xs leading-[8px]">
                            {item.rolename}
                          </p>
                        </Badge>
                      ))}
                    </div>
                  </TextGroup>
                </div>
                <h1 className="mt-14 text-2xl	font-semibold tablet:mt-7 tablet:text-xl">
                  SEPA-Lastschriftmandat
                </h1>
                <div className="flex flex-col">
                  <TextGroup
                    title="IBAN"
                    value={member?.IBAN ?? ""}
                  />
                  <TextGroup
                    title="BIC"
                    value={member?.BIC ?? ""}
                  />
                  <TextGroup
                    title="Mandatsreferenz"
                    value={member?.mandate_refer ?? ""}
                  />
                  <TextGroup
                    type="last"
                    title="Mandat unterzeichnet am"
                    value={
                      member?.mandate_sign
                        ? getCleanDateTime(member?.mandate_sign)
                        : ""
                    }
                  />
                </div>
                <h1 className="mt-14 text-2xl	font-semibold tablet:mt-7 tablet:text-xl">
                  Club Fragen
                </h1>
                <div className="flex flex-col">
                  {member?.question?.map((item: any, key: number) => {
                    return (
                      <div
                        className={cn(
                          "flex justify-between items-center",
                          member?.question?.length !== key + 1 && "border-b"
                        )}
                        key={key}
                      >
                        <TextGroup
                          type="last"
                          title={
                            question.filter((f) => f._id === item.questionID)[0]
                              ?.questiontitle
                          }
                          value={item.answer.join(", ")}
                        />
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
                              onClick={() =>
                                handleEditQuestion(item.questionID)
                              }
                            >
                              <div className="flex justify-between items-center">
                                <Pencil className="w-4 h-4 mr-2" />
                                Bearbeiten
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRemoveQuestion(item.questionID)
                              }
                            >
                              <div className="flex justify-between items-center text-destructive">
                                <LogOut className="w-4 h-4 mr-2" />
                                Löschen
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
                <Dialog open={openDlg} onOpenChange={setOpenDlg}>
                  <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                    <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                      <h1 className="text-2xl	font-semibold tablet:text-xl">
                        {
                          question.filter((f) => f._id === questionID)[0]
                            ?.questiontitle
                        }
                      </h1>
                      <p className="pt-2 text-sm text-content mobile:text-xs">
                        {
                          question.filter((f) => f._id === questionID)[0]
                            ?.description
                        }
                      </p>
                    </div>
                    <div className="max-h-[700px] flex flex-col p-10 overflow-y-auto tablet:p-7 mobile:p-5">
                      {question.filter((f) => f._id === questionID)[0]
                        ?.questiontype === "short" && (
                        <Form {...textForm}>
                          <form
                            className="w-full flex flex-col space-y-6 tablet:space-y-3"
                            onSubmit={textForm.handleSubmit(handleQuestion)}
                          >
                            <ProfileInput
                              form={textForm.control}
                              flag="other"
                              id={
                                question.filter((f) => f._id === questionID)[0]
                                  ?._id
                              }
                              placeholder={
                                question.filter((f) => f._id === questionID)[0]
                                  ?.placeholder
                              }
                            />
                            <Button
                              className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                              type="submit"
                            >
                              Weiter
                            </Button>
                          </form>
                        </Form>
                      )}
                      {question.filter((f) => f._id === questionID)[0]
                        ?.questiontype === "long" && (
                        <Form {...textForm}>
                          <form
                            className="w-full flex flex-col space-y-6 tablet:space-y-3"
                            onSubmit={textForm.handleSubmit(handleQuestion)}
                          >
                            <ProfileInput
                              form={textForm.control}
                              flag="other"
                              type="textarea"
                              id={
                                question.filter((f) => f._id === questionID)[0]
                                  ?._id
                              }
                              placeholder={
                                question.filter((f) => f._id === questionID)[0]
                                  ?.placeholder
                              }
                            />
                            <Button
                              className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                              type="submit"
                            >
                              Weiter
                            </Button>
                          </form>
                        </Form>
                      )}
                      {question.filter((f) => f._id === questionID)[0]
                        ?.questiontype === "single" && (
                        <Form {...textForm}>
                          <form
                            className="w-full flex flex-col space-y-6 tablet:space-y-3"
                            onSubmit={textForm.handleSubmit(handleQuestion)}
                          >
                            <ProfileInput
                              form={textForm.control}
                              flag="other"
                              type="radio"
                              id={
                                question.filter((f) => f._id === questionID)[0]
                                  ?._id
                              }
                              radioValues={
                                question.filter((f) => f._id === questionID)[0]
                                  ?.content
                              }
                            />
                            <Button
                              className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                              type="submit"
                            >
                              Weiter
                            </Button>
                          </form>
                        </Form>
                      )}
                      {question.filter((f) => f._id === questionID)[0]
                        ?.questiontype === "multiple" && (
                        <Form {...arrayForm}>
                          <form
                            className="w-full flex flex-col space-y-6 tablet:space-y-3"
                            onSubmit={arrayForm.handleSubmit(handleQuestion)}
                          >
                            <ProfileInput
                              form={arrayForm.control}
                              flag="other"
                              type="checkboxs"
                              id={
                                question.filter((f) => f._id === questionID)[0]
                                  ?._id
                              }
                              checkboxValues={
                                question.filter((f) => f._id === questionID)[0]
                                  ?.content
                              }
                            />
                            <Button
                              className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                              type="submit"
                            >
                              Weiter
                            </Button>
                          </form>
                        </Form>
                      )}
                      {question.filter((f) => f._id === questionID)[0]
                        ?.questiontype === "number" && (
                        <Form {...textForm}>
                          <form
                            className="w-full flex flex-col space-y-6 tablet:space-y-3"
                            onSubmit={textForm.handleSubmit(handleQuestion)}
                          >
                            <ProfileInput
                              form={textForm.control}
                              flag="other"
                              type="number"
                              id={
                                question.filter((f) => f._id === questionID)[0]
                                  ?._id
                              }
                              placeholder={
                                question.filter((f) => f._id === questionID)[0]
                                  ?.placeholder
                              }
                            />
                            <Button
                              className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                              type="submit"
                            >
                              Weiter
                            </Button>
                          </form>
                        </Form>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  className="h-10 self-end px-4 mt-14 text-sm bg-custom mobile:w-full mobile:px-2 mobile:mt-7 hover:bg-customhover"
                  onClick={() => setIsEdit((prev) => !prev)}
                  disabled={
                    user?.role !== "owner" &&
                    !user?.functions?.includes("club-members-members-edit")
                  }
                >
                  Bearbeiten
                </Button>
              </div>
            ) : (
              <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setAvatar(acceptedFiles[0]);
                    setTempAvatar(URL.createObjectURL(acceptedFiles[0]));
                  }}
                  accept={{
                    "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      className="w-36 h-36 flex justify-center items-center overflow-hidden rounded-full bg-[#F8F8F8] cursor-pointer mobile:self-center"
                      {...getRootProps()}
                    >
                      {avatar === undefined ? (
                        <div className="h-full w-full flex flex-col justify-center items-center rounded-full hover:border hover:border-content hover:border-dashed">
                          <Images className="w-4 h-4 text-content" />
                          <p className="text-xs text-content text-center">
                            .jpg, .jpeg, .png, .webp
                          </p>
                        </div>
                      ) : String(avatar).includes(
                          process.env.NEXT_PUBLIC_UPLOAD_URI as string
                        ) ? (
                        <div className="relative w-full h-full">
                          <Image
                            className="object-cover"
                            src={avatar}
                            fill={true}
                            sizes="100%"
                            alt="avatar"
                          />
                          <Trash2
                            className="absolute top-1/2 right-0 w-4 h-4 -translate-y-1/2 text-destructive cursor-pointer z-20 hover:text-custom"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAvatar(undefined);
                              setRemoveAvatar(true);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            className="object-cover"
                            src={tempAvatar}
                            fill={true}
                            sizes="100%"
                            alt="avatar"
                          />
                          <Trash2
                            className="absolute top-1/2 right-0 w-4 h-4 -translate-y-1/2 text-destructive cursor-pointer z-20 hover:text-custom"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAvatar(undefined);
                              setRemoveAvatar(true);
                            }}
                          />
                        </div>
                      )}
                      <Input
                        {...getInputProps()}
                        className="hidden"
                        type="file"
                        disabled={loading}
                      />
                    </div>
                  )}
                </Dropzone>
                <Form {...form}>
                  <form
                    className="w-full flex flex-col mt-16 tablet:mt-8"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="space-y-6">
                      <ProfileInput
                        form={form.control}
                        id="username"
                        title="Benutzername*"
                        placeholder="@benutzername"
                        content="Wir achten sehr auf den Schutz deiner Identität, daher sollte dies nicht deinen Klarnamen enthalten. Du kannst dir auch ganz einfach einen generieren."
                        actionButton={{
                          text: "Generieren",
                          onClick: generateRandomUsername
                        }}
                      />
                      <ProfileInput
                        form={form.control}
                        type="date"
                        id="birth"
                        title="Geburtsdatum*"
                      />
                      <ProfileInput
                        form={form.control}
                        id="email"
                        type="email"
                        title="E-Mail"
                        placeholder="info@beispiel.de"
                      />
                      <ProfileInput
                        form={form.control}
                        id="phone"
                        title="Telefon"
                        placeholder="Max Mustermann"
                      />
                      <AddressInput form={form.control} />
                      <ProfileInput
                        form={form.control}
                        type="textarea"
                        id="bio"
                        title="Notizen"
                        content="Bitte beachte, dass deine Bio eventuell für andere Mitglieder sichtbar ist. Teile nur Infos, die du auch öffentlich machen möchtest."
                        placeholder="Notizen"
                      />
                      <div className="w-full flex justify-between tablet:flex-col">
                        <p className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2 mobile:text-sm">
                          Mitgliedsnummer
                        </p>
                        <p className="w-full">{params.id}</p>
                      </div>
                      <div className="w-full flex justify-between tablet:flex-col">
                        <p className="max-w-64 w-full flex flex-col space-y-2 mr-10 font-medium laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2 mobile:text-sm">
                          Mitgliedsstatus
                        </p>
                        <div className="w-full">
                          {member?.status === "active" && (
                            <Badge className="w-fit h-fit p-1.5 text-xs text-[#19A873] leading-[8px] bg-[#00C978]/25 rounded-md">
                              Aktiv
                            </Badge>
                          )}
                          {member?.status === "inactive" && (
                            <Badge className="w-fit h-fit p-1.5 text-xs text-[#BD4C4D] leading-[8px] bg-[#FEF0F2] rounded-md">
                              Inaktiv
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ProfileInput
                        form={form.control}
                        type="checkbox"
                        id="ageVerify"
                        title="Altersverifikation"
                        checkboxLabel="Das Mitglied ist über 18 Jahre alt und ich habe den
                          Ausweis geprüft"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                      <Button
                        className="h-10 px-4 mobile:px-2"
                        type="button"
                        variant="outline"
                        onClick={handleBefore}
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
              </div>
            )}
          </CardContent>
        </Card>
        {isEdit && (
          <>
            <Card>
              <CardContent className="flex flex-col p-0">
                <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Mitgliedsbeiträge
                  </h1>
                  <p className="pt-2 text-sm text-content mobile:text-xs">
                    Hier kannst du die Mitgliedsbeiträge des Mitglieds
                    bearbeiten.
                  </p>
                </div>
                <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                  <div className="flex justify-between tablet:flex-col">
                    <p className="max-w-64 w-full mr-10 font-medium laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2 mobile:text-sm">
                      Mitgliedsbeiträge
                    </p>
                    <div className="w-full flex flex-col space-y-2">
                      {membership.map((item, key) => {
                        return (
                          <div
                            className="flex justify-between items-center space-x-2 p-5 border rounded-lg tablet:flex-col tablet:items-start tablet:space-x-0 tablet:space-y-2 tablet:p-3"
                            key={key}
                          >
                            <div className="w-full flex items-center space-x-20 desktop:space-x-10 laptop:space-x-5">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  className="flex justify-center items-center w-3 h-3"
                                  id={item._id}
                                  checked={memberships.includes(
                                    item._id as string
                                  )}
                                  onCheckedChange={() =>
                                    toggleCheckbox(item._id as string)
                                  }
                                />
                                <label
                                  className="font-medium text-sm mobile:text-xs"
                                  htmlFor={item._id}
                                >
                                  {item.membershipname}
                                </label>
                              </div>
                              <p className="whitespace-nowrap font-medium text-sm mobile:text-xs">
                                {`${item.price}€ / ${item.period}`}
                              </p>
                            </div>
                            <p
                              className="max-w-xs w-full overflow-hidden text-content text-sm tablet:max-w-none mobile:text-xs"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                    <Button
                      className="h-10 px-4 mobile:px-2"
                      variant="outline"
                      onClick={handleBefore}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      className="h-10 px-4 text-sm bg-custom mobile:px-2 hover:bg-customhover"
                      onClick={handleMembership}
                    >
                      {membershipLoading ? (
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
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col p-0">
                <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Rollen
                  </h1>
                  <p className="pt-2 text-sm text-content mobile:text-xs">
                    Hier kannst du die Rollen des Mitglieds bearbeiten.
                  </p>
                </div>
                <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                  <div className="flex flex-col space-y-2">
                    {role.map((item, key) => {
                      return (
                        <div
                          className="flex justify-between items-center space-x-2"
                          key={key}
                        >
                          <div className="w-full flex items-center space-x-3">
                            <div
                              className={cn(
                                "min-w-3 h-3 rounded-full",
                                colorData.filter(
                                  (f) => f.name === item.rolecolor
                                )[0].bgColor
                              )}
                            />
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium">
                                {item.rolename}
                              </p>
                              <p className="text-xs text-content">
                                {item.roledesc === ""
                                  ? "Keine Beschreibung."
                                  : item.roledesc}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={roles.includes(item.roleID)}
                            onCheckedChange={() => toggleSwitch(item.roleID)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                    <Button
                      className="h-10 px-4 mobile:px-2"
                      variant="outline"
                      onClick={handleBefore}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      className="h-10 px-4 text-sm bg-custom mobile:px-2 hover:bg-customhover"
                      onClick={handleRole}
                    >
                      {roleLoading ? (
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
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col p-0">
                <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    SEPA-Lastschriftmandat
                  </h1>
                </div>
                <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                  <Form {...sepaform}>
                    <form
                      className="w-full flex flex-col mt-16 tablet:mt-8"
                      onSubmit={sepaform.handleSubmit(onSEPASubmit)}
                    >
                      <div className="space-y-6">
                        <ProfileInput
                          form={sepaform.control}
                          title="IBAN"
                          id="IBAN"
                          placeholder="IBAN"
                        />
                        <ProfileInput
                          form={sepaform.control}
                          title="BIC"
                          id="BIC"
                          placeholder="BIC"
                        />
                        <ProfileInput
                          form={sepaform.control}
                          title="Mandatsreferenz"
                          id="mandate_refer"
                          placeholder="Mandatsreferenz"
                          content="Hier kannst du eine individuelle Mandatsreferenz eingeben, die du selbst erstellt hast oder von deiner Bank erhalten hast. Alternativ kannst du auch eine gültige Mandatsreferenz automatisch generieren lassen."
                          actionButton={{
                            text: "Generieren",
                            onClick: generateMandateReference
                          }}
                        />
                        <ProfileInput
                          form={sepaform.control}
                          title="Mandat unterzeichnet am"
                          type="date"
                          id="mandate_sign"
                          content="Gib das Datum an, an dem das Mandat unterzeichnet wurde. Hinweis: Das unterschriebene Mandat kannst du auch in den Dokumenten hochladen."
                        />
                      </div>
                      <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                        <Button
                          className="h-10 px-4 mobile:px-2"
                          type="button"
                          variant="outline"
                          onClick={handleBefore}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                          type="submit"
                        >
                          {sepaLoading ? (
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
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberInfoPage;
