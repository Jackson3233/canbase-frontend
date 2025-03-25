"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { useLocalStorage } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { userActions } from "@/store/reducers/userReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { confirmJoin } from "@/actions/joinclub";
import { JoinClubAuthFormSchema } from "@/constant/formschema";
import { JoinClubFormPropsInterface } from "@/types/page";
import { isEmpty } from "@/lib/functions";

const AuthForm = ({ setActiveStep }: JoinClubFormPropsInterface) => {
  const dispatch = useAppDispatch();
  const { club } = useAppSelector((state) => state.club);

  const { toast } = useToast();

  const [_, setAuthInfo] = useLocalStorage("AuthInfo", {});

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof JoinClubAuthFormSchema>>({
    resolver: zodResolver(JoinClubAuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof JoinClubAuthFormSchema>) => {
    setLoading(true);

    const result = await confirmJoin({ ...data, clubID: club?.clubID });

    setLoading(false);

    if (result.success) {
      setActiveStep(2);

      setAuthInfo(data);

      !isEmpty(result?.user) &&
        dispatch(userActions.setUser({ user: result.user }));
    } else {
      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="max-w-xl w-full h-fit overflow-hidden rounded-3xl mx-2 laptop:max-w-lg">
        <CardContent className="flex flex-col space-y-8 px-10 py-8 tablet:space-y-4 mobile:px-5 mobile:py-4">
          <div className="flex flex-col space-y-4 tablet:space-y-2">
            <p className="text-content mobile:text-sm">
              Erstelle Deinen Canbase Account oder log Dich ein
            </p>
            <h1 className="text-4xl	font-bold laptop:text-2xl tablet:text-xl">
              Registrieren oder Anmelden
            </h1>
          </div>
          <p className="text-content mobile:text-sm">
            Erstelle einen Account um deine Anmeldung fortzusetzen. Wenn du
            bereits einen Account hast gib deine Anmeldedaten ein.
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
                  id="email"
                  placeholder="E-Mail Adresse*"
                />
                <ProfileInput
                  form={form.control}
                  flag="other"
                  type="password"
                  id="password"
                  placeholder="Passwort*"
                />
              </div>
              <Button
                className="w-full h-10 bg-[#19A873] hover:bg-[#19A873]/75"
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
                  <span className="text-sm">Registrieren / Einloggen</span>
                )}
              </Button>
            </form>
          </Form>
          <div className="text-sm text-content mobile:text-xs">
            {`Mit der Bestätigung des Formulars, stimme ich den `}
            <Link className="text-black hover:text-custom" href="#">
              Allgemeinen Geschäftsbedingungen,
            </Link>
            {` sowie den `}
            <Link className="text-black hover:text-custom" href="#">
              Datenschutzrichtlinien
            </Link>
            {` zu.`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
