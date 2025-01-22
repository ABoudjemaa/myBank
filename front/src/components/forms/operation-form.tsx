"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useOperations } from "@/hooks/useOperations"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"






const formSchema = z.object({
    "label": z.string().min(1).max(255),
    "amount": z.coerce.number().gte(0).lte(9999),
    "date": z.string(),
    "category": z.string()
})

export default function OperationForm({ operation }: { operation?: any }) {

    const { createOperation, editOperation } = useOperations();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (values: any) => {
        await createOperation(values);
        toast("Operation Created successfully", {
            style: {
                background: "#4CAF50",
                color: "#FFFFFF",
            },
        });
    }
    
    const handleUpdate = async (values: any) => {
        await editOperation(operation.id, values);
        toast("Operation Updated successfully", {
            style: {
                background: "#4CAF50",
                color: "#FFFFFF",
            },
        });
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: operation?.label || "",
            amount: parseInt(operation?.amount) || 0,
            date: operation?.date || "2025-01-22T10:01:22.714Z",
            category: "/api/categories/1",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // e.preventDefault();
        try {
            if (operation) {
                await handleUpdate(values);
            }
            else {
                await handleCreate(values);
            }
            router.push('/operations');
        } catch (err) {
            console.log(err);
            setError('Failed to create operation. Please try again.');
        }
    }

    return (
        <Form {...form}>
            {error && (
                <Alert variant="destructive" className="text-sm">
                    {error}
                </Alert>
            )}
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Date" {...field} />
                  </FormControl>
                  <FormDescription>
                    
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} 
            />*/}

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
