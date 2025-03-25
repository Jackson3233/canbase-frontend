"use client";

import { useEffect, useState } from "react";
import { MapPinHouse } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormSubmit } from "./form-button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { axiosPrivateInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { propertyActions } from "@/store/reducers/propertyReducer";


export const CreateRealEstate = (selectedLocation: any) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const realEstateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    location: z.string(),
    size: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, {
        message: "Size must be greater than 0",
      }),
    price: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, {
        message: "Price must be greater than 0",
      }),
    phone: z.string().min(10, "Phone is required"),
  });

  const form = useForm<z.infer<typeof realEstateSchema>>({
    resolver: zodResolver(realEstateSchema),
    defaultValues: {
      title: "",
      location: "",
      size: 0,
      price: 0,
      phone: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        title: "",
        location: "",
        size: 0,
        price: 0,
        phone: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: z.infer<typeof realEstateSchema>) => {
    data.location = selectedLocation.selectedLocation
    
    try {
      if (selectedLocation.selectedLocation) {
        const result = await axiosPrivateInstance
          .post(`/broccoli/createRealEstate/${user?._id}`, data)
          .then((res) => res.data);

        if (result.success) {
          // await dispatch(propertyActions.setProperty({ property: result.data }));
          setIsOpen(false);
          toast({
            className:
              "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
            description: result.msg,
          });
        }
      }
    } catch (error) {
      console.error(error);
      throw error; // Optional: rethrow the error for further handling
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer w-fit flex items-center space-x-2 px-4 py-2 text-green-800 bg-green-100 border border-green-800 rounded-2xl"
      >
        <MapPinHouse className="w-3 h-3" />
        <span className="text-xs">erstellen</span>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl flex flex-col w-full gap-0 overflow-hidden p-8 rounded-3xl mobile:p-5">
          <DialogHeader className="text-left mb-4">
            <DialogTitle className="text-lg tablet:text-base">
              Immobilien
            </DialogTitle>
            <DialogDescription>
              Erzählen Sie uns von Ihrer Immobilie.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" {...field} disabled />
                      {/* <GooglePlacesAutocomplete
                        apiKey="****"
                        apiOptions={{ language: "de", region: "de" }}
                        selectProps={{
                          isDisabled: true,
                        }}
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (square meter)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (€)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSubmit className="self-end w-fit h-10 px-4 text-sm tablet:mt-5 mobile:w-full mobile:self-auto">
                Absenden
              </FormSubmit>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
