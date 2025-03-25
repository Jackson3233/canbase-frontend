import { z } from "zod";
import { getMaxDate } from "@/lib/functions";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .email("Dies ist keine gültige E-Mail."),
  password: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const TwoFAVerifyFormSchema = z.object({
  otp_token: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const SignUpFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .email("Dies ist keine gültige E-Mail."),
  password: z
    .string()
    .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
    .regex(/[a-z]/, {
      message: "Das Passwort muss mindestens einen Kleinbuchstaben enthalten.",
    })
    .regex(/[A-Z]/, {
      message: "Das Passwort muss mindestens einen Großbuchstaben enthalten.",
    })
    .regex(/[0-9]/, {
      message: "Das Passwort muss mindestens eine Zahl enthalten.",
    })
    .regex(/[\W_]/, {
      message: "Das Passwort muss mindestens ein Sonderzeichen enthalten.",
    }),
});

export const RegisterFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .refine((value) => value.includes("@"), {
      message: "Der Benutzername muss ein @ enthalten.",
    }),
  birth: z.coerce
    .date({
      required_error: "Dieses Feld muss ausgefüllt werden.",
      invalid_type_error: "Datumsformat ungültig.",
    })
    .min(new Date("1900-01-01"), "Bitte gib ein korrektes Datum an.")
    .max(getMaxDate(), "Mindestalter 18 Jahre."),
  rule: z
    .boolean()
    .default(false)
    .refine((data) => data.valueOf() === true, {
      message: "Dieses Feld muss ausgewählt werden.",
    }),
});

export const ForgotFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .email("Dies ist keine gültige E-Mail."),
});

export const ResetPassFormSchema = z
  .object({
    newpass: z
      .string()
      .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
      .regex(/[a-z]/, {
        message:
          "Das Passwort muss mindestens einen Kleinbuchstaben enthalten.",
      })
      .regex(/[A-Z]/, {
        message: "Das Passwort muss mindestens einen Großbuchstaben enthalten.",
      })
      .regex(/[0-9]/, {
        message: "Das Passwort muss mindestens eine Zahl enthalten.",
      })
      .regex(/[\W_]/, {
        message: "Das Passwort muss mindestens ein Sonderzeichen enthalten.",
      }),
    repass: z.string(),
  })
  .refine((data) => data.newpass === data.repass, {
    message: "Passwörter stimmen nicht überein",
    path: ["repass"],
  });

export const JoinClubAuthFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .email("Ungültige E-Mail"),
  password: z
    .string()
    .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
    .regex(/[a-z]/, {
      message: "Das Passwort muss mindestens einen Kleinbuchstaben enthalten.",
    })
    .regex(/[A-Z]/, {
      message: "Das Passwort muss mindestens einen Großbuchstaben enthalten.",
    })
    .regex(/[0-9]/, {
      message: "Das Passwort muss mindestens eine Zahl enthalten.",
    })
    .regex(/[\W_]/, {
      message: "Das Passwort muss mindestens ein Sonderzeichen enthalten.",
    }),
});

export const JoinClubInfoFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  birth: z.coerce
    .date({
      required_error: "Dieses Feld muss ausgefüllt werden.",
      invalid_type_error: "Datumsformat ungültig.",
    })
    .min(new Date("1900-01-01"), "Bitte gib ein korrektes Datum an.")
    .max(getMaxDate(), "Mindestalter 18 Jahre."),
  rule: z.boolean().default(false),
});

export const JoinClubBankFormSchema = z.object({
  holder: z.string().optional().or(z.literal("")),
  IBAN: z.string().optional().or(z.literal("")),
  BIC: z.string().optional().or(z.literal("")),
});

export const CreateClubFormSchema = z.object({
  clubname: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  street: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  postcode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export const ClubProfileFormSchema = z.object({
  clubname: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  website: z.string().url("Ungültige URL").optional().or(z.literal("")),
  email: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .email("Ungültige E-Mail")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  postcode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  description: z.string().optional().or(z.literal("")),
  prevent_info: z.string().optional().or(z.literal("")),
  info_members: z.string().optional().or(z.literal("")),
  discord: z
    .string()
    .url("Ungültige URL")
    .includes("discord.gg", { message: "Ungültige Discord URL." })
    .optional()
    .or(z.literal("")),
  tiktok: z
    .string()
    .url("Ungültige URL")
    .includes("tiktok.com", { message: "Ungültige Tiktok URL." })
    .optional()
    .or(z.literal("")),
  youtube: z
    .string()
    .url("Ungültige URL")
    .includes("youtube.com", { message: "Ungültige Youtube URL." })
    .optional()
    .or(z.literal("")),
  twitch: z
    .string()
    .url("Ungültige URL")
    .includes("twitch.tv", { message: "Ungültige Twitch URL." })
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("Ungültige URL")
    .includes("instagram.com", { message: "Ungültige Instagram URL." })
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Ungültige URL")
    .includes("x.com", { message: "Ungültige X URL." })
    .optional()
    .or(z.literal("")),
  facebook: z
    .string()
    .url("Ungültige URL")
    .includes("facebook.com", { message: "Ungültige Facebook URL." })
    .optional()
    .or(z.literal("")),
  imprint: z.string().optional().or(z.literal("")),
  maxUser: z.coerce.number().optional().or(z.literal(500)),
  minAge: z.coerce.number().optional().or(z.literal(18)),
});

export const MyProfileFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  alias: z.string().optional().or(z.literal("")),
  birth: z.coerce
    .date({
      required_error: "Dieses Feld muss ausgefüllt werden.",
      invalid_type_error: "Datumsformat ungültig.",
    })
    .min(new Date("1900-01-01"), "Bitte gib ein korrektes Datum an.")
    .max(getMaxDate(), "Bitte gib ein korrektes Datum an."),
  email: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .email("Ungültige E-Mail"),
  phone: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  postcode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
});

export const MemberFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .refine((value) => value.includes("@"), {
      message: "Der Benutzername muss ein @ enthalten.",
    }),
  birth: z.coerce
    .date({
      required_error: "Dieses Feld muss ausgefüllt werden.",
      invalid_type_error: "Datumsformat ungültig.",
    })
    .min(new Date("1900-01-01"), "Bitte gib ein korrektes Datum an.")
    .max(getMaxDate(), "Bitte gib ein korrektes Datum an."),
  email: z.string().email("Ungültige E-Mail").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  postcode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  ageVerify: z.boolean().default(false),
});

export const SEPAFormSchema = z.object({
  IBAN: z.string().optional().or(z.literal("")),
  BIC: z.string().optional().or(z.literal("")),
  mandate_refer: z.string().optional().or(z.literal("")),
  mandate_sign: z.date().optional(),
});

export const EmailInviteFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .email("Ungültige E-Mail"),
});

export const MemberShipFormSchema = z.object({
  membershipname: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  description: z.string().optional().or(z.literal("")),
  period: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  price: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." })
    .refine(
      (data) =>
        data.valueOf().split(",").length + data.valueOf().split(".").length <=
        3,
      {
        message: "Bitte geben Sie es korrekt ein.",
      }
    ),
  cannabis: z.coerce.number().optional(),
  cutting: z.coerce.number().max(5, { message: "Wert darf maximal 5 sein." }).optional(),
  seed: z.coerce.number().max(7, { message: "Wert darf maximal 7 sein." }).optional(),
  minAge: z.coerce.number().optional().or(z.literal(18)),
});

export const DocumentFormSchema = z.object({
  documentname: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  description: z.string().optional().or(z.literal("")),
  isQuestion: z.boolean().default(false),
  tags: z
    .string()
    .array()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const QuestionFormSchema = z.object({
  questiontitle: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  description: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  required: z.boolean().default(true),
  questiontype: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  placeholder: z.string().optional().or(z.literal("")),
});

export const RemoveRoleFormSchema = z.object({
  rolename: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const RoleFormSchema = z.object({
  rolename: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  roledesc: z.string().optional().or(z.literal("")),
});

export const PassFormSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const PublicChannelFormSchema = z.object({
  channelname: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  channeldesc: z.string().optional().or(z.literal("")),
});

export const PrivateChannelFormSchema = z.object({
  channelname: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  channeldesc: z.string().optional().or(z.literal("")),
  user: z
    .string()
    .array()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const StrainFormSchema = z.object({
  strainname: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  description: z.string().optional().or(z.literal("")),
  ratio: z.coerce.number().optional().or(z.literal(50)),
  thc: z.coerce.number().optional(),
  cbd: z.coerce.number().optional(),
  breeder: z.string().optional().or(z.literal("")),
  genetics: z.string().optional().or(z.literal("")),
  type: z.string().optional().or(z.literal("")),
  avg_height: z.coerce.number().optional(),
  yield_per_plant: z.coerce.number().optional(),
  growth_germination: z.coerce.number().optional(),
  growth_cutting: z.coerce.number().optional(),
  growth_vegetative: z.coerce.number().optional(),
  growth_flowering: z.coerce.number().optional(),
  growth_curing: z.coerce.number().optional(),
  effect: z.string().optional().or(z.literal("")),
  terpene: z.string().optional().or(z.literal("")),
  area: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
});

export const PlantFormSchema = z.object({
  plantname: z.string().optional().or(z.literal("")),
  strain: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  description: z.string().optional().or(z.literal("")),
  zone: z.string().optional().or(z.literal("")),
  charge: z.string().optional().or(z.literal("")),
  status: z.string().optional().or(z.literal("")),
  isParent: z.boolean().default(false),
  sowing_date: z.coerce.date().optional(),
  germination_date: z.coerce.date().optional(),
  cutting_date: z.coerce.date().optional(),
  growing_date: z.coerce.date().optional(),
  flowering_date: z.coerce.date().optional(),
  harvest_date: z.coerce.date().optional(),
  destruction_date: z.coerce.date().optional(),
  yield_per_plant: z.coerce.number().optional(),
  substrate: z.string().optional().or(z.literal("")),
  fertilizer: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
});

export const ChargeFormSchema = z.object({
  strain: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  plant_amount: z.coerce.number().optional(),
  zone: z.string().optional().or(z.literal("")),
  status: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
  sowing_date: z.coerce.date().optional(),
  germination_date: z.coerce.date().optional(),
  cutting_date: z.coerce.date().optional(),
  growing_date: z.coerce.date().optional(),
  flowering_date: z.coerce.date().optional(),
  harvest_date: z.coerce.date().optional(),
  destruction_date: z.coerce.date().optional(),
  yield_per_plant: z.coerce.number().optional(),
  substrate: z.string().optional().or(z.literal("")),
  fertilizer: z.string().optional().or(z.literal("")),
});

export const UpdateChargeFormSchema = z.object({
  strain: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  zone: z.string().optional().or(z.literal("")),
  status: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
  sowing_date: z.coerce.date().optional(),
  germination_date: z.coerce.date().optional(),
  cutting_date: z.coerce.date().optional(),
  growing_date: z.coerce.date().optional(),
  flowering_date: z.coerce.date().optional(),
  harvest_date: z.coerce.date().optional(),
  destruction_date: z.coerce.date().optional(),
  yield_per_plant: z.coerce.number().optional(),
  substrate: z.string().optional().or(z.literal("")),
  fertilizer: z.string().optional().or(z.literal("")),
});

export const ZoneFormSchema = z.object({
  zonename: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  description: z.string().optional().or(z.literal("")),
  size: z.string().optional().or(z.literal("")),
  electricity: z.string().optional().or(z.literal("")),
  lighting: z.string().optional().or(z.literal("")),
  ventilation: z.string().optional().or(z.literal("")),
  temperature: z.coerce.number().optional(),
  humidity: z.coerce.number().optional(),
  note: z.string().optional().or(z.literal("")),
});

export const HarvestFormSchema = z.object({
  status: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  member: z.string().optional().or(z.literal("")),
  wet_weight: z.coerce.number().optional().or(z.literal(0)),
  waste: z.coerce.number().optional().or(z.literal(0)),
  dry_weight: z.coerce.number().optional().or(z.literal(0)),
  cbd: z.coerce.number().optional().or(z.literal(0)),
  thc: z.coerce.number().optional().or(z.literal(0)),
  tags: z.string().array(),
  note: z.string().optional().or(z.literal("")),
});

export const DiaryFormSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const InventoryFormSchema = z.object({
  inventoryname: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  type: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  quantity: z.coerce.number().optional().or(z.literal(0)),
  unit: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  storage: z.string().optional().or(z.literal("")),
  sowing_date: z.date().optional(),
  manufacturer: z.string().optional().or(z.literal("")),
  serial_number: z.string().optional().or(z.literal("")),
  barcode: z.string().optional().or(z.literal("")),
  purchase_date: z.date().optional(),
  tags: z.string().array(),
  note: z.string().optional().or(z.literal("")),
});

export const MaterialCuttingFormSchema = z.object({
  cuttingname: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  type: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  quantity: z.coerce.number().optional().or(z.literal(0)),
  unit: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  storage: z.string().optional().or(z.literal("")),
  current_status: z.string().optional().or(z.literal("")),
  best_date: z.date().optional(),
  buyer: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  street: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  address: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  postcode: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  city: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  country: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  manufacturer: z.string().optional().or(z.literal("")),
  serial_number: z.string().optional().or(z.literal("")),
  barcode: z.string().optional().or(z.literal("")),
  purchase_date: z.date().optional(),
  tags: z.string().array(),
  note: z.string().optional().or(z.literal("")),
});

export const MaterialSeedFormSchema = z.object({
  seedname: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  type: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  quantity: z.coerce.number().optional().or(z.literal(0)),
  unit: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  storage: z.string().optional().or(z.literal("")),
  current_status: z.string().optional().or(z.literal("")),
  best_date: z.date().optional(),
  buyer: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  street: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  address: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  postcode: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  city: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  country: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  manufacturer: z.string().optional().or(z.literal("")),
  serial_number: z.string().optional().or(z.literal("")),
  barcode: z.string().optional().or(z.literal("")),
  purchase_date: z.date().optional(),
  tags: z.string().array(),
  note: z.string().optional().or(z.literal("")),
});

export const StorageFormSchema = z.object({
  storagename: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  description: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  postcode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  tags: z.string().array(),
  note: z.string().optional().or(z.literal("")),
});

export const TaxReserveFormSchema = z.object({
  storage: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  pickup_date: z.coerce.date({
    required_error: "Dieses Feld muss ausgefüllt werden.",
    invalid_type_error: "Datumsformat ungültig.",
  }),
});

export const DeclineReserveFormSchema = z.object({
  reason: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const BankFormSchema = z.object({
  recipient: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  IBAN: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  note_members: z.string().optional().or(z.literal("")),
  purpose: z.string().optional().or(z.literal("")),
  sepa_number: z.string().optional().or(z.literal("")),
  note_sepa_mandate: z.string().optional().or(z.literal("")),
});

export const BillFormSchema = z.object({
  contact_person: z.string().optional().or(z.literal("")),
  contact_email: z
    .string()
    .email("Ungültige E-Mail")
    .optional()
    .or(z.literal("")),
  contact_phone: z.string().optional().or(z.literal("")),
  prefix: z.string().optional().or(z.literal("")),
  suffix: z.string().optional().or(z.literal("")),
});

export const TransactionCreateForm = z.object({
  recipient: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  description: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().optional().or(z.literal(0)),
  tax: z.coerce.number().optional(),
  method: z.string().min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
  purpose: z.string().optional().or(z.literal("")),
  IBAN: z.string().optional().or(z.literal("")),
  BIC: z.string().optional().or(z.literal("")),
  mandate: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
});

export const TransactionImportForm = z.object({
  importtype: z
    .string()
    .min(1, { message: "Dieses Feld muss ausgefüllt werden." }),
});

export const BookFormSchema = z.object({
  booking_day: z.coerce.number().optional(),
  overdue: z.coerce.number().optional(),
  auto_invoice: z.boolean().default(false),
});
