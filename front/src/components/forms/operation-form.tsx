import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {UseFormReturn} from "react-hook-form";
import {OperationFormData} from "@/components/schema/operation-form-schema";
import SelectCategoryField from "@/components/forms/fields/select-category-field";
import {Category} from "@/types/category";

interface OperationFormProps {
    form: UseFormReturn<OperationFormData>;
    categories: Category[];
    onSubmit: (data: OperationFormData) => void;
    isLoading: boolean;
    submitLabel?: string;
}

export default function OperationForm({
                                          form,
                                          categories,
                                          onSubmit,
                                          isLoading,
                                          submitLabel = "Create Account",
                                      }: OperationFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 max-w-4xl mx-auto">
                {/* Email */}
                <FormField
                    control={form.control}
                    name="label"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Operation title" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Operation title" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <SelectCategoryField form={form} name={"category"} categories={categories}/>

                <div className="flex items-center justify-between">
                    <Button type="submit" disabled={isLoading}>
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
