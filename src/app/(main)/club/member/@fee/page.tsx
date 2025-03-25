"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronLeft,
  LogOut,
  MoreVertical,
  Pencil,
  Plus,
  Ticket,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { membershipActions } from "@/store/reducers/membershipReducer";
import {
  createMembership,
  removeMembership,
  updateMembership,
} from "@/actions/membership";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberShipFormSchema } from "@/constant/formschema";
import { numberKeysForMembershipFee } from "@/constant/numberkeys";
import { getPeriod, isEmpty } from "@/lib/functions";

const MemberFeePage = () => {
  const dispatch = useAppDispatch();
  const { membership } = useAppSelector((state) => state.membership);

  const { toast } = useToast();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<any>();
  const form = useForm<z.infer<typeof MemberShipFormSchema>>({
    resolver: zodResolver(MemberShipFormSchema),
    defaultValues: {
      membershipname: "",
      description: "",
      period: "",
      price: "",
      cannabis: 0,
      cutting: 0,
      seed: 0,
      minAge: 18,
    },
  });

  useEffect(() => {
    if (isEdit && isEmpty(item)) {
      form.reset({
        membershipname: "",
        description: "",
        period: "",
        price: "",
        cannabis: 0,
        cutting: 0,
        seed: 0,
        minAge: 18,
      });
    }
  }, [isEdit, form, item]);

  const handleUpdateEdit = async (param: any) => {
    form.reset({
      membershipname: param.membershipname,
      description: param.description,
      period: param.period,
      price: String(param.price),
      cannabis: param.cannabis,
      cutting: param.cutting,
      seed: param.seed,
      minAge: param.minAge,
    });

    setItem(param);
    setIsEdit((prev) => !prev);
  };

  const onSubmit = async (data: z.infer<typeof MemberShipFormSchema>) => {
    setLoading(true);

    let result;

    if (isEmpty(item)) {
      result = await createMembership(data);
    } else {
      result = await updateMembership({ ...data, membershipID: item._id });
    }

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setIsEdit(false);
    setLoading(false);

    if (result.success) {
      dispatch(
        membershipActions.setMembership({ membership: result.membership })
      );
    }
  };

  const handleRemoveMembership = async (param: string) => {
    const result = await removeMembership({ membershipID: param });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(
        membershipActions.setMembership({ membership: result.membership })
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {isEdit ? (
          <>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => setIsEdit((prev) => !prev)}
            >
              <ChevronLeft className="w-3 h-3" />
              <span className="text-xs">Abbrechen</span>
            </Button>
            <Card>
              <CardContent className="p-0">
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    Neuer Mitgliedsbeitrag
                  </h1>
                  <p className="pt-2 text-sm text-content mobile:text-xs">
                    An dieser Stelle hast du die Möglichkeit, einen neuen
                    Mitgliedsbeitrag zu erstellen.
                  </p>
                </div>
                <Form {...form}>
                  <form
                    className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="space-y-6">
                      <ProfileInput
                        form={form.control}
                        id="membershipname"
                        title="Name*"
                        placeholder="Standart"
                      />
                      <ProfileInput
                        form={form.control}
                        id="description"
                        type="textarea"
                        title="Beschreibung"
                        placeholder="Beschreibung"
                      />
                    </div>
                    <div className="space-y-6 mt-10 tablet:mt-5">
                      <p className="text-lg font-semibold tablet:txt-base">
                        Abrechnung
                      </p>
                      <ProfileInput
                        form={form.control}
                        id="period"
                        type="selectbox"
                        title="Abrechnungszeitraum*"
                        placeholder="Monatlich"
                        selectValues={[
                          { key: "yearly", value: "Jährlich" },
                          { key: "half-yearly", value: "Halbjährlich" },
                          { key: "quarterly", value: "Vierteljährlich" },
                          { key: "monthly", value: "Monatlich" },
                          { key: "weekly", value: "Wöchentlich" },
                          { key: "daily", value: "Täglich" },
                          { key: "unique", value: "Einmalig" },
                        ]}
                      />
                      <div className="w-full flex justify-between tablet:flex-col">
                        <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                          <p className="font-medium mobile:text-sm">Preis*</p>
                          <p className="text-sm text-content mobile:text-xs">
                            Der Preis in Euro pro Abrechnungsperiode.
                          </p>
                        </div>
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field: { onChange } }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <div className="w-full h-9 flex items-center bg-transparent text-sm px-3 py-1 border border-input rounded-md shadow-sm cursor-text focus:ring-1 focus:ring-ring">
                                  <div
                                    className="focus:outline-none"
                                    data-placeholder="0"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onKeyDown={(e) => {
                                      if (
                                        !numberKeysForMembershipFee.includes(
                                          e.key
                                        )
                                      ) {
                                        e.preventDefault();
                                        return false;
                                      }
                                    }}
                                    onInput={(e: any) =>
                                      onChange(
                                        e.target.innerText.replace(",", ".")
                                      )
                                    }
                                  >
                                    {!isEmpty(item) &&
                                      String(item?.price).replace(".", ",")}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-left" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="space-y-6 mt-10 tablet:mt-5">
                      <p className="text-lg font-semibold tablet:txt-base">
                        Kontingente (monatlich)
                      </p>
                      <div className="w-full flex justify-between tablet:flex-col">
                        <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                          <p className="font-medium mobile:text-sm">
                            Cannabis in Gramm
                          </p>
                          <p className="text-sm text-content mobile:text-xs">
                            Die monatliche Menge Cannabis in dieser
                            Mitgliedschaft.
                          </p>
                        </div>
                        <FormField
                          control={form.control}
                          name="cannabis"
                          render={({ field: { onChange } }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <div className="w-full h-9 flex items-center bg-transparent text-sm px-3 py-1 border border-input rounded-md shadow-sm cursor-text focus:ring-1 focus:ring-ring">
                                  <div
                                    className="focus:outline-none"
                                    data-placeholder="0"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onKeyDown={(e) => {
                                      if (
                                        !numberKeysForMembershipFee.includes(
                                          e.key
                                        )
                                      ) {
                                        e.preventDefault();
                                        return false;
                                      }
                                    }}
                                    onInput={(e: any) =>
                                      onChange(
                                        e.target.innerText.replace(",", ".")
                                      )
                                    }
                                  >
                                    {!isEmpty(item) &&
                                      String(item?.cannabis).replace(".", ",")}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-left" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full flex justify-between tablet:flex-col">
                        <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                          <p className="font-medium mobile:text-sm">
                            Stecklinge
                          </p>
                          <p className="text-sm text-content mobile:text-xs">
                            Die monatliche Menge Stecklinge in dieser
                            Mitgliedschaft.
                          </p>
                        </div>
                        <FormField
                          control={form.control}
                          name="cutting"
                          render={({ field: { onChange } }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <div className="w-full h-9 flex items-center bg-transparent text-sm px-3 py-1 border border-input rounded-md shadow-sm cursor-text focus:ring-1 focus:ring-ring">
                                  <div
                                    className="focus:outline-none"
                                    data-placeholder="0"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onKeyDown={(e) => {
                                      if (
                                        !numberKeysForMembershipFee.includes(
                                          e.key
                                        )
                                      ) {
                                        e.preventDefault();
                                        return false;
                                      }
                                    }}
                                    onInput={(e: any) =>
                                      onChange(
                                        e.target.innerText.replace(",", ".")
                                      )
                                    }
                                  >
                                    {!isEmpty(item) &&
                                      String(item?.cutting).replace(".", ",")}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-left" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full flex justify-between tablet:flex-col">
                        <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                          <p className="font-medium mobile:text-sm">Samen</p>
                          <p className="text-sm text-content mobile:text-xs">
                            Die monatliche Menge Samen in dieser Mitgliedschaft.
                          </p>
                        </div>
                        <FormField
                          control={form.control}
                          name="seed"
                          render={({ field: { onChange } }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <div className="w-full h-9 flex items-center bg-transparent text-sm px-3 py-1 border border-input rounded-md shadow-sm cursor-text focus:ring-1 focus:ring-ring">
                                  <div
                                    className="focus:outline-none"
                                    data-placeholder="0"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onKeyDown={(e) => {
                                      if (
                                        !numberKeysForMembershipFee.includes(
                                          e.key
                                        )
                                      ) {
                                        e.preventDefault();
                                        return false;
                                      }
                                    }}
                                    onInput={(e: any) =>
                                      onChange(
                                        e.target.innerText.replace(",", ".")
                                      )
                                    }
                                  >
                                    {!isEmpty(item) &&
                                      String(item?.seed).replace(".", ",")}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-left" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="space-y-6 mt-10 tablet:mt-5">
                      <p className="text-lg font-semibold tablet:txt-base">
                        Sichtbarkeit
                      </p>
                      <ProfileInput
                        form={form.control}
                        type="number"
                        id="minAge"
                        title="Mindestalter*"
                        content="Das Mindestalter für die Mitgliedschaft."
                        minValue={18}
                        placeholder="18"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6 tablet:mt-3 mobile:justify-evenly">
                      <Button
                        className="h-10 px-4 mobile:px-2"
                        type="button"
                        variant="outline"
                        onClick={() => setIsEdit((prev) => !prev)}
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
                          <span className="text-sm">Erstellen</span>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </>
        ) : !isEmpty(membership) ? (
          <>
            {isEmpty(item) ? (
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={() => setIsEdit((prev) => !prev)}
              >
                <Plus className="w-3 h-3" />
                <span className="text-xs">Neuen Mitgliedsbeitrag anlegen</span>
              </Button>
            ) : (
              <Button
                className="h-auto w-fit flex space-x-2 rounded-2xl"
                variant="outline"
                onClick={() => {
                  setItem(undefined);
                  setIsEdit((prev) => !prev);
                }}
              >
                <Plus className="w-3 h-3" />
                <span className="text-xs">Neuen Mitgliedsbeitrag anlegen</span>
              </Button>
            )}
            <div className="flex flex-wrap gap-3 mobile:justify-center">
              {membership.map((item, key) => (
                <Card className="max-w-sm w-full rounded-3xl" key={key}>
                  <CardContent className="relative p-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="absolute top-6 right-4"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 text-sm"
                        align="start"
                      >
                        <DropdownMenuItem
                          onClick={() => handleUpdateEdit(item)}
                        >
                          <div className="flex justify-between items-center">
                            <Pencil className="w-4 h-4 mr-2" />
                            Bearbeiten
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleRemoveMembership(item._id as string)
                          }
                        >
                          <div className="flex justify-between items-center text-destructive">
                            <LogOut className="w-4 h-4 mr-2" />
                            Löschen
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <>
                      <div className="w-full flex flex-col items-center border-b p-8 pb-0 mobile:p-5 mobile:pb-0">
                        <div className="w-20 h-20 flex justify-center items-center rounded-full bg-custom">
                          <Ticket className="w-5 h-5" color="white" />
                        </div>
                        <div className="max-w-56 w-full py-5 text-center">
                          <p className="text-2xl font-semibold tablet:text-xl mobile:text-lg">
                            {item.membershipname}
                          </p>
                          <p
                            className="overflow-hidden text-sm mobile:text-xs"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="px-10 py-5 mobile:px-5 mobile:py-3">
                        <div className="flex justify-between py-5 text-sm border-b tablet:py-3">
                          <p className="max-w-16 w-full text-content mr-11">
                            Preis
                          </p>
                          <p className="w-full">
                            {String(item.price).replace(".", ",")} € /{" "}
                            {getPeriod(item.period as string)}
                          </p>
                        </div>
                        <div className="flex justify-between py-5 text-sm border-b tablet:py-3">
                          <p className="max-w-16 w-full text-content mr-11">
                            Cannabis
                          </p>
                          <p className="w-full">
                            {String(item.cannabis).replace(".", ",")} g /{" "}
                            Monatlich
                          </p>
                        </div>
                        <div className="flex justify-between py-5 text-sm border-b tablet:py-3">
                          <p className="max-w-16 w-full text-content mr-11">
                            Stecklinge
                          </p>
                          <p className="w-full">
                            {String(item.cutting).replace(".", ",")} /{" "}
                            Monatlich
                          </p>
                        </div>
                        <div className="flex justify-between py-5 text-sm tablet:py-3">
                          <p className="max-w-16 w-full text-content mr-11">
                            Samen
                          </p>
                          <p className="w-full">
                            {String(item.seed).replace(".", ",")} /{" "}
                            Monatlich
                          </p>
                        </div>
                      </div>
                    </>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-10 tablet:p-7 mobile:p-5">
            <CardContent className="p-0">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Mitgliedsbeiträge
              </h1>
              <p className="max-w-2xl w-full pt-2 text-sm text-content tablet:max-w-none mobile:text-xs">
                {`Du hast noch keine Mitgliedsbeiträge für deinen Club erstellt.
                Klicke auf 'Mitgliedsbeitrag hinzufügen', um zu beginnen und
                deinem Club eine einzigartige Struktur zu geben. Gestalte
                unterschiedliche Mitgliedsbeiträge und weise sie den Mitgliedern
                zu.`}
              </p>
              <Button
                className="h-10 flex px-4 mt-8 text-sm bg-custom mobile:w-full mobile:mt-4 hover:bg-customhover"
                onClick={() => setIsEdit((prev) => !prev)}
              >
                Mitgliedsbeitrag hinzufügen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberFeePage;
