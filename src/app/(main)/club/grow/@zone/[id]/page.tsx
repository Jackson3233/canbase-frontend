"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronLeft, Pencil } from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { zonesActions } from "@/store/reducers/zonesReducer";
import Overview from "@/components/basic/Overview";
import ProfileInput from "@/components/basic/ProfileInput";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
import { addDiary, getZone, updateZone } from "@/actions/zone";
import { ZoneFormSchema, DiaryFormSchema } from "@/constant/formschema";
import { getAvatarLetters, getCleanDate, isEmpty } from "@/lib/functions";
import PageQRModal from "@/components/basic/PageQRModal";

const ZoneInfoPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diaryLoading, setDiaryLoading] = useState(false);
  const [zone, setZone] = useState<any>();
  const [openQRModal, setOpenQRModal] = useState(false);

  const form = useForm<z.infer<typeof ZoneFormSchema>>({
    resolver: zodResolver(ZoneFormSchema),
    defaultValues: {
      zonename: "",
      description: "",
      size: "",
      electricity: "",
      lighting: "",
      ventilation: "",
      temperature: undefined,
      humidity: undefined,
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
      const result = await getZone({ zoneID: params.id });

      if (result.success) {
        setZone(result.zone);

        form.reset({
          zonename: result.zone?.zonename,
          description: result.zone?.description,
          size: result.zone?.size,
          electricity: result.zone?.electricity,
          lighting: result.zone?.lighting,
          ventilation: result.zone?.ventilation,
          temperature: result.zone?.temperature,
          humidity: result.zone?.humidity,
          note: result.zone?.note,
        });
      }
    })();
  }, [form, params.id]);

  const handleBefore = () => {
    if (isEdit) {
      setIsEdit((prev) => !prev);

      form.reset({
        zonename: zone?.zonename,
        description: zone?.description,
        size: zone?.size,
        electricity: zone?.electricity,
        lighting: zone?.lighting,
        ventilation: zone?.ventilation,
        temperature: zone?.temperature,
        humidity: zone?.humidity,
        note: zone?.note,
      });
    } else {
      router.push("/club/grow?tab=zone");
    }
  };

  const onDiarySubmit = async (data: z.infer<typeof DiaryFormSchema>) => {
    setDiaryLoading(true);

    const result = await addDiary({ ...data, zoneID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setDiaryLoading(false);

    if (result.success) {
      dispatch(zonesActions.setZones({ zones: result.zones }));
      setZone(result.zone);

      diaryForm.reset({ content: "" });
    }
  };

  const onSubmit = async (data: z.infer<typeof ZoneFormSchema>) => {
    setLoading(true);

    const result = await updateZone({ ...data, zoneID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(zonesActions.setZones({ zones: result.zones }));
      setZone(result.zone);

      setIsEdit((prev) => !prev);

      form.reset({
        zonename: result.zone?.zonename,
        description: result.zone?.description,
        size: result.zone?.size,
        electricity: result.zone?.electricity,
        lighting: result.zone?.lighting,
        ventilation: result.zone?.ventilation,
        temperature: result.zone?.temperature,
        humidity: result.zone?.humidity,
        note: result.zone?.note,
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
            <span className="text-xs">{!isEdit ? "Alle Zonen" : "Zurück"}</span>
          </Button>
          {!isEdit && (
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
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
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold mobile:text-xs">
                    Pflanzen
                  </p>
                  <h1 className="text-2xl font-semibold laptop:text-xl tablet:text-base">
                    {zone?.plants.length}
                  </h1>
                </div>
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold	mobile:text-xs">
                    Optimale Temperatur
                  </p>
                  <p>-</p>
                </div>
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold	mobile:text-xs">
                    Optimale Luftfeuchtigkeit
                  </p>
                  <p>-</p>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-6 laptop:flex-col tablet:gap-3">
              <Card className="w-full h-fit">
                <CardContent className="p-0">
                  <h1 className="p-7 border-b font-semibold tablet:p-5 tablet:text-sm">
                    {zone?.zonename}
                  </h1>
                  <div className="flex flex-col space-y-5 p-7 tablet:space-y-3 tablet:p-5">
                    <div className="flex flex-col space-y-5 tablet:space-y-3">
                      <div className="flex flex-wrap gap-5 tablet:gap-3 mobile:flex-col">
                        <Overview title="Name" content={zone?.zonename} />
                        <Overview
                          title="Beschreibung"
                          content={
                            !isEmpty(zone?.description) ? zone.description : "-"
                          }
                          flag={
                            !isEmpty(zone?.description) ? "other" : "default"
                          }
                        />
                        <Overview
                          title="Fläche"
                          content={
                            !isEmpty(zone?.size) ? `${zone.size}qm2` : "-"
                          }
                        />
                        <Overview
                          title="Strom"
                          content={
                            !isEmpty(zone?.electricity)
                              ? `${zone.electricity}kWh`
                              : "-"
                          }
                        />
                        <Overview
                          title="Lampen"
                          content={
                            !isEmpty(zone?.lighting) ? zone.lighting : "-"
                          }
                        />
                        <Overview
                          title="Ventilation"
                          content={
                            !isEmpty(zone?.ventilation) ? zone.ventilation : "-"
                          }
                        />
                      </div>
                      {!isEmpty(zone?.note) && (
                        <Overview title="Notizen" content={zone.note} />
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
                    {zone?.diary?.map((item: any, key: string) => {
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
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl	font-semibold tablet:text-xl">
                  {zone?.zonename} bearbeiten
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Hier kannst du die Zone bearbeiten.
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
                      id="zonename"
                      title="Name*"
                      placeholder="Name"
                    />
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="description"
                      title="Beschreibung"
                      content="Eine optionale Beschreibung der Zone."
                      placeholder="Beschreibung"
                    />
                    <ProfileInput
                      form={form.control}
                      id="size"
                      title="Fläche"
                      content="Die optionale Größe der Zone in Quadratmetern oder einer anderen Einheit."
                      placeholder="Fläche"
                    />
                    <ProfileInput
                      form={form.control}
                      id="electricity"
                      title="Strom"
                      content="Der Stromverbrauch der Beleuchtung und der Lüftung, meist in kWh."
                      placeholder="Strom"
                    />
                    <ProfileInput
                      form={form.control}
                      id="lighting"
                      title="Beleuchtung"
                      content="Informationen über die Art der Beleuchtung (LED, HPS, etc.) und den Lichtzyklus."
                      placeholder="Beleuchtung"
                    />
                    <ProfileInput
                      form={form.control}
                      id="ventilation"
                      title="Ventilation"
                      content="Details zum Lüftungssystem, z.B. Art der Ventilatoren oder des Filtersystems."
                      placeholder="Ventilation"
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="temperature"
                      title="Optimale Temperatur"
                      content="Details zum Lüftungssystem, z.B. Art der Ventilatoren oder des Filtersystems."
                      tag="Celsius (°C)"
                      placeholder="Optimale Temperatur"
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="humidity"
                      title="Optimale Luftfeuchtigkeit"
                      content="Die optimale Luftfeuchtigkeit in der Zone, in Prozent, ebenfalls wichtig für das Pflanzenwachstum."
                      tag="Prozent (%)"
                      placeholder="Optimale Luftfeuchtigkeit"
                    />
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="note"
                      title="Notiz"
                      content="Ein optionales Feld für zusätzliche Anmerkungen oder Besonderheiten der Zone."
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
            </CardContent>
          </Card>
        )}
         {openQRModal && (
          <PageQRModal
            isOpen={openQRModal}
            onClose={() => setOpenQRModal(false)}
            type="zone"
            data={zone}
            qrCode={zone?.qrCode}
          />
        )}
      </div>
    </div>
  );
};

export default ZoneInfoPage;
