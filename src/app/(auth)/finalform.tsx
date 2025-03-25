"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppSelector } from "@/store/hook";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { finalJoin } from "@/actions/joinclub";
import { getCleanDate } from "@/lib/functions";

const FinalForm = () => {
  const { club } = useAppSelector((state) => state.club);

  const router = useRouter();

  const { toast } = useToast();

  const [authInfo, setAuthInfo] = useLocalStorage<any>("AuthInfo", {});
  const [userInfo, setUserInfo] = useLocalStorage<any>("UserInfo", {});
  const [questionInfo, setQuestionInfo] = useLocalStorage<any>(
    "QuestionInfo",
    []
  );
  const [bankInfo, setBankInfo] = useLocalStorage<any>("BankInfo", {});

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const result = await finalJoin({
      ...authInfo,
      ...userInfo,
      ...bankInfo,
      question: questionInfo,
      clubID: club?.clubID,
    });


    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      router.push("/login");

      setAuthInfo(undefined);
      setUserInfo(undefined);
      setQuestionInfo(undefined);
      setBankInfo(undefined);
    }
  };

  const areBankFieldsEmpty = !bankInfo?.holder && !bankInfo?.iban && !bankInfo?.bic;

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="max-w-xl w-full h-fit overflow-hidden rounded-3xl mx-2 laptop:max-w-lg">
        <CardContent className="flex flex-col space-y-8 px-10 py-8 tablet:space-y-4 mobile:px-5 mobile:py-4">
          <div className="flex flex-col space-y-4 tablet:space-y-2">
            <p className="text-content mobile:text-sm">
              Überprüfe Deine Angaben und schicke Deinen Antrag ab
            </p>
            <h1 className="text-4xl	font-bold laptop:text-2xl tablet:text-xl">
              Abschicken
            </h1>
          </div>
          <div className="flex flex-col">
            <div className="grid grid-cols-2 py-4 border-b mobile:py-2">
              <p className="text-content tablet:text-sm">Name</p>
              <p className="tablet:text-sm">{userInfo?.username}</p>
            </div>
            <div className="grid grid-cols-2 py-4 border-b mobile:py-2">
              <p className="text-content tablet:text-sm">E-Mail</p>
              <p className="tablet:text-sm">{authInfo?.email}</p>
            </div>
            <div className="grid grid-cols-2 py-4 border-b mobile:py-2">
              <p className="text-content tablet:text-sm">Geburtsdatum</p>
              <p className="tablet:text-sm">
                {getCleanDate(userInfo?.birth, 1)}
              </p>
            </div>
            <div className="grid grid-cols-2 py-6 tablet:py-3">
              <p className="text-content tablet:text-sm">
                SEPA-Lastschriftmandat
              </p>
              <p className="tablet:text-sm">{areBankFieldsEmpty ? "Nicht akzeptiert" : "Akzeptiert"}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              className="w-full h-10 bg-[#19A873] hover:bg-[#19A873]/75"
              onClick={handleSubmit}
            >
              {loading ? (
                <ClipLoader
                  aria-label="loader"
                  data-testid="loader"
                  color="white"
                  size={16}
                />
              ) : (
                <span className="text-sm">Abschicken</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalForm;
