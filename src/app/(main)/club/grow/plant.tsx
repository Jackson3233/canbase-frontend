"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { plantsActions } from "@/store/reducers/plantsReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createPlant } from "@/actions/plant";
import { PlantFormSchema } from "@/constant/formschema";
import { cn } from "@/lib/utils";
import { PlantPropsInterface } from "@/types/component";

const PlantModal = ({ openPlantDlg, setOpenPlantDlg }: PlantPropsInterface) => {
  const dispatch = useAppDispatch();
  const { strains } = useAppSelector((state) => state.strains);
  const { zones } = useAppSelector((state) => state.zones);
  const { charges } = useAppSelector((state) => state.charges);

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [strainOpen, setStrainOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [chargeOpen, setChargeOpen] = useState(false);

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

  useEffect(() => {
    form.reset({
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
    });
  }, [form, openPlantDlg]);

  const onSubmit = async (data: z.infer<typeof PlantFormSchema>) => {
    setLoading(true);

    const result = await createPlant(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(plantsActions.setPlants({ plants: result.plants }));

      setOpenPlantDlg(false);
    }
  };

  return (
    <Dialog open={openPlantDlg} onOpenChange={setOpenPlantDlg}>
      <DialogContent className="max-w-5xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
        <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
          <h1 className="text-2xl font-semibold tablet:text-xl">
            Pflanze erstellen
          </h1>
          <p className="pt-2 text-sm text-content mobile:text-xs">
            Erstelle eine neue Pflanze
          </p>
        </div>
        <div className="max-h-[700px] flex flex-col p-10 overflow-y-auto tablet:p-7 mobile:p-5">
          <Form {...form}>
            <form
              className="w-full flex flex-col"
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
                    <Info className="w-4 h-4 m-0.5 text-white" fill="#55A3FF" />
                    <div className="flex flex-col text-[#55A3FF]">
                      <p className="text-sm font-semibold text-[#55A3FF]">
                        Hinweis zu Pflanzendaten
                      </p>
                      <p className="text-xs">
                        Daten zu einer Pflanze werden von der verknüpften Charge
                        und dem Strain abgeleitet. Hier kannst du die Daten für
                        eine einzelne Pflanze überschreiben.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between tablet:flex-col">
                  <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Strain*</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Wähle eine vorgefertigte Genetik für die neue Pflanze oder
                      erstelle eine neue.
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
                                  ? strains.find((item) => item._id === value)
                                      ?.strainname
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
                      Wähle eine Zone in der sich die Pflanze momentan befindet.
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
                                  ? charges.find((item) => item._id === value)
                                      ?.chargename
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
                  onClick={() => setOpenPlantDlg(false)}
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
      </DialogContent>
    </Dialog>
  );
};

export default PlantModal;
