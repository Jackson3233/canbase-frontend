"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  ArrowUpDown,
  ChevronLeft,
  Download,
  File,
  Import,
  Plus,
} from "lucide-react";
import { TransactionTable } from "./transaction-table";
import { transactionColumns } from "./transaction-column";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { transactionsActions } from "@/store/reducers/transactionsReducer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ProfileInput from "@/components/basic/ProfileInput";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAutoTransaction,
  createTransaction,
} from "@/actions/transaction";
import {
  TransactionCreateForm,
  TransactionImportForm,
} from "@/constant/formschema";
import { importTypes } from "@/constant/importypes";
import { formatEuro, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";

const FinanceTransactionPage = () => {
  const dispatch = useAppDispatch();
  const {
    transactions,
    currentMonthTotalPositive,
    currentMonthTotalNegative,
    previousMonthTotalPositive,
    previousMonthTotalNegative,
  } = useAppSelector((state) => state.transactions);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();

  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statement, setStatement] = useState<any>();
  const [statementErr, setStatementErr] = useState("");

  const createForm = useForm<z.infer<typeof TransactionCreateForm>>({
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
  const importForm = useForm<z.infer<typeof TransactionImportForm>>({
    resolver: zodResolver(TransactionImportForm),
    defaultValues: {
      importtype: "",
    },
  });

  const handleBefore = () => {
    setIsEdit(false);
    setStatement(undefined);
    setStatementErr("");

    createForm.reset({
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
    });

    importForm.reset({ importtype: "" });
  };

  const handleManual = () => {
    setIsEdit(true);
    setIsCreate(true);
  };

  const handleAuto = () => {
    setIsEdit(true);
    setIsCreate(false);
  };

  const onCreateSubmit = async (
    data: z.infer<typeof TransactionCreateForm>
  ) => {
    setLoading(true);

    const result = await createTransaction(data);

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

      setIsEdit(false);

      createForm.reset({
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
      });
    }
  };

  const onImportSubmit = async (
    data: z.infer<typeof TransactionImportForm>
  ) => {
    if (statement === undefined) {
      setStatementErr("Dieses Feld muss ausgefüllt werden.");
    } else {
      setLoading(true);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        value !== undefined && formData.append(key, value as string);
      });

      formData.append("statement", statement);

      const result = await createAutoTransaction(formData);

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

        setIsEdit(false);
        setStatement(undefined);
        setStatementErr("");

        importForm.reset({ importtype: "" });
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {!isEdit ? (
          !isEmpty(transactions) ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={handleManual}
                disabled={
                  user?.role !== "owner" &&
                  !user?.functions?.includes(
                    "club-finance-transactions-manange"
                  )
                }
              >
                <Plus className="w-3 h-3" />
                <span className="text-xs">Neue Kontobewegung</span>
              </Button>
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={handleAuto}
                disabled={
                  user?.role !== "owner" &&
                  !user?.functions?.includes(
                    "club-finance-transactions-manange"
                  )
                }
              >
                <Import className="w-3 h-3" />
                <span className="text-xs">Kontoauszug importieren</span>
              </Button>
            </div>
          ) : (
            <Card className="p-10 tablet:p-7 mobile:p-5">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-6 h-6 tablet:w-4 tablet:h-4" />
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    Keine Kontobewegungen
                  </h1>
                </div>
                <p className="pt-2 text-sm text-content tablet:max-w-none mobile:text-xs">
                  {`Erstelle eine neue Kontobewegung, um sie hier anzuzeigen oder importiere sie aus einer CSV-Datei.`}
                </p>
                <div className="flex items-center space-x-3 mt-8 mobile:flex-col mobile:space-x-0 mobile:space-y-3">
                  <Button
                    className="h-10 flex items-center space-x-2 px-4 bg-custom mobile:w-full hover:bg-customhover"
                    onClick={handleManual}
                    disabled={
                      user?.role !== "owner" &&
                      !user?.functions?.includes(
                        "club-finance-transactions-manange"
                      )
                    }
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Neue Kontobewegung</span>
                  </Button>
                  <Button
                    className="h-10 flex items-center space-x-2 px-4 mobile:w-full"
                    variant="outline"
                    onClick={handleAuto}
                    disabled={
                      user?.role !== "owner" &&
                      !user?.functions?.includes(
                        "club-finance-transactions-manange"
                      )
                    }
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Kontoauszug importieren</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={handleBefore}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="text-xs">Zurück</span>
          </Button>
        )}
        {!isEdit ? (
          !isEmpty(transactions) && (
            <div className="flex flex-col space-y-6 tablet:space-y-3">
              <Card>
                <CardContent className="grid grid-cols-3 divide-x p-0 tablet:grid-cols-1 tablet:divide-x-0 tablet:divide-y">
                  <div className="flex p-7 tablet:justify-center tablet:p-5">
                    <div className="flex flex-col space-y-2 tablet:items-center">
                      <p className="text-sm font-semibold mobile:text-xs">
                        Einnahmen im aktuellen Monat
                      </p>
                      <div className="flex items-end space-x-2 tablet:flex-col tablet:space-x-0">
                        <h2 className="text-2xl text-[#00C978] font-semibold laptop:text-xl tablet:text-base">
                          {`${formatEuro(currentMonthTotalPositive)}`}
                        </h2>
                        <p className="text-sm text-content font-medium">
                          {`davor ${formatEuro(previousMonthTotalPositive)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex p-7 tablet:justify-center tablet:p-5">
                    <div className="flex flex-col space-y-2 tablet:items-center">
                      <p className="text-sm font-semibold mobile:text-xs">
                        Ausgaben im aktuellen Monat
                      </p>
                      <div className="flex items-end space-x-2 tablet:flex-col tablet:space-x-0">
                        <h2 className="text-2xl text-[#E83939] font-semibold laptop:text-xl tablet:text-base">
                          {`${formatEuro(Math.abs(currentMonthTotalNegative))}`}
                        </h2>
                        <p className="text-sm text-content font-medium">
                          {`davor ${formatEuro(
                            Math.abs(previousMonthTotalNegative)
                          )}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex p-7 tablet:justify-center tablet:p-5">
                    <div className="flex flex-col space-y-2 tablet:items-center">
                      <p className="text-sm font-semibold mobile:text-xs">
                        Gewinn / Verlust im aktuellen Monat
                      </p>
                      <h2
                        className={cn(
                          "text-2xl font-semibold laptop:text-xl tablet:text-base",
                          currentMonthTotalPositive +
                            currentMonthTotalNegative >=
                            0
                            ? "text-[#00C978]"
                            : "text-[#E83939]"
                        )}
                      >
                        {formatEuro(
                          currentMonthTotalPositive + currentMonthTotalNegative
                        )}
                      </h2>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <div className="p-10 tablet:p-7 mobile:p-5">
                    <h1 className="text-2xl font-semibold tablet:text-xl">
                      Alle Kontobewegungen
                    </h1>
                    <p className="text-xs text-content">
                      {transactions.length} Kontobewegung
                    </p>
                  </div>
                  <TransactionTable
                    columns={transactionColumns}
                    data={transactions as any}
                  />
                </CardContent>
              </Card>
            </div>
          )
        ) : isCreate ? (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  Kontobewegung erstellen
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Erstelle eine neue Kontobewegung für deinen Club.
                </p>
              </div>
              <Form {...createForm}>
                <form
                  className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
                  onSubmit={createForm.handleSubmit(onCreateSubmit)}
                >
                  <div className="space-y-6 mobile:space-y-3">
                    <ProfileInput
                      form={createForm.control}
                      id="recipient"
                      title="Name *"
                      content="Der Name der Empfänger:in oder des Unternehmens. Bei Einnahmen kann dies auch der Name des Mitglieds sein."
                      placeholder="Ventilator-Shop GmbH"
                    />
                    <ProfileInput
                      form={createForm.control}
                      type="textarea"
                      id="description"
                      title="Beschreibung"
                      content="Eine optionale Beschreibung der Transaktion."
                      placeholder="Miete, Strom, Einkauf etc."
                    />
                    <ProfileInput
                      form={createForm.control}
                      type="tagInput"
                      id="amount"
                      title="Betrag (Brutto) *"
                      content="Negative Beträge für Ausgaben, positive Beträge für Einnahmen."
                      tag="Euro (€)"
                      placeholder="-100,00"
                    />
                    <ProfileInput
                      form={createForm.control}
                      type="tagInput"
                      id="tax"
                      title="Steuer"
                      content="Die Steuer in Prozent."
                      tag="Prozent (%)"
                      placeholder="19"
                    />
                    <ProfileInput
                      form={createForm.control}
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
                      form={createForm.control}
                      type="textarea"
                      id="purpose "
                      title="Verwendungszweck"
                      content="Welcher Verwendungszweck steht auf der Rechnung oder Quittung?"
                      placeholder="Re-Nr.-XXXXXXXX"
                    />
                    <ProfileInput
                      form={createForm.control}
                      id="IBAN"
                      title="IBAN"
                      content="Die IBAN der Empfänger oder des Unternehmens."
                      placeholder="DE12 3456 7890 1234 5678 90"
                    />
                    <ProfileInput
                      form={createForm.control}
                      id="BIC"
                      title="BIC"
                      content="Die BIC des Bankinstituts der Empfänger oder des Unternehmens."
                      placeholder="BANKDEFFXXX"
                    />
                    <ProfileInput
                      form={createForm.control}
                      id="mandate"
                      title="Mandatsreferenz"
                      content="Die Mandatsreferenz für SEPA-Lastschriften."
                      placeholder="0000-12345678-123456"
                    />
                    <ProfileInput
                      form={createForm.control}
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
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  Kontoauszug importieren
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Importiere Kontoauszüge um Automatisch Kontobewegungen
                  hinzuzufügen.
                </p>
              </div>
              <Form {...importForm}>
                <form
                  className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
                  onSubmit={importForm.handleSubmit(onImportSubmit)}
                >
                  <div className="space-y-6 mobile:space-y-3">
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">
                          Bank / Import Typ *
                        </p>
                        <p className="text-sm text-content mobile:text-xs">
                          Wähle den Bank / Import Typ aus, um eine Datei zu
                          importieren.
                        </p>
                      </div>
                      <FormField
                        control={importForm.control}
                        name="importtype"
                        render={({ field: { value, onChange } }) => (
                          <FormItem className="w-full flex flex-col space-y-5 tablet:space-y-3">
                            <div>
                              <Select
                                defaultValue={value}
                                onValueChange={onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Wähle eine Bank aus" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="skatbank">
                                    Skatbank
                                  </SelectItem>
                                  <SelectItem value="sparkasse">
                                    Sparkasse (CAMT V2)
                                  </SelectItem>
                                  <SelectItem value="commerzbank">
                                    Commerzbank
                                  </SelectItem>
                                  <SelectItem value="glsbank">
                                    GLS Bank
                                  </SelectItem>
                                  <SelectItem value="mt-940">MT-940</SelectItem>
                                  <SelectItem value="other">Andere</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-left" />
                            </div>
                            {value && (
                              <div className="p-3 border rounded-md">
                                {
                                  importTypes.filter((f) => f.id === value)[0]
                                    ?.value
                                }
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full flex justify-between tablet:flex-col">
                      <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                        <p className="font-medium mobile:text-sm">
                          Kontoauszüge *
                        </p>
                        <p className="text-sm text-content mobile:text-xs">
                          Wähle die Kontoauszüge aus, die importiert werden
                          sollen.
                        </p>
                      </div>
                      <Dropzone
                        onDrop={(acceptedFiles) =>
                          setStatement(acceptedFiles[0])
                        }
                        accept={{
                          "application/pdf": [],
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div className="w-full flex flex-col space-y-2">
                            <div
                              className="h-56 overflow-hidden rounded-3xl bg-[#F8F8F8] cursor-pointer"
                              {...getRootProps()}
                            >
                              <div className="w-full h-full flex flex-col justify-center items-center space-y-2 rounded-3xl hover:border hover:border-content hover:border-dashed">
                                <File className="w-8 h-8 text-content" />
                                <p className="text-sm text-content text-center mobile:text-xs">
                                  Erlaubte Dateitypen: .sta .mt940 .940 .txt
                                  (Maximal 10MB) - Maximal 10 Dateien
                                </p>
                              </div>
                              <Input
                                className="hidden"
                                type="file"
                                {...getInputProps()}
                              />
                            </div>
                            {statement === undefined ? (
                              <p className="text-xs font-medium text-destructive">
                                {statementErr}
                              </p>
                            ) : (
                              <p className="text-xs font-medium">
                                Hochgeladene Datei: {statement?.name}
                              </p>
                            )}
                          </div>
                        )}
                      </Dropzone>
                    </div>
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

export default FinanceTransactionPage;
