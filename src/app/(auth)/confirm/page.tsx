"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { confirmEmail, signIn } from "@/actions/auth";
import ProfileInput from "@/components/basic/ProfileInput";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoginFormSchema } from "@/constant/formschema";

const ConfirmPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    (async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      await confirmEmail({ token: token, email: email });
    })();
  }, [searchParams]);

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    setLoading(true);

    const result = await signIn(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      localStorage.setItem("token", result.token);

      router.push("/dashboard");
    }
  };

  return (
    <div className="self-center text-center laptop:px-10 tablet:w-full tablet:px-5 tablet:py-10">
      <div className="max-w-96 w-full flex flex-col space-y-12 mx-auto laptop:max-w-none tablet:space-y-6">
        <div className="flex flex-col space-y-8 tablet:space-y-4">
          <h1 className="text-4xl font-bold tablet:pt-12 mobile:text-2xl">
            Registrierung erfolgreich!
          </h1>
          <p className="text-content mobile:text-sm">
            Dein Account ist jetzt aktiv! Du kannst Dich nun einloggen
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
            <Link
              className="mt-5 text-left text-sm text-content tablet:mt-3 hover:text-customhover"
              href={"/forgot"}
            >
              Passwort vergessen?
            </Link>
            <Button className="h-10 mt-6 rounded-md tablet:mt-5" type="submit">
              {loading ? (
                <ClipLoader
                  aria-label="loader"
                  data-testid="loader"
                  color="white"
                  size={16}
                />
              ) : (
                <span className="text-sm">Einloggen</span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ConfirmPage;
