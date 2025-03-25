"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Check,
  ChevronLeft,
  ChevronsUpDown,
  Plus,
  Sprout,
  XIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import ProfileInput from "@/components/basic/ProfileInput";
import AddressInput from "@/components/basic/AddressInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  MaterialCuttingFormSchema,
  MaterialSeedFormSchema,
} from "@/constant/formschema";
import { cn } from "@/lib/utils";

const unitTypes = [
  { key: "gram", value: "Gramm (g)" },
  { key: "kilogram", value: "Kilogramm (kg)" },
  { key: "milliliter", value: "Milliliter (ml)" },
  { key: "liter", value: "Liter (l)" },
  { key: "piece", value: "Stück" },
];

const InventoryMaterialPage = () => {
  const dispatch = useAppDispatch();
  const { storages } = useAppSelector((state) => state.storages);

  const { toast } = useToast();

  const [isEdit, setIsEdit] = useState("");
  const [loading, setLoading] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [tags, setTags] = useState("");

  const cuttingTagsRef = useRef<HTMLInputElement>(null);
  const seedTagsRef = useRef<HTMLInputElement>(null);

  const cuttingForm = useForm<z.infer<typeof MaterialCuttingFormSchema>>({
    resolver: zodResolver(MaterialCuttingFormSchema),
    defaultValues: {
      cuttingname: "",
      description: "",
      type: "",
      quantity: 0,
      unit: "",
      storage: "",
      current_status: "",
      best_date: undefined,
      buyer: "",
      street: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      manufacturer: "",
      serial_number: "",
      barcode: "",
      purchase_date: undefined,
      tags: [],
      note: "",
    },
  });

  const seedForm = useForm<z.infer<typeof MaterialSeedFormSchema>>({
    resolver: zodResolver(MaterialSeedFormSchema),
    defaultValues: {
      seedname: "",
      description: "",
      type: "",
      quantity: 0,
      unit: "",
      storage: "",
      current_status: "",
      best_date: undefined,
      buyer: "",
      street: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      manufacturer: "",
      serial_number: "",
      barcode: "",
      purchase_date: undefined,
      tags: [],
      note: "",
    },
  });

  const handleBefore = () => {
    setIsEdit("");
  };

  const onCuttingSubmit = async (
    data: z.infer<typeof MaterialCuttingFormSchema>
  ) => {};

  const onSeedSubmit = async (
    data: z.infer<typeof MaterialSeedFormSchema>
  ) => {};

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="max-w-[1440px] w-full flex flex-col space-y-5 my-8">
        {isEdit === "" ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={() => setIsEdit("cutting")}
              >
                <Plus className="w-3 h-3" />
                <span className="text-xs">Stecklinge hinzufügen</span>
              </Button>
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={() => setIsEdit("seed")}
              >
                <Plus className="w-3 h-3" />
                <span className="text-xs">Samen hinzufügen</span>
              </Button>
            </div>
            <Card className="p-10 tablet:p-7 mobile:p-5">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <Sprout className="w-6 h-6 tablet:w-4 tablet:h-4" />
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Vermehrungsmaterial
                  </h1>
                </div>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  {`Erfasse hier das erhaltene oder selbst produzierte Vermehrungsmaterial des Clubs.`}
                  <br />
                  {`Diese Daten werden für die Nachweisdokumentation benötigt.`}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit("")}
            >
              <ChevronLeft className="w-3 h-3" />
              <span className="text-xs">Zurück</span>
            </Button>
            {isEdit === "cutting" && (
              <Card>
                <CardContent className="p-0">
                  <h1 className="p-10 pb-5 text-2xl	font-semibold border-b tablet:p-7 tablet:pb-5 tablet:text-xl mobile:p-5">
                    Stecklinge hinzufügen
                  </h1>
                  <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                    <Form {...cuttingForm}>
                      <form
                        className="w-full flex flex-col"
                        onSubmit={cuttingForm.handleSubmit(onCuttingSubmit)}
                      >
                        <div className="space-y-6 mobile:space-y-3">
                          <ProfileInput
                            form={cuttingForm.control}
                            id="cuttingname"
                            title="Name"
                            content="Der Name des Inventars"
                            placeholder="Name"
                          />
                          <ProfileInput
                            form={cuttingForm.control}
                            type="textarea"
                            id="description"
                            title="Beschreibung"
                            content="Eine kurze Beschreibung des Inventars"
                            placeholder="Beschreibung"
                          />
                          <ProfileInput
                            form={cuttingForm.control}
                            type="selectbox"
                            id="type"
                            title="Typ*"
                            content="Der Typ des Inventars. Cannabis Typen werden speziell behandelt."
                            placeholder="Wähle einen Typ aus"
                            selectValues={[
                              {
                                key: "grow-equipment",
                                value: "Grow Equipment",
                              },
                              { key: "other", value: "Sonstiges" },
                            ]}
                          />
                          <div className="w-full flex tablet:flex-col">
                            <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                              <p className="font-medium mobile:text-sm">
                                Menge & Einheit *
                              </p>
                              <p className="text-sm text-content mobile:text-xs">
                                Menge und Einheit des Inventars
                              </p>
                            </div>
                            <div className="w-full flex space-x-3">
                              <FormField
                                control={cuttingForm.control}
                                name="quantity"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormControl>
                                      <Input
                                        className="h-9"
                                        type="number"
                                        placeholder="Menge"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-left" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={cuttingForm.control}
                                name="unit"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Wähle eine Einheit aus" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {unitTypes.map((item, key) => (
                                          <SelectItem
                                            key={key}
                                            value={item.key}
                                          >
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
                          </div>
                          <div className="w-full flex justify-between tablet:flex-col">
                            <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                              <p className="font-medium mobile:text-sm">
                                Lagerort
                              </p>
                              <p className="text-sm text-content mobile:text-xs">
                                Der Ort, an dem sich das Inventar befindet.
                              </p>
                            </div>
                            <FormField
                              control={cuttingForm.control}
                              name="storage"
                              render={({ field: { value, onChange } }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <Collapsible open={storageOpen}>
                                      <CollapsibleTrigger
                                        asChild
                                        onClick={() =>
                                          setStorageOpen((prev) => !prev)
                                        }
                                      >
                                        <Button
                                          className="w-full flex justify-between items-center font-normal px-3 py-2"
                                          variant="outline"
                                        >
                                          {value
                                            ? storages.find(
                                                (item) => item._id === value
                                              )?.storagename
                                            : "Lagerort auswählen..."}
                                          <ChevronsUpDown className="h-3 w-3 opacity-50" />
                                        </Button>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <Card>
                                          <CardContent className="mt-1 p-1">
                                            <Command>
                                              <CommandInput placeholder="Suche nach einem Lagerort" />
                                              <CommandEmpty className="text-sm px-3 py-1.5">
                                                Keine Lagerort gefunden.
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
                            form={cuttingForm.control}
                            id="current_status"
                            title="Aktueller Zustand"
                            content="Der aktuelle Zustand des Inventars"
                            placeholder="Aktueller Zustand"
                          />
                          <ProfileInput
                            form={cuttingForm.control}
                            type="date"
                            id="best_date"
                            title="Mindeshaltbarkeitsdatum"
                            content="Das Datum, an dem das Inventar nicht mehr verwendet werden sollte."
                          />
                          <div className="py-3">
                            <h1 className="font-semibold mobile:text-sm">
                              Angaben nach §26 KCanG
                            </h1>
                            <p className="text-sm text-content mobile:text-xs">
                              Angaben nach §26 KCanG zur Dokumentation von
                              erhaltenem Vermehrungsmaterial
                            </p>
                          </div>
                          <ProfileInput
                            form={cuttingForm.control}
                            id="buyer"
                            title="Name*"
                            content="Name und Vorname der Person, Anbauvereinigung oder juristischen Person, von der das Vermehrungsmaterial erworben wurde."
                            placeholder="Herman Strauß"
                          />
                          <AddressInput
                            form={cuttingForm.control}
                            type="required"
                            content="Adresse der Person oder Sitz der Anbauvereinigung oder juristischen Person, von der das Vermehrungsmaterial erworben wurde."
                          />
                          <div className="py-3">
                            <h1 className="font-semibold mobile:text-sm">
                              Herstellerinformationen
                            </h1>
                            <p className="text-sm text-content mobile:text-xs">
                              Informationen zum Hersteller des Inventars.
                            </p>
                          </div>
                          <ProfileInput
                            form={cuttingForm.control}
                            id="manufacturer"
                            title="Hersteller"
                            content="Der Name des Herstellers"
                            placeholder="Hersteller"
                          />
                          <ProfileInput
                            form={cuttingForm.control}
                            id="serial_number"
                            title="Seriennummer des Herstellers"
                            content="Die Hersteller Seriennummer des Items"
                            placeholder="Seriennummer"
                          />
                          <ProfileInput
                            form={cuttingForm.control}
                            id="barcode"
                            title="Hersteller Barcode"
                            content="Der Hersteller Barcode des Items"
                            placeholder="Barcode"
                          />
                          <ProfileInput
                            form={cuttingForm.control}
                            type="date"
                            id="purchase_date"
                            title="Gekauft am"
                            content="Das Datum, an dem das Inventar Item gekauft worden ist."
                          />
                          <div className="py-3">
                            <h1 className="font-semibold mobile:text-sm">
                              Weitere Informationen
                            </h1>
                            <p className="text-sm text-content mobile:text-xs">
                              Weitere Informationen zur Organisation des
                              Inventars.
                            </p>
                          </div>
                          <div className="w-full flex justify-between tablet:flex-col">
                            <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                              <p className="font-medium mobile:text-sm">Tags</p>
                              <p className="text-sm text-content mobile:text-xs">
                                Tags helfen dabei, das Inventar Item zu
                                kategorisieren.
                              </p>
                            </div>
                            <FormField
                              control={cuttingForm.control}
                              name="tags"
                              render={({ field: { value, onChange } }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <div
                                      className={cn(
                                        "max-h-32 min-h-10 overflow-y-auto flex w-full flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                      )}
                                    >
                                      {value.map((item: any, key: any) => (
                                        <Badge key={key} variant="secondary">
                                          {item}
                                          <Button
                                            className="ml-2 h-3 w-3"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              onChange(
                                                value.filter((f: any) => f !== item)
                                              );
                                            }}
                                          >
                                            <XIcon className="w-3" />
                                          </Button>
                                        </Badge>
                                      ))}
                                      <input
                                        className="flex-1 outline-none min-w-0 bg-white"
                                        ref={cuttingTagsRef}
                                        value={tags}
                                        placeholder="Suche nach Tags oder füge Neue hinzu..."
                                        onChange={(e) =>
                                          setTags(e.target.value)
                                        }
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          if (
                                            value.includes(tags) ||
                                            tags.length === 0
                                          ) {
                                            toast({
                                              className:
                                                "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
                                              description:
                                                "Bitte geben Sie ein gültiges Tag ein.",
                                            });
                                            setTags("");
                                          } else {
                                            onChange([...value, tags]);
                                            setTags("");

                                            const tagsInput =
                                              cuttingTagsRef.current;
                                            if (tagsInput)
                                              tagsInput.placeholder = "";
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === "Enter" ||
                                            e.key === ","
                                          ) {
                                            e.preventDefault();

                                            if (
                                              value.includes(tags) ||
                                              tags.length === 0
                                            ) {
                                              toast({
                                                className:
                                                  "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
                                                description:
                                                  "Bitte geben Sie ein gültiges Tag ein.",
                                              });
                                              setTags("");
                                            } else {
                                              onChange([...value, tags]);
                                              setTags("");

                                              const tagsInput =
                                                cuttingTagsRef.current;
                                              if (tagsInput)
                                                tagsInput.placeholder = "";
                                            }
                                          } else if (
                                            e.key === "Backspace" &&
                                            tags.length === 0 &&
                                            value.length > 0
                                          ) {
                                            e.preventDefault();

                                            const tagsInput =
                                              cuttingTagsRef.current;
                                            if (
                                              value.length === 1 &&
                                              tagsInput
                                            ) {
                                              tagsInput.placeholder =
                                                "Suche nach Tags oder füge Neue hinzu...";
                                            }

                                            onChange(value.slice(0, -1));
                                          }
                                        }}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-left" />
                                </FormItem>
                              )}
                            />
                          </div>
                          <ProfileInput
                            form={cuttingForm.control}
                            type="textarea"
                            id="note"
                            title="Notizen"
                            content="Weitere Informationen oder Besonderheiten zur Ernte."
                            placeholder="Notiz"
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
                  </div>
                </CardContent>
              </Card>
            )}
            {isEdit === "seed" && (
              <Card>
                <CardContent className="p-0">
                  <h1 className="p-10 pb-5 text-2xl	font-semibold border-b tablet:p-7 tablet:pb-5 tablet:text-xl mobile:p-5">
                    Samen hinzufügen
                  </h1>
                  <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                    <Form {...seedForm}>
                      <form
                        className="w-full flex flex-col"
                        onSubmit={seedForm.handleSubmit(onSeedSubmit)}
                      >
                        <div className="space-y-6 mobile:space-y-3">
                          <ProfileInput
                            form={seedForm.control}
                            id="seedname "
                            title="Name"
                            content="Der Name des Inventars"
                            placeholder="Name"
                          />
                          <ProfileInput
                            form={seedForm.control}
                            type="textarea"
                            id="description"
                            title="Beschreibung"
                            content="Eine kurze Beschreibung des Inventars"
                            placeholder="Beschreibung"
                          />
                          <ProfileInput
                            form={seedForm.control}
                            type="selectbox"
                            id="type"
                            title="Typ*"
                            content="Der Typ des Inventars. Cannabis Typen werden speziell behandelt."
                            placeholder="Wähle einen Typ aus"
                            selectValues={[
                              {
                                key: "grow-equipment",
                                value: "Grow Equipment",
                              },
                              { key: "other", value: "Sonstiges" },
                            ]}
                          />
                          <div className="w-full flex tablet:flex-col">
                            <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                              <p className="font-medium mobile:text-sm">
                                Menge & Einheit *
                              </p>
                              <p className="text-sm text-content mobile:text-xs">
                                Menge und Einheit des Inventars
                              </p>
                            </div>
                            <div className="w-full flex space-x-3">
                              <FormField
                                control={seedForm.control}
                                name="quantity"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormControl>
                                      <Input
                                        className="h-9"
                                        type="number"
                                        placeholder="Menge"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-left" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={seedForm.control}
                                name="unit"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Wähle eine Einheit aus" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {unitTypes.map((item, key) => (
                                          <SelectItem
                                            key={key}
                                            value={item.key}
                                          >
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
                          </div>
                          <div className="w-full flex justify-between tablet:flex-col">
                            <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                              <p className="font-medium mobile:text-sm">
                                Lagerort
                              </p>
                              <p className="text-sm text-content mobile:text-xs">
                                Der Ort, an dem sich das Inventar befindet.
                              </p>
                            </div>
                            <FormField
                              control={seedForm.control}
                              name="storage"
                              render={({ field: { value, onChange } }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <Collapsible open={storageOpen}>
                                      <CollapsibleTrigger
                                        asChild
                                        onClick={() =>
                                          setStorageOpen((prev) => !prev)
                                        }
                                      >
                                        <Button
                                          className="w-full flex justify-between items-center font-normal px-3 py-2"
                                          variant="outline"
                                        >
                                          {value
                                            ? storages.find(
                                                (item) => item._id === value
                                              )?.storagename
                                            : "Lagerort auswählen..."}
                                          <ChevronsUpDown className="h-3 w-3 opacity-50" />
                                        </Button>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <Card>
                                          <CardContent className="mt-1 p-1">
                                            <Command>
                                              <CommandInput placeholder="Suche nach einem Lagerort" />
                                              <CommandEmpty className="text-sm px-3 py-1.5">
                                                Keine Lagerort gefunden.
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
                            form={seedForm.control}
                            id="current_status"
                            title="Aktueller Zustand"
                            content="Der aktuelle Zustand des Inventars"
                            placeholder="Aktueller Zustand"
                          />
                          <ProfileInput
                            form={seedForm.control}
                            type="date"
                            id="best_date"
                            title="Mindeshaltbarkeitsdatum"
                            content="Das Datum, an dem das Inventar nicht mehr verwendet werden sollte."
                          />
                          <div className="py-3">
                            <h1 className="font-semibold mobile:text-sm">
                              Angaben nach §26 KCanG
                            </h1>
                            <p className="text-sm text-content mobile:text-xs">
                              Angaben nach §26 KCanG zur Dokumentation von
                              erhaltenem Vermehrungsmaterial
                            </p>
                          </div>
                          <ProfileInput
                            form={seedForm.control}
                            id="buyer"
                            title="Name*"
                            content="Name und Vorname der Person, Anbauvereinigung oder juristischen Person, von der das Vermehrungsmaterial erworben wurde."
                            placeholder="Herman Strauß"
                          />
                          <AddressInput
                            form={seedForm.control}
                            type="required"
                            content="Adresse der Person oder Sitz der Anbauvereinigung oder juristischen Person, von der das Vermehrungsmaterial erworben wurde."
                          />
                          <div className="py-3">
                            <h1 className="font-semibold mobile:text-sm">
                              Herstellerinformationen
                            </h1>
                            <p className="text-sm text-content mobile:text-xs">
                              Informationen zum Hersteller des Inventars.
                            </p>
                          </div>
                          <ProfileInput
                            form={seedForm.control}
                            id="manufacturer"
                            title="Hersteller"
                            content="Der Name des Herstellers"
                            placeholder="Hersteller"
                          />
                          <ProfileInput
                            form={seedForm.control}
                            id="serial_number"
                            title="Seriennummer des Herstellers"
                            content="Die Hersteller Seriennummer des Items"
                            placeholder="Seriennummer"
                          />
                          <ProfileInput
                            form={seedForm.control}
                            id="barcode"
                            title="Hersteller Barcode"
                            content="Der Hersteller Barcode des Items"
                            placeholder="Barcode"
                          />
                          <ProfileInput
                            form={seedForm.control}
                            type="date"
                            id="purchase_date"
                            title="Gekauft am"
                            content="Das Datum, an dem das Inventar Item gekauft worden ist."
                          />
                          <div className="py-3">
                            <h1 className="font-semibold mobile:text-sm">
                              Weitere Informationen
                            </h1>
                            <p className="text-sm text-content mobile:text-xs">
                              Weitere Informationen zur Organisation des
                              Inventars.
                            </p>
                          </div>
                          <div className="w-full flex justify-between tablet:flex-col">
                            <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                              <p className="font-medium mobile:text-sm">Tags</p>
                              <p className="text-sm text-content mobile:text-xs">
                                Tags helfen dabei, das Inventar Item zu
                                kategorisieren.
                              </p>
                            </div>
                            <FormField
                              control={seedForm.control}
                              name="tags"
                              render={({ field: { value, onChange } }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <div
                                      className={cn(
                                        "max-h-32 min-h-10 overflow-y-auto flex w-full flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                      )}
                                    >
                                      {value.map((item: any, key: any) => (
                                        <Badge key={key} variant="secondary">
                                          {item}
                                          <Button
                                            className="ml-2 h-3 w-3"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              onChange(
                                                value.filter((f: any) => f !== item)
                                              );
                                            }}
                                          >
                                            <XIcon className="w-3" />
                                          </Button>
                                        </Badge>
                                      ))}
                                      <input
                                        className="flex-1 outline-none min-w-0 bg-white"
                                        ref={seedTagsRef}
                                        value={tags}
                                        placeholder="Suche nach Tags oder füge Neue hinzu..."
                                        onChange={(e) =>
                                          setTags(e.target.value)
                                        }
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          if (
                                            value.includes(tags) ||
                                            tags.length === 0
                                          ) {
                                            toast({
                                              className:
                                                "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
                                              description:
                                                "Bitte geben Sie ein gültiges Tag ein.",
                                            });
                                            setTags("");
                                          } else {
                                            onChange([...value, tags]);
                                            setTags("");

                                            const tagsInput =
                                              seedTagsRef.current;
                                            if (tagsInput)
                                              tagsInput.placeholder = "";
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === "Enter" ||
                                            e.key === ","
                                          ) {
                                            e.preventDefault();

                                            if (
                                              value.includes(tags) ||
                                              tags.length === 0
                                            ) {
                                              toast({
                                                className:
                                                  "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
                                                description:
                                                  "Bitte geben Sie ein gültiges Tag ein.",
                                              });
                                              setTags("");
                                            } else {
                                              onChange([...value, tags]);
                                              setTags("");

                                              const tagsInput =
                                                seedTagsRef.current;
                                              if (tagsInput)
                                                tagsInput.placeholder = "";
                                            }
                                          } else if (
                                            e.key === "Backspace" &&
                                            tags.length === 0 &&
                                            value.length > 0
                                          ) {
                                            e.preventDefault();

                                            const tagsInput =
                                              seedTagsRef.current;
                                            if (
                                              value.length === 1 &&
                                              tagsInput
                                            ) {
                                              tagsInput.placeholder =
                                                "Suche nach Tags oder füge Neue hinzu...";
                                            }

                                            onChange(value.slice(0, -1));
                                          }
                                        }}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-left" />
                                </FormItem>
                              )}
                            />
                          </div>
                          <ProfileInput
                            form={seedForm.control}
                            type="textarea"
                            id="note"
                            title="Notizen"
                            content="Weitere Informationen oder Besonderheiten zur Ernte."
                            placeholder="Notiz"
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
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryMaterialPage;
