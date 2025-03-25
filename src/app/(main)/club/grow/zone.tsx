"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppDispatch } from "@/store/hook";
import { zonesActions } from "@/store/reducers/zonesReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createZone } from "@/actions/zone";
import { ZoneFormSchema } from "@/constant/formschema";
import { ZonePropsInterface } from "@/types/component";

const ZoneModal = ({ openZoneDlg, setOpenZoneDlg }: ZonePropsInterface) => {
  const dispatch = useAppDispatch();

  const { toast } = useToast();

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

  useEffect(() => {
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
  }, [form, openZoneDlg]);

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
    }
  };

  return (
    <Dialog open={openZoneDlg} onOpenChange={setOpenZoneDlg}>
      <DialogContent className="max-w-5xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
        <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
          <h1 className="text-2xl font-semibold tablet:text-xl">
            Zone bearbeiten
          </h1>
          <p className="pt-2 text-sm text-content mobile:text-xs">
            Erstelle eine neue Zone
          </p>
        </div>
        <div className="max-h-[700px] flex flex-col p-10 overflow-y-auto tablet:p-7 mobile:p-5">
          <Form {...form}>
            <form
              className="w-full flex flex-col tablet:mt-8"
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
                  onClick={() => setOpenZoneDlg(false)}
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

export default ZoneModal;
