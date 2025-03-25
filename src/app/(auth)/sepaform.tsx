"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocalStorage } from "usehooks-ts";
import { useAppSelector } from "@/store/hook";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { JoinClubBankFormSchema } from "@/constant/formschema";
import { isEmpty } from "@/lib/functions";
import { JoinClubFormPropsInterface } from "@/types/page";

const SEPAForm = ({ setActiveStep }: JoinClubFormPropsInterface) => {
  const { user } = useAppSelector((state) => state.user);
  const { club } = useAppSelector((state) => state.club);

  const [_, setBankInfo] = useLocalStorage("BankInfo", {});

  const form = useForm<z.infer<typeof JoinClubBankFormSchema>>({
    resolver: zodResolver(JoinClubBankFormSchema),
    defaultValues: {
      holder: !isEmpty(user?.holder) ? user?.holder : "",
      IBAN: !isEmpty(user?.IBAN) ? user?.IBAN : "",
      BIC: !isEmpty(user?.BIC) ? user?.BIC : "",
    },
  });

  // Watch all three fields
  const holder = form.watch("holder");
  const iban = form.watch("IBAN");
  const bic = form.watch("BIC");

  // Check if all fields are empty
  const areFieldsEmpty = !holder && !iban && !bic;
  
  const onSubmit = (data: z.infer<typeof JoinClubBankFormSchema>) => {
    setActiveStep(5);

    setBankInfo(data);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="max-w-xl w-full h-fit overflow-hidden rounded-3xl mx-2 laptop:max-w-lg">
        <CardContent className="flex flex-col space-y-8 px-10 py-8 tablet:space-y-4 mobile:px-5 mobile:py-4">
          <div className="flex flex-col space-y-4 tablet:space-y-2">
            <p className="text-content mobile:text-sm">
              Ermächtige deinen Club Beiträge automatisch einzuziehen
            </p>
            <h1 className="text-4xl	font-bold laptop:text-2xl tablet:text-xl">
              SEPA-Lastschriftmandat
            </h1>
          </div>
          <div className="text-content mobile:text-sm">
            <p>
              {`Ich ermächtige `}
              <span className="text-black">
                {club?.clubname}
                {` e.V. `}
                {club?.street +
                  " " +
                  club?.address +
                  " " +
                  club?.postcode +
                  " " +
                  club?.city}
              </span>
            </p>
            <p>
              {`Gläubiger Identifikationsnummer: `}
              <span className="text-black">{}</span>
            </p>
            <p>
              {`Mandatsreferenz:`}
              <span className="text-black">{` wird separat mitgeteilt `}</span>
            </p>
            <p>
              {` wiederkehrende Zahlungen von meinem Konto mittels Lastschrift
              einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von
              CSC Berlin e.V. auf mein Konto gezogenen Lastschriften einzulösen.`}
            </p>
            <p>
              {`Hinweise: Ich kann innerhalb von acht Wochen, beginnend mit dem
              Belastungsdatum, die Erstattung des belasteten Betrages verlangen.
              Es gelten dabei die mit meinem Kreditinstitut vereinbarten
              Bedingungen.`}
            </p>
          </div>
          <Form {...form}>
            <form
              className="w-full flex flex-col space-y-6 tablet:space-y-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col space-y-4 tablet:space-y-2">
                <ProfileInput
                  form={form.control}
                  flag="other"
                  id="holder"
                  placeholder="Kontoinhaber"
                />
                <ProfileInput
                  form={form.control}
                  flag="other"
                  id="IBAN"
                  placeholder="IBAN"
                />
                <ProfileInput
                  form={form.control}
                  flag="other"
                  id="BIC"
                  placeholder="BIC"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                  type="submit"
                >
                  {areFieldsEmpty ? "Nicht akzeptieren" : "Weiter"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEPAForm;
