"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { Check, ChevronsUpDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { chargesActions } from "@/store/reducers/chargesReducer";
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
import { createCharge } from "@/actions/charge";
import { ChargeFormSchema } from "@/constant/formschema";
import { cn } from "@/lib/utils";
import { ChargePropsInterface } from "@/types/component";

const ChargeModal = ({
  openChargeDlg,
  setOpenChargeDlg,
}: ChargePropsInterface) => {
  const dispatch = useAppDispatch();
  const { strains } = useAppSelector((state) => state.strains);
  const { zones } = useAppSelector((state) => state.zones);

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [strainOpen, setStrainOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);

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
  }, [form, openChargeDlg]);

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
    }
  };

  return (
    <Dialog open={openChargeDlg} onOpenChange={setOpenChargeDlg}>
      <DialogContent className="max-w-5xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
        <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
          <h1 className="text-2xl font-semibold tablet:text-xl">
            Charge hinzufügen
          </h1>
          <p className="pt-2 text-sm text-content mobile:text-xs">
            Erstelle einen neuen Charge
          </p>
        </div>
        <div className="max-h-[700px] flex flex-col p-10 overflow-y-auto tablet:p-7 mobile:p-5">
          <Form {...form}>
            <form
              className="w-full flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-6 mobile:space-y-3">
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
                  onClick={() => setOpenChargeDlg(false)}
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

export default ChargeModal;
