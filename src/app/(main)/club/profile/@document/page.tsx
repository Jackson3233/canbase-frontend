"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { FileText, LogOut, MoreVertical, Pencil, XIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { clubActions } from "@/store/reducers/clubReducer";
import { removeDoc, uploadDoc } from "@/actions/club";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { DocumentFormSchema } from "@/constant/formschema";
import { getCleanDate, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";

const ClubDocumentPage = () => {
  const dispatch = useAppDispatch();
  const { club } = useAppSelector((state) => state.club);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [flag, setFlag] = useState("new");
  const [tempData, setTempData] = useState<any>();
  const [document, setDocument] = useState<any>();
  const [documentErr, setDocumentErr] = useState("");
  const [tags, setTags] = useState("");

  const tagsRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof DocumentFormSchema>>({
    resolver: zodResolver(DocumentFormSchema),
    defaultValues: {
      documentname: "",
      description: "",
      isQuestion: false,
      tags: [],
    },
  });

  useEffect(() => {
    if (!open) {
      setTempData(undefined);
      setDocument(undefined);
      setDocumentErr("");
      setTags("");

      form.reset({
        documentname: "",
        description: "",
        isQuestion: false,
        tags: [],
      });
    }
  }, [open, form]);

  useEffect(() => {
    if (!deleteOpen) {
      setTempData(undefined);
    }
  }, [deleteOpen]);

  const handleUploadDialog = () => {
    setOpen(true);
    setFlag("new");
  };

  const handleEditDialog = async (param: any) => {
    setOpen(true);
    setFlag("update");
    setTempData(param);

    form.reset({
      documentname: param.documentname,
      description: param.description,
      isQuestion: param.isQuestion,
      tags: param.tags,
    });
  };

  const handleDeleteDialog = (param: any) => {
    setDeleteOpen(true);
    setTempData(param);
  };

  const handleDeleteDoc = async () => {
    setLoading(true);

    const result = await removeDoc({ documentID: tempData.documentID });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(clubActions.setClub({ club: result.club }));

      setDeleteOpen(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof DocumentFormSchema>) => {
    if (flag === "new" && document === undefined) {
      setDocumentErr("Dieses Feld muss ausgefüllt werden.");
    } else {
      setLoading(true);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        value !== undefined && formData.append(key, value as string);
      });
      formData.append("documentID", tempData?.documentID);
      formData.append("flag", flag);
      formData.append("doc", document);

      const result = await uploadDoc(formData);

      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });

      setLoading(false);

      if (result.success) {
        dispatch(clubActions.setClub({ club: result.club }));

        setOpen(false);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <Card className="w-full my-8">
        <CardContent className="p-0">
          <div className="p-10 tablet:p-7 mobile:p-5">
            <h1 className="text-2xl	font-semibold tablet:text-xl">Dokumente</h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Füge Dokumente deines Clubs hinzu, die für Mitglieder sichtbar
              sind. Lege fest, welche Dokumente bei Mitgliedsanfragen akzeptiert
              werden müssen.
            </p>
          </div>
          <>
            {!isEmpty(club?.document) &&
              club?.document?.map((item, key) => (
                <div
                  className="flex justify-between p-10 border-t tablet:p-7 mobile:p-5"
                  key={key}
                >
                  <div className="flex items-center space-x-8 tablet:space-x-4">
                    <FileText className="w-10 h-10 text-content" />
                    <div className="flex flex-col space-y-2">
                      <Link
                        className="text-lg tablet:text-base mobile:text-sm hover:text-customhover"
                        href={process.env.NEXT_PUBLIC_UPLOAD_URI + item.doc}
                        target="_blank"
                      >
                        {item.documentname}
                      </Link>
                      <p className="text-xs text-content">
                        {`Erstellt am ${getCleanDate(item.date, 2)}`}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.isQuestion && (
                          <Badge className="w-fit p-1.5 text-xs text-[#19A873] leading-[8px] bg-[#00C978]/25 rounded-md">
                            Registrierung
                          </Badge>
                        )}
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
                  </div>
                  <DropdownMenu key={key}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 text-sm" align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditDialog(item)}
                        disabled={
                          user?.role !== "owner" &&
                          !user?.functions?.includes(
                            "club-settings-documents-edit"
                          )
                        }
                      >
                        <div className="flex justify-between items-center">
                          <Pencil className="w-4 h-4 mr-2" />
                          Bearbeiten
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteDialog(item)}
                        disabled={
                          user?.role !== "owner" &&
                          !user?.functions?.includes(
                            "club-settings-documents-delete"
                          )
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
              ))}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                <div className="p-8 mobile:p-5">
                  <h1 className="text-xl font-semibold tablet:text-base">
                    Sind Sie sicher, dass Sie das Dokument löschen möchten?
                  </h1>
                  <p className="mt-8 text-sm text-content mobile:mt-5 mobile:text-xs">
                    {`Sind Sie sicher, das `}
                    <span className="text-custom">
                      {tempData?.documentname}
                    </span>
                    {`-Dokument zu löschen?`}
                  </p>
                  <div className="flex flex-row justify-end space-x-2 mt-12 tablet:mt-6 mobile:justify-evenly mobile:mt-3">
                    <Button
                      className="h-10 px-4 text-sm mobile:px-2"
                      variant="outline"
                      onClick={() => setDeleteOpen(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      className="h-10 px-4 mobile:px-2"
                      variant="destructive"
                      onClick={handleDeleteDoc}
                    >
                      {loading ? (
                        <ClipLoader
                          aria-label="loader"
                          data-testid="loader"
                          color="white"
                          size={16}
                        />
                      ) : (
                        <span className="text-sm">Entfernen</span>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
          <div
            className={cn(
              "flex p-10 pt-0 tablet:p-7 tablet:pt-0 mobile:p-5 mobile:pt-0",
              !isEmpty(club?.document) &&
                "justify-end pt-16 border-t tablet:pt-8 mobile:pt-4"
            )}
          >
            <Dialog open={open} onOpenChange={setOpen}>
              <Button
                className="h-10 flex px-4 space-x-2 bg-custom mobile:w-full hover:bg-customhover"
                onClick={handleUploadDialog}
                disabled={
                  user?.role !== "owner" &&
                  !user?.functions?.includes("club-settings-documents-add")
                }
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">Dokumente hinzufügen</span>
              </Button>
              <DialogContent className="max-w-3xl w-full max-h-[700px] overflow-hidden gap-0 p-0 rounded-3xl">
                <h1 className="text-sm font-semibold px-10 mt-10 tablet:px-7 tablet:mt-7 mobile:px-5 mobile:mt-5">
                  Dokument hinzufügen
                </h1>
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <div className="flex justify-between space-x-10 tablet:flex-col tablet:space-x-0 tablet:space-y-5">
                    <Dropzone
                      onDrop={(acceptedFiles) => setDocument(acceptedFiles[0])}
                      accept={{
                        "application/pdf": [],
                      }}
                      disabled={flag === "update"} // Deaktiviert Dropzone im Bearbeiten-Modus
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="flex flex-col space-y-2">
                          <div
                            className={cn(
                              "min-w-56 h-56 overflow-hidden rounded-3xl bg-[#F8F8F8] cursor-pointer mobile:w-full",
                              flag === "update" && "cursor-not-allowed" // Visuelles Feedback
                            )}
                            {...getRootProps()}
                          >
                            <div className="w-full h-full flex flex-col justify-center items-center space-y-2 rounded-3xl hover:border hover:border-content hover:border-dashed">
                              <FileText className="w-8 h-8 text-content" />
                              <p className="text-sm text-content text-center mobile:text-xs">
                                .pdf
                              </p>
                            </div>
                            <Input
                              {...getInputProps()}
                              className="hidden"
                              type="file"
                              disabled={flag === "update"} // Datei-Upload verhindern
                            />
                          </div>
                          {/* Zeige Dateinamen im Bearbeiten-Modus an, ohne UUID */}
                          {flag === "update" && tempData?.doc ? (
                            <p className="text-xs font-medium">
                              {tempData?.doc?.split("/").pop()?.replace(/^[a-f0-9-]+-/, "")}
                            </p>
                          ) : (
                            document && (
                              <p className="text-xs font-medium">
                                Hochgeladene Datei: {document?.name}
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </Dropzone>                    
                    <Form {...form}>
                                          <form
                                            className="w-full flex flex-col"
                                            onSubmit={form.handleSubmit(onSubmit)}
                                          >
                                            <div className="space-y-5">
                                              <div className="flex flex-col space-y-3">
                                                <p className="text-sm tablet:text-xs">Name *</p>
                                                <ProfileInput
                                                  form={form.control}
                                                  flag="other"
                                                  id="documentname"
                                                  placeholder="Satzung, Gründungsprotokoll, Datenschutzerklärung, u.a."
                                                />
                                              </div>
                                              <div className="flex flex-col space-y-3">
                                                <p className="text-sm tablet:text-xs">
                                                  Beschreibung
                                                </p>
                                                <ProfileInput
                                                  form={form.control}
                                                  flag="other"
                                                  type="textarea"
                                                  id="description"
                                                  placeholder="Beschreibung"
                                                />
                                              </div>
                                              <ProfileInput
                                                form={form.control}
                                                flag="other"
                                                type="checkbox"
                                                id="isQuestion"
                                                checkboxLabel="Dokument muss bei Registrierung akzeptiert werden"
                                              />
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
                                            <div className="flex justify-end space-x-3 mt-14 tablet:mt-7 mobile:flex-col mobile:space-x-0 mobile:space-y-3 mobile:mt-5">
                                              <Button
                                                className="h-10 px-4 text-sm mobile:px-2"
                                                type="button"
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                              >
                                                Abbrechen
                                              </Button>
                                              <Button
                                                className="h-10 px-4 mobile:px-2"
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
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDocumentPage;
