"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Check,
  ChevronLeft,
  ChevronsUpDown,
  Info,
  Plus,
  Sprout,
} from "lucide-react";
import ChargeModal from "../../charge";
import StrainModal from "../../strain";
import ZoneModal from "../../zone";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { plantsActions } from "@/store/reducers/plantsReducer";
import { chargesActions } from "@/store/reducers/chargesReducer";
import Overview from "@/components/basic/Overview";
import ProfileInput from "@/components/basic/ProfileInput";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { addDiary, getPlant, updatePlant } from "@/actions/plant";
import { DiaryFormSchema, PlantFormSchema } from "@/constant/formschema";
import {
  defaultCalendarOption,
  plantCalendarSeries,
} from "@/constant/calendars";
import { getAvatarLetters, getCleanDate, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import PageQRModal from "@/components/basic/PageQRModal";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PlantInfoPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const { strains } = useAppSelector((state) => state.strains);
  const { zones } = useAppSelector((state) => state.zones);
  const { charges } = useAppSelector((state) => state.charges);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diaryLoading, setDiaryLoading] = useState(false);
  const [strainOpen, setStrainOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [chargeOpen, setChargeOpen] = useState(false);
  const [plant, setPlant] = useState<any>();
  const [openStrainDlg, setOpenStrainDlg] = useState(false);
  const [openChargeDlg, setOpenChargeDlg] = useState(false);
  const [openZoneDlg, setOpenZoneDlg] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);

  const [calendarSeries, setCalendarSeries] = useState<any>([]);

  const form = useForm<z.infer<typeof PlantFormSchema>>({
    resolver: zodResolver(PlantFormSchema),
    defaultValues: {
      plantname: "",
      description: "",
      strain: "",
      zone: "",
      charge: "",
      status: "",
      isParent: false,
      sowing_date: undefined,
      germination_date: undefined,
      cutting_date: undefined,
      growing_date: undefined,
      flowering_date: undefined,
      harvest_date: undefined,
      destruction_date: undefined,
      yield_per_plant: undefined,
      substrate: "",
      fertilizer: "",
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
      const result = await getPlant({ plantID: params.id });

      if (result.success) {
        setPlant(result.plant);

        form.reset({
          plantname: result.plant?.plantname,
          description: result.plant?.description,
          strain: result.plant?.strain._id,
          zone: result.plant?.zone?._id,
          charge: result.plant?.charge?._id,
          status: result.plant?.status ?? "",
          isParent: result.plant?.isParent,
          sowing_date: result.plant?.sowing_date,
          germination_date: result.plant?.germination_date,
          cutting_date: result.plant?.cutting_date,
          growing_date: result.plant?.growing_date,
          flowering_date: result.plant?.flowering_date,
          harvest_date: result.plant?.harvest_date,
          destruction_date: result.plant?.destruction_date,
          yield_per_plant: result.plant?.yield_per_plant,
          substrate: result.plant?.substrate,
          fertilizer: result.plant?.fertilizer,
          note: result.plant?.note,
        });

        const tempSeries = plantCalendarSeries(result.plant);

        setCalendarSeries(tempSeries);
      }
    })();
  }, [form, params.id]);

  const handleBefore = () => {
    if (isEdit) {
      setIsEdit((prev) => !prev);

      form.reset({
        plantname: plant?.plantname,
        description: plant?.description,
        strain: plant?.strain._id,
        zone: plant?.zone?._id,
        charge: plant?.charge?._id,
        status: plant?.status ?? "",
        isParent: plant?.isParent,
        sowing_date: plant?.sowing_date,
        germination_date: plant?.germination_date,
        cutting_date: plant?.cutting_date,
        growing_date: plant?.growing_date,
        flowering_date: plant?.flowering_date,
        harvest_date: plant?.harvest_date,
        destruction_date: plant?.destruction_date,
        yield_per_plant: plant?.yield_per_plant,
        substrate: plant?.substrate,
        fertilizer: plant?.fertilizer,
        note: plant?.note,
      });
    } else {
      router.push("/club/grow?tab=plant");
    }
  };

  const onDiarySubmit = async (data: z.infer<typeof DiaryFormSchema>) => {
    setDiaryLoading(true);

    const result = await addDiary({ ...data, plantID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setDiaryLoading(false);

    if (result.success) {
      dispatch(plantsActions.setPlants({ plants: result.plants }));
      setPlant(result.plant);

      diaryForm.reset({ content: "" });
    }
  };

  const onSubmit = async (data: z.infer<typeof PlantFormSchema>) => {
    setLoading(true);

    const result = await updatePlant({ ...data, plantID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(plantsActions.setPlants({ plants: result.plants }));
      dispatch(chargesActions.setCharges({ charges: result.charges }));
      setPlant(result.plant);

      setIsEdit((prev) => !prev);

      form.reset({
        plantname: result.plant?.plantname,
        description: result.plant?.description,
        strain: result.plant?.strain._id,
        zone: result.plant?.zone?._id,
        charge: result.plant?.charge?._id,
        status: result.plant?.status ?? "",
        isParent: result.plant?.isParent,
        sowing_date: result.plant?.sowing_date,
        germination_date: result.plant?.germination_date,
        cutting_date: result.plant?.cutting_date,
        growing_date: result.plant?.growing_date,
        flowering_date: result.plant?.flowering_date,
        harvest_date: result.plant?.harvest_date,
        destruction_date: result.plant?.destruction_date,
        yield_per_plant: result.plant?.yield_per_plant,
        substrate: result.plant?.substrate,
        fertilizer: result.plant?.fertilizer,
        note: result.plant?.note,
      });

      const tempSeries = plantCalendarSeries(result.plant);

      setCalendarSeries(tempSeries);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <div className="flex items-center space-x-2">
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={handleBefore}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="text-xs">
              {!isEdit ? "Alle Pflanzen" : "Zurück"}
            </span>
          </Button>
          {!isEdit && (
            <Button
              className="h-auto w-fit rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
              disabled={
                user?.role !== "owner" &&
                !user?.functions?.includes("club-grow-manage")
              }
            >
              <span className="text-xs">Bearbeiten</span>
            </Button>
          )}
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={() => setOpenQRModal(true)}
          >
            <span className="text-xs">QR Code</span>
          </Button>
        </div>
        {!isEdit ? (
          <div className="flex flex-col space-y-5">
            <div className="flex gap-6 laptop:flex-col tablet:gap-3">
              <Card className="w-full h-fit">
                <CardContent className="p-0">
                  <h1 className="p-7 font-semibold border-b tablet:p-5 tablet:text-sm">
                    {plant?.plantname}
                  </h1>
                  <div className="flex flex-col space-y-5 p-7 tablet:space-y-3 tablet:p-5">
                    <div className="w-24 h-24 flex justify-center items-center bg-[#F8F8F8] rounded-full tablet:self-center">
                      <Sprout className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
                    </div>
                    <div className="flex flex-col space-y-5 tablet:space-y-3">
                      <div className="flex flex-wrap gap-5 tablet:gap-3 mobile:flex-col">
                        <Overview title="Name" content={plant?.plantname} />
                        <Overview
                          title="Strain"
                          content={plant?.strain.strainname}
                        />
                        <Overview
                          title="Charge"
                          content={
                            isEmpty(plant?.charge)
                              ? "-"
                              : plant.charge.chargename
                          }
                        />
                        <Overview
                          title="Zone"
                          content={
                            isEmpty(plant?.zone) ? "-" : plant.zone.zonename
                          }
                        />
                        <div className="max-w-72 w-full flex flex-col space-y-1">
                          <p className="text-xs text-content">Status</p>
                          <div className="flex items-center space-x-1 text-xs font-medium">
                            {plant?.status === "seeds" ? (
                              <>
                                <div className="w-3 h-3 bg-[#00E98B] rounded-sm" />
                                <span className="text-xs">Samen</span>
                              </>
                            ) : plant?.status === "germination" ? (
                              <>
                                <div className="w-3 h-3 bg-[#00D37E] rounded-sm" />
                                <span className="text-xs">Keimung</span>
                              </>
                            ) : plant?.status === "cutting" ? (
                              <>
                                <div className="w-3 h-3 bg-[#00C173] rounded-sm" />
                                <span className="text-xs">Steckling</span>
                              </>
                            ) : plant?.status === "vegetative" ? (
                              <>
                                <div className="w-3 h-3 bg-[#009659] rounded-sm" />
                                <span className="text-xs">
                                  Vegetative Phase
                                </span>
                              </>
                            ) : plant?.status === "flowering" ? (
                              <>
                                <div className="w-3 h-3 bg-[#007043] rounded-sm" />
                                <span className="text-xs">Blütephase</span>
                              </>
                            ) : plant?.status === "harvest" ? (
                              <>
                                <div className="w-3 h-3 bg-[#002114] rounded-sm" />
                                <span className="text-xs">Ernte</span>
                              </>
                            ) : plant?.status === "quarantine" ? (
                              <>
                                <div className="w-3 h-3 bg-[#FBCB15] rounded-sm" />
                                <span className="text-xs">Quarantäne</span>
                              </>
                            ) : plant?.status === "destroyed" ? (
                              <>
                                <div className="w-3 h-3 bg-[#EF4444] rounded-sm" />
                                <span className="text-xs">Vernichtet</span>
                              </>
                            ) : (
                              <>-</>
                            )}
                          </div>
                        </div>
                        <Overview
                          title="Angelegt am"
                          content={getCleanDate(plant?.createdAt, 2)}
                        />
                      </div>
                      {!isEmpty(plant?.note) && (
                        <Overview title="Notizen" content={plant.note} />
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
                    {plant?.diary?.map((item: any, key: string) => {
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
                          disabled={
                            user?.role !== "owner" &&
                            !user?.functions?.includes("club-grow-manage")
                          }
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
            <Card>
              <CardContent className="p-0">
                <h1 className="p-7 font-semibold border-b tablet:p-5 tablet:text-sm">
                  Anbaukalender
                </h1>
                <div className="p-7 tablet:p-5">
                  <ApexChart
                    series={calendarSeries}
                    options={defaultCalendarOption as any}
                    type="rangeBar"
                    height={150}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  {plant?.plantname} bearbeiten
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Hier kannst du die Pflanze bearbeiten.
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
                      id="plantname"
                      title="Name"
                      content="Der Name der Pflanze. Wird aus Strain und Charge automatisch generiert und kann hier ergänzt werden."
                      placeholder="Namen"
                    />
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="description"
                      title="Beschreibung"
                      content="Eine Kurzbeschreibung der Pflanze."
                      placeholder="Beschreibung"
                    />
                    <div className="flex flex-col space-y-3">
                      <p className="text-lg font-semibold mobile:text-base">
                        Zuordnung
                      </p>
                      <div className="flex space-x-2 p-3 bg-[#55A3FF]/10 border-l-2 border-l-[#55A3FF] rounded-lg">
                        <Info
                          className="w-4 h-4 m-0.5 text-white"
                          fill="#55A3FF"
                        />
                        <div className="flex flex-col text-[#55A3FF]">
                          <p className="text-sm font-semibold text-[#55A3FF]">
                            Hinweis zu Pflanzendaten
                          </p>
                          <p className="text-xs">
                            Daten zu einer Pflanze werden von der verknüpften
                            Charge und dem Strain abgeleitet. Hier kannst du die
                            Daten für eine einzelne Pflanze überschreiben.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">Strain*</p>
                        <p className="text-sm text-content mobile:text-xs">
                          Wähle eine vorgefertigte Genetik für die neue Pflanze
                          oder erstelle eine neue.
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="strain"
                        render={({ field: { value, onChange } }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Collapsible open={strainOpen}>
                                <CollapsibleTrigger
                                  asChild
                                  onClick={() => setStrainOpen((prev) => !prev)}
                                >
                                  <Button
                                    className="w-full flex justify-between items-center font-normal px-3 py-2"
                                    variant="outline"
                                  >
                                    {value
                                      ? strains.find(
                                          (item) => item._id === value
                                        )?.strainname
                                      : "Strain auswählen..."}
                                    <ChevronsUpDown className="h-3 w-3 opacity-50" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <Card>
                                    <CardContent className="mt-1 p-1">
                                      <Command>
                                        <CommandInput placeholder="Suche nach einem Strain" />
                                        <CommandEmpty className="text-sm px-3 py-1.5">
                                          Keine Strain gefunden.
                                        </CommandEmpty>
                                        <CommandList>
                                          <CommandGroup>
                                            <CommandItem
                                              onSelect={() => {
                                                setStrainOpen(false);
                                                setOpenStrainDlg(true);
                                              }}
                                            >
                                              <Plus className="mr-2 h-4 w-4" />
                                              <p>Neuen Strain erstellen</p>
                                            </CommandItem>
                                            {strains.map((item, key) => (
                                              <CommandItem
                                                key={key}
                                                onSelect={() => {
                                                  onChange(
                                                    item._id === value
                                                      ? ""
                                                      : item._id
                                                  );
                                                  setStrainOpen(false);
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
                                                {item.strainname}
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
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">Zone</p>
                        <p className="text-sm text-content mobile:text-xs">
                          Wähle eine Zone in der sich die Pflanze momentan
                          befindet.
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="zone"
                        render={({ field: { value, onChange } }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Collapsible open={zoneOpen}>
                                <CollapsibleTrigger
                                  asChild
                                  onClick={() => setZoneOpen((prev) => !prev)}
                                >
                                  <Button
                                    className="w-full flex justify-between items-center font-normal px-3 py-2"
                                    variant="outline"
                                  >
                                    {value
                                      ? zones.find((item) => item._id === value)
                                          ?.zonename
                                      : "Zone auswählen..."}
                                    <ChevronsUpDown className="h-3 w-3 opacity-50" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <Card>
                                    <CardContent className="mt-1 p-1">
                                      <Command>
                                        <CommandInput placeholder="Suche nach einer Zone" />
                                        <CommandEmpty className="text-sm px-3 py-1.5">
                                          Keine Zone gefunden.
                                        </CommandEmpty>
                                        <CommandList>
                                          <CommandGroup>
                                            <CommandItem
                                              onSelect={() => {
                                                setZoneOpen(false);
                                                setOpenZoneDlg(true);
                                              }}
                                            >
                                              <Plus className="mr-2 h-4 w-4" />
                                              <p>Neue Zone erstellen</p>
                                            </CommandItem>
                                            {zones.map((item, key) => (
                                              <CommandItem
                                                key={key}
                                                onSelect={() => {
                                                  onChange(
                                                    item._id === value
                                                      ? ""
                                                      : item._id
                                                  );
                                                  setZoneOpen(false);
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
                                                {item.zonename}
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
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">Charge</p>
                        <p className="text-sm text-content mobile:text-xs">
                          Wähle eine Charge in der sich die Pflanze momentan
                          befindet.
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="charge"
                        render={({ field: { value, onChange } }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Collapsible open={chargeOpen}>
                                <CollapsibleTrigger
                                  asChild
                                  onClick={() => setChargeOpen((prev) => !prev)}
                                >
                                  <Button
                                    className="w-full flex justify-between items-center font-normal px-3 py-2"
                                    variant="outline"
                                  >
                                    {value
                                      ? charges.find(
                                          (item) => item._id === value
                                        )?.chargename
                                      : "Charge auswählen..."}
                                    <ChevronsUpDown className="h-3 w-3 opacity-50" />
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <Card>
                                    <CardContent className="mt-1 p-1">
                                      <Command>
                                        <CommandInput placeholder="Suche nach einer Charge" />
                                        <CommandEmpty className="text-sm px-3 py-1.5">
                                          Keine Charge gefunden.
                                        </CommandEmpty>
                                        <CommandList>
                                          <CommandGroup>
                                            <CommandItem
                                              onSelect={() => {
                                                setChargeOpen(false);
                                                setOpenChargeDlg(true);
                                              }}
                                            >
                                              <Plus className="mr-2 h-4 w-4" />
                                              <p>Neue Charge erstellen</p>
                                            </CommandItem>
                                            {charges.map((item, key) => (
                                              <CommandItem
                                                key={key}
                                                onSelect={() => {
                                                  onChange(
                                                    item._id === value
                                                      ? ""
                                                      : item._id
                                                  );
                                                  setChargeOpen(false);
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
                                                {item.chargename}
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
                    <p className="py-3 text-lg font-semibold mobile:text-base">
                      Anbau
                    </p>
                    <ProfileInput
                      form={form.control}
                      type="selectbox"
                      id="status"
                      title="Status"
                      content="Der aktuelle Zustand der Pflanze (Keimung, Wachstum, Blüte, Ernte)."
                      placeholder="Suche nach einem Status"
                      selectValues={[
                        { key: "seeds", value: "Samen" },
                        { key: "germination", value: "Keimung" },
                        { key: "cutting", value: "Steckling" },
                        { key: "vegetative", value: "Vegetative Phase" },
                        { key: "flowering", value: "Blütephase" },
                        { key: "harvest", value: "Ernte" },
                        { key: "quarantine", value: "Quarantäne" },
                        { key: "destroyed", value: "Vernichtet " },
                      ]}
                    />
                    <ProfileInput
                      form={form.control}
                      type="checkbox"
                      id="isParent"
                      title="Mutterpflanze"
                      content="Legt fest, ob diese Pflanze als Mutterpflanze ausgewählt werden kann."
                      checkboxLabel="Mutterpflanze"
                    />
                    <ProfileInput
                      form={form.control}
                      type="date"
                      id="sowing_date"
                      title="Datum der Aussaat"
                      content="Das Datum an dem der Samen gesetzt wurde."
                    />
                    <ProfileInput
                      form={form.control}
                      type="date"
                      id="germination_date"
                      title="Datum der Keimung"
                      content="Das Datum an dem der Samen gekeimt ist."
                    />
                    <ProfileInput
                      form={form.control}
                      type="date"
                      id="cutting_date"
                      title="Datum des Stecklingsetzens"
                      content="Das Datum an dem der Steckling gesetzt wurde."
                    />
                    <ProfileInput
                      form={form.control}
                      type="date"
                      id="growing_date"
                      title="Datum der Vegetationsphase"
                      content="Das Datum an dem die Pflanze in die Wachstumsphase übergegangen ist."
                    />
                    <ProfileInput
                      form={form.control}
                      type="date"
                      id="flowering_date"
                      title="Datum der Blütephase"
                      content="Das Datum an dem die Pflanze in die Blütephase übergegangen ist."
                    />
                    <ProfileInput
                      form={form.control}
                      type="date"
                      id="harvest_date"
                      title="Datum der Ernte"
                      content="Das Datum an dem die Pflanze geerntet wurde."
                    />
                    <ProfileInput
                      form={form.control}
                      type="date"
                      id="destruction_date"
                      title="Datum der Vernichtung"
                      content="Das Datum an dem die Pflanze vernichtet wurde."
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="yield_per_plant"
                      title="Erwarteter Ertrag pro Pflanze"
                      content="Die geschätzte Erntemenge in Gramm."
                      minValue={0}
                      tag="Gramm (g)"
                      placeholder="Erwarteter Ertrag pro Pflanze"
                    />
                    <ProfileInput
                      form={form.control}
                      id="substrate"
                      title="Substrat"
                      content="Das Material, in dem die Pflanze wächst."
                      placeholder="Substrat"
                    />
                    <ProfileInput
                      form={form.control}
                      id="fertilizer"
                      title="Dünger"
                      content="Die unterschiedlichen Dünger, die für die Pflanze verwendet werden."
                      placeholder="Dünger"
                    />
                    <p className="py-3 text-lg font-semibold mobile:text-base">
                      Weiteres
                    </p>
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="note"
                      title="Notiz"
                      content="Füge eine Notiz hinzu"
                      placeholder="Notiz hinzufügen"
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
      <StrainModal
        openStrainDlg={openStrainDlg}
        setOpenStrainDlg={setOpenStrainDlg}
      />
      <ChargeModal
        openChargeDlg={openChargeDlg}
        setOpenChargeDlg={setOpenChargeDlg}
      />
      <ZoneModal openZoneDlg={openZoneDlg} setOpenZoneDlg={setOpenZoneDlg} />

      {openQRModal && 
        <PageQRModal
        isOpen={openQRModal}
        onClose={() => setOpenQRModal(false)}
        type="plant"
        data={plant}
        qrCode={plant?.qrCode}
      />
      }
    </div>
  );
};

export default PlantInfoPage;
