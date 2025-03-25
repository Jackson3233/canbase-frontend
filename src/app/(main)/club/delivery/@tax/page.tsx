"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Check,
  ChevronLeft,
  ChevronsUpDown,
  CircleCheck,
  CircleX,
  FileText,
  Plus,
  QrCode,
  ShoppingCart,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import TextGroup from "@/components/basic/TextGroup";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DeclineReserveFormSchema,
  TaxReserveFormSchema,
} from "@/constant/formschema";
import { getAvatarLetters, getCleanDate } from "@/lib/functions";
import { cn } from "@/lib/utils";

const DeliveryTaxPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { storages } = useAppSelector((state) => state.storages);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [openReserveDlg, setOpenReserveDlg] = useState(false);
  const [openCancelReserveDlg, setOpenCancelReserveDlg] = useState(false);
  const [openDeclineReserveDlg, setOpenDeclineReserveDlg] = useState(false);

  const reserveForm = useForm<z.infer<typeof TaxReserveFormSchema>>({
    resolver: zodResolver(TaxReserveFormSchema),
    defaultValues: {
      storage: "",
      pickup_date: new Date(),
    },
  });
  const declineForm = useForm<z.infer<typeof DeclineReserveFormSchema>>({
    resolver: zodResolver(DeclineReserveFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleBefore = () => {
    setIsEdit((prev) => !prev);
  };

  const onReserveSubmit = async (
    data: z.infer<typeof TaxReserveFormSchema>
  ) => {};

  const onDeclineSubmit = async (
    data: z.infer<typeof DeclineReserveFormSchema>
  ) => {};

  return (
    <div className="w-full flex flex-col space-y-5 my-8">
      <div className="w-full flex flex-col space-y-5">
        {!isEdit ? (
          <div className="flex items-center space-x-2">
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
            >
              <Plus className="w-3 h-3" />
              <span className="text-xs">Neue Abgabe</span>
            </Button>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => {}}
            >
              <FileText className="w-3 h-3" />
              <span className="text-xs">Bericht erstellen</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={handleBefore}
            >
              <ChevronLeft className="w-3 h-3" />
              <span className="text-xs">Alle Abgaben</span>
            </Button>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => {}}
            >
              <ShoppingCart className="w-3 h-3" />
              <span className="text-xs">Kasten</span>
            </Button>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setOpenReserveDlg((prev) => !prev)}
            >
              <CircleCheck className="w-3 h-3" />
              <span className="text-xs">Bestätigen</span>
            </Button>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setOpenCancelReserveDlg((prev) => !prev)}
            >
              <CircleX className="w-3 h-3" />
              <span className="text-xs">Ablehnen</span>
            </Button>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setOpenDeclineReserveDlg((prev) => !prev)}
            >
              <X className="w-3 h-3" />
              <span className="text-xs">Stornieren</span>
            </Button>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => {}}
            >
              <QrCode className="w-3 h-3" />
              <span className="text-xs">Klebeetikett erstellen</span>
            </Button>
          </div>
        )}
        {!isEdit ? (
          <div className="flex flex-col space-y-6 tablet:space-y-3">
            <Card>
              <CardContent className="grid grid-cols-3 divide-x p-0 tablet:grid-cols-1 tablet:divide-x-0 tablet:divide-y">
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold mobile:text-xs">
                    Geplante Abgaben heute
                  </p>
                  <div className="flex justify-between items-end gap-2 tablet:flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl text-custom font-semibold laptop:text-base tablet:text-sm">
                        1 Abgabe
                      </h1>
                      <p className="text-xs text-content">15 g / 2 Samen</p>
                    </div>
                    <Badge
                      className="w-fit h-fit p-1 text-xs leading-[8px] whitespace-nowrap rounded-xl"
                      variant="secondary"
                    >
                      1 Mitglied
                    </Badge>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold	mobile:text-xs">Status</p>
                  <div className="flex justify-between items-end gap-2 tablet:flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-semibold laptop:text-base tablet:text-sm">
                        6 Reservierungen
                      </h1>
                      <p className="text-xs text-content">
                        51 g / 3 Stecklinge / 1 Samen
                      </p>
                    </div>
                    <Badge
                      className="w-fit h-fit p-1 text-xs leading-[8px] whitespace-nowrap rounded-xl"
                      variant="secondary"
                    >
                      6 Mitglieder
                    </Badge>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold mobile:text-xs">
                    Reserviert am
                  </p>
                  <h1 className="text-xl font-semibold laptop:text-base tablet:text-sm">
                    Cannanas Express Samen
                  </h1>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col space-y-6 tablet:space-y-3">
            <Card>
              <CardContent className="grid grid-cols-3 divide-x p-0 tablet:grid-cols-1 tablet:divide-x-0 tablet:divide-y">
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold mobile:text-xs">
                    Mitglied
                  </p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarImage
                        src={
                          (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                          user?.avatar
                        }
                        alt="avatar"
                      />
                      <AvatarFallback className="text-xs text-white bg-custom">
                        {getAvatarLetters(user?.username)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-xl font-semibold laptop:text-base tablet:text-sm">
                      {user?.username}
                    </h1>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold	mobile:text-xs">Status</p>
                  <div className="flex justify-between items-end gap-2 tablet:flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-semibold laptop:text-base tablet:text-sm">
                        Reserviert
                      </h1>
                      <p className="text-xs text-content">
                        4 Gramm/1 Steckling
                      </p>
                    </div>
                    <Badge
                      className="w-fit h-fit p-1 text-xs leading-[8px] whitespace-nowrap rounded-xl"
                      variant="secondary"
                    >
                      71,90 €
                    </Badge>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-between space-y-2 p-7 tablet:items-center tablet:p-5">
                  <p className="text-sm font-semibold mobile:text-xs">
                    Reserviert am
                  </p>
                  <h1 className="text-xl font-semibold laptop:text-base tablet:text-sm">
                    15. November 2024
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <h1 className="p-10 pb-5 text-2xl font-semibold border-b tablet:p-7 tablet:pb-5 tablet:text-xl mobile:p-5">
                  Details
                </h1>
                <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                  <TextGroup title="Mitglied" value="Mia Neumann (CSC-007)" />
                  <TextGroup title="Gesamtbetrag" value="71,90 €" />
                  <div className="w-full flex py-5 text-sm border-b tablet:py-3">
                    <p className="max-w-32 w-full text-content mr-44 laptop:mr-20 tablet:mr-10 mobile:mr-5">
                      Status
                    </p>
                    <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
                      Reserviert
                    </Badge>
                  </div>
                  <TextGroup
                    title="Erstellt am"
                    value={getCleanDate(String(new Date()), 1)}
                  />
                  <TextGroup type="last" title="Notizen" value="" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <h1 className="p-10 pb-5 text-2xl font-semibold border-b tablet:p-7 tablet:pb-5 tablet:text-xl mobile:p-5">
                  Abgabedetails
                </h1>
                <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                  <TextGroup title="Enthaltenes Cannabis" value="4 Gramm" />
                  <TextGroup
                    title="Enthaltene Stecklinge"
                    value="1 Steckling"
                  />
                  <TextGroup title="Enthaltene Samen" value="Keine Samen" />
                  <TextGroup title="max. THC-Gehalt" value="20 %" />
                  <TextGroup title="Geplante Abgabe am" value="" />
                  <TextGroup title="Geplante Abgabestelle" value="" />
                  <TextGroup title="Abgegeben am" value="" />
                  <TextGroup title="Abgeholt in" value="" />
                  <TextGroup type="last" title="Abgegeben von" value="" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Dialog open={openReserveDlg} onOpenChange={setOpenReserveDlg}>
        <DialogContent className="max-w-3xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
          <h1 className="p-7 pb-5 border-b text-xl font-semibold tablet:text-base mobile:p-5">
            Reservierung bestätigen
          </h1>
          <Form {...reserveForm}>
            <form
              className="flex flex-col p-7 mobile:p-5"
              onSubmit={reserveForm.handleSubmit(onReserveSubmit)}
            >
              <div className="flex flex-col space-y-5 tablet:space-y-3">
                <div className="w-full flex justify-between tablet:flex-col">
                  <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Abgabeort*</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Wähle den Ort aus, an dem die Reservierungen abgeholt
                      werden können.
                    </p>
                  </div>
                  <FormField
                    control={reserveForm.control}
                    name="storage"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Collapsible open={storageOpen}>
                            <CollapsibleTrigger
                              asChild
                              onClick={() => setStorageOpen((prev) => !prev)}
                            >
                              <Button
                                className="w-full flex justify-between items-center font-normal px-3 py-2"
                                variant="outline"
                              >
                                {value
                                  ? storages.find((item) => item._id === value)
                                      ?.storagename
                                  : "Lagerorte auswählen..."}
                                <ChevronsUpDown className="h-3 w-3 opacity-50" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <Card>
                                <CardContent className="mt-1 p-1">
                                  <Command>
                                    <CommandInput placeholder="Suche nach einem Mitglieder" />
                                    <CommandEmpty className="text-sm px-3 py-1.5">
                                      Keine Lagerorte gefunden.
                                    </CommandEmpty>
                                    <CommandList>
                                      <CommandGroup>
                                        {storages.map((item, key) => (
                                          <CommandItem
                                            key={key}
                                            onSelect={() => {
                                              onChange(
                                                item._id === value
                                                  ? ""
                                                  : item._id
                                              );
                                              setStorageOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                value === item._id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {item.storagename}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </CardContent>
                              </Card>
                            </CollapsibleContent>
                          </Collapsible>
                        </FormControl>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />
                </div>
                <ProfileInput
                  form={reserveForm.control}
                  type="date"
                  id="pickup_date"
                  title="Abholtermin*"
                  content="Wähle das Datum aus, an dem die Reservierungen abgeholt werden können."
                />
              </div>
              <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                <Button
                  className="h-10 px-4 mobile:px-2"
                  type="button"
                  variant="outline"
                  onClick={() => setOpenReserveDlg(false)}
                >
                  Abbrechen
                </Button>
                <Button
                  className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                  onClick={() => {}}
                >
                  {loading ? (
                    <ClipLoader
                      aria-label="loader"
                      data-testid="loader"
                      color="white"
                      size={16}
                    />
                  ) : (
                    <span className="text-sm">Reservierung bestätigen</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openCancelReserveDlg}
        onOpenChange={setOpenCancelReserveDlg}
      >
        <DialogContent className="max-w-3xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
          <h1 className="p-7 pb-5 border-b text-xl font-semibold tablet:text-base mobile:p-5">
            Reservierung stornieren
          </h1>
          <div className="flex flex-col p-7 mobile:p-5">
            <p className="text-content tablet:text-sm">
              Möchtest du die Reservierung für Mia Neumann wirklich stornieren?
            </p>
            <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
              <Button
                className="h-10 px-4 mobile:px-2"
                type="button"
                variant="outline"
                onClick={() => setOpenCancelReserveDlg(false)}
              >
                Abbrechen
              </Button>
              <Button
                className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                onClick={() => {}}
              >
                {loading ? (
                  <ClipLoader
                    aria-label="loader"
                    data-testid="loader"
                    color="white"
                    size={16}
                  />
                ) : (
                  <span className="text-sm">Reservierung stornieren</span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDeclineReserveDlg}
        onOpenChange={setOpenDeclineReserveDlg}
      >
        <DialogContent className="max-w-3xl w-full overflow-hidden gap-0 p-0 rounded-3xl">
          <h1 className="p-7 pb-5 border-b text-xl font-semibold tablet:text-base mobile:p-5">
            Reservierung ablehnen
          </h1>
          <Form {...declineForm}>
            <form
              className="flex flex-col p-7 mobile:p-5"
              onSubmit={declineForm.handleSubmit(onDeclineSubmit)}
            >
              <ProfileInput
                form={declineForm.control}
                type="textarea"
                id="reason"
                title="Ablehnungsgrund*"
              />
              <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                <Button
                  className="h-10 px-4 mobile:px-2"
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDeclineReserveDlg(false)}
                >
                  Abbrechen
                </Button>
                <Button
                  className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                  onClick={() => {}}
                >
                  {loading ? (
                    <ClipLoader
                      aria-label="loader"
                      data-testid="loader"
                      color="white"
                      size={16}
                    />
                  ) : (
                    <span className="text-sm">Reservierung ablehnen</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryTaxPage;
