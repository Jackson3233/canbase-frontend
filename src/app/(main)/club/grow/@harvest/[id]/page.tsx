"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Check,
  ChevronLeft,
  ChevronsUpDown,
  PackageOpen,
  Pencil,
  Sprout,
  XIcon,
} from "lucide-react";
import { PlantTable } from "../../plant-table";
import { plantColumns } from "../../plant-column";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { harvestsActions } from "@/store/reducers/harvestReducer";
import Overview from "@/components/basic/Overview";
import GrowCard from "@/components/basic/GrowCard";
import ProfileInput from "@/components/basic/ProfileInput";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { addDiary, getHarvest, updateHarvest } from "@/actions/harvest";
import { DiaryFormSchema, HarvestFormSchema } from "@/constant/formschema";
import { getAvatarLetters, getCleanDate, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const HarvestInfoPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const { members } = useAppSelector((state) => state.members);
  const { plants } = useAppSelector((state) => state.plants);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diaryLoading, setDiaryLoading] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [openHarvestDlg, setOpenHarvestDlg] = useState(false);
  const [harvest, setHarvest] = useState<any>();
  const [tags, setTags] = useState("");

  const tagsRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof HarvestFormSchema>>({
    resolver: zodResolver(HarvestFormSchema),
    defaultValues: {
      status: "",
      member: "",
      wet_weight: 0,
      waste: 0,
      dry_weight: 0,
      cbd: 0,
      thc: 0,
      tags: [],
      note: "",
    },
  });
  const diaryForm = useForm<z.infer<typeof DiaryFormSchema>>({
    resolver: zodResolver(DiaryFormSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    (async () => {
      const result = await getHarvest({ harvestID: params.id });

      if (result.success) {
        setHarvest(result.harvest);

        form.reset({
          status: result.harvest?.status,
          member: result.harvest?.member?._id,
          wet_weight: result.harvest?.wet_weight,
          waste: result.harvest?.wet_weight,
          dry_weight: result.harvest?.wet_weight,
          cbd: result.harvest?.cbd,
          thc: result.harvest?.thc,
          tags: result.harvest?.tags,
          note: result.harvest?.note,
        });
      }
    })();
  }, [form, params.id]);

  const handleBefore = () => {
    if (isEdit) {
      setIsEdit((prev) => !prev);

      form.reset({
        status: harvest?.status,
        member: harvest?.member?._id,
        wet_weight: harvest?.wet_weight,
        waste: harvest?.wet_weight,
        dry_weight: harvest?.wet_weight,
        cbd: harvest?.cbd,
        thc: harvest?.thc,
        tags: harvest?.tags,
        note: harvest?.note,
      });
    } else {
      router.push("/club/grow?tab=harvest");
    }
  };

  const onDiarySubmit = async (data: z.infer<typeof DiaryFormSchema>) => {
    setDiaryLoading(true);

    const result = await addDiary({ ...data, harvestID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setDiaryLoading(false);

    if (result.success) {
      dispatch(harvestsActions.setHarvests({ harvests: result.harvests }));
      setHarvest(result.harvest);

      diaryForm.reset({ content: "" });
    }
  };

  const onSubmit = async (data: z.infer<typeof HarvestFormSchema>) => {
    setLoading(true);

    const result = await updateHarvest({ ...data, harvestID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(harvestsActions.setHarvests({ harvests: result.harvests }));
      setHarvest(result.harvest);

      setIsEdit((prev) => !prev);

      form.reset({
        status: result.harvest?.status,
        member: result.harvest?.member?._id,
        wet_weight: result.harvest?.wet_weight,
        waste: result.harvest?.wet_weight,
        dry_weight: result.harvest?.wet_weight,
        cbd: result.harvest?.cbd,
        thc: result.harvest?.thc,
        tags: result.harvest?.tags,
        note: result.harvest?.note,
      });
    }
  };

  const handleCannabis = () => {};

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={handleBefore}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="text-xs">
              {!isEdit ? "Alle Chargen" : "Zurück"}
            </span>
          </Button>
          {!isEdit && (
            <>
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={() => setIsEdit((prev) => !prev)}
              >
                <Pencil className="w-3 h-3" />
                <span className="text-xs">Bearbeiten</span>
              </Button>
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={() => setOpenHarvestDlg(true)}
              >
                <Sprout className="w-3 h-3" />
                <span className="text-xs">Inventarisieren</span>
              </Button>
            </>
          )}
        </div>
        {!isEdit ? (
          <div className="flex flex-col space-y-5">
            <div className="flex gap-6 laptop:flex-col tablet:gap-3">
              <Card className="w-full h-fit">
                <CardContent className="p-0">
                  <div className="p-7 border-b tablet:p-5">
                    <h1 className="font-semibold tablet:text-sm">
                      {harvest?.harvestname}
                    </h1>
                    <p className="text-sm text-content mobile:text-xs">
                      {harvest?.charge?.plants.length} Pflanzen
                    </p>
                  </div>
                  <div className="flex flex-col space-y-5 p-7 tablet:space-y-3 tablet:p-5">
                    <div className="w-24 h-24 flex justify-center items-center bg-[#F8F8F8] rounded-full tablet:self-center">
                      <PackageOpen className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
                    </div>
                    <div className="flex flex-col space-y-5 tablet:space-y-3">
                      <div className="flex flex-wrap gap-5 tablet:gap-3 mobile:flex-col">
                        <Overview title="Name" content={harvest?.harvestname} />
                        <div className="max-w-72 w-full flex flex-col space-y-1">
                          <p className="text-xs text-content">Status</p>
                          {harvest?.status === "drying" && (
                            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                              Trockung
                            </Badge>
                          )}
                          {harvest?.status === "curing" && (
                            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                              Aushärtung
                            </Badge>
                          )}
                          {harvest?.status === "test_in_progress" && (
                            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                              Test in Bearbeitung
                            </Badge>
                          )}
                          {harvest?.status === "ready_for_issue" && (
                            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                              Bereit zur Ausgabe
                            </Badge>
                          )}
                          {harvest?.status === "destroyed" && (
                            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                              Vernichtet
                            </Badge>
                          )}
                        </div>
                        <Overview
                          title="Mitglieder"
                          content={harvest?.member?.username}
                        />
                        <Overview
                          title="Trockengewicht"
                          content={`${harvest?.wet_weight} g`}
                        />
                        <Overview
                          title="Nassgewicht"
                          content={`${harvest?.waste} g`}
                        />
                        <Overview
                          title="Verschnitt"
                          content={`${harvest?.dry_weight} g`}
                        />
                        <Overview
                          title="Gemessener THC Gehalt"
                          content={`${harvest?.cbd} %`}
                        />
                        <Overview
                          title="Gemessener CBD Gehalt"
                          content={`${harvest?.thc} %`}
                        />
                        <Overview
                          title="Erstellt am"
                          content={getCleanDate(harvest?.createdAt, 2)}
                        />
                        <Overview
                          title="Zuletzt bearbeitet"
                          content={getCleanDate(harvest?.updatedAt, 2)}
                        />
                      </div>
                      {!isEmpty(harvest?.note) && (
                        <Overview title="Notizen" content={harvest.note} />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="max-w-xs w-full h-fit laptop:max-w-none">
                <CardContent className="p-0">
                  <h1 className="p-7 font-semibold border-b tablet:p-5 tablet:text-sm">
                    Tagebuch
                  </h1>
                  <div className="flex flex-col space-y-3 p-7 tablet:p-5">
                    {harvest?.diary?.map((item: any, key: string) => {
                      return (
                        <div className="flex space-x-2" key={key}>
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={
                                (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                                item.user?.avatar
                              }
                              alt="avatar"
                            />
                            <AvatarFallback className="text-sm">
                              {getAvatarLetters(item.user.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col space-y-2">
                            <div>
                              <p className="text-xs font-medium">
                                {item.user.username}
                              </p>
                              <p className="text-xs text-content">
                                {getCleanDate(item.date, 2)}
                              </p>
                            </div>
                            <p
                              className="overflow-hidden text-xs font-medium text-ellipsis break-all"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.content}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <Form {...diaryForm}>
                      <form
                        className="w-full flex flex-col space-y-3"
                        onSubmit={diaryForm.handleSubmit(onDiarySubmit)}
                      >
                        <FormField
                          control={diaryForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Textarea
                                  className="h-24 resize-none"
                                  placeholder="Neuer Eintrag..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-left" />
                            </FormItem>
                          )}
                        />
                        <Button
                          className="h-10 self-end px-4 bg-custom mobile:w-full mobile:px-2 hover:bg-customhover"
                          type="submit"
                        >
                          {diaryLoading ? (
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
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="max-w-lg w-full rounded-3xl">
              <CardContent className="flex flex-col space-y-5 p-10 tablet:space-y-3 tablet:p-7 mobile:p-5">
                <div className="w-16 h-16 flex justify-center items-center bg-[#F8F8F8] rounded-full">
                  <PackageOpen className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
                </div>
                <div className="flex flex-col space-y-4 tablet:space-y-2">
                  <p className="text-lg font-semibold tablet:text-base mobile:text-sm">
                    {harvest?.charge.chargename}
                  </p>
                  <div className="flex flex-col text-sm text-content mobile:text-xs">
                    <p>{harvest?.charge?.plants.length} Pflanzen</p>
                    <p>
                      Gestartet: {getCleanDate(harvest?.charge.createdAt, 2)}
                    </p>
                  </div>
                </div>
                {!isEmpty(harvest?.charge?.description) && (
                  <p
                    className="overflow-hidden text-xs font-medium text-content text-ellipsis break-all"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {harvest.charge.description}
                  </p>
                )}
                <div className="flex flex-col space-y-4 tablet:space-y-2">
                  <p className="text-sm text-content mobile:text-xs">
                    Anbaufortschritt
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {harvest?.charge?.plants.map((item: any, key: string) => (
                      <div key={key}>
                        {item.status === "seeds" && (
                          <div className="w-3 h-3 bg-[#00E98B] rounded-sm" />
                        )}
                        {item.status === "germination" && (
                          <div className="w-3 h-3 bg-[#00D37E] rounded-sm" />
                        )}
                        {item.status === "cutting" && (
                          <div className="w-3 h-3 bg-[#00C173] rounded-sm" />
                        )}
                        {item.status === "vegetative" && (
                          <div className="w-3 h-3 bg-[#009659] rounded-sm" />
                        )}
                        {item.status === "flowering" && (
                          <div className="w-3 h-3 bg-[#007043] rounded-sm" />
                        )}
                        {item.status === "harvest" && (
                          <div className="w-3 h-3 bg-[#002114] rounded-sm" />
                        )}
                        {item.status === "quarantine" && (
                          <div className="w-3 h-3 bg-[#FBCB15] rounded-sm" />
                        )}
                        {item.status === "destroyed" && (
                          <div className="w-3 h-3 bg-[#EF4444] rounded-sm" />
                        )}
                        {item.status === undefined && (
                          <div className="w-3 h-3 border rounded-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Geerntete Pflanzen
                  </h1>
                  <p className="text-xs text-content">
                    {harvest?.charge?.plants.length} Pflanzen
                  </p>
                </div>
                <PlantTable
                  columns={plantColumns}
                  data={
                    plants.filter((plant) =>
                      harvest?.charge?.plants.includes(plant._id)
                    ) as any
                  }
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl	font-semibold tablet:text-xl">
                  Ernte bearbeiten
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  {harvest.harvestedID}
                </p>
              </div>
              <Form {...form}>
                <form
                  className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="space-y-6 mobile:space-y-3">
                    <ProfileInput
                      form={form.control}
                      type="selectbox"
                      id="status"
                      title="Status*"
                      content="Der aktuelle Status der Ernte."
                      placeholder="Suche nach einem Status"
                      selectValues={[
                        { key: "drying", value: "Trockung" },
                        { key: "curing", value: "Aushärtung" },
                        {
                          key: "test_in_progress",
                          value: "Test in Bearbeitung",
                        },
                        { key: "ready_for_issue", value: "Bereit zur Ausgabe" },
                        { key: "destroyed", value: "Vernichtet" },
                      ]}
                    />
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">Charge</p>
                      </div>
                      <div className="w-full">
                        <GrowCard
                          type="charge"
                          title={harvest?.charge.chargename}
                          status={harvest?.charge.status}
                        />
                      </div>
                    </div>
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">Pflanzen</p>
                      </div>
                      <div className="w-full flex flex-wrap gap-3">
                        {plants
                          .filter((plant) =>
                            harvest?.charge?.plants.includes(plant._id)
                          )
                          .map((plant, key) => (
                            <GrowCard
                              key={key}
                              type="plant"
                              title={plant.plantname}
                              status={plant.status}
                            />
                          ))}
                      </div>
                    </div>
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">Mitglieder</p>
                      </div>
                      <FormField
                        control={form.control}
                        name="member"
                        render={({ field: { value, onChange } }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Collapsible open={memberOpen}>
                                <CollapsibleTrigger
                                  asChild
                                  onClick={() => setMemberOpen((prev) => !prev)}
                                >
                                  <Button
                                    className="w-full flex justify-between items-center font-normal px-3 py-2"
                                    variant="outline"
                                  >
                                    {value
                                      ? members.find(
                                          (item) => item._id === value
                                        )?.username
                                      : "Mitglieder auswählen..."}
                                    <ChevronsUpDown className="h-3 w-3 opacity-50" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <Card>
                                    <CardContent className="mt-1 p-1">
                                      <Command>
                                        <CommandInput placeholder="Suche nach einem Mitglieder" />
                                        <CommandEmpty className="text-sm px-3 py-1.5">
                                          Keine Mitglieder gefunden.
                                        </CommandEmpty>
                                        <CommandList>
                                          <CommandGroup>
                                            {members.map((item, key) => (
                                              <CommandItem
                                                key={key}
                                                onSelect={() => {
                                                  onChange(
                                                    item._id === value
                                                      ? ""
                                                      : item._id
                                                  );
                                                  setMemberOpen(false);
                                                }}
                                              >
                                                <Check
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === item._id
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                {item.username}
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </CardContent>
                                  </Card>
                                </CollapsibleContent>
                              </Collapsible>
                            </FormControl>
                            <FormMessage className="text-left" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="wet_weight"
                      title="Nassgewicht*"
                      content="Das Gewicht der Pflanzen direkt nach der Ernte in Gramm."
                      minValue={0}
                      tag="Gramm (g)"
                      placeholder="Nassgewicht"
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="waste"
                      title="Verschnitt*"
                      content="Das Gewicht des Verschnitts in Gramm."
                      minValue={0}
                      tag="Gramm (g)"
                      placeholder="Verschnitt"
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="dry_weight"
                      title="Trockengewicht*"
                      content="Das Gewicht der Pflanzen nach der Aushärtung in Gramm."
                      minValue={0}
                      tag="Gramm (g)"
                      placeholder="Trockengewicht"
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="cbd"
                      title="CBD Gehalt*"
                      content="Der gemessene CBD Gehalt in Prozent"
                      minValue={0}
                      tag="Gramm (g)"
                      placeholder="CBD Gehalt"
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="thc"
                      title="THC Gehalt*"
                      content="Der gemessene THC Gehalt in Prozent."
                      minValue={0}
                      tag="Gramm (g)"
                      placeholder="THC Gehalt"
                    />
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">Tags</p>
                        <p className="text-sm text-content mobile:text-xs">
                          Tags helfen dabei, das Ernten zu kategorisieren.
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field: { value, onChange } }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <div
                                className={cn(
                                  "max-h-32 min-h-10 overflow-y-auto flex w-full flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                )}
                              >
                                {value.map((item: any, key: any) => (
                                  <Badge key={key} variant="secondary">
                                    {item}
                                    <Button
                                      className="ml-2 h-3 w-3"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        onChange(
                                          value.filter((f: any) => f !== item)
                                        );
                                      }}
                                    >
                                      <XIcon className="w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                                <input
                                  className="flex-1 outline-none min-w-0 bg-white"
                                  ref={tagsRef}
                                  value={tags}
                                  placeholder="Suche nach Tags oder füge Neue hinzu..."
                                  onChange={(e) => setTags(e.target.value)}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (
                                      value.includes(tags) ||
                                      tags.length === 0
                                    ) {
                                      toast({
                                        className:
                                          "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
                                        description:
                                          "Bitte geben Sie ein gültiges Tag ein.",
                                      });
                                      setTags("");
                                    } else {
                                      onChange([...value, tags]);
                                      setTags("");

                                      const tagsInput = tagsRef.current;
                                      if (tagsInput) tagsInput.placeholder = "";
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === ",") {
                                      e.preventDefault();

                                      if (
                                        value.includes(tags) ||
                                        tags.length === 0
                                      ) {
                                        toast({
                                          className:
                                            "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
                                          description:
                                            "Bitte geben Sie ein gültiges Tag ein.",
                                        });
                                        setTags("");
                                      } else {
                                        onChange([...value, tags]);
                                        setTags("");

                                        const tagsInput = tagsRef.current;
                                        if (tagsInput)
                                          tagsInput.placeholder = "";
                                      }
                                    } else if (
                                      e.key === "Backspace" &&
                                      tags.length === 0 &&
                                      value.length > 0
                                    ) {
                                      e.preventDefault();

                                      const tagsInput = tagsRef.current;
                                      if (value.length === 1 && tagsInput) {
                                        tagsInput.placeholder =
                                          "Suche nach Tags oder füge Neue hinzu...";
                                      }

                                      onChange(value.slice(0, -1));
                                    }
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-left" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="note"
                      title="Notizen"
                      content="Weitere Informationen oder Besonderheiten zur Ernte."
                      placeholder="Notizen"
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
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={openHarvestDlg} onOpenChange={setOpenHarvestDlg}>
        <DialogContent className="max-w-5xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
          <h1 className="p-10 pb-5 border-b text-2xl font-semibold tablet:p-7 tablet:pb-5 tablet:text-xl mobile:p-5">
            Ernte inventarisieren
          </h1>
          <div className="max-h-[700px] flex flex-col p-10 overflow-y-auto tablet:p-7 mobile:p-5">
            <div className="flex flex-col space-y-5 tablet:space-y-3">
              <div className="flex flex-wrap gap-5 tablet:gap-3 mobile:flex-col">
                <Overview title="Name" content={harvest?.harvestname} />
                <div className="max-w-72 w-full flex flex-col space-y-1">
                  <p className="text-xs text-content">Status</p>
                  {harvest?.status === "drying" && (
                    <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                      Trockung
                    </Badge>
                  )}
                  {harvest?.status === "curing" && (
                    <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                      Aushärtung
                    </Badge>
                  )}
                  {harvest?.status === "test_in_progress" && (
                    <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                      Test in Bearbeitung
                    </Badge>
                  )}
                  {harvest?.status === "ready_for_issue" && (
                    <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                      Bereit zur Ausgabe
                    </Badge>
                  )}
                  {harvest?.status === "destroyed" && (
                    <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                      Vernichtet
                    </Badge>
                  )}
                </div>
                <Overview
                  title="Mitglieder"
                  content={harvest?.member?.username}
                />
                <Overview
                  title="Trockengewicht"
                  content={`${harvest?.wet_weight} g`}
                />
                <Overview title="Nassgewicht" content={`${harvest?.waste} g`} />
                <Overview
                  title="Verschnitt"
                  content={`${harvest?.dry_weight} g`}
                />
                <Overview
                  title="Gemessener THC Gehalt"
                  content={`${harvest?.cbd} %`}
                />
                <Overview
                  title="Gemessener CBD Gehalt"
                  content={`${harvest?.thc} %`}
                />
                <Overview
                  title="Erstellt am"
                  content={getCleanDate(harvest?.createdAt, 2)}
                />
                <Overview
                  title="Zuletzt bearbeitet"
                  content={getCleanDate(harvest?.updatedAt, 2)}
                />
              </div>
              {!isEmpty(harvest?.note) && (
                <Overview title="Notizen" content={harvest.note} />
              )}
            </div>
            <Separator className="my-5 tablet:my-3" />
            <div className="flex flex-col space-y-5 tablet:space-y-3">
              <div className="w-full flex justify-between tablet:flex-col">
                <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                  <p className="font-medium mobile:text-sm">Charge</p>
                </div>
                <div className="w-full">
                  <GrowCard
                    type="charge"
                    title={harvest?.charge.chargename}
                    status={harvest?.charge.status}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between tablet:flex-col">
                <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                  <p className="font-medium mobile:text-sm">Pflanzen</p>
                </div>
                <div className="w-full flex flex-wrap gap-3">
                  {plants
                    .filter((plant) =>
                      harvest?.charge?.plants.includes(plant._id)
                    )
                    .map((plant, key) => (
                      <GrowCard
                        key={key}
                        type="plant"
                        title={plant.plantname}
                        status={plant.status}
                      />
                    ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
              <Button
                className="h-10 px-4 mobile:px-2"
                type="button"
                variant="outline"
                onClick={() => setOpenHarvestDlg(false)}
              >
                Abbrechen
              </Button>
              <Button
                className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                onClick={handleCannabis}
              >
                {loading ? (
                  <ClipLoader
                    aria-label="loader"
                    data-testid="loader"
                    color="white"
                    size={16}
                  />
                ) : (
                  <span className="text-sm">Inventar erstellen</span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HarvestInfoPage;
