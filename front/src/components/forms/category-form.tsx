import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import {CategoryFormData} from "@/components/schema/category-form-schema";

interface CategoryFormProps {
    form: UseFormReturn<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => void;
    isLoading: boolean;
    submitLabel?: string;
}

export default function CategoryForm({
                                       form,
                                       onSubmit,
                                       isLoading,
                                       submitLabel = "Create Account",
                                   }: CategoryFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 max-w-4xl mx-auto">
                {/* Email */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Category title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center justify-between">
                    <Button type="submit" disabled={isLoading}>
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
