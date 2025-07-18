import {cn} from "@/lib/utils";

export const activeLinkClasses = (path: string, pathname:string) => {
    return cn(
        "text-gray-300 hover:text-white",
        pathname.startsWith(path) && "text-white font-bold"
    );
};