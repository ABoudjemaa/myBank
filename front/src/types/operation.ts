import {Category} from "@/types/category";

export type Operation = {
    id: number;
    label: string;
    amount: number;
    date: string;
    category: string | Category; // API returns category as a string (e.g., "/api/categories/1")
}