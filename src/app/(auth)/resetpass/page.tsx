"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { resetPass } from "@/actions/auth";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { ResetPassFormSchema } from "@/constant/formschema";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<any>();
  const [email, setEmail] = useState<any>();
  const form = useForm<z.infer<typeof ResetPassFormSchema>>({
    resolver: zodResolver(ResetPassFormSchema),
    defaultValues: {
      newpass: "",
      repass: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    setToken(token);
    setEmail(email);
  }, [searchParams]);

  const onSubmit = async (data: z.infer<typeof ResetPassFormSchema>) => {
    setLoading(true);

    const result = await resetPass({ token: token, email: email, ...data });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      router.push("/login");
    }
  };

  return (
    <div className="self-center text-center laptop:px-10 tablet:w-full tablet:px-5 tablet:py-10">
      <div className="max-w-96 w-full flex flex-col space-y-12 mx-auto laptop:max-w-none tablet:space-y-6">
        <div className="flex flex-col space-y-8 tablet:space-y-4">
          <h1 className="text-4xl font-bold tablet:pt-12 mobile:text-2xl">
            Neues Passwort
          </h1>
          <div className="text-content mobile:text-sm">
            <p>
              Vergebe ein neues Passwort. Danach kannst Du dich wieder ganz
              normal einloggen.
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
                type="password"
                id="newpass"
                placeholder="Passwort*"
              />
              <ProfileInput
                form={form.control}
                flag="other"
                type="password"
                id="repass"
                placeholder="Passwort wiederholen*"
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
                <span className="text-sm">Zurücksetzen</span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
