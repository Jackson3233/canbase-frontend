"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  AlertTriangle,
  Check,
  ChevronsUpDown,
  Info,
  XIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { chargesActions } from "@/store/reducers/chargesReducer";
import { plantsActions } from "@/store/reducers/plantsReducer";
import { harvestsActions } from "@/store/reducers/harvestReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import GrowCard from "@/components/basic/GrowCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { createHarvest } from "@/actions/harvest";
import { HarvestFormSchema } from "@/constant/formschema";
import { cn } from "@/lib/utils";
import { HarvestPropsInterface } from "@/types/component";

const HarvestModal = ({
  openHarvestDlg,
  setOpenHarvestDlg,
  chargeID,
}: HarvestPropsInterface) => {
  const dispatch = useAppDispatch();
  const { members } = useAppSelector((state) => state.members);
  const { charges } = useAppSelector((state) => state.charges);

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [charge, setCharge] = useState<any>();
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

  useEffect(() => {
    form.reset({
      status: "",
      member: "",
      wet_weight: 0,
      waste: 0,
      dry_weight: 0,
      cbd: 0,
      thc: 0,
      tags: [],
      note: "",
    });

    setCharge(charges.find((charge) => charge.chargeID === chargeID));
  }, [form, openHarvestDlg, chargeID]);

  const onSubmit = async (data: z.infer<typeof HarvestFormSchema>) => {
    setLoading(true);

    const result = await createHarvest({ ...data, chargeID: chargeID });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(harvestsActions.setHarvests({ harvests: result.harvests }));
      dispatch(chargesActions.setCharges({ charges: result.charges }));
      dispatch(plantsActions.setPlants({ plants: result.plants }));

      setOpenHarvestDlg(false);

      router.push(`/club/grow/?tab=harvest`);
    }
  };

  return (
    <Dialog open={openHarvestDlg} onOpenChange={setOpenHarvestDlg}>
      <DialogContent className="max-w-5xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
        <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
          <h1 className="text-2xl	font-semibold tablet:text-xl">
            Neue Ernte erstellen
          </h1>
          <p className="pt-2 text-sm text-content mobile:text-xs">
            Erstelle eine neue Ernte
          </p>
        </div>
        <div className="max-h-[700px] flex flex-col p-10 overflow-y-auto tablet:p-7 mobile:p-5">
          <Form {...form}>
            <form
              className="w-full flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-6 mobile:space-y-3">
                <div className="flex space-x-2 p-3 bg-[#55A3FF]/10 border-l-2 border-l-[#55A3FF] rounded-lg">
                  <Info className="w-4 h-4 m-0.5 text-white" fill="#55A3FF" />
                  <div className="flex flex-col text-[#55A3FF]">
                    <p className="text-sm font-semibold text-[#55A3FF]">
                      Hinweis
                    </p>
                    <p className="text-xs">
                      Pflanzen und Chargen können nach dem Erstellen einer Ernte
                      nicht mehr bearbeitet werden.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 p-3 bg-[#FBCB15]/10 border-l-2 border-l-[#FBCB15] rounded-lg">
                  <AlertTriangle
                    className="w-4 h-4 m-0.5 text-white"
                    fill="#FBCB15"
                  />
                  <div className="flex flex-col text-[#FBCB15]">
                    <p className="text-sm font-semibold text-[#FBCB15]">
                      Status der Pflanzen / Chargen
                    </p>
                    <p className="text-xs">
                      Nicht alle Pflanzen / Chargen sind in der Blütephase. Bist
                      du sicher, dass du eine Ernte erstellen willst?
                    </p>
                  </div>
                </div>
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
                    { key: "test_in_progress", value: "Test in Bearbeitung" },
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
                      title={charge?.chargename}
                      status={charge?.status}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-between tablet:flex-col">
                  <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Pflanzen</p>
                  </div>
                  <div className="w-full flex flex-wrap gap-3">
                    {charge?.plants?.map((plant: any, key: string) => (
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
                                  ? members.find((item) => item._id === value)
                                      ?.username
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
                            {value.map((item, key) => (
                              <Badge key={key} variant="secondary">
                                {item}
                                <Button
                                  className="ml-2 h-3 w-3"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    onChange(value.filter((f) => f !== item));
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
                                if (value.includes(tags) || tags.length === 0) {
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
                                    if (tagsInput) tagsInput.placeholder = "";
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
                  onClick={() => setOpenHarvestDlg(false)}
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

export default HarvestModal;
