"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronLeft,
  FileText,
  LogOut,
  MoreVertical,
  Pencil,
  UserRound,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { transactionsActions } from "@/store/reducers/transactionsReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import TextGroup from "@/components/basic/TextGroup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getTransaction,
  removeAttachments,
  updateTransaction,
  uploadAttachments,
} from "@/actions/transaction";
import { TransactionCreateForm } from "@/constant/formschema";
import {
  formatEuro,
  getCleanDate,
  getTimeDifferenceInGerman,
  isEmpty,
} from "@/lib/functions";

const TransactionInfoPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [transaction, setTransaction] = useState<any>();
  const [open, setOpen] = useState(false);
  const [document, setDocument] = useState<any>();
  const [documentErr, setDocumentErr] = useState("");

  const form = useForm<z.infer<typeof TransactionCreateForm>>({
    resolver: zodResolver(TransactionCreateForm),
    defaultValues: {
      recipient: "",
      description: "",
      amount: 0,
      tax: undefined,
      method: "",
      purpose: "",
      IBAN: "",
      BIC: "",
      mandate: "",
      note: "",
    },
  });

  useEffect(() => {
    (async () => {
      const result = await getTransaction({ transactionID: params.id });

      if (result.success) {
        setTransaction(result.transaction);

        form.reset({
          recipient: result.transaction?.recipient,
          description: result.transaction?.description,
          amount: result.transaction?.amount,
          tax: result.transaction?.tax,
          method: result.transaction?.method,
          purpose: result.transaction?.purpose,
          IBAN: result.transaction?.IBAN,
          BIC: result.transaction?.BIC,
          mandate: result.transaction?.mandate,
          note: result.transaction?.note,
        });
      }
    })();
  }, [form, params.id]);

  useEffect(() => {
    if (!open) {
      setDocument(undefined);
      setDocumentErr("");
    }
  }, [open]);

  const handleBefore = () => {
    if (isEdit) {
      setIsEdit((prev) => !prev);
      setDocument(undefined);
      setDocumentErr("");

      form.reset({
        recipient: transaction?.recipient,
        description: transaction?.description,
        amount: transaction?.amount,
        tax: transaction?.tax,
        method: transaction?.method,
        purpose: transaction?.purpose,
        IBAN: transaction?.IBAN,
        BIC: transaction?.BIC,
        mandate: transaction?.mandate,
        note: transaction?.note,
      });
    } else {
      router.push("/club/finance?tab=transaction");
    }
  };

  const handleUploadAttachment = async () => {
    if (document === undefined) {
      setDocumentErr("Dieses Feld muss ausgefüllt werden.");
    } else {
      setFileLoading(true);

      const formData = new FormData();

      formData.append("transactionID", params.id);
      formData.append("doc", document);

      const result = await uploadAttachments(formData);

      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });

      setFileLoading(false);

      if (result.success) {
        dispatch(
          transactionsActions.setTransactions({
            transactions: result.transactions.transactions,
            currentMonthTotalPositive:
              result.transactions.currentMonthTotalPositive,
            currentMonthTotalNegative:
              result.transactions.currentMonthTotalNegative,
            previousMonthTotalPositive:
              result.transactions.previousMonthTotalPositive,
            previousMonthTotalNegative:
              result.transactions.previousMonthTotalNegative,
          })
        );
        setTransaction(result.transaction);

        setOpen(false);
        setDocument(undefined);
        setDocumentErr("");
      }
    }
  };

  const handleDeleteAttachment = async (param: any) => {
    const result = await removeAttachments({
      transactionID: params.id,
      attachment: param,
    });

    if (result.success) {
      dispatch(
        transactionsActions.setTransactions({
          transactions: result.transactions.transactions,
          currentMonthTotalPositive:
            result.transactions.currentMonthTotalPositive,
          currentMonthTotalNegative:
            result.transactions.currentMonthTotalNegative,
          previousMonthTotalPositive:
            result.transactions.previousMonthTotalPositive,
          previousMonthTotalNegative:
            result.transactions.previousMonthTotalNegative,
        })
      );
      setTransaction(result.transaction);
    }
  };

  const onSubmit = async (data: z.infer<typeof TransactionCreateForm>) => {
    setLoading(true);

    const result = await updateTransaction({
      ...data,
      transactionID: params.id,
    });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(
        transactionsActions.setTransactions({
          transactions: result.transactions.transactions,
          currentMonthTotalPositive:
            result.transactions.currentMonthTotalPositive,
          currentMonthTotalNegative:
            result.transactions.currentMonthTotalNegative,
          previousMonthTotalPositive:
            result.transactions.previousMonthTotalPositive,
          previousMonthTotalNegative:
            result.transactions.previousMonthTotalNegative,
        })
      );
      setTransaction(result.transaction);

      setIsEdit((prev) => !prev);

      form.reset({
        recipient: result.transaction?.recipient,
        description: result.transaction?.description,
        amount: result.transaction?.amount,
        tax: result.transaction?.tax,
        method: result.transaction?.method,
        purpose: result.transaction?.purpose,
        IBAN: result.transaction?.IBAN,
        BIC: result.transaction?.BIC,
        mandate: result.transaction?.mandate,
        note: result.transaction?.note,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <div className="flex items-center space-x-2">
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={handleBefore}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="text-xs">
              {!isEdit ? "Alle Kontobewegungen" : "Zurück"}
            </span>
          </Button>
          {!isEdit && (
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
              disabled={
                user?.role !== "owner" &&
                !user?.functions?.includes("club-finance-transactions-manange")
              }
            >
              <Pencil className="w-3 h-3" />
              <span className="text-xs">Bearbeiten</span>
            </Button>
          )}
        </div>
        {!isEdit ? (
          <div className="flex flex-col space-y-6 tablet:space-y-3">
            <Card>
              <CardContent className="grid grid-cols-3 divide-x p-0 tablet:grid-cols-1 tablet:divide-x-0 tablet:divide-y">
                <div className="flex p-7 tablet:justify-center tablet:p-5">
                  <div className="flex flex-col space-y-2 tablet:items-center">
                    <p className="text-sm font-semibold mobile:text-xs">
                      Person / Organisatuon
                    </p>
                    <h2 className="text-2xl font-semibold laptop:text-xl tablet:text-base">
                      {transaction?.recipient}
                    </h2>
                  </div>
                </div>
                <div className="flex p-7 tablet:justify-center tablet:p-5">
                  <div className="flex flex-col space-y-2 tablet:items-center">
                    <p className="text-sm font-semibold mobile:text-xs">
                      Gesamtbetrag
                    </p>
                    <h2 className="text-2xl font-semibold laptop:text-xl tablet:text-base">
                      {transaction?.amount >= 0 ? (
                        <span className="text-[#00C978]">
                          {formatEuro(transaction?.amount)}
                        </span>
                      ) : (
                        <span className="text-[#EF4444]">
                          {formatEuro(transaction?.amount)}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>
                <div className="flex p-7 tablet:justify-center tablet:p-5">
                  <div className="flex flex-col space-y-2 tablet:items-center">
                    <p className="text-sm font-semibold mobile:text-xs">
                      Zahlungsmethode
                    </p>
                    <h2 className="text-2xl font-semibold laptop:text-xl tablet:text-base">
                      {transaction?.method === "cash" && <>Bar</>}
                      {transaction?.method === "instant" && (
                        <>Sofortüberweisung</>
                      )}
                      {transaction?.method === "card" && <>Karte</>}
                      {transaction?.method === "paypal" && <>PayPal</>}
                      {transaction?.method === "credit" && <>Guthaben</>}
                      {transaction?.method === "harvest" && <>Ernte</>}
                      {transaction?.method === "transfer" && <>Überweisung</>}
                      {transaction?.method === "other" && <>Sonstiges</>}
                    </h2>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <p className="p-7 font-medium border-b table:p-5 tablet:text-sm">
                  Details
                </p>
                <div className="flex flex-col px-7 tablet:px-5">
                  <TextGroup
                    title="Person / Organisation"
                    value={
                      isEmpty(transaction?.recipient)
                        ? "-"
                        : transaction.recipient
                    }
                  />
                  <TextGroup
                    title="Beschreibung"
                    value={
                      isEmpty(transaction?.description)
                        ? "-"
                        : transaction.description
                    }
                  />
                  <TextGroup
                    title="Betrag"
                    value={
                      isEmpty(transaction?.amount)
                        ? "-"
                        : formatEuro(transaction.amount)
                    }
                  />
                  <TextGroup
                    title="Zahlungsmethode"
                    value={
                      isEmpty(transaction?.method)
                        ? "-"
                        : transaction.method === "cash"
                        ? "Bar"
                        : transaction.method === "instant"
                        ? "Sofortüberweisung"
                        : transaction.method === "card"
                        ? "Karte"
                        : transaction.method === "paypal"
                        ? "PayPal"
                        : transaction.method === "credit"
                        ? "Guthaben"
                        : transaction.method === "harvest"
                        ? "Ernte"
                        : transaction.method === "transfer"
                        ? "Überweisung"
                        : "Sonstiges"
                    }
                  />
                  <TextGroup
                    title="Verwendungszweck"
                    value={
                      isEmpty(transaction?.purpose) ? "-" : transaction.purpose
                    }
                  />
                  <TextGroup
                    title="IBAN"
                    value={isEmpty(transaction?.IBAN) ? "-" : transaction.IBAN}
                  />
                  <TextGroup
                    title="BIC"
                    value={isEmpty(transaction?.BIN) ? "-" : transaction.BIN}
                  />
                  <TextGroup
                    title="SEPA-Mandatsreferenz"
                    value={
                      isEmpty(transaction?.mandate) ? "-" : transaction.mandate
                    }
                  />
                  <TextGroup
                    title="Erstellt am"
                    value={
                      isEmpty(transaction?.createdAt)
                        ? "-"
                        : getCleanDate(transaction.createdAt, 2)
                    }
                  />
                  <TextGroup
                    type="last"
                    title="Notizen"
                    value={isEmpty(transaction?.note) ? "-" : transaction.note}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <p className="p-7 font-medium border-b table:p-5 tablet:text-sm">
                  Anhänge
                </p>
                <div className="flex flex-col">
                  <div className="w-full flex flex-col">
                    {isEmpty(transaction?.attachments) ? (
                      <p className="p-7 table:p-5 text-sm">
                        Es wurden noch keine Dateien hinzugefügt.
                      </p>
                    ) : (
                      transaction.attachments?.map(
                        (attachment: string, key: string) => (
                          <div
                            className="flex justify-between items-center px-7 py-5 border-b tablet:px-5 tablet:py-3"
                            key={key}
                          >
                            <Link
                              className="tablet:text-sm hover:text-customhover"
                              href={
                                process.env.NEXT_PUBLIC_UPLOAD_URI + attachment
                              }
                              target="_blank"
                            >
                              {attachment
                                ?.split("/")
                                .pop()
                                ?.replace(/^[a-f0-9-]+-/, "")}
                            </Link>
                            <DropdownMenu key={key}>
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
                                  onClick={() =>
                                    handleDeleteAttachment(attachment)
                                  }
                                >
                                  <div className="flex justify-between items-center text-destructive">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Löschen
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )
                      )
                    )}
                  </div>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <Button
                      className="h-10 self-end px-4 m-7 text-sm bg-custom tablet:m-5 mobile:w-full hover:bg-customhover"
                      onClick={() => setOpen(true)}
                      disabled={
                        user?.role !== "owner" &&
                        !user?.functions?.includes(
                          "club-finance-transactions-manange"
                        )
                      }
                    >
                      Anhang hinzufügen
                    </Button>
                    <DialogContent className="max-w-xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
                      <h1 className="text-sm font-semibold p-7 tablet:p-5">
                        Anhang hinzufügen
                      </h1>
                      <div className="flex flex-col p-7 border-y tablet:p-5">
                        <Dropzone
                          onDrop={(acceptedFiles) =>
                            setDocument(acceptedFiles[0])
                          }
                          accept={{
                            "application/pdf": [],
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="w-full flex flex-col space-y-2">
                              <div
                                className="h-56 overflow-hidden rounded-3xl bg-[#F8F8F8] cursor-pointer mobile:w-full"
                                {...getRootProps()}
                              >
                                <div className="w-full h-full flex flex-col justify-center items-center space-y-2 rounded-3xl hover:border hover:border-content hover:border-dashed">
                                  <FileText className="w-8 h-8 text-content" />
                                  <p className="text-sm text-content text-center mobile:text-xs">
                                    .pdf
                                  </p>
                                </div>
                                <Input
                                  className="hidden"
                                  type="file"
                                  {...getInputProps()}
                                />
                              </div>
                              {document === undefined ? (
                                <p className="text-xs font-medium text-destructive">
                                  {documentErr}
                                </p>
                              ) : (
                                <p className="text-xs font-medium">
                                  Hochgeladene Datei: {document?.name}
                                </p>
                              )}
                            </div>
                          )}
                        </Dropzone>
                      </div>
                      <div className="flex justify-end space-x-3 p-7 tablet:p-5 mobile:justify-evenly">
                        <Button
                          className="h-10 px-4 mobile:px-2"
                          type="button"
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                          onClick={handleUploadAttachment}
                        >
                          {fileLoading ? (
                            <ClipLoader
                              aria-label="loader"
                              data-testid="loader"
                              color="white"
                              size={16}
                            />
                          ) : (
                            <span className="text-sm">Datei hinzufügen</span>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <p className="p-7 font-medium border-b table:p-5 tablet:text-sm">
                  Historie
                </p>
                <div className="p-7 tablet:p-5">
                  {transaction?.history.map((item: any, key: number) => (
                    <div className="flex" key={key}>
                      <div className="flex flex-col">
                        <div className="min-w-8 min-h-8 flex justify-center items-center rounded-full bg-[#EFEFEF]">
                          <UserRound className="w-4 h-4" color="white" />
                        </div>
                        <div className="w-0.5 min-h-5 h-full self-center bg-[#EFEFEF]"></div>
                      </div>
                      <div className="w-full flex justify-between gap-2 mt-2 ml-4 tablet:flex-col tablet:justify-start mobile:ml-2 mobile:mt-0">
                        <p className="text-sm">{item.content}</p>
                        <p className="text-xs text-content">
                          {item.date && getTimeDifferenceInGerman(item.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  {transaction?.recipient} bearbeiten
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Erstelle eine neue Kontobewegung für deinen Club.
                </p>
              </div>
              <Form {...form}>
                <form
                  className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="space-y-6 mobile:space-y-3">
                    <ProfileInput
                      form={form.control}
                      id="recipient"
                      title="Name *"
                      content="Der Name der Empfänger:in oder des Unternehmens. Bei Einnahmen kann dies auch der Name des Mitglieds sein."
                      placeholder="Ventilator-Shop GmbH"
                    />
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="description"
                      title="Beschreibung"
                      content="Eine optionale Beschreibung der Transaktion."
                      placeholder="Miete, Strom, Einkauf etc."
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="amount"
                      title="Betrag (Brutto) *"
                      content="Negative Beträge für Ausgaben, positive Beträge für Einnahmen."
                      tag="Euro (€)"
                      placeholder="-100,00"
                    />
                    <ProfileInput
                      form={form.control}
                      type="tagInput"
                      id="tax"
                      title="Steuer"
                      content="Die Steuer in Prozent."
                      tag="Prozent (%)"
                      placeholder="19"
                    />
                    <ProfileInput
                      form={form.control}
                      type="selectbox"
                      id="method"
                      title="Zahlungsmethode *"
                      content="Wähle die Zahlungsmethode, die für diese Transaktion verwendet wurde."
                      placeholder="Wähle die Zahlungsmethode aus"
                      selectValues={[
                        { key: "cash", value: "Bar" },
                        { key: "instant", value: "Sofortüberweisung" },
                        { key: "card", value: "Karte" },
                        { key: "paypal", value: "PayPal" },
                        { key: "credit", value: "Guthaben" },
                        { key: "harvest", value: "Ernte" },
                        { key: "transfer", value: "Überweisung" },
                        { key: "other", value: "Sonstiges" },
                      ]}
                    />
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="purpose "
                      title="Verwendungszweck"
                      content="Welcher Verwendungszweck steht auf der Rechnung oder Quittung?"
                      placeholder="Re-Nr.-XXXXXXXX"
                    />
                    <ProfileInput
                      form={form.control}
                      id="IBAN"
                      title="IBAN"
                      content="Die IBAN der Empfänger oder des Unternehmens."
                      placeholder="DE12 3456 7890 1234 5678 90"
                    />
                    <ProfileInput
                      form={form.control}
                      id="BIC"
                      title="BIC"
                      content="Die BIC des Bankinstituts der Empfänger oder des Unternehmens."
                      placeholder="BANKDEFFXXX"
                    />
                    <ProfileInput
                      form={form.control}
                      id="mandate"
                      title="Mandatsreferenz"
                      content="Die Mandatsreferenz für SEPA-Lastschriften."
                      placeholder="0000-12345678-123456"
                    />
                    <ProfileInput
                      form={form.control}
                      type="textarea"
                      id="note "
                      title="Notizen"
                      content="Ein optionales Feld für zusätzliche Anmerkungen oder Besonderheiten der Zone."
                      placeholder="Notiz "
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                    <Button
                      className="h-10 px-4 mobile:px-2"
                      type="button"
                      variant="outline"
                      onClick={handleBefore}
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransactionInfoPage;
