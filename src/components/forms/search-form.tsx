"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const filterItems = [
  {
    category: "Type",
    items: [
      { id: "sport", label: "Sport", count: 10 },
      { id: "suv", label: "SUV", count: 12 },
      { id: "mpv", label: "MPV", count: 16 },
      { id: "sedan", label: "Sedan", count: 20 },
      { id: "coupe", label: "Coupe", count: 14 },
      { id: "hatchback", label: "Hatchback", count: 14 },
    ],
  },
  {
    category: "Capacity",
    items: [
      { id: "2Person", label: "2 Person", count: 10 },
      { id: "4Person", label: "4 Person", count: 14 },
      { id: "6Person", label: "6 Person", count: 12 },
      { id: "8orMore", label: "8 or More", count: 16 },
    ],
  },
  {
    category: "Brand",
    items: [
      { id: "bmw", label: "BMW", count: 10 },
      { id: "toyota", label: "Toyota", count: 14 },
      { id: "chevrolet", label: "Chevrolet", count: 12 },
      { id: "volkswagen", label: "Volkswagen", count: 16 },
    ],
  },
] as const;

const FormSchema = z.object({
  type: z.array(z.string()),
  capacity: z.array(z.string()),
  brand: z.array(z.string()),
  price: z.number().min(0).max(100),
  is_available: z.boolean().default(false),
});

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: searchParams.get("type")?.split(",") || [],
      capacity: searchParams.get("capacity")?.split(",") || [],
      brand: searchParams.get("make")?.split(",") || [],
      price: parseInt(searchParams.get("max_price") || "100"),
      is_available: searchParams.get("is_available") === "1",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const params = new URLSearchParams(searchParams);
      if (value.type?.length) params.set("type", value.type.join(","));
      else params.delete("type");
      if (value.capacity?.length)
        params.set("capacity", value.capacity.join(","));
      else params.delete("capacity");
      if (value.brand?.length) params.set("make", value.brand.join(","));
      else params.delete("make");
      params.set("max_price", value.price?.toString() || "");
      params.set("is_available", value.is_available ? "1" : "0");

      router.push(`/cars?${params.toString()}`, { scroll: false });
    });

    return () => subscription.unsubscribe();
  }, [form, router, searchParams]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams(searchParams);
    if (data.type.length) params.set("type", data.type.join(","));
    if (data.brand.length) params.set("make", data.brand.join(","));
    params.set("max_price", data.price.toString());
    params.set("is_available", data.is_available ? "1" : "0");

    router.push(`/cars?${params.toString()}`);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-6 bg-white h-full"
      >
        {filterItems.map((category) => (
          <FormField
            key={category.category}
            control={form.control}
            name={
              category.category.toLowerCase() as "type" | "capacity" | "brand"
            }
            render={() => (
              <FormItem>
                <FormLabel className="text-md font-semibold  text-gray-500 ">
                  {category.category}
                </FormLabel>
                <div className="!mt-5 space-y-2 gap-3 flex flex-col">
                  {category.items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={
                        category.category.toLowerCase() as
                          | "type"
                          | "capacity"
                          | "brand"
                      }
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label} ({item.count})
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                {category.category === "Brand" && (
                  <a
                    href="#"
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  >
                    View More
                  </a>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Price</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
              </FormControl>
              <div className="text-sm mt-2">
                Max. ${field.value.toFixed(2)} per day
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
