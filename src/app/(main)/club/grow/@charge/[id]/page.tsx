"use client";

import { useEffect, useState } from "react";
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
  Plus,
  Slice,
} from "lucide-react";
import { PlantTable } from "../../plant-table";
import { plantColumns } from "../../plant-column";
import StrainModal from "../../strain";
import ZoneModal from "../../zone";
import HarvestModal from "../../harvest";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { chargesActions } from "@/store/reducers/chargesReducer";
import { plantsActions } from "@/store/reducers/plantsReducer";
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
import { addDiary, getCharge, updateCharge } from "@/actions/charge";
import { DiaryFormSchema, UpdateChargeFormSchema } from "@/constant/formschema";
import { getAvatarLetters, getCleanDate, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import PageQRModal from "@/components/basic/PageQRModal";

const ChargeInfoPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const { plants } = useAppSelector((state) => state.plants);
  const { strains } = useAppSelector((state) => state.strains);
  const { zones } = useAppSelector((state) => state.zones);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diaryLoading, setDiaryLoading] = useState(false);
  const [strainOpen, setStrainOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [charge, setCharge] = useState<any>();
  const [openStrainDlg, setOpenStrainDlg] = useState(false);
  const [openZoneDlg, setOpenZoneDlg] = useState(false);
  const [openHarvestDlg, setOpenHarvestDlg] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);

  const form = useForm<z.infer<typeof UpdateChargeFormSchema>>({
    resolver: zodResolver(UpdateChargeFormSchema),
    defaultValues: {
      strain: "",
      zone: "",
      status: "",
      description: "",
      note: "",
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
      const result = await getCharge({ chargeID: params.id });

      if (result.success) {
        setCharge(result.charge);

        form.reset({
          strain: result.charge?.strain?._id,
          zone: result.charge?.zone?._id,
          status: result.charge?.status,
          description: result.charge?.description,
          note: result.charge?.note,
          sowing_date: result.charge?.sowing_date,
          germination_date: result.charge?.germination_date,
          cutting_date: result.charge?.cutting_date,
          growing_date: result.charge?.growing_date,
          flowering_date: result.charge?.flowering_date,
          harvest_date: result.charge?.harvest_date,
          destruction_date: result.charge?.destruction_date,
          yield_per_plant: result.charge?.yield_per_plant,
          substrate: result.charge?.substrate,
          fertilizer: result.charge?.fertilizer,
        });
      }
    })();
  }, [form, params.id]);

  const handleBefore = () => {
    if (isEdit) {
      setIsEdit((prev) => !prev);

      form.reset({
        strain: charge?.strain?._id,
        zone: charge?.zone?._id,
        status: charge?.status,
        description: charge?.description,
        note: charge?.note,
        sowing_date: charge?.sowing_date,
        germination_date: charge?.germination_date,
        cutting_date: charge?.cutting_date,
        growing_date: charge?.growing_date,
        flowering_date: charge?.flowering_date,
        harvest_date: charge?.harvest_date,
        destruction_date: charge?.destruction_date,
        yield_per_plant: charge?.yield_per_plant,
        substrate: charge?.substrate,
        fertilizer: charge?.fertilizer,
      });
    } else {
      router.push("/club/grow?tab=charge");
    }
  };

  const onDiarySubmit = async (data: z.infer<typeof DiaryFormSchema>) => {
    setDiaryLoading(true);

    const result = await addDiary({ ...data, chargeID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setDiaryLoading(false);

    if (result.success) {
      dispatch(chargesActions.setCharges({ charges: result.charges }));
      setCharge(result.charge);

      diaryForm.reset({ content: "" });
    }
  };

  const onSubmit = async (data: z.infer<typeof UpdateChargeFormSchema>) => {
    setLoading(true);

    const result = await updateCharge({ ...data, chargeID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(chargesActions.setCharges({ charges: result.charges }));
      dispatch(plantsActions.setPlants({ plants: result.plants }));
      setCharge(result.charge);

      setIsEdit((prev) => !prev);

      form.reset({
        strain: result.charge?.strain?._id,
        zone: result.charge?.zone?._id,
        status: result.charge?.status,
        description: result.charge?.description,
        note: result.charge?.note,
        sowing_date: result.charge?.sowing_date,
        germination_date: result.charge?.germination_date,
        cutting_date: result.charge?.cutting_date,
        growing_date: result.charge?.growing_date,
        flowering_date: result.charge?.flowering_date,
        harvest_date: result.charge?.harvest_date,
        destruction_date: result.charge?.destruction_date,
        yield_per_plant: result.charge?.yield_per_plant,
        substrate: result.charge?.substrate,
        fertilizer: result.charge?.fertilizer,
      });
    }
  };

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
                onClick={() => setOpenHarvestDlg((prev) => !prev)}
              >
                <Slice className="w-3 h-3" />
                <span className="text-xs">Ernten</span>
              </Button>
            </>
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
                  <div className="p-7 border-b tablet:p-5">
                    <h1 className="font-semibold tablet:text-sm">
                      {charge?.chargename}
                    </h1>
                    <p className="text-sm text-content mobile:text-xs">
                      {charge?.plants.length} Pflanzen
                    </p>
                  </div>
                  <div className="flex flex-col space-y-5 p-7 tablet:space-y-3 tablet:p-5">
                    <div className="w-24 h-24 flex justify-center items-center bg-[#F8F8F8] rounded-full tablet:self-center">
                      <PackageOpen className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
                    </div>
                    <div className="flex flex-col space-y-5 tablet:space-y-3">
                      <div className="flex flex-wrap gap-5 tablet:gap-3 mobile:flex-col">
                        <Overview title="Name" content={charge?.chargename} />
                        <Overview
                          title="Beschreibung"
                          content={
                            isEmpty(charge?.description)
                              ? "-"
                              : charge?.description
                          }
                        />
                        <div className="max-w-72 w-full flex flex-col space-y-1">
                          <p className="text-xs text-content">Status</p>
                          <div className="flex items-center space-x-1 text-xs font-medium">
                            {charge?.status === "seeds" ? (
                              <>
                                <div className="w-3 h-3 bg-[#00E98B] rounded-sm" />
                                <span className="text-xs">Samen</span>
                              </>
                            ) : charge?.status === "germination" ? (
                              <>
                                <div className="w-3 h-3 bg-[#00D37E] rounded-sm" />
                                <span className="text-xs">Keimung</span>
                              </>
                            ) : charge?.status === "cutting" ? (
                              <>
                                <div className="w-3 h-3 bg-[#00C173] rounded-sm" />
                                <span className="text-xs">Steckling</span>
                              </>
                            ) : charge?.status === "vegetative" ? (
                              <>
                                <div className="w-3 h-3 bg-[#009659] rounded-sm" />
                                <span className="text-xs">
                                  Vegetative Phase
                                </span>
                              </>
                            ) : charge?.status === "flowering" ? (
                              <>
                                <div className="w-3 h-3 bg-[#007043] rounded-sm" />
                                <span className="text-xs">Blütephase</span>
                              </>
                            ) : charge?.status === "harvest" ? (
                              <>
                                <div className="w-3 h-3 bg-[#002114] rounded-sm" />
                                <span className="text-xs">Ernte</span>
                              </>
                            ) : charge?.status === "quarantine" ? (
                              <>
                                <div className="w-3 h-3 bg-[#FBCB15] rounded-sm" />
                                <span className="text-xs">Quarantäne</span>
                              </>
                            ) : (
                              <>-</>
                            )}
                          </div>
                        </div>
                        <Overview
                          title="Strain"
                          content={
                            isEmpty(charge?.strain)
                              ? "-"
                              : charge.strain.strainname
                          }
                        />
                        <Overview
                          title="Zone"
                          content={
                            isEmpty(charge?.zone) ? "-" : charge.zone.zonename
                          }
                        />
                        <Overview
                          title="Geplante Ertrag"
                          content={
                            isEmpty(charge?.yield_per_plant)
                              ? "-"
                              : charge.yield_per_plant
                          }
                        />
                        <Overview
                          title="Substrat"
                          content={
                            isEmpty(charge?.substrate) ? "-" : charge.substrate
                          }
                        />
                        <Overview
                          title="Dünger"
                          content={
                            isEmpty(charge?.fertilizer)
                              ? "-"
                              : charge.fertilizer
                          }
                        />
                        <Overview
                          title="Angelegt am"
                          content={getCleanDate(charge?.createdAt, 2)}
                        />
                        <Overview
                          title="Samen angelegt am"
                          content={
                            isEmpty(charge?.sowing_date)
                              ? "-"
                              : getCleanDate(charge.sowing_date, 2)
                          }
                        />
                        <Overview
                          title="Keimung am"
                          content={
                            isEmpty(charge?.germination_date)
                              ? "-"
                              : getCleanDate(charge.germination_date, 2)
                          }
                        />
                        <Overview
                          title="Stecklinge gesetzt am"
                          content={
                            isEmpty(charge?.cutting_date)
                              ? "-"
                              : getCleanDate(charge.cutting_date, 2)
                          }
                        />
                        <Overview
                          title="Vegetative Phase eingeleitet am"
                          content={
                            isEmpty(charge?.growing_date)
                              ? "-"
                              : getCleanDate(charge.growing_date, 2)
                          }
                        />
                        <Overview
                          title="Blüte eingeleitet am"
                          content={
                            isEmpty(charge?.flowering_date)
                              ? "-"
                              : getCleanDate(charge.flowering_date, 2)
                          }
                        />
                        <Overview
                          title="Ernte geplant am"
                          content={
                            isEmpty(charge?.harvest_date)
                              ? "-"
                              : getCleanDate(charge.harvest_date, 2)
                          }
                        />
                      </div>
                      {!isEmpty(charge?.note) && (
                        <Overview title="Notizen" content={charge.note} />
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
                    {charge?.diary?.map((item: any, key: string) => {
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
            <Card>
              <CardContent className="p-0">
                <div className="p-7 tablet:p-5">
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Alle Pflanzen
                  </h1>
                  <p className="text-xs text-content">
                    {`${
                      plants.filter(
                        (item) => item.charge?.chargeID == params.id
                      ).length
                    } Pflanzen`}
                  </p>
                </div>
                <PlantTable
                  columns={plantColumns}
                  data={
                    plants.filter(
                      (item) => item.charge?.chargeID == params.id
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
                  {charge?.chargename} bearbeiten
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Hier kannst du die Charge bearbeiten.
                </p>
              </div>
              <Form {...form}>
                <form
                  className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="space-y-6 mobile:space-y-3">
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
                      type="textarea"
                      id="description"
                      title="Beschreibung"
                      content="Eine Kurzbeschreibung der Charge"
                      placeholder="Beschreibung"
                    />
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="note"
                      title="Notiz"
                      content="Weitere Informationen oder Besonderheiten zur Charge."
                      placeholder="Notiz"
                    />
                    <p className="py-3 text-lg font-semibold mobile:text-base">
                      Anbau
                    </p>
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
      <ZoneModal openZoneDlg={openZoneDlg} setOpenZoneDlg={setOpenZoneDlg} />
      <HarvestModal
        openHarvestDlg={openHarvestDlg}
        setOpenHarvestDlg={setOpenHarvestDlg}
        chargeID={params.id}
      />
      {openQRModal && 
          <PageQRModal
            isOpen={openQRModal}
            onClose={() => setOpenQRModal(false)}
            type="charge"
            data={charge}
            qrCode={charge?.qrCode}
          />
      }
    </div>
  );
};

export default ChargeInfoPage;
