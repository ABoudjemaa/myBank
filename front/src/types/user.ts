import {Role} from "@/types/role";

export type User =  {
    id          : string;
    firstName    : string;
    email       : string;
    role        : Role;
    roles       : Role[];
} | null
