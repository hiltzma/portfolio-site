import { Doc, Id } from "../../convex/_generated/dataModel";

export type Profile = Doc<"profile"> & {
  profileImageUrl?: string | null;
  bannerImageUrl?: string | null;
};

export type Certificate = Doc<"certificates"> & {
  attachmentUrl?: string | null;
};

export type Achievement = Doc<"achievements"> & {
  attachmentUrl?: string | null;
};

export type Education = Doc<"education"> & {
  attachmentUrl?: string | null;
};

export interface AdminPanelProps {
  profile: Profile | null;
  certificates: Certificate[] | undefined;
  achievements: Achievement[] | undefined;
  education: Education[] | undefined;
}

export interface PublicViewProps {
  profile: Profile;
  certificates: Certificate[] | undefined;
  achievements: Achievement[] | undefined;
  education: Education[] | undefined;
}
