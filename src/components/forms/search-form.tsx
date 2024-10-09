"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

const filterItems = [
  {
    category: "Type",
    items: [
      { id: "Sports Car", label: "Sports Car", count: 10 },
      { id: "SUV", label: "SUV", count: 12 },
      { id: "MPV", label: "MPV", count: 16 },
      { id: "Sedan", label: "Sedan", count: 20 },
      { id: "Coupe", label: "Coupe", count: 14 },
      { id: "Hatchback", label: "Hatchback", count: 14 },
    ],
  },
  {
    category: "Seating Capacity",
    items: [
      { id: "2", label: "2 Person", count: 10 },
      { id: "4", label: "4 Person", count: 14 },
      { id: "5", label: "5 Person", count: 12 },
      { id: "7", label: "7 Person", count: 16 },
    ],
  },
  {
    category: "Brand",
    items: [
      { id: "bmw", label: "BMW", count: 10 },
      { id: "porsche", label: "Porsche", count: 14 },
      { id: "toyota", label: "Toyota", count: 12 },
      { id: "volkswagen", label: "Volkswagen", count: 16 },
    ],
  },
] as const;

const FormSchema = z.object({
  type: z.array(z.string()).optional(),
  seating_capacity: z.array(z.string()).optional(),
  make: z.array(z.string()).optional(),
  max_price: z.number().min(0).max(1000),
  is_available: z.boolean().default(false),
});

interface SearchFormProps {
  onClose?: () => void;
}

export function SearchForm({ onClose }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: searchParams.getAll("type[]"),
      seating_capacity: searchParams.getAll("seating_capacity[]"),
      make: searchParams.getAll("make[]"),
      max_price: parseInt(searchParams.get("max_price") || "1000"),
      is_available: searchParams.get("is_available") === "1",
    },
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const subscription = form.watch((value) => {
      const params = new URLSearchParams(searchParams.toString());

      // Clear existing array parameters
      params.delete("type[]");
      params.delete("seating_capacity[]");
      params.delete("make[]");

      // Add updated array parameters
      value.type?.forEach((type) => {
        if (type) params.append("type[]", type);
      });
      value.seating_capacity?.forEach((capacity) => {
        if (capacity) params.append("seating_capacity[]", capacity);
      });
      value.make?.forEach((make) => {
        if (make) params.append("make[]", make);
      });

      if (value.max_price !== undefined) {
        params.set("max_price", value.max_price.toString());
      }

      params.set("is_available", value.is_available ? "1" : "0");

      router.push(`/cars?${params.toString()}`, { scroll: false });

      // Clear any existing timeout
      if (timeout) clearTimeout(timeout);

      // Set a new timeout to close the sheet after filters are applied
      // Only on mobile screens
      if (window.innerWidth < 768 && onClose) {
        timeout = setTimeout(() => {
          onClose();
        }, 500); // Add a small delay for better UX
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, [form, router, searchParams, onClose]);

  return (
    <Form {...form}>
      <form className="space-y-8 p-6 bg-white h-full">
        {filterItems.map((category) => (
          <FormField
            key={category.category}
            control={form.control}
            name={
              category.category === "Type"
                ? "type"
                : category.category === "Seating Capacity"
                ? "seating_capacity"
                : "make"
            }
            render={() => (
              <FormItem>
                <FormLabel className="text-md font-semibold text-gray-500">
                  {category.category}
                </FormLabel>
                <div className="mt-5 space-y-2 flex flex-col">
                  {category.items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={
                        category.category === "Type"
                          ? "type"
                          : category.category === "Seating Capacity"
                          ? "seating_capacity"
                          : "make"
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
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        ) || []
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
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="max_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Max Price</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
              </FormControl>
              <div className="text-sm mt-2">
                Max. ${field.value.toFixed(2)} per day
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Available Only</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
