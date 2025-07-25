import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Category } from "@/types/category"


type SelectCategoryFieldProps = {
  form: any
  name: string
  categories: Category[]
}

export default function SelectCategoryField({
  form,
  name,
  categories,
}: SelectCategoryFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">Category</FormLabel>
          <FormControl>
            <select {...field} className="w-full border rounded px-2 py-1">
              <option value="">-- Select category --</option>
              {categories.map((category) => (
                <option key={category.id} value={`/api/categories/${category.id}`}>
                  {category.title}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
