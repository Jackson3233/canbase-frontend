"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Circle,
  LogOut,
  MinusCircle,
  MoreVertical,
  Pencil,
  Plus,
  Square,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { questionActions } from "@/store/reducers/questionReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  createQuestion,
  defaultQuestion,
  removeQuestion,
  updateQuestion,
} from "@/actions/question";
import { QuestionFormSchema } from "@/constant/formschema";
import { Switch } from "@/components/ui/switch";

const questionTypes = [
  { key: "short", value: "Kurze Antwort" },
  { key: "long", value: "Lange Antwort" },
  { key: "single", value: "Einfach Auswahl" },
  { key: "multiple", value: "Mehrfach Auswahl" },
  { key: "number", value: "Zahl/Wert" },
];

const ClubQuestionPage = () => {
  const dispatch = useAppDispatch();
  const { question } = useAppSelector((state) => state.question);

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [openDlg, setOpenDlg] = useState(false);
  const [isCheckbox, setIsCheckbox] = useState(false);
  const [checkboxs, setCheckboxs] = useState<any>([]);
  const [isRadioGroup, setIsRadioGroup] = useState(false);
  const [radios, setRadios] = useState<any>([]);
  const [update, setUpdate] = useState("");

  const form = useForm<z.infer<typeof QuestionFormSchema>>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      questiontitle: "",
      description: "",
      required: true,
      questiontype: "",
      placeholder: "",
    },
  });

  useEffect(() => {
    if (!openDlg) {
      form.reset({
        questiontitle: "",
        description: "",
        required: true,
        questiontype: "",
        placeholder: "",
      });

      setIsCheckbox(false);
      setCheckboxs([]);
      setIsRadioGroup(false);
      setRadios([]);
      setUpdate("");
    }
  }, [openDlg, form]);

  const handleRadioChange = (id: string, e: any) => {
    const newRadio = radios.map((radio: any) =>
      radio.id === id ? { ...radio, value: e.target.value } : radio
    );

    setRadios(newRadio);
  };

  const handleCheckboxChange = (id: string, e: any) => {
    const newCheckbox = checkboxs.map((checkbox: any) =>
      checkbox.id === id ? { ...checkbox, value: e.target.value } : checkbox
    );

    setCheckboxs(newCheckbox);
  };

  const handleDefaultQuestion = async (param: string) => {
    const result = await defaultQuestion({ questionID: param });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(questionActions.setQuestion({ question: result.question }));
    }
  };

  const handleUpdateQuestion = async (param: any) => {
    setOpenDlg(true);
    setUpdate(param._id);

    form.reset({
      questiontitle: param.questiontitle,
      description: param.description,
      required: param.required,
      questiontype: param.questiontype,
      placeholder: param.placeholder,
    });

    if (param.questiontype === "single") {
      setIsRadioGroup(true);
      setRadios(param.content);
    }
    if (param.questiontype === "multiple") {
      setIsCheckbox(true);
      setCheckboxs(param.content);
    }
  };

  const handleRemoveQuestion = async (param: string) => {
    const result = await removeQuestion({ questionID: param });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(questionActions.setQuestion({ question: result.question }));
    }
  };

  const onSubmit = async (data: z.infer<typeof QuestionFormSchema>) => {
    setLoading(true);

    let tempData: any = data;

    if (data.questiontype === "single") {
      tempData.content = JSON.stringify(radios);
    }
    if (data.questiontype === "multiple") {
      tempData.content = JSON.stringify(checkboxs);
    }

    let result;

    if (update === "") {
      result = await createQuestion(tempData);
    } else {
      result = await updateQuestion({ ...tempData, questionID: update });
    }

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(questionActions.setQuestion({ question: result.question }));

      setOpenDlg(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5 my-8">
      <Card className="w-full my-8">
        <CardContent className="p-0">
          <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
            <h1 className="text-2xl font-semibold tablet:text-xl">
              Clubfragen
            </h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Erstellt unterschiedliche Abschnitte und füge Elemente wie
              Checkboxen oder Auswahlfragen hinzu.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="px-10 py-5 border-b tablet:px-7 mobile:p-5">
              <p className="font-medium">Registrierungsdokumente*</p>
              <p className="text-content font-normal text-sm">
                Bitte lies folgende Dokumente und akzeptiere sie.
              </p>
            </div>
            {question.filter(
              (f) => f?.questiontitle === "Dein Monatlicher Bedarf?"
            )[0] && (
              <div className="flex justify-between space-x-2 px-10 py-5 border-b tablet:px-7 mobile:p-5">
                <div className="flex flex-col text-left">
                  <p className="font-medium">
                    {
                      question.filter(
                        (f) => f?.questiontitle === "Dein Monatlicher Bedarf?"
                      )[0]?.questiontitle
                    }
                  </p>
                  <p className="text-content font-normal text-sm">
                    {
                      question.filter(
                        (f) => f?.questiontitle === "Dein Monatlicher Bedarf?"
                      )[0].description
                    }
                  </p>
                </div>
                <Switch
                  checked={
                    question.filter(
                      (f) => f?.questiontitle === "Dein Monatlicher Bedarf?"
                    )[0].isShown
                  }
                  onCheckedChange={() =>
                    handleDefaultQuestion(
                      question.filter(
                        (f) => f?.questiontitle === "Dein Monatlicher Bedarf?"
                      )[0]._id
                    )
                  }
                />
              </div>
            )}
            <Accordion className="w-full" type="single" collapsible>
              {question.map((item, key) => (
                <>
                  {item?.questiontitle !== "Dein Monatlicher Bedarf?" && (
                    <div
                      className="flex justify-between space-x-2 px-10 py-5 border-b tablet:px-7 mobile:p-5"
                      key={key}
                    >
                      <AccordionItem className="w-full" value={`item-${key}`}>
                        <AccordionTrigger>
                          <div className="flex flex-col text-left">
                            <p>{item?.questiontitle}</p>
                            <p className="text-content font-normal text-sm">
                              {item?.description}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col space-y-3 p-3 border rounded-md">
                            <div>
                              <p>{item?.questiontitle}</p>
                              <p className="text-content font-normal text-sm">
                                {item?.description}
                              </p>
                            </div>
                            {item?.questiontype === "short" && (
                              <Input
                                className="max-w-md w-full"
                                type="text"
                                placeholder={item?.placeholder}
                              />
                            )}
                            {item?.questiontype === "long" && (
                              <Textarea
                                className="h-40 resize-none"
                                placeholder={item.placeholder}
                              />
                            )}
                            {item?.questiontype === "single" && (
                              <RadioGroup>
                                {item.content?.map((r, key) => (
                                  <div
                                    className="flex items-center space-x-2"
                                    key={key}
                                  >
                                    <RadioGroupItem id={r.id} value={r.id} />
                                    <Label className="text-sm" htmlFor={r.id}>
                                      {r.value}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            )}
                            {item?.questiontype === "multiple" && (
                              <div className="flex flex-col space-y-2">
                                {item.content?.map((c, key) => (
                                  <div
                                    className="flex items-center space-x-2"
                                    key={key}
                                  >
                                    <Checkbox
                                      className="flex justify-center items-center w-4 h-4"
                                      id={c.id}
                                    />
                                    <Label className="text-sm" htmlFor={c.id}>
                                      {c.value}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            )}
                            {item?.questiontype === "number" && (
                              <Input
                                className="max-w-md w-full"
                                type="number"
                                placeholder={item.placeholder}
                              />
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-56 text-sm"
                          align="end"
                        >
                          <DropdownMenuItem
                            onClick={() => handleUpdateQuestion(item)}
                          >
                            <div className="flex justify-between items-center">
                              <Pencil className="w-4 h-4 mr-2" />
                              Bearbeiten
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemoveQuestion(item._id)}
                          >
                            <div className="flex justify-between items-center text-destructive">
                              <LogOut className="w-4 h-4 mr-2" />
                              Löschen
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </>
              ))}
            </Accordion>
          </div>
          <div className="w-full px-10 py-5 tablet:px-7 mobile:px-5">
            <Button
              className="w-full h-10 flex items-center space-x-2 px-4"
              variant="outline"
              onClick={() => setOpenDlg(true)}
            >
              <Plus className="w-4 h-4" />
              <p className="text-sm">Frage hinzufügen</p>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={openDlg} onOpenChange={setOpenDlg}>
        <DialogContent className="max-w-5xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
          <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
            <h1 className="text-2xl font-semibold tablet:text-xl">
              Frage hinzufügen
            </h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Erstelle eine für das Anmeldeformular deiner potentiellen neuen
              Mitglieder
            </p>
          </div>
          <div className="max-h-[700px] flex flex-col p-10 overflow-y-auto tablet:p-7 mobile:p-5">
            <Form {...form}>
              <form
                className="w-full flex flex-col"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-6 mobile:space-y-3">
                  <ProfileInput
                    form={form.control}
                    id="questiontitle"
                    title="Titel der Frage*"
                    placeholder="Name*"
                  />
                  <ProfileInput
                    form={form.control}
                    type="textarea"
                    id="description"
                    title="Beschreibung*"
                    content="Eine kurze Beschreibung zu deiner Frage, damit Mitglieder besser verstehen, was du von ihnen wissen möchtest."
                    placeholder="Beschreibung*"
                  />
                  <ProfileInput
                    form={form.control}
                    type="switch"
                    id="required"
                    title="Pflichtfrage?*"
                    content="Ist die Frage für den Anwerber verpflichtend zu beantworten?"
                  />
                  <div className="w-full flex justify-between tablet:flex-col">
                    <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                      <p className="font-medium mobile:text-sm">Fragen Typ*</p>
                      <p className="text-sm text-content mobile:text-xs">
                        Wähle den Typ der Frage aus
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="questiontype"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Select
                            defaultValue={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);

                              if (e === "single") {
                                setIsRadioGroup(true);
                                setRadios([{ id: Date.now(), value: "" }]);
                                setIsCheckbox(false);
                                setCheckboxs([]);
                              } else if (e === "multiple") {
                                setIsCheckbox(true);
                                setCheckboxs([{ id: Date.now(), value: "" }]);
                                setIsRadioGroup(false);
                                setRadios([]);
                              } else {
                                setIsCheckbox(false);
                                setCheckboxs([]);
                                setIsRadioGroup(false);
                                setRadios([]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Fragen Typ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {questionTypes.map((item, key) => (
                                <SelectItem key={key} value={item.key}>
                                  {item.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isRadioGroup && (
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">
                          Konfiguriere deine Frage
                        </p>
                        <p className="text-sm text-content mobile:text-xs">
                          Konfiguriere deine Frage im Detail, damit du die
                          Antwort bekommst, die du brauchst.
                        </p>
                      </div>
                      <div className="w-full flex flex-col space-y-3">
                        {radios.length > 0 &&
                          radios.map((item: any, key: string) => {
                            return (
                              <div
                                className="flex items-center space-x-3"
                                key={key}
                              >
                                <Circle size={14} />
                                <Input
                                  className="max-w-md w-full"
                                  type="text"
                                  value={item.value}
                                  placeholder={`Frage ${key + 1}`}
                                  onChange={(e) =>
                                    handleRadioChange(item.id, e)
                                  }
                                />
                                {radios.length > 1 && (
                                  <MinusCircle
                                    className="text-custom cursor-pointer"
                                    size={16}
                                    onClick={() =>
                                      setRadios(
                                        radios.filter(
                                          (radio: any) => radio.id !== item.id
                                        )
                                      )
                                    }
                                  />
                                )}
                              </div>
                            );
                          })}
                        <p
                          className="w-fit text-custom text-sm cursor-pointer hover:text-customhover"
                          onClick={() =>
                            setRadios([
                              ...radios,
                              { id: Date.now(), value: "" },
                            ])
                          }
                        >
                          Füge eine weitere Auswahlmöglichkeit hinzu
                        </p>
                      </div>
                    </div>
                  )}
                  {isCheckbox && (
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">
                          Konfiguriere deine Frage
                        </p>
                        <p className="text-sm text-content mobile:text-xs">
                          Wähle den Typ der Frage aus
                        </p>
                      </div>
                      <div className="w-full flex flex-col space-y-3">
                        {checkboxs.length > 0 &&
                          checkboxs.map((item: any, key: string) => {
                            return (
                              <div
                                className="flex items-center space-x-3"
                                key={key}
                              >
                                <Square size={14} />
                                <Input
                                  className="max-w-md w-full"
                                  type="text"
                                  value={item.value}
                                  placeholder={`Frage ${key + 1}`}
                                  onChange={(e) =>
                                    handleCheckboxChange(item.id, e)
                                  }
                                />
                                {checkboxs.length > 1 && (
                                  <MinusCircle
                                    className="text-custom cursor-pointer"
                                    size={16}
                                    onClick={() =>
                                      setCheckboxs(
                                        checkboxs.filter(
                                          (checkbox: any) =>
                                            checkbox.id !== item.id
                                        )
                                      )
                                    }
                                  />
                                )}
                              </div>
                            );
                          })}
                        <p
                          className="w-fit text-custom text-sm cursor-pointer hover:text-customhover"
                          onClick={() =>
                            setCheckboxs([
                              ...checkboxs,
                              { id: Date.now(), value: "" },
                            ])
                          }
                        >
                          Füge eine weitere Auswahlmöglichkeit hinzu
                        </p>
                      </div>
                    </div>
                  )}
                  <ProfileInput
                    form={form.control}
                    id="placeholder"
                    title="Platzhalter"
                    placeholder="Tippe deine Antwort ein"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                  <Button
                    className="h-10 px-4 mobile:px-2"
                    type="button"
                    variant="outline"
                    onClick={() => setOpenDlg(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                    type="submit"
                  >
                    {loading ? (
                      <ClipLoader
                        aria-label="loader"
                        data-testid="loader"
                        color="white"
                        size={16}
                      />
                    ) : (
                      <span className="text-sm">Speichern</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClubQuestionPage;
