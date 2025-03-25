"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Dropzone from "react-dropzone";
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronLeft, Dna, Images, Plus, Trash2 } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { strainsActions } from "@/store/reducers/strainsReducer";
import { createStrain } from "@/actions/strain";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { StrainFormSchema } from "@/constant/formschema";
import { strainsData } from "@/constant/strains";
import {
  defaultCalendarOption,
  strainCalendarSeries,
} from "@/constant/calendars";
import {
  UriToFileObject,
  getAvatarLetters,
  getCleanDate,
  isEmpty,
} from "@/lib/functions";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StrainPage = () => {
  const dispatch = useAppDispatch();
  const { strains } = useAppSelector((state) => state.strains);
  const { charges } = useAppSelector((state) => state.charges);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
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

  const handleBefore = () => {
    setIsEdit((prev) => !prev);
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
  };

  const handelAutoFill = async (param: any) => {
    form.setValue("strainname", param.name);
    form.setValue("description", param.desc);
    !isNaN(Number(param.thc.replace("%", ""))) &&
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

      setIsEdit((prev) => !prev);
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
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {!isEdit ? (
          isEmpty(strains) ? (
            <Card className="p-10 tablet:p-7 mobile:p-5">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <Dna className="w-6 h-6 tablet:w-4 tablet:h-4" />
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    Strains
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
                  <span className="text-sm">Strain hinzufügen</span>
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
              <span className="text-xs">Strain hinzufügen</span>
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
          !isEmpty(strains) && (
            <div className="grid grid-cols-2 gap-3 laptop:grid-cols-1">
              {strains.map((item, key) => (
                <div className="bg-white rounded-3xl shadow-sm" key={key}>
                  <div className="relative py-8 px-6 sm:px-8">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid place-items-center">
                        <a href={`/club/grow/${item.strainID}`} data-discover="true">
                          <div className="relative aspect-square shrink-0 rounded-full h-24 w-24">
                            <div className="flex items-center justify-center bg-stone-100 aspect-square size-full rounded-full object-cover">
                              {item.avatar ? (
                                <Image
                                  src={(process.env.NEXT_PUBLIC_UPLOAD_URI as string) + item.avatar}
                                  alt={item.strainname}
                                  className="size-full rounded-full object-cover"
                                />
                              ) : (
                                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-stone-700 w-12 h-12">
                                  <path d="M144.931 75.7924C160.404 66.9992 176.827 61.8537 187.247 59.7512C187.708 59.6676 188.122 59.8356 188.332 60.0506C188.66 60.3878 188.797 60.8495 188.723 61.2794C186.621 71.6507 181.442 87.9832 172.616 103.372L172.614 103.376C169.194 109.351 165.152 115.259 160.499 120.693L155.17 126.917L163.142 128.81C173.519 131.274 182.704 135.277 188.124 138.28L188.132 138.285L188.141 138.289C188.486 138.479 188.75 138.88 188.75 139.375C188.75 139.82 188.489 140.262 188.111 140.477C182.54 143.553 172.948 147.702 162.171 150.164C154.636 151.88 146.367 152.799 138.392 151.87L131.202 151.031L132.963 158.052L136.199 170.96C136.2 170.962 136.201 170.964 136.201 170.967C136.322 171.469 136.164 171.956 135.744 172.299C135.425 172.56 134.92 172.663 134.4 172.429L112.292 161.025L105.46 157.501L105.009 165.175L104.696 170.488L104.625 171.691C103.288 171.816 101.699 171.914 100 171.914C98.1557 171.914 96.53 171.904 95.2049 171.863L95.0347 170.255L94.4722 164.942L93.6979 157.629L87.1821 161.038L65.5114 172.376C65.0756 172.583 64.5856 172.522 64.2166 172.22C63.7965 171.878 63.6391 171.39 63.7598 170.889C63.7604 170.886 63.761 170.884 63.7616 170.881L66.9983 157.974L68.7597 150.949L61.5668 151.792C53.6337 152.721 45.3276 151.802 37.7929 150.086C26.9899 147.619 17.396 143.5 11.8545 140.402L11.8374 140.392L11.8204 140.383C11.4745 140.193 11.2109 139.792 11.2109 139.297C11.2109 138.852 11.4729 138.409 11.8516 138.194C17.2619 135.198 26.4449 131.232 36.8356 128.728L44.796 126.809L39.4529 120.605C34.8472 115.256 30.8074 109.353 27.3864 103.376L27.3842 103.372C18.5459 87.9616 13.3643 71.6049 11.268 61.2358L11.2636 61.2137L11.2589 61.1918C11.1911 60.8711 11.2922 60.4273 11.6215 60.098C11.9128 59.8067 12.3335 59.673 12.7592 59.7523C23.1905 61.8106 39.5776 66.9893 55.0664 75.7911C59.6448 78.4021 64.2027 81.3209 68.4633 84.6182L77.0463 91.2607L76.5175 80.4204C76.0029 69.8715 77.6557 59.1273 80.4051 49.1841L80.4058 49.1815C85.1269 32.0724 93.0385 16.8664 98.9418 8.0814C99.2061 7.70012 99.6269 7.5 100 7.5C100.373 7.5 100.794 7.70008 101.058 8.08135C106.961 16.865 114.871 32.0679 119.592 49.1739C122.31 59.1405 123.997 69.8448 123.482 80.4213L122.959 91.1819L131.515 84.6349C135.801 81.355 140.372 78.3924 144.931 75.7924ZM95.5972 175.567L95.5838 175.44C95.5932 175.513 95.601 175.587 95.6073 175.663L95.5972 175.567Z" stroke="currentColor" strokeWidth="10"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                        </a>
                      </div>
                      <a className="text-color-primary text-center text-xl font-medium hover:underline" href={`/club/grow/${item.strainID}`} data-discover="true">
                        {item.strainname}
                      </a>
                      <div className="mt-2 grid w-full grid-cols-2 gap-2">
                        <div className="min-w-24 overflow-hidden rounded-md border border-stone-100 bg-stone-50 px-2 py-1 text-center">
                          <div className="text-color-secondary text-xs uppercase">thc</div>
                          <div className="line-clamp-1 font-bold">{item.thc || 0}&nbsp;%</div>
                        </div>
                        <div className="min-w-24 overflow-hidden rounded-md border border-stone-100 bg-stone-50 px-2 py-1 text-center">
                          <div className="text-color-secondary text-xs uppercase">cbd</div>
                          <div className="line-clamp-1 font-bold">{item.cbd || 0}&nbsp;%</div>
                        </div>
                      </div>
                      <div className="px-3 pb-4 pt-2 rounded-md border border-stone-100 bg-stone-50">
                        <div className="text-color-secondary mb-2 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="size-5">
                              <title>indica</title>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"></path>
                            </svg>
                            {100 - (item.ratio || 0)}&nbsp;% Indica
                          </div>
                          <div className="flex items-center gap-1">
                            {item.ratio || 0}&nbsp;% Sativa
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="size-5">
                              <title>Sativa</title>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="relative mt-4">
                          <div className="h-2 w-full rounded-full bg-gradient-to-r from-sky-500 to-amber-500 ring-1 ring-white">
                            <div className="drop-shadow-black absolute -top-1.5 h-5 w-1 rounded-full bg-white ring-2 ring-white ring-offset-1 drop-shadow" style={{ left: `${item.ratio || 0}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-color-secondary line-clamp-3 text-sm">
                        <div>{item.description || 'Keine Beschreibung verfügbar'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 sm:px-8 pb-8">
                    <div className="grid grid-cols-1 gap-4">
                      {/* Additional content can be added here */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  Strain hinzufügen
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Erstelle einen neuen Strain
                </p>
              </div>
              <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                <div className="w-full flex tablet:flex-col">
                  <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Bild</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Ein repräsentatives Bild für diesen Strain.
                    </p>
                  </div>
                  <div>
                    {strainAvatar ? (
                      <div className="relative w-36 h-36 overflow-hidden rounded-full">
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
                            className="w-36 h-36 flex justify-center items-center overflow-hidden rounded-full bg-[#F8F8F8] cursor-pointer mobile:self-center"
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
                                    setTempAvatar(undefined);
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
                                                .includes(
                                                  strainInput.toLowerCase()
                                                )
                                            )
                                            .map((m, key) => {
                                              return (
                                                <div
                                                  className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
                                                  key={key}
                                                  onClick={() =>
                                                    handelAutoFill(m)
                                                  }
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
                            Definiere hier den Indica / Sativa-Anteil deines
                            Strains.
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StrainPage;
