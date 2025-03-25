"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChangePasswordPage = () => {
  const router = useRouter();

  return (
    <div className="self-center laptop:px-10 tablet:w-full tablet:px-5 tablet:py-10">
      <div className="max-w-96 w-full flex flex-col space-y-8 mx-auto laptop:max-w-none tablet:space-y-4">
        <div className="flex flex-col space-y-6 tablet:space-y-3">
          <h1 className="text-3xl font-bold tablet:pt-12 mobile:text-2xl">
            Passwort zurücksetzen
          </h1>
          <div className="flex space-x-2 p-4 text-custom bg-customforeground border-l-2 border-customhover rounded-lg mobile:p-2">
            <CheckCircle className="w-4 h-4 mt-0.5" />
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-semibold">
                Du wurdest erfolgreich ausgeloggt
              </p>
              <p className="text-xs">
                Überprüfe dein Postfach und setze dein Passwort zurück.
              </p>
            </div>
          </div>
          <Button
            className="h-10 rounded-md text-sm"
            onClick={() => router.push("/login")}
          >
            Zum Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
