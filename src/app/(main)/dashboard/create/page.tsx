"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppDispatch } from "@/store/hook";
import { userActions } from "@/store/reducers/userReducer";
import { clubActions } from "@/store/reducers/clubReducer";
import { createClub } from "@/actions/club";
import ProfileInput from "@/components/basic/ProfileInput";
import AddressInput from "@/components/basic/AddressInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CreateClubFormSchema } from "@/constant/formschema";

const ClubCreatePage = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof CreateClubFormSchema>>({
    resolver: zodResolver(CreateClubFormSchema),
    defaultValues: {
      clubname: "",
      street: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CreateClubFormSchema>) => {
    setLoading(true);

    const result = await createClub(data);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(clubActions.setClub({ club: result.club }));
      dispatch(userActions.setUser({ user: result.user }));

      router.push("/club/profile");
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <Card className="w-full my-8">
        <CardContent className="p-0">
          <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
            <h1 className="text-2xl font-semibold tablet:text-xl mobile:text-center">
              Lege deine Club-Daten fest
            </h1>
            <p className="pt-2 text-sm text-content mobile:text-center mobile:text-xs">
              Du kannst alle Daten, später in den Einstellungen anpassen
            </p>
          </div>
          <Form {...form}>
            <form
              className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-4">
                <ProfileInput
                  form={form.control}
                  id="clubname"
                  title="Name*"
                  textWidth="max-w-xs"
                  placeholder="CSC e.V."
                />
                <AddressInput form={form.control} textWidth="max-w-xs" />
                <ProfileInput
                  form={form.control}
                  type="textarea"
                  id="description"
                  title="Beschreibung"
                  textWidth="max-w-xs"
                  placeholder="Beschreibung"
                />
              </div>
              <Button
                className="h-10 self-end px-4 mt-9 bg-custom mobile:w-full mobile:mt-5 hover:bg-customhover"
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
                  <span className="text-sm">Club erstellen</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubCreatePage;
