"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronLeft, Focus, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { zonesActions } from "@/store/reducers/zonesReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form } from "@/components/ui/form";
import { createZone } from "@/actions/zone";
import { ZoneFormSchema } from "@/constant/formschema";
import { getAvatarLetters, getCleanDate, isEmpty } from "@/lib/functions";

const ZonePage = () => {
  const dispatch = useAppDispatch();
  const { zones } = useAppSelector((state) => state.zones);
  const { charges } = useAppSelector((state) => state.charges);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleBefore = () => {
    setIsEdit((prev) => !prev);

    form.reset({
      zonename: "",
      description: "",
      size: "",
      electricity: "",
      lighting: "",
      ventilation: "",
      temperature: undefined,
      humidity: undefined,
      note: "",
    });
  };

  const onSubmit = async (data: z.infer<typeof ZoneFormSchema>) => {
    setLoading(true);

    const result = await createZone(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(zonesActions.setZones({ zones: result.zones }));

      setIsEdit((prev) => !prev);

      form.reset({
        zonename: "",
        description: "",
        size: "",
        electricity: "",
        lighting: "",
        ventilation: "",
        temperature: undefined,
        humidity: undefined,
        note: "",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {!isEdit ? (
          isEmpty(zones) ? (
            <Card className="p-10 tablet:p-7 mobile:p-5">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <Focus className="w-6 h-6 tablet:w-4 tablet:h-4" />
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    Zone
                  </h1>
                </div>
                <p className="pt-2 text-sm text-content tablet:max-w-none mobile:text-xs">
                  {`Lege jetzt eine erste Anbauzone für deinen Club an.`}
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
                  <span className="text-sm">Zone hinzufügen</span>
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
              <span className="text-xs">Zone hinzufügen</span>
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
          !isEmpty(zones) && (
            <div className="grid grid-cols-2 gap-3 laptop:grid-cols-1">
              {zones.map((item, key) => (
                <Card
                  className="rounded-3xl cursor-pointer"
                  key={key}
                  onClick={() =>
                    router.push("/club/grow/" + item.zoneID + "?tab=zone")
                  }
                >
                  <CardContent className="flex flex-col space-y-5 p-10 tablet:space-y-3 tablet:p-7 mobile:p-5">
                    <div className="w-16 h-16 flex justify-center items-center bg-[#F8F8F8] rounded-full">
                      <Focus className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
                    </div>
                    <div className="flex justify-between space-x-3 mobile:flex-col mobile:space-x-0 mobile:space-y-3">
                      <div className="flex flex-col space-y-4 tablet:space-y-2">
                        <p className="text-lg font-semibold tablet:text-base mobile:text-sm">
                          {item.zonename}
                        </p>
                        {(!isEmpty(item.temperature) ||
                          !isEmpty(item.humidity)) && (
                          <div className="flex flex-col text-sm text-content mobile:text-xs">
                            {!isEmpty(item.temperature) && (
                              <p>{`Temperatur: ${item.temperature} °C`}</p>
                            )}
                            {!isEmpty(item.humidity) && (
                              <p>{`Luftfeuchtigkeit: ${item.humidity} %`}</p>
                            )}
                          </div>
                        )}
                        {charges.filter((f) => f.zone?._id == item._id).length >
                          0 && (
                          <div className="flex flex-col space-y-2 tablet:space-y-1">
                            <p className="text-xs text-content">Chargen</p>
                            <div className="flex flex-wrap items-center gap-2">
                              {charges
                                .filter((f) => f.zone?._id == item._id)
                                .map((m, key) => (
                                  <Badge
                                    key={key}
                                    className="w-fit p-1.5 text-xs text-black leading-[8px] bg-[#989898]/15 rounded-md"
                                  >
                                    {m.chargename}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {!isEmpty(item.diary) && (
                        <div className="max-w-[250px] w-full flex bg-[#FBFBFB] px-5 py-3 border rounded-lg space-x-5 tablet:space-x-3 mobile:max-w-none">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={
                                (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                                item.diary?.at(item.diary.length - 1)?.user
                                  ?.avatar
                              }
                              alt="avatar"
                            />
                            <AvatarFallback className="text-sm">
                              {getAvatarLetters(
                                item.diary?.at(item.diary.length - 1)?.user
                                  .username
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col space-y-2">
                            <div>
                              <p className="text-xs font-medium">
                                {
                                  item.diary?.at(item.diary.length - 1)?.user
                                    .username
                                }
                              </p>
                              <p className="text-xs text-content">
                                {getCleanDate(
                                  item.diary?.at(item.diary.length - 1)
                                    ?.date as string,
                                  2
                                )}
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
                              {item.diary?.at(item.diary.length - 1)?.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  Zone hinzufügen
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Erstelle eine neue Zone
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
      </div>
    </div>
  );
};

export default ZonePage;
