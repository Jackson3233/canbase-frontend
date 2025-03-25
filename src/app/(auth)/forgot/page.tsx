"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { forgotPass } from "@/actions/auth";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { ForgotFormSchema } from "@/constant/formschema";

const ForgotPage = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof ForgotFormSchema>>({
    resolver: zodResolver(ForgotFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ForgotFormSchema>) => {
    setLoading(true);

    const result = await forgotPass(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);
  };

  return (
    <div className="self-center text-center laptop:px-10 tablet:w-full tablet:px-5 tablet:py-10">
      <div className="max-w-96 w-full flex flex-col space-y-12 mx-auto laptop:max-w-none tablet:space-y-6">
        <div className="flex flex-col space-y-8 tablet:space-y-4">
          <h1 className="text-4xl font-bold tablet:pt-12 mobile:text-2xl">
            Passwort zurücksetzen
          </h1>
          <div className="text-content mobile:text-sm">
            <p>
              Du hast Dein Passwort vergessen? Keine Sorge! Gib deine E-Mail ein
              und wir senden Dir eine Mail zum zurücksetzen deines Passworts
            </p>
          </div>
        </div>
        <Form {...form}>
          <form
            className="w-full flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ProfileInput
              form={form.control}
              flag="other"
              type="email"
              id="email"
              placeholder="E-Mail Adresse*"
            />
            <Button className="h-10 mt-6 rounded-md tablet:mt-5" type="submit">
              {loading ? (
                <ClipLoader
                  aria-label="loader"
                  data-testid="loader"
                  color="white"
                  size={16}
                />
              ) : (
                <span className="text-sm">Passwort zurücksetzen</span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPage;
