import type { Photo } from "@/types/photo";

export interface UnlockedClientGallery {
  code: string;
  clientName: string;
  projectTitle: string;
  date: string;
  location: string;
  note: string;
  maxSelection: number;
  photos: Photo[];
}
