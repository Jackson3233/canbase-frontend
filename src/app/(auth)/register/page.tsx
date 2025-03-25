"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { useLocalStorage } from "usehooks-ts";
import { signUp } from "@/actions/auth";
import ProfileInput from "@/components/basic/ProfileInput";
import DateOTPInput from "@/components/basic/DateOTPInput";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RegisterFormSchema } from "@/constant/formschema";
import { generateUsername } from "@/lib/username";

const RegisterPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [userinfo, setUserInfo] = useLocalStorage<any>("userinfo", {});
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      username: "",
      birth: new Date(),
      rule: false,
    },
  });

  const generateRandomUsername = () => {
    const newUsername = generateUsername();
    form.setValue("username", newUsername);
  };

  const onSubmit = async (data: z.infer<typeof RegisterFormSchema>) => {
    setLoading(true);

    const result = await signUp({ ...userinfo, ...data });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      router.push("/welcome");
      setUserInfo(undefined);
    }
  };

  return (
    <div className="self-center laptop:px-10 tablet:w-full tablet:px-5 tablet:py-10">
      <div className="max-w-96 w-full flex flex-col space-y-8 mx-auto laptop:max-w-none tablet:space-y-4">
        <div className="flex flex-col space-y-6 tablet:space-y-3">
          <h1 className="text-4xl font-bold tablet:pt-12 mobile:text-2xl">
            Herzlich Willkommen bei
            <span className="text-custom">{" Canbase!"}</span>
          </h1>
          <p className="text-content mobile:text-sm">
            Bitte vervollständige dein persönliches Profil und bestätige, dass
            du über 18 Jahre alt bist.
          </p>
        </div>
        <Form {...form}>
          <form
            className="w-full flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-3">
              <ProfileInput
                form={form.control}
                flag="other"
                id="username"
                placeholder="@benutzername"
                content="Wir achten sehr auf den Schutz deiner Identität, daher sollte dies nicht deinen Klarnamen enthalten. Du kannst dir auch ganz einfach einen generieren."
                actionButton={{
                  text: "Generieren",
                  onClick: generateRandomUsername
                }}
              />
              <DateOTPInput
                form={form.control}
                id="birth"
              />
            </div>
            <div className="mt-5 tablet:mt-3">
              <ProfileInput
                form={form.control}
                flag="other"
                type="checkbox"
                id="rule"
                checkboxLabel="Ich bestätige, dass alle Angaben korrekt sind und ich über 18 Jahre alt bin."
              />
            </div>
            <Button className="h-10 mt-6 rounded-md tablet:mt-5" type="submit">
              {loading ? (
                <ClipLoader
                  aria-label="loader"
                  data-testid="loader"
                  color="white"
                  size={16}
                />
              ) : (
                "Weiter"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
