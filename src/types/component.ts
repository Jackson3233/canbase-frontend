import React, { ReactElement } from "react";
import { Editor } from "@tiptap/react";

export interface SidebarItemPropsInterface {
  route: string;
  children: [React.ReactNode, React.ReactNode];
  comingsoon?: boolean;
  isMobile: boolean;
  setIsToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ClubCardPropsInterface {
  title: string;
  icon: React.ReactNode;
  content: string;
  btnIcon: React.ReactNode;
  btnText: string;
  route: string;
}

export interface ClubPropsInterface {
  clubname: string;
  badge?: string;
  avatar?: string;
  users: number;
  maxUser: number;
  description?: string;
  prevent_info?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  discord?: string;
  facebook?: string;
  youtube?: string;
  clubStatus: string;
  clubID: string;
  allowRequest?: boolean;
  handleClubInfo?: any;
}

export interface TextGroupPropsInterface {
  type?: "default" | "last";
  title: string;
  value?: string;
  html?: ReactElement;
  children?: React.ReactNode;
}

export interface ProfileInputPropsInterface {
  form: any;
  flag?: string;
  type?: string;
  id: string;
  title?: string;
  content?: string;
  minValue?: number;
  maxValue?: number;
  checkboxLabel?: string;
  radioValues?: { id: string; value: string }[];
  checkboxValues?: { id: string; value: string }[];
  selectValues?: { key: string; value: string }[];
  textWidth?: string;
  tag?: string;
  handleValue?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}


export interface AddressInputPropsInterface {
  form: any;
  type?: "default" | "required";
  content?: string;
  textWidth?: string;
  disabled?: boolean;
}

export interface ColorPropsInterface {
  colorName: string;
  bgColor: string;
  borderColor: string;
  active: boolean;
  setColor: any;
}

export interface ChatRoomPropsInterface {
  title: string;
  roomID: string;
  chatData: any;
  setChatData: any;
}

export interface MessagePropsInterface {
  user: string;
  text: string;
  time: string;
  type: string;
}

export interface ClubStatusPropsInterface {
  done: boolean;
  title: string;
  content: string;
  link: string;
}

export interface AnalyticPropsInterface {
  title: string;
  content: string | number;
  info: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
}

export interface FeedbackPropsInterface {
  openFeedback: boolean;
  setOpenFeedback: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UpdatesPropsInterface {
  openUpdates: boolean;
  setOpenUpdates: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MediaPropsInterface {
  openMedia: boolean;
  setOpenMedia: React.Dispatch<React.SetStateAction<boolean>>;
  media: any;
  changeCheck: any;
}

export interface TiptapPropsInterface {
  message: string;
  disabled: boolean;
  setMessage: any;
  onSend: (message: string) => {};
}

export interface ChatToolbarPropsInterface {
  editor: Editor | null;
  message: string;
  setMessage: any;
  disabled: boolean;
}

export interface CommunityTiptapPropsInterface {
  message: string;
  setMessage: any;
  disabled?: boolean;
  documents: any;
  setDocuments: any;
  handleImages: any;
  votes?: any;
  setVotes?: any;
  onSend: (message: string) => {};
  imgsCount: number;
  docsCount: number;
  voteAvailable?: boolean;
}

export interface CommunityToolbarPropsInterface {
  editor: Editor | null;
  message: string;
  setMessage: any;
  documents: any;
  setDocuments: any;
  handleImages: any;
  votes: any;
  setVotes: any;
  imgsCount: number;
  docsCount: number;
  voteAvailable: boolean;
}

export interface MediaItemPropsInterface {
  title: string;
  media: string;
  content: string;
  check: boolean;
  clickItem: any;
}

export interface OverviewPropsInterface {
  title: string;
  content: string;
  flag?: "default" | "other";
}

export interface StrainPropsInterface {
  openStrainDlg: boolean;
  setOpenStrainDlg: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PlantPropsInterface {
  openPlantDlg: boolean;
  setOpenPlantDlg: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ChargePropsInterface {
  openChargeDlg: boolean;
  setOpenChargeDlg: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ZonePropsInterface {
  openZoneDlg: boolean;
  setOpenZoneDlg: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HarvestPropsInterface {
  openHarvestDlg: boolean;
  setOpenHarvestDlg: React.Dispatch<React.SetStateAction<boolean>>;
  chargeID: string;
}

export interface GrowCardPropsInterface {
  type: string;
  title: string;
  status?: string;
}
