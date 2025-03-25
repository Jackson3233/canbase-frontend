"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { getCleanDate, isEmpty } from "@/lib/functions";
import { JoinClubFormPropsInterface } from "@/types/page";
import { Input } from "@/components/ui/input";

type QuestionType = { [key: string]: string } | { [key: string]: string[] };

const QuestionForm = ({ setActiveStep }: JoinClubFormPropsInterface) => {
  const { club } = useAppSelector((state) => state.club);
  const { question } = useAppSelector((state) => state.question);

  const [_, setQuestionInfo] = useLocalStorage("QuestionInfo", {});

  const [isStart, setIsStart] = useState(false);
  const [isDocument, setIsDocument] = useState(true);
  const [currentQA, setCurrentQA] = useState(0);
  const [formSchema, setFormSchema] = useState<any>();
  const [result, setResult] = useState<QuestionType[]>([]);

  const textForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [question.filter((f) => f.isShown).at(currentQA)?._id as string]: "",
    },
  });

  const arrayForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [question.filter((f) => f.isShown).at(currentQA)?._id as string]: [],
    },
  });

  useEffect(() => {
    const currentQuestion = question.filter((f) => f.isShown).at(currentQA);

    if (
      currentQuestion?.questiontype === "short" ||
      currentQuestion?.questiontype === "long" ||
      currentQuestion?.questiontype === "single"
    ) {
      !currentQuestion?.required
        ? setFormSchema(
            z.object({
              [currentQuestion?._id]: z.string().optional().or(z.literal("")),
            })
          )
        : setFormSchema(
            z.object({
              [currentQuestion?._id]: z
                .string()
                .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
            })
          );

      textForm.reset({ [currentQuestion?._id]: "" });
    }

    if (currentQuestion?.questiontype === "multiple") {
      !currentQuestion?.required
        ? setFormSchema(
            z.object({
              [currentQuestion?._id]: z.string().optional().or(z.literal("")),
            })
          )
        : setFormSchema(
            z.object({
              [currentQuestion?._id]: z
                .string()
                .array()
                .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
            })
          );

      arrayForm.reset({ [currentQuestion?._id]: [] });
    }

    if (currentQuestion?.questiontype === "number") {
      !currentQuestion?.required
        ? setFormSchema(
            z.object({
              [currentQuestion?._id]: z.coerce.number().optional(),
            })
          )
        : setFormSchema(
            z.object({
              [currentQuestion?._id]: z.coerce
                .number()
                .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
            })
          );

      textForm.reset({ [currentQuestion?._id]: "" });
    }
  }, [textForm, arrayForm, question, currentQA]);

  const handleDocument = () => {
    if (isEmpty(question.filter((f) => f.isShown))) {
      setActiveStep(4);
    } else {
      setIsDocument(false);
    }
  };

  const onSubmit = (data: any) => {
    setResult((prev) => [...prev, data]);

    setCurrentQA((prev) => prev + 1);

    if (currentQA === question.filter((f) => f.isShown).length - 1) {
      setActiveStep(4);

      setQuestionInfo([...result, data]);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      {!isStart ? (
        <Card className="max-w-xl w-full h-fit overflow-hidden rounded-3xl mx-2 laptop:max-w-lg">
          <CardContent className="flex flex-col space-y-8 px-10 py-8 tablet:space-y-4 mobile:px-5 mobile:py-4">
            <div className="flex flex-col space-y-4 tablet:space-y-2">
              <p className="text-content mobile:text-sm">
                Beantworte die Fragen um deinen Antrag zu vervollständigen
              </p>
              <h1 className="text-4xl	font-bold laptop:text-2xl tablet:text-xl">
                Club Fragen
              </h1>
            </div>
            <p className="text-content mobile:text-sm">
              Um deine Anfrage optimal bearbeiten zu können und dich noch besser
              kennenzulernen, hat sich der Club ein paar Fragen überlegt.
            </p>
            <div className="flex justify-between">
              <Button
                className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                onClick={() => setIsStart(true)}
              >
                Weiter
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isDocument ? (
        <Card className="max-w-xl w-full h-fit overflow-hidden rounded-3xl laptop:max-w-lg">
          <CardContent className="flex flex-col space-y-8 px-10 py-8 tablet:space-y-4 mobile:px-5 mobile:py-4">
            <h1 className="text-4xl	font-bold laptop:text-2xl tablet:text-xl">
              Registrierungsdokumente
            </h1>
            <p className="text-content mobile:text-sm">
              Bitte lies die folgenden Dokumente, indem du auf sie drauf klickst
              und akzeptiere sie.
            </p>
            <div className="flex flex-col space-y-4 tablet:space-y-2">
              {!isEmpty(
                club?.document?.filter((f) => f.isQuestion === true)
              ) ? (
                club?.document
                  ?.filter((f) => f.isQuestion === true)
                  .map((item, key) => (
                    <div
                      className="flex items-center space-x-8 tablet:space-x-4"
                      key={key}
                    >
                      <FileText className="w-8 h-8 text-content tablet:w-6 tablet:h-6" />
                      <div className="flex flex-col">
                        <Link
                          className="mobile:text-sm hover:text-customhover"
                          href={process.env.NEXT_PUBLIC_UPLOAD_URI + item.doc}
                          target="_blank"
                        >
                          {item.documentname}
                        </Link>
                        <p className="text-xs text-content">
                          Erstellt am {getCleanDate(item.date, 2)}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="mobile:text-sm">Kein Dokument</p>
              )}
            </div>
            <Button
              className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
              onClick={handleDocument}
            >
              Weiter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-xl w-full h-fit overflow-hidden rounded-3xl laptop:max-w-lg">
          <CardContent className="flex flex-col space-y-8 px-10 py-8 tablet:space-y-4 mobile:px-5 mobile:py-4">
            <h1 className="text-4xl	font-bold laptop:text-2xl tablet:text-xl">
              {question.filter((f) => f.isShown).at(currentQA)?.questiontitle}
            </h1>
            <p className="text-content mobile:text-sm">
              {question.filter((f) => f.isShown).at(currentQA)?.description}
            </p>
            {question.filter((f) => f.isShown).at(currentQA)?.questiontype ===
              "short" && (
              <Form {...textForm}>
                <form
                  className="w-full flex flex-col space-y-6 tablet:space-y-3"
                  onSubmit={textForm.handleSubmit(onSubmit)}
                >
                  <ProfileInput
                    form={textForm.control}
                    flag="other"
                    id={
                      question.filter((f) => f.isShown).at(currentQA)
                        ?._id as string
                    }
                    placeholder={
                      question.filter((f) => f.isShown).at(currentQA)
                        ?.placeholder
                    }
                  />
                  <div className="flex justify-between">
                    <Button
                      className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                      type="submit"
                    >
                      Weiter
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            {question.filter((f) => f.isShown).at(currentQA)?.questiontype ===
              "long" && (
              <Form {...textForm}>
                <form
                  className="w-full flex flex-col space-y-6 tablet:space-y-3"
                  onSubmit={textForm.handleSubmit(onSubmit)}
                >
                  <ProfileInput
                    form={textForm.control}
                    flag="other"
                    type="textarea"
                    id={
                      question.filter((f) => f.isShown).at(currentQA)
                        ?._id as string
                    }
                    placeholder={
                      question.filter((f) => f.isShown).at(currentQA)
                        ?.placeholder
                    }
                  />
                  <div className="flex justify-between">
                    <Button
                      className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                      type="submit"
                    >
                      Weiter
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            {question.filter((f) => f.isShown).at(currentQA)?.questiontype ===
              "single" && (
              <Form {...textForm}>
                <form
                  className="w-full flex flex-col space-y-6 tablet:space-y-3"
                  onSubmit={textForm.handleSubmit(onSubmit)}
                >
                  <ProfileInput
                    form={textForm.control}
                    flag="other"
                    type="radio"
                    id={
                      question.filter((f) => f.isShown).at(currentQA)
                        ?._id as string
                    }
                    radioValues={
                      question.filter((f) => f.isShown).at(currentQA)?.content
                    }
                  />
                  <div className="flex justify-between">
                    <Button
                      className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                      type="submit"
                    >
                      Weiter
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            {question.filter((f) => f.isShown).at(currentQA)?.questiontype ===
              "multiple" && (
              <Form {...arrayForm}>
                <form
                  className="w-full flex flex-col space-y-6 tablet:space-y-3"
                  onSubmit={arrayForm.handleSubmit(onSubmit)}
                >
                  <ProfileInput
                    form={arrayForm.control}
                    flag="other"
                    type="checkboxs"
                    id={
                      question.filter((f) => f.isShown).at(currentQA)
                        ?._id as string
                    }
                    checkboxValues={
                      question.filter((f) => f.isShown).at(currentQA)?.content
                    }
                  />
                  <div className="flex justify-between">
                    <Button
                      className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                      type="submit"
                    >
                      Weiter
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            {question.filter((f) => f.isShown).at(currentQA)?.questiontype ===
              "number" && (
              <Form {...textForm}>
                <form
                  className="w-full flex flex-col space-y-6 tablet:space-y-3"
                  onSubmit={textForm.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={textForm.control}
                    name={
                      question.filter((f) => f.isShown).at(currentQA)
                        ?._id as string
                    }
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="w-full flex flex-col space-y-6 tablet:space-y-3">
                        <div className="flex flex-col space-y-2">
                          <FormControl>
                            <Input
                              className="h-10"
                              type="number"
                              max={
                                question.filter((f) => f.isShown).at(currentQA)
                                  ?.questiontitle === "Dein Monatlicher Bedarf?"
                                  ? 50
                                  : undefined
                              }
                              onChange={onChange}
                              placeholder={
                                question.filter((f) => f.isShown).at(currentQA)
                                  ?.placeholder
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-left" />
                        </div>
                        {question.filter((f) => f.isShown).at(currentQA)
                          ?.questiontitle === "Dein Monatlicher Bedarf?" && (
                          <div className="flex flex-col space-y-4 tablet:space-y-2">
                            <p className="text-sm font-medium tablet:text-xs">
                              Dein Wöchentlicher Mitgliedsbeitrag:
                            </p>
                            <p className="text-4xl font-bold text-[#00C978] tablet:text-2xl mobile:text-xl">
                              ca. {(Number(value) * 10) / 4}€/pro Woche
                            </p>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full h-10 bg-[#19A873] text-sm hover:bg-[#19A873]/75"
                    type="submit"
                  >
                    {question.filter((f) => f.isShown).at(currentQA)
                      ?.questiontitle === "Dein Monatlicher Bedarf?"
                      ? "Nächste Frage"
                      : "Weiter"}
                  </Button>
                  {question.filter((f) => f.isShown).at(currentQA)
                    ?.questiontitle === "Dein Monatlicher Bedarf?" && (
                    <p className="text-xs text-content">
                      *bitte bedenke, das Mitglieder mit einer erhöhten
                      Abnahmemenge aufgrund des Vereinsaufbaus, aus
                      wirtschaftlichen Gründen, den Vorang vor
                      Beitrittsanfragen, mit einer geringeren Menge, erhalten.
                    </p>
                  )}
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionForm;
