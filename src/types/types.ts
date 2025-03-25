interface Club {
  _id: string;
  No: number;
  clubName: string;
  clubStatus: string;
  userCount: number;
  website?: string;
  email?: string;
  phone?: string;
  street?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  description?: string;
  prevent_info?: string;
  info_members?: string;
  discord?: string;
  tiktok?: string;
  youtube?: string;
  twitch?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  imprint?: string;
  maxUser?: number;
  minAge?: number;
  avatar?: string;
  badge?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  memberID: string;
  two_fa_status: string;
  role?: string;
  status?: string;
  registerDate?: string;
  memberdate?: string;
  last_login?: string;
  last_password_change?: string;
}

interface ClubNote {
  _id: string;
  clubId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateLog {
  subtitle:string;
  versionNumber: string;
  releaseDate: string;
  newFeatures: Array<{
    key: string;
    value: string;
  }>;
  improvements: Array<{
    key: string;
    value: string;
  }>;
}

export type { Club, User, ClubNote, UpdateLog };