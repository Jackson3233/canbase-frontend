"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Dropzone from "react-dropzone";
import ClipLoader from "react-spinners/ClipLoader";
import { Images, Trash2 } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { useAppDispatch } from "@/store/hook";
import { strainsActions } from "@/store/reducers/strainsReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createStrain } from "@/actions/strain";
import { StrainFormSchema } from "@/constant/formschema";
import { UriToFileObject } from "@/lib/functions";
import { strainsData } from "@/constant/strains";
import {
  defaultCalendarOption,
  strainCalendarSeries,
} from "@/constant/calendars";
import { StrainPropsInterface } from "@/types/component";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StrainModal = ({
  openStrainDlg,
  setOpenStrainDlg,
}: StrainPropsInterface) => {
  const dispatch = useAppDispatch();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<any>();
  const [tempAvatar, setTempAvatar] = useState<any>();
  const [strainAvatar, setStrainAvatar] = useState<any>();
  const [strainInput, setStrainInput] = useDebounceValue("", 500);

  const [growthGermination, setGrowthGermination] = useState<
    number | undefined
  >(undefined);
  const [growthCutting, setGrowthCutting] = useState<number | undefined>(
    undefined
  );
  const [growthVegetative, setGrowthVegetative] = useState<number | undefined>(
    undefined
  );
  const [growthFlowering, setGrowthFlowering] = useState<number | undefined>(
    undefined
  );
  const [growthCuring, setGrowthCuring] = useState<number | undefined>(
    undefined
  );
  const [calendarSeries, setCalendarSeries] = useState(strainCalendarSeries);

  const form = useForm<z.infer<typeof StrainFormSchema>>({
    resolver: zodResolver(StrainFormSchema),
    defaultValues: {
      strainname: "",
      description: "",
      ratio: 50,
      thc: undefined,
      cbd: undefined,
      breeder: "",
      genetics: "",
      type: "",
      avg_height: undefined,
      yield_per_plant: undefined,
      growth_germination: undefined,
      growth_cutting: undefined,
      growth_vegetative: undefined,
      growth_flowering: undefined,
      growth_curing: undefined,
      effect: "",
      terpene: "",
      area: "",
      note: "",
    },
  });

  useEffect(() => {
    setAvatar(undefined);
    setTempAvatar(undefined);
    setStrainAvatar(undefined);
    setStrainInput("");

    setGrowthGermination(undefined);
    setGrowthCutting(undefined);
    setGrowthVegetative(undefined);
    setGrowthFlowering(undefined);
    setGrowthCuring(undefined);

    form.reset({
      strainname: "",
      description: "",
      ratio: 50,
      thc: undefined,
      cbd: undefined,
      breeder: "",
      genetics: "",
      type: "",
      avg_height: undefined,
      yield_per_plant: undefined,
      growth_germination: undefined,
      growth_cutting: undefined,
      growth_vegetative: undefined,
      growth_flowering: undefined,
      growth_curing: undefined,
      effect: "",
      terpene: "",
      area: "",
      note: "",
    });
  }, [form, openStrainDlg]);

  const updateCalendarData = (param: any) => {
    setCalendarSeries((prevSeries) => {
      const index = prevSeries.findIndex((item) => item.name === param.name);
      const updatedSeries = [...prevSeries];

      if (index !== -1) {
        updatedSeries[index] = param;
      } else {
        updatedSeries.push(param);
      }

      return updatedSeries;
    });
  };

  const removeCalendarData = (param: string) => {
    setCalendarSeries((prevSeries) =>
      prevSeries.filter((item) => item.name !== param)
    );
  };

  const calculateDateTime = (days: number) =>
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    ).getTime() +
    days * 24 * 60 * 60 * 1000;

  useEffect(() => {
    const stages = [
      { name: "Keimung", days: growthGermination },
      {
        name: "Stecklinge gesetzt",
        days: growthCutting,
      },
      {
        name: "Vegetative Phase",
        days: growthVegetative,
      },
      {
        name: "Blüte",
        days: growthFlowering,
      },
      {
        name: "Ernte",
        days: growthCuring,
      },
    ];

    let accumulatedDays = 0;

    stages.forEach((stage) => {
      if (stage.days === undefined) {
        removeCalendarData(stage.name);
      } else {
        accumulatedDays += Number(stage.days);

        updateCalendarData({
          name: stage.name,
          data: [
            {
              x: "Strain",
              y: [
                calculateDateTime(accumulatedDays - Number(stage.days)),
                calculateDateTime(accumulatedDays),
              ],
            },
          ],
        });
      }
    });
  }, [
    growthGermination,
    growthCutting,
    growthVegetative,
    growthFlowering,
    growthCuring,
  ]);

  const handelAutoFill = async (param: any) => {
    form.setValue("strainname", param.name);
    form.setValue("description", param.desc);
    form.setValue("thc", Number(param.thc.replace("%", "")));
    form.setValue("cbd", param.cbd);

    const sativa = param.art.match(/(?:Sativa\s*(\d+)%?|(\d+)%?\s*Sativa)/);

    form.setValue("ratio", sativa ? Number(sativa[1] || sativa[2]) : 0);

    setStrainAvatar("/assets/strains/" + param.image);

    const strainFile = await UriToFileObject(
      "/assets/strains/" + param.image,
      param.image
    );

    setAvatar(strainFile);
    setTempAvatar(undefined);

    setStrainInput("");
  };

  const onSubmit = async (data: z.infer<typeof StrainFormSchema>) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      value !== undefined && formData.append(key, value as string);
    });

    formData.append("avatar", avatar);

    const result = await createStrain(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(strainsActions.setStrains({ strains: result.strains }));

      setOpenStrainDlg(false);
    }
  };

  return (
    <Dialog open={openStrainDlg} onOpenChange={setOpenStrainDlg}>
      <DialogContent className="max-w-5xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
        <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
          <h1 className="text-2xl font-semibold tablet:text-xl">
            Strain hinzufügen
          </h1>
          <p className="pt-2 text-sm text-content mobile:text-xs">
            Erstelle einen neuen Strain
          </p>
        </div>
        <div className="max-h-[700px] flex flex-col p-10 overflow-y-auto tablet:p-7 mobile:p-5">
          <div className="w-full flex tablet:flex-col">
            <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
              <p className="font-medium mobile:text-sm">Bild</p>
              <p className="text-sm text-content mobile:text-xs">
                Ein repräsentatives Bild für diesen Strain.
              </p>
            </div>
            <div>
              {strainAvatar ? (
                <div className="relative min-w-36 w-36 min-h-36 overflow-hidden rounded-full">
                  <Image
                    className="object-cover"
                    src={strainAvatar}
                    fill={true}
                    sizes="100%"
                    alt="strain"
                  />
                  <Trash2
                    className="absolute top-1/2 right-0 w-4 h-4 -translate-y-1/2 text-destructive cursor-pointer z-20 hover:text-custom"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStrainAvatar(undefined);
                      setAvatar(undefined);
                    }}
                  />
                </div>
              ) : (
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
                      className="min-w-36 min-h-36 w-36 h-36 flex justify-center items-center overflow-hidden rounded-full bg-[#F8F8F8] cursor-pointer mobile:self-center"
                      {...getRootProps()}
                    >
                      {avatar === undefined ? (
                        <div className="w-full h-full flex flex-col justify-center items-center rounded-full hover:border hover:border-content hover:border-dashed">
                          <Images className="w-4 h-4 text-content" />
                          <p className="text-xs text-content text-center">
                            .jpg, .jpeg, .png, .webp
                          </p>
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
              )}
            </div>
          </div>
          <Form {...form}>
            <form
              className="w-full flex flex-col mt-16 tablet:mt-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-6 mobile:space-y-3">
                <div className="w-full flex justify-between tablet:flex-col">
                  <p className="max-w-64 w-full mr-10 font-medium laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2 mobile:text-sm">
                    Name*
                  </p>
                  <FormField
                    control={form.control}
                    name="strainname"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="flex flex-col space-y-1">
                            <Input
                              className="h-9"
                              placeholder="Name"
                              value={value}
                              onChange={(e) => {
                                onChange(e.target.value);
                                setStrainInput(e.target.value);
                              }}
                            />
                            {strainInput.length > 2 &&
                              strainsData.filter((f) =>
                                f.name
                                  .toLowerCase()
                                  .includes(strainInput.toLowerCase())
                              ).length > 0 && (
                                <Card>
                                  <CardContent className="p-1">
                                    {strainsData
                                      .filter((f) =>
                                        f.name
                                          .toLowerCase()
                                          .includes(strainInput.toLowerCase())
                                      )
                                      .map((m, key) => {
                                        return (
                                          <div
                                            className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
                                            key={key}
                                            onClick={() => handelAutoFill(m)}
                                          >
                                            {m.name}
                                          </div>
                                        );
                                      })}
                                  </CardContent>
                                </Card>
                              )}
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
                  id="description"
                  title="Beschreibung"
                  content="Beschreibe den Strain"
                  placeholder="Beschreibung"
                />
                <div className="w-full flex tablet:flex-col">
                  <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">
                      Indica / Sativa Anteil
                    </p>
                    <p className="text-sm text-content mobile:text-xs">
                      Definiere hier den Indica / Sativa-Anteil deines Strains.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="ratio"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="w-full max-w-96">
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            <div className="flex justify-between text-xs text-content">
                              <span>{`Indica (${value})`}</span>
                              <span>Hybrid</span>
                              <span>{`Sativa (${
                                100 - (value as number)
                              })`}</span>
                            </div>
                            <Slider
                              value={[value as number]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={onChange}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <ProfileInput
                  form={form.control}
                  type="number"
                  id="thc"
                  title="THC-Gehalt"
                  content="Angabe des THC-Gehalts in Prozent"
                  placeholder="10%"
                />
                <ProfileInput
                  form={form.control}
                  id="cbd"
                  title="CBD-Gehalt"
                  content="Angabe des CBD-Gehalts in Prozent"
                  placeholder="1%"
                />
                <p className="py-3 text-lg font-semibold mobile:text-base">
                  Anbau
                </p>
                <ProfileInput
                  form={form.control}
                  id="breeder"
                  title="Züchter"
                  content="Der Name des Züchters oder der Firma, die die Sorte entwickelt hat."
                  placeholder="Züchter"
                />
                <ProfileInput
                  form={form.control}
                  id="genetics"
                  title="Genetik"
                  content="Informationen zur genetischen Herkunft der Sorte."
                  placeholder="Genetik"
                />
                <ProfileInput
                  form={form.control}
                  type="selectbox"
                  id="type"
                  title="Typ"
                  content="Angabe, ob die Sorte selbstblühend ist oder nicht."
                  placeholder="Wähle den Blütentyp aus"
                  selectValues={[
                    { key: "photo-period", value: "Photoperiodisch" },
                    { key: "auto-flowering", value: "Autoflowering" },
                  ]}
                />
                <ProfileInput
                  form={form.control}
                  type="number"
                  id="avg_height"
                  title="Durchschnittliche Höhe"
                  content="Die durchschnittliche Wachstumshöhe in Innenräumen."
                  placeholder="Durchschnittliche Höhe"
                />
                <ProfileInput
                  form={form.control}
                  type="tagInput"
                  id="yield_per_plant"
                  title="Ertrag pro Pflanze"
                  content="Angabe des erwarteten Ertrags pro Pflanze in Gramm."
                  tag="Gramm (g)"
                  placeholder="Ertrag pro Pflanze"
                />
                <ProfileInput
                  form={form.control}
                  type="tagInput"
                  id="growth_germination"
                  title="Wachstumsdauer (Keimung)"
                  content="Dauer der Keimung in Tagen."
                  minValue={0}
                  tag="Tage"
                  handleValue={setGrowthGermination}
                  placeholder="Wachstumsdauer"
                />
                <ProfileInput
                  form={form.control}
                  type="tagInput"
                  id="growth_cutting"
                  title="Wachstumsdauer (Steckling)"
                  content="Dauer der Anzucht in Tagen."
                  minValue={0}
                  tag="Tage"
                  handleValue={setGrowthCutting}
                  placeholder="Wachstumsdauer"
                />
                <ProfileInput
                  form={form.control}
                  type="tagInput"
                  id="growth_vegetative"
                  title="Wachstumsdauer (Vegetative Phase)"
                  content="Dauer der vegetative Phase in Tagen."
                  minValue={0}
                  tag="Tage"
                  handleValue={setGrowthVegetative}
                  placeholder="Wachstumsdauer"
                />
                <ProfileInput
                  form={form.control}
                  type="tagInput"
                  id="growth_flowering"
                  title="Wachstumsdauer (Blütephase)"
                  content="Dauer der Blütephase in Tagen."
                  minValue={0}
                  tag="Tage"
                  handleValue={setGrowthFlowering}
                  placeholder="Wachstumsdauer"
                />
                <ProfileInput
                  form={form.control}
                  type="tagInput"
                  id="growth_curing"
                  title="Aushärtung"
                  content="Dauer der Aushärtung in Tagen."
                  minValue={0}
                  tag="Tage"
                  handleValue={setGrowthCuring}
                  placeholder="Aushärtung"
                />
                {(growthGermination || 0) +
                  (growthCutting || 0) +
                  (growthVegetative || 0) +
                  (growthFlowering || 0) +
                  (growthCuring || 0) >
                  0 && (
                  <div className="w-full flex flex-col space-y-3 p-5 border border-input rounded-3xl">
                    <p className="text-xs">
                      {`Anbaukalender - Gesamtdauer ${
                        (growthGermination || 0) +
                        (growthCutting || 0) +
                        (growthVegetative || 0) +
                        (growthFlowering || 0) +
                        (growthCuring || 0)
                      } Tage`}
                    </p>
                    <ApexChart
                      series={calendarSeries}
                      options={defaultCalendarOption as any}
                      type="rangeBar"
                      height={150}
                    />
                  </div>
                )}
                <p className="py-3 text-lg	font-semibold mobile:text-base">
                  Wirkung
                </p>
                <ProfileInput
                  form={form.control}
                  id="effect"
                  title="Wirkungen"
                  content="Beschreibung der Haupteffekte beim Konsum."
                  placeholder="Wirkungen"
                />
                <ProfileInput
                  form={form.control}
                  id="terpene"
                  title="Terpenprofil"
                  content="Die dominanten Terpene in der Sorte."
                  placeholder="Terpenprofil"
                />
                <ProfileInput
                  form={form.control}
                  id="area"
                  title="Anwendungsgebiete"
                  content="Was dieser Strain medizinisch oder therapeutisch bewirken kann."
                  placeholder="Anwendungsgebiete"
                />
                <ProfileInput
                  form={form.control}
                  type="textarea"
                  id="note"
                  title="Notiz"
                  content="Füge eine Notiz hinzu"
                  placeholder="Notiz"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                <Button
                  className="h-10 px-4 mobile:px-2"
                  type="button"
                  variant="outline"
                  onClick={() => setOpenStrainDlg(false)}
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

export default StrainModal;
