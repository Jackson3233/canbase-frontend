"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocalStorage } from "usehooks-ts";
import { Info } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { JoinClubInfoFormSchema } from "@/constant/formschema";
import { isEmpty } from "@/lib/functions";
import { JoinClubFormPropsInterface } from "@/types/page";

const InfoForm = ({ setActiveStep }: JoinClubFormPropsInterface) => {
  const { user } = useAppSelector((state) => state.user);

  const [_, setUserInfo] = useLocalStorage("UserInfo", {});

  const form = useForm<z.infer<typeof JoinClubInfoFormSchema>>({
    resolver: zodResolver(JoinClubInfoFormSchema),
    defaultValues: {
      username: !isEmpty(user) ? user?.username : "",
      birth: !isEmpty(user) ? new Date(user?.birth as any) : new Date(),
      rule: !isEmpty(user) ? true : false,
    },
  });

  const onSubmit = (data: z.infer<typeof JoinClubInfoFormSchema>) => {
    setActiveStep(3);

    setUserInfo(data);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="max-w-xl w-full h-fit overflow-hidden rounded-3xl mx-2 laptop:max-w-lg">
        <CardContent className="flex flex-col space-y-8 px-10 py-8 tablet:space-y-4 mobile:px-5 mobile:py-4">
          <div className="flex flex-col space-y-4 tablet:space-y-2">
            <p className="text-content mobile:text-sm">
              Erstelle Deinen Canbase Account
            </p>
            <h1 className="text-4xl	font-bold laptop:text-2xl tablet:text-xl">
              Persönliche Informationen
            </h1>
          </div>
          <p className="text-content mobile:text-sm">
            Deine persönlichen Informationen helfen dem Club, deine Anfrage
            besser zu verstehen und deine Mitgliedschaft im Club zu ermöglichen.
          </p>
          <Form {...form}>
            <form
              className="w-full flex flex-col space-y-6 tablet:space-y-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col space-y-4 tablet:space-y-2">
                <ProfileInput
                  form={form.control}
                  flag="other"
                  id="username"
                  placeholder="Name*"
                />
                <ProfileInput
                  form={form.control}
                  flag="other"
                  type="date"
                  id="birth"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div>
                  <ProfileInput
                    form={form.control}
                    flag="other"
                    type="checkbox"
                    id="rule"
                    checkboxLabel="Daten anonym an den Club senden"
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-lg w-full bg-white text-black border">
                      <p className="text-sm mobile:text-xs">
                        Wenn du diese Option auswählst, bekommt der Club keine
                        deiner Personenbezogenen Daten. Erst wenn er dich als
                        Mitglied seines Clubs akzeptiert, erhält er volle
                        Übersicht über dein Mitgliedsprofil.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                type="submit"
              >
                Weiter
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoForm;
