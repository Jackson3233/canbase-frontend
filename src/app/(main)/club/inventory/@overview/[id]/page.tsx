"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  ArrowLeftRight,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  Pencil,
  SwitchCamera,
  XIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { inventoriesActions } from "@/store/reducers/inventoriesReducer";
import Overview from "@/components/basic/Overview";
import ProfileInput from "@/components/basic/ProfileInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { getInventory, updateInventory } from "@/actions/inventory";
import { InventoryFormSchema } from "@/constant/formschema";
import { getCleanDate, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";

const unitTypes = [
  { key: "gram", value: "Gramm (g)" },
  { key: "kilogram", value: "Kilogramm (kg)" },
  { key: "milliliter", value: "Milliliter (ml)" },
  { key: "liter", value: "Liter (l)" },
  { key: "piece", value: "Stück" },
];

const InventoryInfoPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const { storages } = useAppSelector((state) => state.storages);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [inventory, setInventory] = useState<any>();
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

  useEffect(() => {
    (async () => {
      const result = await getInventory({ inventoryID: params.id });

      if (result.success) {
        setInventory(result.inventory);

        form.reset({
          inventoryname: result.inventory?.inventoryname,
          description: result.inventory?.description,
          type: result.inventory?.type,
          quantity: result.inventory?.quantity,
          unit: result.inventory?.unit,
          storage: result.inventory?.storage?._id,
          sowing_date: result.inventory?.sowing_date,
          manufacturer: result.inventory?.manufacturer,
          serial_number: result.inventory?.serial_number,
          barcode: result.inventory?.barcode,
          purchase_date: result.inventory?.purchase_date,
          tags: result.inventory?.tags,
          note: result.inventory?.note,
        });
      }
    })();
  }, [form, params.id]);

  const handleBefore = () => {
    if (isEdit) {
      setIsEdit((prev) => !prev);
      setStorageOpen(false);

      form.reset({
        inventoryname: inventory?.inventoryname,
        description: inventory?.description,
        type: inventory?.type,
        quantity: inventory?.quantity,
        unit: inventory?.unit,
        storage: inventory?.storage?._id,
        sowing_date: inventory?.sowing_date,
        manufacturer: inventory?.manufacturer,
        serial_number: inventory?.serial_number,
        barcode: inventory?.barcode,
        purchase_date: inventory?.purchase_date,
        tags: inventory?.tags,
        note: inventory?.note,
      });
    } else {
      router.push("/club/inventory");
    }
  };

  const onSubmit = async (data: z.infer<typeof InventoryFormSchema>) => {
    setLoading(true);

    const result = await updateInventory({ ...data, inventoryID: params.id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(
        inventoriesActions.setInventories({ inventories: result.inventories })
      );
      setInventory(result.inventory);

      setIsEdit((prev) => !prev);

      form.reset({
        inventoryname: result.inventory?.inventoryname,
        description: result.inventory?.description,
        type: result.inventory?.type,
        quantity: result.inventory?.quantity,
        unit: result.inventory?.unit,
        storage: result.inventory?.storage?._id,
        sowing_date: result.inventory?.sowing_date,
        manufacturer: result.inventory?.manufacturer,
        serial_number: result.inventory?.serial_number,
        barcode: result.inventory?.barcode,
        purchase_date: result.inventory?.purchase_date,
        tags: result.inventory?.tags,
        note: result.inventory?.note,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5 my-8">
      <div className="w-full flex flex-col space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={handleBefore}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="text-xs">Zurück</span>
          </Button>
          {!isEdit && (
            <>
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={() => setIsEdit((prev) => !prev)}
              >
                <Pencil className="w-3 h-3" />
                <span className="text-xs">Bearbeiten</span>
              </Button>
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span className="text-xs">Transaktion</span>
              </Button>
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
              >
                <SwitchCamera className="w-3 h-3" />
                <span className="text-xs">Umwandeln</span>
              </Button>
            </>
          )}
        </div>
        {!isEdit ? (
          <Card>
            <CardContent className="p-0">
              <h1 className="p-7 border-b font-semibold tablet:p-5 tablet:text-sm">
                {!isEmpty(inventory?.inventoryname)
                  ? inventory.inventoryname
                  : inventory?.inventoryID}
              </h1>
              <div className="flex flex-col space-y-5 p-7 tablet:space-y-3 tablet:p-5">
                <div className="flex flex-col space-y-5 tablet:space-y-3">
                  <div className="flex flex-wrap gap-5 tablet:gap-3 mobile:flex-col">
                    <Overview
                      title="Name"
                      content={
                        !isEmpty(inventory?.inventoryname)
                          ? inventory.inventoryname
                          : "-"
                      }
                    />
                    <Overview
                      title="Beschreibung"
                      content={
                        !isEmpty(inventory?.description)
                          ? inventory.description
                          : "-"
                      }
                    />
                    <div className="max-w-72 w-full flex flex-col space-y-1">
                      <p className="text-xs text-content">Menge</p>
                      <Progress value={100} className="w-2/3" />
                      <p className="text-sm">
                        {inventory?.quantity}/{inventory?.quantity}
                        {inventory?.unit === "gram" && "g"}
                        {inventory?.unit === "kilogram" && "kg"}
                        {inventory?.unit === "milliliter" && "ml"}
                        {inventory?.unit === "liter" && "l"}
                        {inventory?.unit === "piece" && "Stk."}
                      </p>
                    </div>
                    <Overview
                      title="Lagerort"
                      content={
                        !isEmpty(inventory?.storage)
                          ? inventory.storage.storagename
                          : "-"
                      }
                    />
                    <>
                      {inventory?.type === "grow-equipment" && (
                        <Overview title="Typ" content="Grow Equipment" />
                      )}
                      {inventory?.type === "other " && (
                        <Overview title="Typ" content="Sonstiges" />
                      )}
                    </>
                    <Overview
                      title="Datum der Aussaat"
                      content={
                        isEmpty(inventory?.sowing_date)
                          ? "-"
                          : getCleanDate(inventory.sowing_date, 2)
                      }
                    />
                    <Overview
                      title="Hersteller "
                      content={
                        !isEmpty(inventory?.manufacturer)
                          ? inventory.manufacturer
                          : "-"
                      }
                    />
                    <Overview
                      title="Seriennummer des Herstellers"
                      content={
                        !isEmpty(inventory?.serial_number)
                          ? inventory.serial_number
                          : "-"
                      }
                    />
                    <Overview
                      title="Hersteller Barcode"
                      content={
                        !isEmpty(inventory?.barcode) ? inventory.barcode : "-"
                      }
                    />
                    <Overview
                      title="Gekauft am"
                      content={
                        isEmpty(inventory?.purchase_date)
                          ? "-"
                          : getCleanDate(inventory.purchase_date, 2)
                      }
                    />
                  </div>
                  <Overview
                    title="Notizen"
                    content={!isEmpty(inventory?.note) ? inventory.note : "-"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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
                        title="Name*"
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

export default InventoryInfoPage;
