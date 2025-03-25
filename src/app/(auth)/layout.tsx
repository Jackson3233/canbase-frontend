"use client";

import { Suspense } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/joinclub" || pathname === "/signupclub" ? (
        <div className="w-full h-screen mx-auto">
          <div className="w-full h-16 flex justify-between items-center px-7 border-b tablet:px-5 mobile:px-3">
            <div className="flex items-center space-x-3 tablet:space-x-2">
              <p className="text-content mobile:text-sm">Clubverwaltung mit</p>
              <div className="flex items-center">
                <Image
                  src="/assets/images/logo.svg"
                  width={25}
                  height={25}
                  alt="logo"
                />
                <p className="text-custom font-bold text-lg tablet:text-base mobile:text-sm">
                  Canbase
                </p>
              </div>
            </div>
            <LockKeyhole className="w-4 h-4 cursor-pointer hover:text-custom" />
          </div>
          <Suspense fallback={<></>}>{children}</Suspense>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center mx-auto">
          <div className="relative h-[800px] grid grid-cols-2 overflow-hidden mx-5 border rounded-xl tablet:max-w-lg tablet:w-full tablet:h-fit tablet:grid-cols-1 mobile:mx-3">
            <Image
              className="absolute left-8 top-8 tablet:left-4 hidden tablet:block"
              src="/assets/images/logo.svg"
              width={38}
              height={38}
              alt="logo"
            />
            <div className="relative flex flex-col justify-center p-6 tablet:hidden">
              <div className="absolute inset-0 bg-custom" />
              <Image
                className="relative"
                src="/assets/images/logo-white.svg"
                width={38}
                height={38}
                alt="logo"
              />
              <div className="relative mt-auto">
                <blockquote className="text-white py-2">
                  <p className="text-lg">
                    “Durch Canbase konnten wir unseren Club auf die nächste
                    Stufe heben. Wir konnten uns endlich nur auf unsere
                    Mitglieder konzentrieren.”
                  </p>
                  <p className="pt-5">Boris Depping</p>
                </blockquote>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
            <Suspense fallback={<></>}>{children}</Suspense>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthLayout;
