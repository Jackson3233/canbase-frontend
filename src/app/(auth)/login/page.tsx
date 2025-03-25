"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocalStorage } from "usehooks-ts";
import ClipLoader from "react-spinners/ClipLoader";
import { signIn, twoFAVerify } from "@/actions/auth";
import ProfileInput from "@/components/basic/ProfileInput";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginFormSchema, TwoFAVerifyFormSchema } from "@/constant/formschema";

const LoginPage = () => {
  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    const token: any = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const [logininfo, setLoginInfo] = useLocalStorage<any>("logininfo", {});

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [twoFAOpen, setTwoFAOpen] = useState(false);
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const twoFAVerifyform = useForm<z.infer<typeof TwoFAVerifyFormSchema>>({
    resolver: zodResolver(TwoFAVerifyFormSchema),
    defaultValues: {
      otp_token: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    setLoading(true);

    const result = await signIn(data);
    console.log('🔄 Login Result:', result);

    setLoading(false);

    if (result.success) {
      if (result.two_fa) {
        setLoginInfo(data);
        console.log('📦 2FA aktiviert, speichere Login Info:', data);
        setTwoFAOpen((prev) => !prev);
      } else {
        toast({
          className:
            "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
          description: result.msg,
        });

        console.log('📦 Speichere Token:', result.token);
        localStorage.setItem("token", result.token);

        router.push("/dashboard");
      }
    } else {
      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });
    }
  };

  const onTwoFAVerifySubmit = async (
    data: z.infer<typeof TwoFAVerifyFormSchema>
  ) => {
    setOtpLoading(true);

    const result = await twoFAVerify({ ...logininfo, ...data });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoginInfo(undefined);
    setOtpLoading(false);

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
            Einloggen
          </h1>
          <p className="text-content mobile:text-sm">
            oder kostenlos{" "}
            <b
              className="cursor-pointer hover:text-custom"
              onClick={() => router.push("/signup")}
            >
              registrieren
            </b>
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
      <Dialog open={twoFAOpen} onOpenChange={setTwoFAOpen}>
        <DialogContent className="max-w-xl w-full flex flex-col gap-0 overflow-hidden rounded-3xl p-0">
          <div className="flex items-center p-8 pb-5 border-b mobile:pb-3">
            <Image
              src="/assets/images/logo.svg"
              width={38}
              height={38}
              alt="logo"
            />
            <h1 className="text-lg font-bold tablet:text-base">
              Zwei-Faktor-Authentifizierung
            </h1>
          </div>
          <div className="flex flex-col space-y-3 p-8 mobile:p-5">
            <p className="text-sm mobile:text-xs">
              Geben Sie zur Anmeldung unten den sechsstelligen
              Authentifizierungscode ein, der von Ihrer Authenticator-App bereit
              gestellt wird.
            </p>
            <Form {...twoFAVerifyform}>
              <form
                className="flex flex-col"
                onSubmit={twoFAVerifyform.handleSubmit(onTwoFAVerifySubmit)}
              >
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-semibold mobile:text-xs">
                    Authentisierungscode
                  </p>
                  <ProfileInput
                    form={twoFAVerifyform.control}
                    flag="other"
                    id="otp_token"
                    placeholder="z.B. 123456"
                  />
                </div>
                <Button
                  className="self-end h-10 bg-custom mt-10 px-4 hover:bg-customhover tablet:mt-5 mobile:self-auto mobile:px-2"
                  type="submit"
                >
                  {otpLoading ? (
                    <ClipLoader
                      aria-label="loader"
                      data-testid="loader"
                      color="white"
                      size={16}
                    />
                  ) : (
                    <span className="text-sm">Login</span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;
