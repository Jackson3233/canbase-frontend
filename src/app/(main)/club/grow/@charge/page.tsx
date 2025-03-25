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
  PackageOpen,
  Plus,
} from "lucide-react";
import StrainModal from "../strain";
import ZoneModal from "../zone";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { chargesActions } from "@/store/reducers/chargesReducer";
import { plantsActions } from "@/store/reducers/plantsReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { createCharge } from "@/actions/charge";
import { ChargeFormSchema } from "@/constant/formschema";
import {
  chargeCalendarOption,
  chargeCalendarSeries,
} from "@/constant/calendars";
import { getCleanDate, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import PageQRModal from "@/components/basic/PageQRModal";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChargePage = () => {
  const dispatch = useAppDispatch();
  const { charges } = useAppSelector((state) => state.charges);
  const { strains } = useAppSelector((state) => state.strains);
  const { zones } = useAppSelector((state) => state.zones);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strainOpen, setStrainOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [openStrainDlg, setOpenStrainDlg] = useState(false);
  const [openZoneDlg, setOpenZoneDlg] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);

  const [calendarSeries, setCalendarSeries] = useState<any>([]);

  const form = useForm<z.infer<typeof ChargeFormSchema>>({
    resolver: zodResolver(ChargeFormSchema),
    defaultValues: {
      strain: "",
      plant_amount: undefined,
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

  useEffect(() => {
    const tempSeries = chargeCalendarSeries(charges);

    setCalendarSeries(tempSeries);
  }, [charges]);

  const handleBefore = () => {
    setIsEdit((prev) => !prev);

    form.reset({
      strain: "",
      plant_amount: undefined,
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
    });
  };

  const onSubmit = async (data: z.infer<typeof ChargeFormSchema>) => {
    setLoading(true);

    const result = await createCharge(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(chargesActions.setCharges({ charges: result.charges }));
      dispatch(plantsActions.setPlants({ plants: result.plants }));

      setIsEdit((prev) => !prev);

      form.reset({
        strain: "",
        plant_amount: undefined,
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
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {!isEdit ? (
          isEmpty(charges) ? (
            <Card className="p-10 tablet:p-7 mobile:p-5">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <PackageOpen className="w-6 h-6 tablet:w-4 tablet:h-4" />
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    Charge
                  </h1>
                </div>
                <p className="pt-2 text-sm text-content tablet:max-w-none mobile:text-xs">
                  {`Nutze Chargen um Pflanzen im Anbauprozess zu gruppieren und gebündelt zu verwalten.`}
                </p>
                <Button
                  className="h-10 flex items-center space-x-2 px-4 mt-8 bg-custom mobile:w-full mobile:mt-4 hover:bg-customhover"
                  onClick={() => setIsEdit((prev) => !prev)}
                  disabled={
                    user?.role !== "owner" &&
                    !user?.functions?.includes("club-grow-manage")
                  }
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Charge hinzufügen</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
              disabled={
                user?.role !== "owner" &&
                !user?.functions?.includes("club-grow-manage")
              }
            >
              <Plus className="w-3 h-3" />
              <span className="text-xs">Charge hinzufügen</span>
            </Button>
          )
        ) : (
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={handleBefore}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="text-xs">Zurück</span>
          </Button>
        )}
        {!isEdit ? (
          !isEmpty(charges) && (
            <div className="flex flex-col space-y-5">
              <Card>
                <CardContent className="p-0">
                  <h1 className="p-7 font-semibold border-b tablet:p-5 tablet:text-sm">
                    Anbaukalender
                  </h1>
                  <div className="p-7 tablet:p-5">
                    <ApexChart
                      series={calendarSeries}
                      options={chargeCalendarOption as any}
                      type="rangeBar"
                      height={charges.length > 1 ? 75 * charges.length : 150}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3 laptop:grid-cols-1">
                {charges
                  .filter((f) => !f.isHarvested)
                  .map((item, key) => (
                    <Card
                      className="rounded-3xl cursor-pointer"
                      key={key}
                      onClick={() =>
                        router.push(
                          "/club/grow/" + item.chargeID + "?tab=charge"
                        )
                      }
                    >
                      <CardContent className="flex flex-col space-y-5 p-10 tablet:space-y-3 tablet:p-7 mobile:p-5">
                        <div className="w-16 h-16 flex justify-center items-center bg-[#F8F8F8] rounded-full">
                          <PackageOpen className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
                        </div>
                        <div className="flex flex-col space-y-4 tablet:space-y-2">
                          <p className="text-lg font-semibold tablet:text-base mobile:text-sm">
                            {item.chargename}
                          </p>
                          <div className="flex flex-col text-sm text-content mobile:text-xs">
                            <p>{item.plants.length} Pflanzen</p>
                            <p>Gestartet: {getCleanDate(item.createdAt, 2)}</p>
                          </div>
                        </div>
                        {!isEmpty(item.description) && (
                          <p
                            className="overflow-hidden text-xs font-medium text-content text-ellipsis break-all"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-col space-y-4 tablet:space-y-2">
                          <p className="text-sm text-content mobile:text-xs">
                            Anbaufortschritt
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.plants.map((item, key) => (
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
                  ))}
              </div>
            </div>
          )
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  Charge hinzufügen
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Erstelle einen neuen Charge
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
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="plant_amount"
                      title="Pflanzenanzahl"
                      content="Anzahl der Pflanzen, die automatisch erstellt werden sollen."
                      minValue={1}
                      tag="Stück"
                      placeholder="Pflanzenanzahl"
                    />
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
                        { key: "destroyed", value: "Vernichtet" },
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

      {openQRModal && (
        <PageQRModal
          isOpen={openQRModal}
          onClose={() => setOpenQRModal(false)}
          type="charge"
          data={charges as any}
          qrCode={(charges as any)?.qrCode ?? ""}
        />
      )}
    </div>
  );
};

export default ChargePage;
