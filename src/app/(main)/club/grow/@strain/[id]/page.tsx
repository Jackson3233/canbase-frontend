"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StarRatings from "react-star-ratings";
import Dropzone from "react-dropzone";
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronLeft, Dna, Images, Pencil, Trash2 } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { strainsActions } from "@/store/reducers/strainsReducer";
import {
  addDiary,
  changeRate,
  getStrain,
  updateStrain,
} from "@/actions/strain";
import Overview from "@/components/basic/Overview";
import ProfileInput from "@/components/basic/ProfileInput";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { StrainFormSchema, DiaryFormSchema } from "@/constant/formschema";
import {
  UriToFileObject,
  getAvatarLetters,
  getCleanDate,
  isEmpty,
} from "@/lib/functions";
import { strainsData } from "@/constant/strains";
import {
  defaultCalendarOption,
  strainCalendarSeries,
} from "@/constant/calendars";
import PageQRModal from "@/components/basic/PageQRModal";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StrainInfoPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diaryLoading, setDiaryLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [avatar, setAvatar] = useState<any>();
  const [tempAvatar, setTempAvatar] = useState<any>();
  const [removeAvatar, setRemoveAvatar] = useState<any>(false);
  const [strainAvatar, setStrainAvatar] = useState<any>();
  const [strain, setStrain] = useState<any>();
  const [strainInput, setStrainInput] = useDebounceValue("", 500);
  const [openQRModal, setOpenQRModal] = useState(false);

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
  const diaryForm = useForm<z.infer<typeof DiaryFormSchema>>({
    resolver: zodResolver(DiaryFormSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    (async () => {
      const result = await getStrain({ strainID: params.id });

      if (result.success) {
        setStrain(result.strain);
        setRating(result.strain?.rating);

        !isEmpty(result.strain?.avatar) &&
          setAvatar(process.env.NEXT_PUBLIC_UPLOAD_URI + result.strain.avatar);

        setGrowthGermination(result.strain?.growth_germination);
        setGrowthCutting(result.strain?.growth_cutting);
        setGrowthVegetative(result.strain?.growth_vegetative);
        setGrowthFlowering(result.strain?.growth_flowering);
        setGrowthCuring(result.strain?.growth_curing);

        form.reset({
          strainname: result.strain?.strainname,
          description: result.strain?.description,
          ratio: result.strain?.ratio,
          thc: result.strain?.thc,
          cbd: result.strain?.cbd,
          breeder: result.strain?.breeder,
          genetics: result.strain?.genetics,
          type: result.strain?.type,
          avg_height: result.strain?.avg_height,
          yield_per_plant: result.strain?.yield_per_plant,
          growth_germination: result.strain?.growth_germination,
          growth_cutting: result.strain?.growth_cutting,
          growth_vegetative: result.strain?.growth_vegetative,
          growth_flowering: result.strain?.growth_flowering,
          growth_curing: result.strain?.growth_curing,
          effect: result.strain?.effect,
          terpene: result.strain?.terpene,
          area: result.strain?.area,
          note: result.strain?.note,
        });
      }
    })();
  }, [form, params.id]);

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
    if (isEdit) {
      setIsEdit((prev) => !prev);

      if (!isEmpty(strain?.avatar)) {
        setAvatar(process.env.NEXT_PUBLIC_UPLOAD_URI + strain.avatar);
      } else {
        setAvatar(undefined);
      }
      setTempAvatar(undefined);
      setRemoveAvatar(false);
      setStrainAvatar(undefined);
      setStrainInput("");

      setGrowthGermination(strain?.growth_germination);
      setGrowthCutting(strain?.growth_cutting);
      setGrowthVegetative(strain?.growth_vegetative);
      setGrowthFlowering(strain?.growth_flowering);
      setGrowthCuring(strain?.growth_curing);

      form.reset({
        strainname: strain?.strainname,
        description: strain?.description,
        ratio: strain?.ratio,
        thc: strain?.thc,
        cbd: strain?.cbd,
        breeder: strain?.breeder,
        genetics: strain?.genetics,
        type: strain?.type,
        avg_height: strain?.avg_height,
        yield_per_plant: strain?.yield_per_plant,
        growth_germination: strain?.growth_germination,
        growth_cutting: strain?.growth_cutting,
        growth_vegetative: strain?.growth_vegetative,
        growth_flowering: strain?.growth_flowering,
        growth_curing: strain?.growth_curing,
        effect: strain?.effect,
        terpene: strain?.terpene,
        area: strain?.area,
        note: strain?.note,
      });
    } else {
      router.push("/club/grow");
    }
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
    setRemoveAvatar(true);

    setStrainInput("");
  };

  const changeRating = async (newRating: number) => {
    if (
      user?.role === "owner" ||
      user?.functions?.includes("club-grow-manage")
    ) {
      const result = await changeRate({
        rating: newRating,
        strainID: params.id,
      });

      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });

      if (result.success) {
        setRating(result.rating);
      }
    }
  };

  const onDiarySubmit = async (data: z.infer<typeof DiaryFormSchema>) => {
    setDiaryLoading(true);

    const result = await addDiary({ ...data, strainID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setDiaryLoading(false);

    if (result.success) {
      dispatch(strainsActions.setStrains({ strains: result.strains }));
      setStrain(result.strain);

      diaryForm.reset({ content: "" });
    }
  };

  const onSubmit = async (data: z.infer<typeof StrainFormSchema>) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      value !== undefined && formData.append(key, value as string);
    });

    formData.append("strainID", params.id);
    formData.append("avatar", avatar);
    formData.append("removeAvatar", removeAvatar);

    const result = await updateStrain(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(strainsActions.setStrains({ strains: result.strains }));
      setStrain(result.strain);

      setIsEdit((prev) => !prev);
      !isEmpty(result.strain?.avatar) &&
        setAvatar(process.env.NEXT_PUBLIC_UPLOAD_URI + result.strain.avatar);
      setTempAvatar(undefined);
      setRemoveAvatar(false);
      setStrainInput("");

      setGrowthGermination(result.strain?.growth_germination);
      setGrowthCutting(result.strain?.growth_cutting);
      setGrowthVegetative(result.strain?.growth_vegetative);
      setGrowthFlowering(result.strain?.growth_flowering);
      setGrowthCuring(result.strain?.growth_curing);

      form.reset({
        strainname: result.strain?.strainname,
        description: result.strain?.description,
        ratio: result.strain?.ratio,
        thc: result.strain?.thc,
        cbd: result.strain?.cbd,
        breeder: result.strain?.breeder,
        genetics: result.strain?.genetics,
        type: result.strain?.type,
        avg_height: result.strain?.avg_height,
        yield_per_plant: result.strain?.yield_per_plant,
        growth_germination: result.strain?.growth_germination,
        growth_cutting: result.strain?.growth_cutting,
        growth_vegetative: result.strain?.growth_vegetative,
        growth_flowering: result.strain?.growth_flowering,
        growth_curing: result.strain?.growth_curing,
        effect: result.strain?.effect,
        terpene: result.strain?.terpene,
        area: result.strain?.area,
        note: result.strain?.note,
      });
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
              {!isEdit ? "Alle Strains" : "Zurück"}
            </span>
          </Button>
          {!isEdit && (
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
              disabled={
                user?.role !== "owner" &&
                !user?.functions?.includes("club-grow-manage")
              }
            >
              <Pencil className="w-3 h-3" />
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
          <div className="flex flex-col space-y-6 tablet:space-y-3">
            <Card>
              <CardContent className="grid grid-cols-3 divide-x p-0 tablet:grid-cols-1 tablet:divide-x-0 tablet:divide-y">
                <div className="flex p-7 tablet:justify-center tablet:p-5">
                  <div className="flex flex-col space-y-2 tablet:items-center">
                    <p className="text-sm font-semibold mobile:text-xs">
                      Insgesamt geerntet
                    </p>
                    <p>-</p>
                    {/* <h2 className="text-2xl font-semibold laptop:text-xl tablet:text-base">
                      1,2kg
                    </h2> */}
                  </div>
                </div>
                <div className="flex p-7 tablet:justify-center tablet:p-5">
                  <div className="flex flex-col space-y-2 tablet:items-center">
                    <p className="text-sm font-semibold mobile:text-xs">
                      Im aktuellen Monat ausgegeben
                    </p>
                    <p>-</p>
                    {/* <div className="flex items-center space-x-2 tablet:flex-col tablet:space-x-0">
                      <h2 className="text-2xl font-semibold laptop:text-xl tablet:text-base">
                        220g
                      </h2>
                      <div className="flex items-center gap-2 laptop:flex-col laptop:items-start laptop:gap-1 tablet:flex-row tablet:items-center tablet:gap-2">
                        <p className="text-sm text-content">davor 210g</p>
                        <Badge className="w-fit h-fit flex items-center space-x-1 p-1 text-[#19A873] bg-[#19A873]/25 rounded-xl">
                          <MoveUp size={12} />
                          <p className="text-xs leading-[8px] whitespace-nowrap">
                            10%
                          </p>
                        </Badge>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="flex p-7 tablet:justify-center tablet:p-5">
                  <div className="flex flex-col space-y-2 tablet:items-center">
                    <p className="text-sm font-semibold mobile:text-xs">
                      Club Bewertung
                    </p>
                    <StarRatings
                      rating={rating}
                      starRatedColor="#FBCB15"
                      starEmptyColor="#EAEAEA"
                      starHoverColor="#FBCB15"
                      changeRating={changeRating}
                      numberOfStars={5}
                      starDimension="22px"
                      starSpacing="2px"
                      name="rating"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-6 laptop:flex-col tablet:gap-3">
              <Card className="w-full h-fit">
                <CardContent className="p-0">
                  <h1 className="p-7 font-semibold border-b tablet:p-5 tablet:text-sm">
                    {strain?.strainname}
                  </h1>
                  <div className="flex flex-col space-y-5 p-7 tablet:space-y-3 tablet:p-5">
                    <div className="w-24 h-24 tablet:self-center">
                      {avatar === undefined ? (
                        <div className="w-full h-full flex justify-center items-center bg-[#F8F8F8] rounded-full">
                          <Dna className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
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
                    <div className="flex flex-col space-y-5 tablet:space-y-3">
                      <div className="flex flex-wrap gap-5 tablet:gap-3 mobile:flex-col">
                        <Overview title="Name" content={strain?.strainname} />
                        <Overview
                          title="Beschreibung"
                          content={
                            !isEmpty(strain?.description)
                              ? strain.description
                              : "-"
                          }
                          flag={
                            !isEmpty(strain?.description) ? "other" : "default"
                          }
                        />
                        <Overview
                          title="THC-Gehalt"
                          content={
                            !isEmpty(strain?.thc) ? `${strain.thc}%` : "-"
                          }
                        />
                        <Overview
                          title="CBD-Gehalt"
                          content={
                            !isEmpty(strain?.cbd) ? `${strain.cbd}%` : "-"
                          }
                        />
                        <Overview
                          title="Genetik"
                          content={
                            !isEmpty(strain?.genetics) ? strain.genetics : "-"
                          }
                        />
                        <Overview
                          title="Züchter"
                          content={
                            !isEmpty(strain?.breeder) ? strain.breeder : "-"
                          }
                        />
                        {!isEmpty(strain?.type) ? (
                          <>
                            {strain.type === "photo-period" && (
                              <Overview
                                title="Blütentyp"
                                content="Photoperiodisch"
                              />
                            )}
                            {strain.type === "auto-flowering" && (
                              <Overview
                                title="Blütentyp"
                                content="Autoflowering"
                              />
                            )}
                          </>
                        ) : (
                          <Overview title="Blütentyp" content="-" />
                        )}
                        <Overview
                          title="Pflanzenhöhe"
                          content={
                            !isEmpty(strain?.avg_height)
                              ? strain.avg_height
                              : "-"
                          }
                        />
                        <Overview
                          title="Ertrag pro Pflanze"
                          content={
                            !isEmpty(strain?.yield_per_plant)
                              ? strain.yield_per_plant
                              : "-"
                          }
                        />
                        <Overview
                          title="Wirkung"
                          content={
                            !isEmpty(strain?.effect) ? strain.effect : "-"
                          }
                        />
                        <Overview
                          title="Terpene"
                          content={
                            !isEmpty(strain?.terpene) ? strain.terpene : "-"
                          }
                        />
                        <Overview
                          title="Mögliche medizinische oder therapeutische Wirkungen"
                          content={!isEmpty(strain?.area) ? strain.area : "-"}
                        />
                        <div className="max-w-48 w-full flex flex-col space-y-1">
                          <p className="text-xs text-content">
                            {`Anbaudauer (${
                              (strain?.growth_germination || 0) +
                              (strain?.growth_cutting || 0) +
                              (strain?.growth_vegetative || 0) +
                              (strain?.growth_flowering || 0) +
                              (strain?.growth_curing || 0)
                            } Tage)`}
                          </p>
                          <div className="flex flex-col text-xs font-medium">
                            <div className="flex items-center justify-between">
                              <p className="text-content">Keimung</p>
                              <p>
                                {!isEmpty(strain?.growth_germination)
                                  ? strain.growth_germination
                                  : "0 "}
                                Tage
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-content">Steckling</p>
                              <p>
                                {!isEmpty(strain?.growth_cutting)
                                  ? strain.growth_cutting
                                  : "0 "}
                                Tage
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-content">Vegetative Phase</p>
                              <p>
                                {!isEmpty(strain?.growth_vegetative)
                                  ? strain.growth_vegetative
                                  : "0 "}
                                Tage
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-content">Blütephase</p>
                              <p>
                                {!isEmpty(strain?.growth_flowering)
                                  ? strain.growth_flowering
                                  : "0 "}
                                Tage
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-content">Aushärtung</p>
                              <p>
                                {!isEmpty(strain?.growth_curing)
                                  ? strain.growth_curing
                                  : "0 "}
                                Tage
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!isEmpty(strain?.note) && (
                        <Overview title="Notizen" content={strain.note} />
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
                    {strain?.diary?.map((item: any, key: string) => {
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
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  {strain?.strainname} bearbeiten
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Hier kannst du den Strain bearbeiten.
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
                            setAvatar(undefined);
                            setRemoveAvatar(true);
                            setStrainAvatar(undefined);
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
         {openQRModal && (
            <PageQRModal
            isOpen={openQRModal}
            onClose={() => setOpenQRModal(false)}
            type="strain"
            data={strain}
            qrCode={strain?.qrCode}
          />
        )}
      </div>
    </div>
  );
};

export default StrainInfoPage;
