"use client";

import { useEffect, useRef, useState } from "react";
import { useQRCode } from "next-qrcode";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { AlertTriangle, File, FileCheck, Info } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { inviteMember } from "@/actions/member";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EmailInviteFormSchema } from "@/constant/formschema";

interface CSVRow {
  name: string;
  email: string;
}

const MemberInvitePage = () => {
  const { club } = useAppSelector((state) => state.club);

  const { Canvas } = useQRCode();

  const { toast } = useToast();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [loading, setLoading] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCSV, setOpenCSV] = useState(false);
  const [csvFile, setCSVFile] = useState<any>();
  const [isParsing, setIsParsing] = useState(false);
  const [csvError, setCSVError] = useState("");
  const [csvContent, setCSVContent] = useState<CSVRow[]>([]);
  const form = useForm<z.infer<typeof EmailInviteFormSchema>>({
    resolver: zodResolver(EmailInviteFormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.setAttribute("allowTransparency", "true");
    }
  }, []);

  useEffect(() => {
    if (!openCSV) {
      setCSVFile(undefined);
      setIsParsing(false);
      setCSVError("");
      setCSVContent([]);
    }
  }, [openCSV]);

  const handleClipboard = async (param: string) => {
    await navigator.clipboard.writeText(param);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: "Link in die Zwischenablage kopiert.",
    });
  };

  const handleCSV = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    setCSVFile(file);
    setIsParsing(true);
    setCSVError("");
    setCSVContent([]);

    Papa.parse(file, {
      complete: (result) => {
        setIsParsing(false);

        if (result.errors.length) {
          setCSVError(
            "Bitte geben Sie eine CSV-Datei im richtigen Format ein."
          );

          return;
        }

        const extractedData = result.data.map((row: any) => ({
          name: row["Name"],
          email: row["Email"],
        })) as CSVRow[];

        setCSVContent(extractedData);
      },
      error: (error) => {
        console.log(error);

        setIsParsing(false);
        setCSVError("Bitte geben Sie eine CSV-Datei im richtigen Format ein.");
      },
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
  };

  const handleInvite = async () => {
    setLoadingCSV(true);

    let emails: string[] = [];

    csvContent.map((item) => {
      item.email && emails.push(item.email);
    });

    const result = await inviteMember({ clubID: club?.clubID, email: emails });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoadingCSV(false);
    setOpenCSV(false);
  };

  const onSubmit = async (data: z.infer<typeof EmailInviteFormSchema>) => {
    setLoading(true);

    let emails: string[] = [];

    emails.push(data.email);

    const result = await inviteMember({ clubID: club?.clubID, email: emails });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);
  };

  const downloadQRCode = () => {
    const canva = document.getElementsByTagName("canvas")[0];

    canva.toBlob((blob: any) => {
      saveAs(blob, "qr-code.png");
    });
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <Card id="email-invite">
          <CardContent className="p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                E-Mail Einladung
              </h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                Neue Mitglieder einladen per E-Mail
              </p>
            </div>
            <Form {...form}>
              <form
                className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <ProfileInput
                  form={form.control}
                  id="email"
                  type="email"
                  title="E-Mail*"
                  placeholder="info@beispiel.de"
                />
                <div className="flex justify-end space-x-3 mt-6 tablet:mt-3 mobile:justify-evenly">
                  <Dialog open={openCSV} onOpenChange={setOpenCSV}>
                    <Button
                      className="h-10 px-4 mobile:px-2"
                      type="button"
                      variant="outline"
                      onClick={() => setOpenCSV(true)}
                    >
                      CSV importieren
                    </Button>
                    <DialogContent className="max-w-3xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
                      <h1 className="text-lg font-semibold px-10 mt-10 tablet:text-base tablet:px-7 tablet:mt-7 mobile:px-5 mobile:mt-5">
                        Mitglieder importieren
                      </h1>
                      <div className="max-h-[700px] overflow-y-auto px-10 py-5 tablet:px-7 mobile:py-5">
                        <div className="flex flex-col space-y-4">
                          <div className="p-4 border-l-4 border-blue-100 rounded-md bg-blue-50">
                            <div className="flex">
                              <Info className="shrink-0 size-5 text-blue-400" />
                              <div className="flex flex-col justify-center items-start space-y-2 ml-3">
                                <div className="text-sm font-medium text-blue-800">
                                  Hinweis
                                </div>
                                <div className="text-sm text-blue-700">
                                  <div className="mb-2">
                                    Wähle eine CSV Datei (Kommagetrennte Werte)
                                    mit E-Mail-Adressen aus, um Einladungen zu
                                    verschicken. Dies ist ein Beispiel einer CSV
                                    Datei:
                                  </div>
                                  <pre className="block w-full whitespace-break-spaces rounded-md border border-blue-500 p-4 text-xs">
                                    {`Name,Email\n`}
                                    {`Hanna,hanna@example.club\n`}
                                    {`Max,max@example.club`}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Dropzone
                            onDrop={(acceptedFiles) => handleCSV(acceptedFiles)}
                            accept={{
                              "text/csv": [],
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div className="flex flex-col space-y-2">
                                <div
                                  className="min-w-full	h-28 overflow-hidden rounded-lg bg-[#F8F8F8] cursor-pointer mobile:w-full"
                                  {...getRootProps()}
                                >
                                  <div className="w-full h-full flex flex-col justify-center items-center space-y-2 rounded-lg hover:border hover:border-content hover:border-dashed">
                                    {isParsing ? (
                                      <>
                                        <ClipLoader
                                          className="w-5 h-5 text-content"
                                          aria-label="loader"
                                          data-testid="loader"
                                        />
                                        <p className="word-break-all max-w-md text-xs text-content text-center transition-colors">
                                          Parsing CSV...
                                        </p>
                                      </>
                                    ) : !csvFile ? (
                                      <>
                                        <File className="w-5 h-5 text-content" />
                                        <p className="word-break-all max-w-md text-xs text-content text-center transition-colors">
                                          Erlaubte Dateitypen: .csv (maximal
                                          10MB)
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        <FileCheck className="w-5 h-5 text-content" />
                                        <p className="word-break-all max-w-md text-xs text-content text-center transition-colors">
                                          {csvFile?.name}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                  <Input
                                    {...getInputProps()}
                                    className="hidden"
                                    type="file"
                                    disabled={loading}
                                  />
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          {csvError ? (
                            <p className="text-xs text-destructive">
                              {csvError}
                            </p>
                          ) : (
                            csvFile && (
                              <div className="flex flex-col space-y-2">
                                <p className="text-xs text-content">
                                  Gefundene E-Mail Adressen ({csvContent.length}
                                  /100)
                                </p>
                                <div className="flex flex-col py-2 border-y">
                                  {csvContent.map(
                                    (item: CSVRow, key: number) => (
                                      <div
                                        className="space-x-2 text-sm mobile:text-xs"
                                        key={key}
                                      >
                                        <span>{item.name}</span>
                                        <span>{item.email}</span>
                                      </div>
                                    )
                                  )}
                                  {}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                        <div className="flex flex-row justify-end space-x-2 mt-8 mobile:justify-evenly mobile:mt-5">
                          <Button
                            className="h-10 px-4 text-sm mobile:px-2"
                            variant="outline"
                            onClick={() => setOpenCSV(false)}
                          >
                            Schließen
                          </Button>
                          {csvFile && (
                            <Button
                              className="h-10 space-x-1 px-4 text-sm mobile:px-2"
                              disabled={csvContent.length === 0}
                              onClick={handleInvite}
                            >
                              {loadingCSV ? (
                                <ClipLoader
                                  aria-label="loader"
                                  data-testid="loader"
                                  color="white"
                                  size={16}
                                />
                              ) : (
                                <>
                                  <span>{csvContent.length}</span>
                                  <span>Mitglieder einladen</span>
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="h-10 px-4 text-sm bg-custom mobile:px-2 hover:bg-customhover"
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
                      <span className="text-sm">Einladen</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card id="qrcode">
          <CardContent className="p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">QR-Code</h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                Mit diesem Code können sich Mitglieder deinem Club anschließen.
              </p>
            </div>
            <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
              <div className="flex justify-center items-center">
                <Canvas
                  text={
                    process.env.NEXT_PUBLIC_CLIENT_URI +
                    "joinclub?clubID=" +
                    club?.clubID
                  }
                  options={{
                    width: 200,
                    margin: 0,
                  }}
                />
              </div>
              <p className="text-2xl text-center font-semibold mt-2 tablet:text-xl mobile:text-lg">
                {club?.clubID}
              </p>
              <div className="flex justify-end space-x-3 mt-6 tablet:mt-3 mobile:justify-evenly">
                <Button
                  className="h-10 px-4 mobile:px-2"
                  variant="outline"
                  onClick={() =>
                    handleClipboard(
                      process.env.NEXT_PUBLIC_CLIENT_URI +
                        "joinclub?clubID=" +
                        club?.clubID
                    )
                  }
                >
                  Link kopieren
                </Button>
                <Button
                  className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                  onClick={downloadQRCode}
                >
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card id="embed-code">
          <CardContent className="p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Einbettungscode
              </h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                Integriere diesen Code auf deiner Club-Webseite, damit
                Interessierte sich direkt dort anmelden können.
              </p>
            </div>
            <div className="p-10 tablet:p-7 mobile:p-5">
              <div className="flex flex-col space-y-10 tablet:space-y-5">
                <div className="flex flex-col space-y-2">
                  <p className="tablet:text-sm">Vorschau</p>
                  <div className="py-3 border-2 rounded-lg">
                    <iframe
                      ref={iframeRef}
                      style={{
                        border: "none",
                        width: "100%",
                        height: "900px",
                        background: "none",
                      }}
                      src={
                        process.env.NEXT_PUBLIC_CLIENT_URI +
                        "joinclub?clubID=" +
                        club?.clubID
                      }
                      frameBorder="0"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="tablet:text-sm">
                    Füge diesen Code in deine Website ein:
                  </p>
                  <div className="flex justify-center items-center py-4 px-6 bg-[#FAFAFA] rounded-lg tablet:py-2 tablet:px-3">
                    <p className="text-content break-all tablet:text-sm">
                      {`<iframe
                      style="border:none;width:100%;height:800px;background:none;"
                      src=${
                        process.env.NEXT_PUBLIC_CLIENT_URI +
                        "joinclub?clubID=" +
                        club?.clubID
                      }
                      frameborder="0"
                      allowTransparency="true"
                    ></iframe>`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="tablet:text-sm">Hinweise zur Einbettung</p>
                  <p className="text-sm text-content tablet:text-xs">
                    {`Kopiere diesen Code und integriere ihn im <body> deiner Webseite. Bei Nutzung eines Baukastensystems, füge den Code in ein HTML-Widget ein. Das Formular sollte mindestens 900 Pixel hoch und 260 Pixel breit sein, um optimal dargestellt zu werden. Vergiss nicht, unsere Datenschutzvorlage in deine Datenschutzerklärung aufzunehmen. Brauchst du Unterstützung? Kontaktiere uns unter ${process.env.NEXT_PUBLIC_EMAIL_INFO}.`}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-16 laptop:flex-col laptop:space-x-0 laptop:space-y-3 tablet:mt-8">
                <Dialog open={open} onOpenChange={setOpen}>
                  <Button
                    className="h-10 px-4 laptop:w-full mobile:px-2"
                    variant="outline"
                    onClick={() => setOpen(true)}
                  >
                    Datenschutzvorlage
                  </Button>
                  <DialogContent className="max-w-3xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
                    <h1 className="text-lg font-semibold px-10 mt-10 tablet:text-base tablet:px-7 tablet:mt-7 mobile:px-5 mobile:mt-5">
                      Datenschutzklausel für die Mitgliederregistrierung
                    </h1>
                    <div className="max-h-[700px] overflow-y-auto px-10 py-5 tablet:px-7 mobile:py-5">
                      <div className="flex flex-col space-y-3">
                        <div className="p-4 rounded-md border-l-2 border-yellow-200 bg-yellow-50">
                          <div className="flex">
                            <AlertTriangle className="shrink-0 size-5 text-yellow-400" />
                            <div className="ml-3 flex flex-col items-start justify-center space-y-2">
                              <div className="text-sm font-medium text-yellow-800">
                                Haftungsausschluss
                              </div>
                              <div className="text-sm text-yellow-700">
                                <div className="text-sm text-yellow-700">
                                  Sehr geehrter Canbase Nutzer.
                                </div>
                                Im Sinne der Datenschutzgrundverordnung erfüllt
                                die folgende von Canbase bereitgestellte
                                Musterdatenschutzklausel zur Nutzung von
                                Online-Kontaktformularen dessen Anforderungen.
                                Wir bitten Sie unter Verwendung der
                                Musterdatenschutzklausel einen Rechtsbeistand
                                für das konkrete Vorhaben zu konsultieren da
                                Canbase keinerlei Haftung für die Richtigkeit,
                                Aktualität, und Vollständigkeit der
                                bereitgestellten Informationen übernehmen kann
                                und wird. Vielen Dank
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="text-sm text-content">
                            Muster Datenschutzklausel für eure Website:
                          </div>
                          <pre className="block w-full whitespace-break-spaces p-4 text-xs bg-[#FAFAFA] rounded-md">
                            {`Mit dem Kontaktformular unserer Website (Name ihrer Website) ist es möglich mit uns in Kontakt zu treten. Um einen Reibungslosen Ablauf gewährleisten zu können, erheben wir über das Kontaktformular jene Personenbezogenen Daten, welche in den jeweiligen Eingabemasken (E-Mailadresse, Name usw.) von den Kontaktsuchenden bereitgestellt werden.\n\n`}
                            {`Dabei werden die Personenbezogenen Daten welche vom Kontaktsuchenden über die Eingabemasken bereitgestellt und durch die Kontaktperson verarbeitet werden, ausschließlich im Rahmen des Kontaktbezugs (Ver-bearbeitung oder Beantwortung) verarbeitet.\n\n`}
                            {`Gemäß Art. 6 Abs. 1 lit. f DSGVO. Verfolgen wir ein entsprechend berechtigtes Interesse dem Kontaktsuchenden sein Gesuch zu beantworten. Sofern das Kontaktersuchen vor dem Hintergrund eines Vertragsabschlusses entsteht bedarf es der zusätzlichen Rechtsgrundlage des Art. 6 Abs. 1 lit. b DSGVO.\n\n`}
                            {`Die Löschung der Daten erfolgt nach vollständig erfolgter Bearbeitung. Anschließend werden die Daten unverzüglich gelöscht sofern keinerlei Notwendigkeit der Aufbewahrung gesetzlich ergibt. Eine vollständig erfolgte Bearbeitung kennzeichnet sich dadurch, dass sich konkludent anhand der Umstände eine Klärung des Sachverhalts entnehmen lässt.\n\n`}
                            {`Zudem haben sie im Rahmen ihrer Möglichkeiten und sofern kein wichtiger Grund hinsichtlich der Aufbewahrungspflichten entgegensteht, das Nutzerrecht zu jedem Zeitpunkt die Löschung Ihrer Daten zu verlangen\n\n`}
                          </pre>
                        </div>
                      </div>
                      <div className="flex flex-row justify-end space-x-2 mt-8 mobile:justify-evenly mobile:mt-5">
                        <Button
                          className="h-10 px-4 text-sm mobile:px-2"
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          className="h-10 px-4 text-sm mobile:px-2"
                          onClick={() =>
                            handleClipboard(
                              `Wir bieten auf unserer Website XYZ ein Kontaktformular an, mit dem Sie mit uns in Kontakt treten können. Im Rahmen der Nutzung des Online-Kontaktformulars werden die aus der Eingabemaske ersichtlichen personenbezogenen Daten erhoben (Name, E-Mail-Adresse).\n\n Die Verarbeitung der personenbezogenen Daten aus der Eingabemaske dient allein zur Beantwortung/Bearbeitung Ihres Anliegens. Zu anderen Zwecken verarbeiten wir die Daten nicht.\n\n Rechtsgrundlage für die Verarbeitung dieser Daten ist das berechtigte Interesse an der Beantwortung des Anliegens gemäß Art. 6 Abs. 1 lit. f DSGVO. Zielt der Kontakt auf den Abschluss eines Vertrages ab, so ist zusätzliche Rechtsgrundlage für die Verarbeitung Art. 6 Abs. 1 lit. b DSGVO.\n\n Nach abschließender Bearbeitung der Anfrage werden die Daten unverzüglich gelöscht. Die Bearbeitung ist abgeschlossen, wenn sich aus den Umständen entnehmen lässt, dass der betroffene Sachverhalt geklärt werden konnte und keine gesetzlichen Aufbewahrungspflichten greifen.\n\n Als Nutzer haben Sie jederzeit die Möglichkeit, die unverzügliche Löschung Ihrer Daten zu verlangen. In einem solchen Fall kann die Konversation jedoch nicht fortgeführt werden.`
                            )
                          }
                        >
                          Kopieren
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  className="h-10 px-4 laptop:w-full mobile:px-2"
                  variant="outline"
                  onClick={() =>
                    handleClipboard(
                      process.env.NEXT_PUBLIC_CLIENT_URI +
                        "joinclub?clubID=" +
                        club?.clubID +
                        "&clubname=" +
                        club?.clubname
                    )
                  }
                >
                  Link kopieren
                </Button>
                <Button
                  className="h-10 px-4 bg-custom laptop:w-full mobile:px-2 hover:bg-customhover"
                  onClick={() =>
                    handleClipboard(`<iframe
                style="border:none;width:100%;height:800px;background:none;"
                src=${
                  process.env.NEXT_PUBLIC_CLIENT_URI +
                  "joinclub?clubID=" +
                  club?.clubID +
                  "&clubname=" +
                  club?.clubname
                }
                frameborder="0"
                allowTransparency="true"
              ></iframe>`)
                  }
                >
                  Einbettcode kopieren
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberInvitePage;
