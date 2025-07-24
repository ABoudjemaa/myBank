import { LucideIcon } from "lucide-react";



type PartialCollectionView = {
  "@id": string;
  "@type": string;
  first: string;
  last: string;
  next?: string;
}

type IriTemplateMapping = {
  "@type": string;
  variable: string;
  property: string;
  required: boolean;
}

type IriTemplate = {
  "@type": string;
  template: string;
  variableRepresentation: string;
  mapping: IriTemplateMapping[];
}

export type ItemResponse = {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
}

export type CollectionResponse<T> = {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems?: number;
  member: T[];
  view?: PartialCollectionView;
  search?: IriTemplate;
}

export type Stat = {
  title: string;
  value: number | string | undefined;
  icon?: LucideIcon
}