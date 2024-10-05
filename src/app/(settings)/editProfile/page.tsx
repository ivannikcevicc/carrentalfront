"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

const schema = z.object({
  avatar: z.any().optional(),
  name: z.string().min(1, "Name is required").max(30, "Name is too long"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email is too short")
    .max(50, "Email is too long"),
  biography: z
    .string()
    .min(30, "Biography is too short")
    .max(350, "Biography is too long"),
});

type FormData = z.infer<typeof schema>;

const EditProfilePage: React.FC = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("avatar", file);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("biography", data.biography);

    try {
      const response = await fetch("/update-profile", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl max-w-3xl mx-auto shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex items-center gap-8 justify-center mb-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={avatarPreview || "/placeholder-avatar.png"} />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <div>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("avatar")}
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("avatar")?.click()}
              className="text-lg"
            >
              <Camera className="mr-2 h-6 w-6" /> Upload Avatar
            </Button>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-lg font-medium" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            className={`w-full text-lg py-3 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-lg font-medium" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full text-lg py-3 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-lg font-medium" htmlFor="biography">
            Biography
          </label>
          <Textarea
            id="biography"
            {...register("biography")}
            placeholder="Enter your biography (30-350 characters)"
            className={`w-full text-lg py-3 min-h-[150px] ${
              errors.biography ? "border-red-500" : ""
            }`}
          />
          {errors.biography && (
            <p className="text-red-500 text-sm mt-1">
              {errors.biography.message}
            </p>
          )}
        </div>

        <Button type="submit" className="mt-6 text-lg py-6">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditProfilePage;
