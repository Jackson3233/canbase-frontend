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
  Codesandbox,
  Plus,
  XIcon,
} from "lucide-react";
import { InventoryTable } from "./inventory-table";
import { inventoryColumns } from "./inventory-column";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { inventoriesActions } from "@/store/reducers/inventoriesReducer";
import ProfileInput from "@/components/basic/ProfileInput";
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
import { createInventory } from "@/actions/inventory";
import { InventoryFormSchema } from "@/constant/formschema";
import { isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";

const unitTypes = [
  { key: "gram", value: "Gramm (g)" },
  { key: "kilogram", value: "Kilogramm (kg)" },
  { key: "milliliter", value: "Milliliter (ml)" },
  { key: "liter", value: "Liter (l)" },
  { key: "piece", value: "Stück" },
];

const InventoryOverviewPage = () => {
  const dispatch = useAppDispatch();
  const { inventories } = useAppSelector((state) => state.inventories);
  const { storages } = useAppSelector((state) => state.storages);

  const { toast } = useToast();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [tags, setTags] = useState("");

  const tagsRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof InventoryFormSchema>>({
    resolver: zodResolver(InventoryFormSchema),
    defaultValues: {
      inventoryname: "",
      description: "",
      type: "",
      quantity: 0,
      unit: "",
      storage: "",
      sowing_date: undefined,
      manufacturer: "",
      serial_number: "",
      barcode: "",
      purchase_date: undefined,
      tags: [],
      note: "",
    },
  });

  const handleBefore = () => {
    setIsEdit((prev) => !prev);
    setStorageOpen(false);

    form.reset({
      inventoryname: "",
      description: "",
      type: "",
      quantity: 0,
      unit: "",
      storage: "",
      sowing_date: undefined,
      manufacturer: "",
      serial_number: "",
      barcode: "",
      purchase_date: undefined,
      tags: [],
      note: "",
    });
  };

  const onSubmit = async (data: z.infer<typeof InventoryFormSchema>) => {
    setLoading(true);

    const result = await createInventory(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(
        inventoriesActions.setInventories({ inventories: result.inventories })
      );

      setIsEdit((prev) => !prev);

      form.reset({
        inventoryname: "",
        description: "",
        type: undefined,
        quantity: 0,
        unit: "",
        storage: "",
        sowing_date: undefined,
        manufacturer: "",
        serial_number: "",
        barcode: "",
        purchase_date: undefined,
        tags: [],
        note: "",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {!isEdit ? (
          isEmpty(inventories) ? (
            <Card className="p-10 tablet:p-7 mobile:p-5">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <Codesandbox className="w-6 h-6 tablet:w-4 tablet:h-4" />
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Inventar
                  </h1>
                </div>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  {`Hier findest du alle deine Inventarpositionen. Erfasse hier alle deine Produkte und dokumentiere die Benutzung.`}
                </p>
                <Button
                  className="h-10 flex items-center space-x-2 px-4 mt-8 bg-custom mobile:w-full hover:bg-customhover"
                  onClick={() => setIsEdit((prev) => !prev)}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Inventar hinzufügen</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
            >
              <Plus className="w-3 h-3" />
              <span className="text-xs">Inventar hinzufügen</span>
            </Button>
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
          !isEmpty(inventories) && (
            <Card>
              <CardContent className="p-0">
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Inventar
                  </h1>
                  <p className="text-xs text-content">
                    {inventories.length} Items
                  </p>
                </div>
                <InventoryTable
                  columns={inventoryColumns}
                  data={inventories as any}
                />
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl	font-semibold tablet:text-xl">
                  Neues Inventar hinzufügen
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Füge ein neues Inventar hinzu
                </p>
              </div>
              <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                <Form {...form}>
                  <form
                    className="w-full flex flex-col"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="space-y-6 mobile:space-y-3">
                      <ProfileInput
                        form={form.control}
                        id="inventoryname"
                        title="Name"
                        placeholder="Name"
                      />
                      <ProfileInput
                        form={form.control}
                        type="textarea"
                        id="description"
                        title="Beschreibung"
                        content="Eine kurze Beschreibung des Inventars"
                        placeholder="Beschreibung"
                      />
                      <ProfileInput
                        form={form.control}
                        type="selectbox"
                        id="type"
                        title="Typ*"
                        content="Angabe, ob die Sorte selbstblühend ist oder nicht."
                        placeholder="Wähle einen Typ aus"
                        selectValues={[
                          { key: "grow-equipment", value: "Grow Equipment" },
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
                            control={form.control}
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
                            control={form.control}
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
                      </div>
                      <div className="w-full flex justify-between tablet:flex-col">
                        <div className="max-w-64 w-full mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                          <p className="font-medium mobile:text-sm">Lagerort</p>
                          <p className="text-sm text-content mobile:text-xs">
                            Der Ort, an dem sich das Inventar befindet.
                          </p>
                        </div>
                        <FormField
                          control={form.control}
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
                        form={form.control}
                        type="date"
                        id="sowing_date"
                        title="Datum der Aussaat"
                        content="Das Datum an dem der Samen gesetzt wurde."
                      />
                      <div className="py-3">
                        <h1 className="font-semibold mobile:text-sm">
                          Herstellerinformationen
                        </h1>
                        <p className="text-sm text-content mobile:text-xs">
                          Informationen zum Herstellers des Inventar Items
                        </p>
                      </div>
                      <ProfileInput
                        form={form.control}
                        id="manufacturer"
                        title="Hersteller"
                        content="Der Name des Herstellers"
                        placeholder="Hersteller"
                      />
                      <ProfileInput
                        form={form.control}
                        id="serial_number"
                        title="Seriennummer des Herstellers"
                        content="Die Hersteller Seriennummer des Items"
                        placeholder="Seriennummer"
                      />
                      <ProfileInput
                        form={form.control}
                        id="barcode"
                        title="Hersteller Barcode"
                        content="Der Hersteller Barcode des Items"
                        placeholder="Barcode"
                      />
                      <ProfileInput
                        form={form.control}
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
                          Weitere Informationen zur Organisation des Inventars
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
                          control={form.control}
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
                                    ref={tagsRef}
                                    value={tags}
                                    placeholder="Suche nach Tags oder füge Neue hinzu..."
                                    onChange={(e) => setTags(e.target.value)}
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

                                        const tagsInput = tagsRef.current;
                                        if (tagsInput)
                                          tagsInput.placeholder = "";
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === ",") {
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

                                          const tagsInput = tagsRef.current;
                                          if (tagsInput)
                                            tagsInput.placeholder = "";
                                        }
                                      } else if (
                                        e.key === "Backspace" &&
                                        tags.length === 0 &&
                                        value.length > 0
                                      ) {
                                        e.preventDefault();

                                        const tagsInput = tagsRef.current;
                                        if (value.length === 1 && tagsInput) {
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
                        form={form.control}
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
      </div>
    </div>
  );
};

export default InventoryOverviewPage;
