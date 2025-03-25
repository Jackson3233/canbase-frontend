"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocalStorage } from "usehooks-ts";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SignUpFormSchema } from "@/constant/formschema";

const SignUpPage = () => {
  const router = useRouter();

  const [_, setUserInfo] = useLocalStorage("userinfo", {});

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof SignUpFormSchema>) => {
    router.push("/register");

    setUserInfo(data);
  };

  return (
    <div className="self-center text-center laptop:px-10 tablet:w-full tablet:px-5 tablet:py-10">
      <div className="max-w-96 w-full flex flex-col space-y-12 mx-auto laptop:max-w-none tablet:space-y-6">
        <div className="flex flex-col space-y-8 tablet:space-y-4">
          <h1 className="text-4xl font-bold tablet:pt-12 mobile:text-2xl">
            Erstelle Deinen Canbase Account
          </h1>
          <div className="text-content mobile:text-sm">
            <p>Erstelle jetzt deinen Canbase Account.</p>
            <p>
              {`Wenn du dich bereits registriert hast, kannst du dich ganz normal `}
              <b
                className="cursor-pointer hover:text-custom"
                onClick={() => router.push("/login")}
              >
                einloggen.
              </b>
            </p>
          </div>
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
                type="email"
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
              className="h-10 mt-6 text-sm rounded-md tablet:mt-5"
              type="submit"
            >
              Registrieren
            </Button>
            <p className="mt-9 text-content tablet:mt-5 tablet:text-sm">
              {`Mit der Bestätigung des Formulars, stimme ich den `}
              <Link className="underline" target="_blank" href="#">
                Allgemeinen Geschäftsbedingungen
              </Link>
              {` sowie den `}
              <Link
                className="underline"
                target="_blank"
                href={process.env.NEXT_PUBLIC_URL_GDPR as string}
              >
                Datenschutzrichtlinien
              </Link>
              {` zu.`}
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpPage;
