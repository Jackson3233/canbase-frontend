"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQRCode } from "next-qrcode";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { Copy } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { userActions } from "@/store/reducers/userReducer";
import { forgotPass } from "@/actions/auth";
import { confirmPass, removeAccount, twoFARequest } from "@/actions/user";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PassFormSchema, TwoFAVerifyFormSchema } from "@/constant/formschema";
import { cn } from "@/lib/utils";

const MineAccountPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const router = useRouter();

  const { Canvas } = useQRCode();
  const { toast } = useToast();

  const [open, setOpen] = useState<boolean>(false);
  const [twoFAOpen, setTwoFAOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [qrCodeShow, setQRCodeShow] = useState(false);
  const [towFA, setTwoFA] = useState<boolean | undefined>(false);
  const [qrcode, setQRCode] = useState("");
  const [qrcodeToken, setQRCodeToken] = useState("");

  const twoFAPassForm = useForm<z.infer<typeof PassFormSchema>>({
    resolver: zodResolver(PassFormSchema),
    defaultValues: {
      password: "",
    },
  });
  const twoFAVerifyform = useForm<z.infer<typeof TwoFAVerifyFormSchema>>({
    resolver: zodResolver(TwoFAVerifyFormSchema),
    defaultValues: {
      otp_token: "",
    },
  });
  const removeAccountPassForm = useForm<z.infer<typeof PassFormSchema>>({
    resolver: zodResolver(PassFormSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    setTwoFA(user?.two_fa_status === "on");
  }, [user]);

  const handleLogOut = () => {
    localStorage.removeItem("token");

    router.replace("/login");
  };

  const handlePasswordChange = () => {
    localStorage.removeItem("token");

    forgotPass({ email: user?.email });

    router.replace("/changepass");
  };

  const handleClipboard = async (param: string) => {
    await navigator.clipboard.writeText(param);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: "Erfolgreich kopiert.",
    });
  };

  const onTwoFAPassSubmit = async (data: z.infer<typeof PassFormSchema>) => {
    setLoading(true);

    const result = await confirmPass(data);

    setLoading(false);

    if (result.success) {
      if (result.status) {
        setOpen((prev) => !prev);
        setTwoFAOpen((prev) => !prev);
        setQRCode(result.qrcode);
        setQRCodeToken(result.token);
      } else {
        dispatch(userActions.setUser({ user: result.user }));

        setOpen((prev) => !prev);

        toast({
          className:
            "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
          description: result.msg,
        });
      }
    } else {
      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });
    }
  };

  const onTwoFAVerifySubmit = async (
    data: z.infer<typeof TwoFAVerifyFormSchema>
  ) => {
    setTwoFALoading(true);

    const result = await twoFARequest(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setTwoFALoading(false);

    if (result.success) {
      dispatch(userActions.setUser({ user: result.user }));

      setTwoFAOpen((prev) => !prev);
    }
  };

  const onRemoveAccount = async (data: z.infer<typeof PassFormSchema>) => {
    setLoading(true);

    const result = await removeAccount(data);

    setLoading(false);

    if (result.success) {
      localStorage.removeItem("token");

      router.replace("/login");
    } else {
      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-3 my-8">
        <Card>
          <CardContent className="p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Authentifizierung
              </h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                Eingeloggt als {user?.email}
              </p>
            </div>
            <div className="px-10 py-5 border-b tablet:px-7 mobile:px-5">
              <Button
                className="h-10 self-start px-4 text-sm mobile:w-full"
                onClick={handleLogOut}
                variant="destructive"
              >
                Logout
              </Button>
            </div>
            <div className="px-10 py-5 border-b tablet:px-7 mobile:px-5">
              <p className="text-sm text-content mobile:text-xs">
                {`Aktiviere die Funktion "Überall ausloggen", wenn du befürchtest, dass dein Account unautorisiert verwendet wird. Dadurch wirst du auf allen Geräten abgemeldet. Es wird zudem empfohlen, dein Passwort zu aktualisieren.`}
              </p>
              <Button
                className="h-10 self-start px-4 text-sm mt-6 tablet:mt-3 mobile:w-full"
                variant="outline"
              >
                Überall ausloggen
              </Button>
            </div>
            <div className="px-10 py-5 border-b tablet:px-7 mobile:px-5">
              <p className="font-medium mobile:text-sm">Passwort ändern</p>
              <p className="text-sm text-content mt-2 mobile:text-xs">
                Um dein Passwort zu ändern, fordere einfach eine
                Passwort-Reset-E-Mail hier an. Du erhältst dann einen Link per
                E-Mail, um dein Passwort zurückzusetzen und ein neues zu wählen.
                Dies führt zu einer automatischen Abmeldung.
              </p>
              <Button
                className="h-10 self-start px-4 text-sm mt-6 tablet:mt-3 mobile:w-full"
                onClick={handlePasswordChange}
                variant="outline"
              >
                Passwort ändern
              </Button>
            </div>
            <div className="px-10 py-5 border-b tablet:px-7 mobile:px-5">
              <div className="flex items-center space-x-1">
                <p className="font-medium mobile:text-sm">
                  2-Faktor-Authentifizierung
                </p>
                {towFA && (
                  <p className="font-medium text-custom mobile:text-sm">{`(Aktiv)`}</p>
                )}
              </div>
              <div className="flex flex-col space-y-5">
                <p className="text-sm text-content mt-2 mobile:text-xs">
                  {`Die 2-Faktor-Authentifizierung (“2FA”) ist ein System der
                doppelten Authentifizierung. Die erste erfolgt mit Ihrem
                Passwort und die zweite mit einem Code, den Sie von einer
                speziellen mobilen App erhalten. Zu den beliebtesten gehören
                Authy, Google Authenticator oder Microsoft Authenticator.`}
                </p>
                <Button
                  className={cn(
                    "h-10 self-start px-4 text-sm mobile:w-full",
                    !towFA && "bg-custom hover:bg-customhover"
                  )}
                  onClick={() => setOpen((prev) => !prev)}
                  variant={!towFA ? "default" : "destructive"}
                >
                  {!towFA ? "2FA einrichten" : "2FA deaktivieren"}
                </Button>
              </div>
            </div>
          </CardContent>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl w-full flex flex-col gap-0 overflow-hidden rounded-3xl p-0">
              <div className="flex items-center p-8 pb-5 border-b mobile:pb-3">
                <Image
                  src="/assets/images/logo.svg"
                  width={38}
                  height={38}
                  alt="logo"
                />
                <h1 className="text-lg font-bold tablet:text-base">
                  Sicherheitskontrolle
                </h1>
              </div>
              <div className="flex flex-col space-y-3 p-8 mobile:p-5">
                <p className="text-sm mobile:text-xs">
                  Bitte geben Sie Ihr Passwort ein, um zu bestätigen, das Sie
                  Inhaber dieses Kontos sind.
                </p>
                <Form {...twoFAPassForm}>
                  <form
                    className="flex flex-col space-y-5 tablet:space-y-3"
                    onSubmit={twoFAPassForm.handleSubmit(onTwoFAPassSubmit)}
                  >
                    <ProfileInput
                      form={twoFAPassForm.control}
                      flag="other"
                      type="password"
                      id="password"
                      placeholder="Passwort"
                    />
                    <div className="self-end flex items-center space-x-3 mobile:self-auto mobile:justify-evenly">
                      <Button
                        className="h-10 px-4 mobile:px-2"
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        className="h-10 bg-custom px-4 hover:bg-customhover mobile:px-2"
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
                          <span className="text-sm">Passwort bestätigen</span>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={twoFAOpen} onOpenChange={setTwoFAOpen}>
            <DialogContent className="max-w-xl w-full flex flex-col gap-0 overflow-hidden rounded-3xl p-0">
              <div className="flex items-center p-5 mobile:p-3">
                <Image
                  src="/assets/images/logo.svg"
                  width={38}
                  height={38}
                  alt="logo"
                />
                <h1 className="text-lg font-bold tablet:text-base">
                  Aktivierung 2-Faktor-Authentifizierung
                </h1>
              </div>
              <div className="flex flex-col space-y-3 p-5 border-y mobile:p-3">
                <p className="text-sm font-semibold">
                  Authenticator App Einrichtung
                </p>
                <ul>
                  <li>
                    {`Installieren Sie eine Authenticator-App auf Ihrem mobilen Gerät Zu den beliebtesten gehören Authy, Google Authenticator oder der Microsoft Authenticator`}
                  </li>
                  <li>{`Suchen Sie nach einem “Konto hinzufügen”-Button`}</li>
                  <li>
                    {`Wenn Sie dazu aufgefordert werden, scannen Sie den unten stehenden Barcode`}
                  </li>
                </ul>
                <div className="flex flex-col space-y-3 justify-center items-center">
                  <Canvas
                    text={qrcode}
                    options={{
                      width: 200,
                      margin: 0,
                    }}
                  />
                  <p
                    className="text-sm text-custom cursor-pointer hover:text-customhover mobile:text-xs mobile:text-red-500"
                    onClick={() => setQRCodeShow((prev) => !prev)}
                  >
                    Scannen klappt nicht?
                  </p>
                  {qrCodeShow && (
                    <div className="relative w-full">
                      <p className="text-sm text-custom text-center mobile:text-xs">
                        {qrcodeToken}
                      </p>
                      <Badge
                        className="absolute top-0 right-0 w-fit h-fit flex items-center space-x-2 p-1 text-xs bg-custom leading-[8px] rounded-md cursor-pointer hover:bg-customhover"
                        onClick={() => handleClipboard(qrcodeToken)}
                      >
                        <Copy className="text-white" size={16} />
                        <p className="text-xs text-white whitespace-nowrap">
                          Kopieren
                        </p>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-5 mobile:p-3">
                <Form {...twoFAVerifyform}>
                  <form
                    className="flex flex-col space-y-5 tablet:space-y-3"
                    onSubmit={twoFAVerifyform.handleSubmit(onTwoFAVerifySubmit)}
                  >
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium mobile:text-xs">
                        Geben Sie unten Ihren 6-stelligen Code ein
                      </p>
                      <p className="text-xs">Überprüfungscode</p>
                      <ProfileInput
                        form={twoFAVerifyform.control}
                        flag="other"
                        id="otp_token"
                        placeholder="z.B. 123456"
                      />
                    </div>
                    <div className="self-end flex items-center space-x-3 mobile:self-auto mobile:justify-evenly">
                      <Button
                        className="h-10 px-4 mobile:px-2"
                        type="button"
                        variant="outline"
                        onClick={() => setTwoFAOpen(false)}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        className="h-10 bg-custom px-4 hover:bg-customhover mobile:px-2"
                        type="submit"
                      >
                        {twoFALoading ? (
                          <ClipLoader
                            aria-label="loader"
                            data-testid="loader"
                            color="white"
                            size={16}
                          />
                        ) : (
                          <span className="text-sm">Aktivieren</span>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
        <Card className="p-10 tablet:p-7 mobile:p-5">
          <CardContent className="flex flex-col p-0">
            <h1 className="text-2xl font-semibold tablet:text-xl">
              Account löschen
            </h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Durch das Löschen deines Accounts verlierst du den Zugang zu
              Canbase und müsstest dich für eine erneute Nutzung registrieren.
              Deine Mitgliedschaft im Club bleibt bestehen und kann vom Club
              weiterhin verwaltet werden, solange du Mitglied in diesem Club
              bist.
            </p>
            <Button
              className="h-10 self-start mt-5 px-4 mobile:w-full mobile:mt-3"
              variant="destructive"
              disabled={true}
              onClick={() => setAccountOpen(true)}
            >
              Account löschen
            </Button>
          </CardContent>
          <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
            <DialogContent className="max-w-xl w-full flex flex-col gap-0 overflow-hidden rounded-3xl p-0">
              <div className="flex items-center p-8 pb-5 border-b mobile:pb-3">
                <Image
                  src="/assets/images/logo.svg"
                  width={38}
                  height={38}
                  alt="logo"
                />
                <h1 className="text-lg font-bold tablet:text-base">
                  Account löschen
                </h1>
              </div>
              <div className="flex flex-col space-y-3 p-8 mobile:p-5">
                <p className="text-sm mobile:text-xs">
                  Bitte gib dein Passwort ein, um zu bestätigen, dass du der
                  Inhaber dieses Kontos bist.
                </p>
                <Form {...removeAccountPassForm}>
                  <form
                    className="flex flex-col space-y-5 tablet:space-y-3"
                    onSubmit={removeAccountPassForm.handleSubmit(
                      onRemoveAccount
                    )}
                  >
                    <ProfileInput
                      form={removeAccountPassForm.control}
                      flag="other"
                      type="password"
                      id="password"
                      placeholder="Passwort"
                    />
                    <div className="self-end flex items-center space-x-3 mobile:self-auto mobile:justify-evenly">
                      <Button
                        className="h-10 px-4 mobile:px-2"
                        type="button"
                        variant="outline"
                        onClick={() => setAccountOpen(false)}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        className="h-10 bg-custom px-4 hover:bg-customhover mobile:px-2"
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
                          <span className="text-sm">Account löschen</span>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
};

export default MineAccountPage;
