"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { bankActions } from "@/store/reducers/bankReducer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { updateBank, updateBill, updateBook } from "@/actions/bank";
import {
  BankFormSchema,
  BillFormSchema,
  BookFormSchema,
} from "@/constant/formschema";

const FinanceSettingPage = () => {
  const dispatch = useAppDispatch();
  const { bank } = useAppSelector((state) => state.bank);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();

  const [bankLoading, setBankLoading] = useState(false);
  const [billLoading, setBillingLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);

  const bankForm = useForm<z.infer<typeof BankFormSchema>>({
    resolver: zodResolver(BankFormSchema),
    defaultValues: {
      recipient: "",
      IBAN: "",
      note_members: "",
      purpose: "",
      sepa_number: "",
      note_sepa_mandate: "",
    },
  });
  const billForm = useForm<z.infer<typeof BillFormSchema>>({
    resolver: zodResolver(BillFormSchema),
    defaultValues: {
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      prefix: "",
      suffix: "",
    },
  });
  const bookForm = useForm<z.infer<typeof BookFormSchema>>({
    resolver: zodResolver(BookFormSchema),
    defaultValues: {
      booking_day: undefined,
      overdue: undefined,
      auto_invoice: false,
    },
  });

  useEffect(() => {
    bankForm.reset({
      recipient: bank?.recipient ?? "",
      IBAN: bank?.IBAN ?? "",
      note_members: bank?.note_members ?? "",
      purpose: bank?.purpose ?? "",
      sepa_number: bank?.sepa_number ?? "",
      note_sepa_mandate: bank?.note_sepa_mandate ?? "",
    });
    billForm.reset({
      contact_person: bank?.contact_person ?? "",
      contact_email: bank?.contact_email ?? "",
      contact_phone: bank?.contact_phone ?? "",
      prefix: bank?.prefix ?? "",
      suffix: bank?.suffix ?? "",
    });
    bookForm.reset({
      booking_day: bank?.booking_day,
      overdue: bank?.overdue,
      auto_invoice: bank?.auto_invoice ?? false,
    });
  }, [bankForm, billForm, bookForm, bank]);

  const onBankSubmit = async (data: z.infer<typeof BankFormSchema>) => {
    setBankLoading(true);

    const result = await updateBank(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setBankLoading(false);

    if (result.success) {
      dispatch(bankActions.setBank({ bank: result.bank }));
    }
  };

  const onBillSubmit = async (data: z.infer<typeof BillFormSchema>) => {
    setBillingLoading(true);

    const result = await updateBill(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setBillingLoading(false);

    if (result.success) {
      dispatch(bankActions.setBank({ bank: result.bank }));
    }
  };

  const onBookSubmit = async (data: z.infer<typeof BookFormSchema>) => {
    setBookLoading(true);

    const result = await updateBook(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setBookLoading(false);

    if (result.success) {
      dispatch(bankActions.setBank({ bank: result.bank }));
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <Card className="w-full my-8">
        <CardContent className="flex flex-col p-0">
          <Accordion className="w-full" type="single" collapsible>
            <div className="px-10 py-5 border-b tablet:px-7 mobile:p-5">
              <AccordionItem className="w-full" value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-col text-left">
                    <p className="text-xl	font-medium mobile:text-lg">
                      Bankverbindung
                    </p>
                    <p className="text-sm text-content font-normal">
                      Hinterlege die Kontodaten des Clubs und alle nötigen
                      Informationen, damit Mitglieder wissen, wie sie ihre
                      Beiträge überweisen können.
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Form {...bankForm}>
                    <form
                      className="w-full flex flex-col mt-5  px-0.5 tablet:mt-3"
                      onSubmit={bankForm.handleSubmit(onBankSubmit)}
                    >
                      <div className="space-y-6 mobile:space-y-3">
                        <ProfileInput
                          form={bankForm.control}
                          id="recipient"
                          title="Empfängername *"
                          placeholder="Clubname"
                        />
                        <ProfileInput
                          form={bankForm.control}
                          id="IBAN"
                          title="IBAN *"
                          placeholder="IBAN"
                        />
                        <ProfileInput
                          form={bankForm.control}
                          type="textarea"
                          id="note_members"
                          title="Hinweis für Mitglieder"
                          content="Diese Informationen werden bei der Zahlung und in E-Mails angezeigt. Erkläre deinen Mitgliedern, wie sie ihre Beiträge überweisen sollen. Sollen sie zum Beispiel einen Dauerauftrag einrichten?"
                          placeholder="Hinweise für Mitglieder"
                        />
                        <ProfileInput
                          form={bankForm.control}
                          type="textarea"
                          id="purpose"
                          title="Verwendungszweck"
                          content="Sollen deine Mitglieder einen bestimmten Verwendungszweck angeben? Hier kannst du eine Beschreibung hinterlegen. Wenn du nichts angibst, wird die Referenznummer der entsprechenden Buchung angezeigt."
                          placeholder="Verwendungszweck"
                        />
                        <ProfileInput
                          form={bankForm.control}
                          id="sepa_number"
                          title="SEPA Gläubiger-Identifikationsnummer"
                          content="Die Gläubiger-Identifikationsnummer ist eine eindeutige Kennung, die von der Deutschen Bundesbank vergeben wird. Sie wird benötigt, um Lastschriften einziehen zu können."
                          placeholder="DE98ZZZ0999999999999"
                        />
                        <ProfileInput
                          form={bankForm.control}
                          type="textarea"
                          id="note_sepa_mandate"
                          title="Hinweise zum SEPA-Mandat"
                          content="Sollen deine Mitglieder einen bestimmten Verwendungszweck angeben? Hier kannst du eine Beschreibung hinterlegen. Wenn du nichts angibst, wird die Referenznummer der entsprechenden Buchung angezeigt."
                          placeholder="Hinweise für SEPA-Mandat"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                        <Button
                          className="h-10 px-4 mobile:px-2"
                          type="button"
                          variant="outline"
                          onClick={() => {
                            bankForm.reset({
                              recipient: bank?.recipient ?? "",
                              IBAN: bank?.IBAN ?? "",
                              note_members: bank?.note_members ?? "",
                              purpose: bank?.purpose ?? "",
                              sepa_number: bank?.sepa_number ?? "",
                              note_sepa_mandate: bank?.note_sepa_mandate ?? "",
                            });
                          }}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                          type="submit"
                          disabled={
                            user?.role !== "owner" &&
                            !user?.functions?.includes(
                              "club-finance-setting-manange"
                            )
                          }
                        >
                          {bankLoading ? (
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
                </AccordionContent>
              </AccordionItem>
            </div>
            <div className="px-10 py-5 border-b tablet:px-7 mobile:p-5">
              <AccordionItem className="w-full" value="item-2">
                <AccordionTrigger>
                  <div className="flex flex-col text-left">
                    <p className="text-xl	font-medium mobile:text-lg">
                      Rechnungsinformationen
                    </p>
                    <p className="text-sm text-content font-normal">
                      Hinterlege alle nötigen Informationen, damit Rechnungen
                      korrekt erstellt werden können.
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Form {...billForm}>
                    <form
                      className="w-full flex flex-col mt-5 px-0.5 tablet:mt-3"
                      onSubmit={billForm.handleSubmit(onBillSubmit)}
                    >
                      <div className="space-y-6 mobile:space-y-3">
                        <ProfileInput
                          form={billForm.control}
                          id="contact_person"
                          title="Kontakt - Ansprechpartner"
                          content="An welche Person sollen sich Mitg lieder wenden, wenn sie Fragen zur Rechnung haben? Wenn du keinen Namen angibst, wird der Name des Clubs verwendet."
                          placeholder="Kontakt - Ansprechpartner"
                        />
                        <ProfileInput
                          form={billForm.control}
                          id="contact_email"
                          title="Kontakt - E-Mail"
                          content="An welche E-Mail Adresse sollen Mitglieder schreiben, wenn sie Fragen zur Rechnung haben? Wenn du keine E-Mail Adresse angibst, wird die E-Mail Adresse des Clubs verwendet."
                          placeholder="Kontakt - E-Mail"
                        />
                        <ProfileInput
                          form={billForm.control}
                          id="contact_phone"
                          title="Kontakt - Telefon"
                          content="Unter welcher Telefonnummer können Mitglieder anrufen, wenn sie Fragen zur Rechnung haben? Wenn du keine Telefonnummer angibst, wird die Telefonnummer des Clubs verwendet."
                          placeholder="Kontakt - Telefon"
                        />
                        <ProfileInput
                          form={billForm.control}
                          id="prefix"
                          type="textarea"
                          title="Prefix Text"
                          content="Dieser Text wird vor den Beiträgen auf der Rechnung angezeigt. Du kannst hier z.B. eine kurze Erklärung schreiben, warum die Beiträge erhoben werden."
                          placeholder="Wir erlauben uns, dir folgende Beiträge für deine Mitgliedschaft in Rechnung zu stellen:"
                        />
                        <ProfileInput
                          form={billForm.control}
                          type="textarea"
                          id="suffix"
                          title="Suffix Text"
                          content="Dieser Text wird nach den Beiträgen auf der Rechnung angezeigt. Du kannst hier z.B. auf ein SEPA-Mandat hinweisen oder dich für die Mitgliedschaft bedanken."
                          placeholder={`Der Betrag wird in Kürze von deinem Konto abgebucht.\n\nVielen Dank für deine Mitgliedschaft bei Clubname`}
                        />
                      </div>
                      <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                        <Button
                          className="h-10 px-4 mobile:px-2"
                          type="button"
                          variant="outline"
                          onClick={() => {
                            billForm.reset({
                              contact_person: bank?.contact_person ?? "",
                              contact_email: bank?.contact_email ?? "",
                              contact_phone: bank?.contact_phone ?? "",
                              prefix: bank?.prefix ?? "",
                              suffix: bank?.suffix ?? "",
                            });
                          }}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                          type="submit"
                          disabled={
                            user?.role !== "owner" &&
                            !user?.functions?.includes(
                              "club-finance-setting-manange"
                            )
                          }
                        >
                          {billLoading ? (
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
                </AccordionContent>
              </AccordionItem>
            </div>
            <div className="px-10 py-5 border-b tablet:px-7 mobile:p-5">
              <AccordionItem className="w-full" value="item-3">
                <AccordionTrigger>
                  <div className="flex flex-col text-left">
                    <p className="text-xl	font-medium mobile:text-lg">
                      Buchungseinstellungen
                    </p>
                    <p className="text-sm text-content font-normal">
                      Hier kannst du spezifische Einstellungen für Buchungen
                      vornehmen. Wir empfehlen, die Einstellungen nur zu ändern,
                      wenn du genau weißt, was du tust und deine Mitglieder
                      darüber informiert hast.
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Form {...bookForm}>
                    <form
                      className="w-full flex flex-col mt-5 px-0.5 tablet:mt-3"
                      onSubmit={bookForm.handleSubmit(onBookSubmit)}
                    >
                      <div className="space-y-6 mobile:space-y-3">
                        <ProfileInput
                          form={bookForm.control}
                          type="number"
                          id="booking_day"
                          title="Buchungstag für monatliche Beiträge"
                          content="Du kannst den Buchungstag für monatliche Beiträge überschreiben. Wenn du nichts angibst, werden Beiträge automatisch am 1. des Monats erstellt. Diese Einstellung ist nur für monatliche Beiträge relevant."
                          minValue={0}
                          placeholder="Tag des Monats"
                        />
                        <ProfileInput
                          form={bookForm.control}
                          id="overdue"
                          type="number"
                          title="Automatisch als überfällig markieren"
                          content="Nach wie vielen Tagen soll eine offene Buchung automatisch als überfällig markiert werden? Wenn du nichts angibst, werden Buchungen nicht automatisch als überfällig markiert."
                          minValue={0}
                          placeholder="Tage"
                        />
                        <ProfileInput
                          form={bookForm.control}
                          type="checkbox"
                          id="auto_invoice"
                          title="Rechnungen automatisch erstellen"
                          content="Wenn du diese Option aktivierst, wird für jede neue Buchung automatisch eine Rechnung erstellt."
                          checkboxLabel="Rechnung automatisch erstellen"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                        <Button
                          className="h-10 px-4 mobile:px-2"
                          type="button"
                          variant="outline"
                          onClick={() => {
                            bookForm.reset({
                              booking_day: bank?.booking_day,
                              overdue: bank?.overdue,
                              auto_invoice: bank?.auto_invoice ?? false,
                            });
                          }}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                          type="submit"
                          disabled={
                            user?.role !== "owner" &&
                            !user?.functions?.includes(
                              "club-finance-setting-manange"
                            )
                          }
                        >
                          {bookLoading ? (
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
                </AccordionContent>
              </AccordionItem>
            </div>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceSettingPage;
