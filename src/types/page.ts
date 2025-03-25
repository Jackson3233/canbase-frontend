import { ColumnDef } from "@tanstack/react-table";

export type RequestType = {
  avatar: string;
  username: string;
  email: string;
  birth: string;
  clublist: any;
  memberID: string;
};

export type WaitlistType = {
  avatar: string;
  username: string;
  email: string;
  birth: string;
  clublist: any;
  memberID: string;
};

export type PendingType = {
  avatar: string;
  username: string;
  email: string;
  birth: string;
  clublist: any;
  memberID: string;
};

export type MemberType = {
  avatar: string;
  username: string;
  email: string;
  birth: string;
  status: "active" | "inactive";
  memberdate: string;
  clubrole: {
    rolename: string;
    roledesc: string;
    roleID: string;
    rolecolor: string;
  }[];
  membership: any;
  memberID: string;
};

export type PlantType = {
  plantname: string;
  strain: {
    strainname: string;
  };
  charge: {
    chargename: string;
  };
  isParent: boolean;
  status:
    | "seeds"
    | "germination"
    | "cutting"
    | "vegetative"
    | "flowering"
    | "harvest"
    | "quarantine"
    | "destroyed";
  isHarvested: boolean;
  plantID: string;
  updatedAt: string;
  createdAt: string;
};

export type TransactionType = {
  recipient: string;
  amount: number;
  method: string;
  purpose: string;
  attachments: string[];
  transactionID: string;
  updatedAt: string;
  createdDate: string;
};

export type HarvestType = {
  harvestname: string;
  status:
    | "drying"
    | "curing"
    | "test_in_progress"
    | "ready_for_issue"
    | "destroyed";
  charge: {
    chargename: string;
    plants: any;
  };
  member: {
    username: string;
  };
  wet_weight: number;
  waste: number;
  dry_weight: number;
  harvestID: string;
  updatedAt: string;
  createdAt: string;
};

export type InventoryType = {
  inventoryID: string;
  inventoryname: string;
  quantity: number;
  unit: string;
  storage: {
    storagename: string;
  };
  type: string;
  manufacturer: string;
  serial_number: string;
  tags: string[];
  createdAt: string;
};

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface MineLayoutPropsInterface {
  profile: React.ReactNode;
  bookings: React.ReactNode;
  account: React.ReactNode;
}

export interface OverviewLayoutPropsInterface {
  intro: React.ReactNode;
  info: React.ReactNode;
  policy: React.ReactNode;
  contact: React.ReactNode;
}

export interface ClubLayoutPropsInterface {
  // children: React.ReactNode;
  edit: React.ReactNode;
  website: React.ReactNode;
  design: React.ReactNode;
  document: React.ReactNode;
  general: React.ReactNode;
  question: React.ReactNode;
  authorities: React.ReactNode;
}

export interface MemberLayoutPropsInterface {
  children: React.ReactNode;
  manage: React.ReactNode;
  invite: React.ReactNode;
  fee: React.ReactNode;
  role: React.ReactNode;
}

export interface CommunityLayoutPropsInterface {
  feed: React.ReactNode;
}

export interface FinanceLayoutPropsInterface {
  book: React.ReactNode;
  transaction: React.ReactNode;
  setting: React.ReactNode;
}

export interface GrowLayoutPropsInterface {
  strain: React.ReactNode;
  zone: React.ReactNode;
  charge: React.ReactNode;
  plant: React.ReactNode;
  harvest: React.ReactNode;
}

export interface InventoryLayoutPropsInterface {
  overview: React.ReactNode;
  cannabis: React.ReactNode;
  material: React.ReactNode;
  storage: React.ReactNode;
}

export interface DeliveryLayoutPropsInterface {
  overview: React.ReactNode;
  tax: React.ReactNode;
  product: React.ReactNode;
}

export interface BroccoliLayoutPropsInterface {
  map: React.ReactNode;
}

export interface JoinClubFormPropsInterface {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}
