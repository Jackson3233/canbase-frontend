"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Dropzone from "react-dropzone";
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronLeft, Images, MapPin, Plus, Trash2, XIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { storagesActions } from "@/store/reducers/storageReducer";
import ProfileInput from "@/components/basic/ProfileInput";
import AddressInput from "@/components/basic/AddressInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createStorage } from "@/actions/storage";
import { StorageFormSchema } from "@/constant/formschema";
import { isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";

const InventoryStoragePage = () => {
  const dispatch = useAppDispatch();
  const { storages } = useAppSelector((state) => state.storages);

  const { toast } = useToast();
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<any>();
  const [tempAvatar, setTempAvatar] = useState<any>();
  const [tags, setTags] = useState("");

  const tagsRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof StorageFormSchema>>({
    resolver: zodResolver(StorageFormSchema),
    defaultValues: {
      storagename: "",
      description: "",
      street: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      tags: [],
      note: "",
    },
  });

  const handleBefore = () => {
    setIsEdit((prev) => !prev);
    setAvatar(undefined);
    setTempAvatar(undefined);

    form.reset({
      storagename: "",
      description: "",
      street: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      tags: [],
      note: "",
    });
  };

  const onSubmit = async (data: z.infer<typeof StorageFormSchema>) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      key !== "tags" &&
        value !== undefined &&
        formData.append(key, value as string);
    });

    formData.append("avatar", avatar);
    formData.append("tags", JSON.stringify(data.tags));

    const result = await createStorage(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(storagesActions.setStorages({ storages: result.storages }));

      setIsEdit((prev) => !prev);
      setAvatar(undefined);
      setTempAvatar(undefined);

      form.reset({
        storagename: "",
        description: "",
        street: "",
        address: "",
        postcode: "",
        city: "",
        country: "",
        tags: [],
        note: "",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {!isEdit ? (
          isEmpty(storages) ? (
            <Card className="p-10 tablet:p-7 mobile:p-5">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-6 h-6 tablet:w-4 tablet:h-4" />
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Lagerorte
                  </h1>
                </div>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  {`Lege jetzt einen Lagerort an um Inventar zu organisieren und Transporte zu dokumentieren.`}
                </p>
                <Button
                  className="h-10 flex items-center space-x-2 px-4 mt-8 bg-custom mobile:w-full hover:bg-customhover"
                  onClick={() => setIsEdit((prev) => !prev)}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Lagerorte hinzufügen</span>
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
              <span className="text-xs">Lagerorte hinzufügen</span>
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
          !isEmpty(storages) && (
            <div className="grid grid-cols-2 gap-3 laptop:grid-cols-1">
              {storages.map((item, key) => (
                <Card
                  className="rounded-3xl cursor-pointer"
                  key={key}
                  onClick={() =>
                    router.push(
                      "/club/inventory/" + item.storageID + "?tab=storage"
                    )
                  }
                >
                  <CardContent className="flex flex-col space-y-5 p-10 tablet:space-y-3 tablet:p-7 mobile:p-5">
                    <div className="flex flex-col justify-center items-center space-y-3 tablet:space-y-1.5">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          className="rounded-full"
                          src={
                            (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                            item.avatar
                          }
                        />
                        <AvatarFallback className="bg-[#F8F8F8] rounded-full">
                          <MapPin className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-semibold mobile:text-xs">
                        {item.storagename}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-4 tablet:space-y-2">
                      {(!isEmpty(item.street) ||
                        !isEmpty(item.address) ||
                        !isEmpty(item.postcode) ||
                        !isEmpty(item.city) ||
                        !isEmpty(item.country)) && (
                        <div className="flex flex-col text-sm text-content mobile:text-xs">
                          {!isEmpty(item.street) && <>{item.street} </>}
                          {!isEmpty(item.address) && <>{item.address} </>}
                          {!isEmpty(item.postcode) && <>{item.postcode} </>}
                          {!isEmpty(item.city) && <>{item.city} </>}
                          {!isEmpty(item.country) && <>{item.country}</>}
                        </div>
                      )}

                      {!isEmpty(item.tags) && (
                        <div className="flex flex-col space-y-2 tablet:space-y-1">
                          <p className="text-xs text-content">Tags</p>
                          <div className="flex flex-wrap items-center gap-2">
                            {item.tags?.map((tag, key) => (
                              <Badge
                                className="w-fit p-1.5 text-xs text-black leading-[8px] bg-[#989898]/25 rounded-md"
                                key={key}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                <h1 className="text-2xl	font-semibold tablet:text-xl">
                  Lagerort hinzufügen
                </h1>
                <p className="pt-2 text-sm text-content mobile:text-xs">
                  Erstelle einen neuen Lagerort
                </p>
              </div>
              <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
                <div className="w-full flex tablet:flex-col">
                  <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Bild</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Ein Bild, das diesen Lagerort repräsentatiert.
                    </p>
                  </div>
                  <div>
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        setAvatar(acceptedFiles[0]);
                        setTempAvatar(URL.createObjectURL(acceptedFiles[0]));
                      }}
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className="w-36 h-36 flex justify-center items-center overflow-hidden rounded-full bg-[#F8F8F8] cursor-pointer mobile:self-center"
                          {...getRootProps()}
                        >
                          {avatar === undefined ? (
                            <div className="w-full h-full flex flex-col justify-center items-center rounded-full hover:border hover:border-content hover:border-dashed">
                              <Images className="w-4 h-4 text-content" />
                              <p className="text-xs text-content text-center">
                                .jpg, .jpeg, .png, .webp
                              </p>
                            </div>
                          ) : (
                            <div className="relative w-full h-full">
                              <Image
                                className="object-cover"
                                src={tempAvatar}
                                fill={true}
                                sizes="100%"
                                alt="avatar"
                              />
                              <Trash2
                                className="absolute top-1/2 right-0 w-4 h-4 -translate-y-1/2 text-destructive cursor-pointer z-20 hover:text-custom"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAvatar(undefined);
                                  setTempAvatar(undefined);
                                }}
                              />
                            </div>
                          )}
                          <Input
                            {...getInputProps()}
                            className="hidden"
                            type="file"
                            disabled={loading}
                          />
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </div>
                <Form {...form}>
                  <form
                    className="w-full flex flex-col mt-16 tablet:mt-8"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="space-y-6 mobile:space-y-3">
                      <ProfileInput
                        form={form.control}
                        id="storagename"
                        title="Name*"
                        content="Der Name des Lagerortes"
                        placeholder="Name"
                      />
                      <ProfileInput
                        form={form.control}
                        type="textarea"
                        id="description"
                        title="Beschreibung"
                        content="Eine kurze Beschreibung des Lagerortes"
                        placeholder="Beschreibung"
                      />
                      <AddressInput form={form.control} />
                      <div className="py-3">
                        <h1 className="font-semibold mobile:text-sm">
                          Weitere Informationen
                        </h1>
                        <p className="text-sm text-content mobile:text-xs">
                          Weitere Informationen zur Organisation des Lagerortes.
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
                        title="Notiz"
                        content="Weitere Informationen oder Besonderheiten zum Lagerort"
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

export default InventoryStoragePage;
