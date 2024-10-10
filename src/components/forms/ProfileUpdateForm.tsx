"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { updateUser } from "@/lib/queries";
import { UpdateUserData, Session } from "@/lib/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(30, "Name is too long"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email is too short")
    .max(50, "Email is too long"),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, "The avatar must be less than 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          file.type
        ),
      "The avatar must be a JPEG, PNG, JPG or GIF"
    )
    .optional()
    .nullable(),
});

type FormData = z.infer<typeof schema>;

const ProfileUpdateForm: React.FC = () => {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      const userInfo = await getUserInfo();
      console.log(userInfo);
      if (userInfo) {
        reset({
          name: userInfo.name,
          email: userInfo.email,
        });
        setAvatarPreview(userInfo.avatar || "/placeholder-avatar.png");
      }
      setIsLoading(false);
    };

    loadUserInfo();
  }, [reset]);

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
    try {
      const updateData: UpdateUserData = {
        name: data.name,
        email: data.email,
      };
      if (data.avatar instanceof File) {
        updateData.avatar = data.avatar;
      }

      const response = await updateUser(updateData);

      // Update the session data in localStorage
      const sessionData = localStorage.getItem("session");
      if (sessionData) {
        const session: Session = JSON.parse(sessionData);
        session.user = {
          ...session.user,
          name: data.name,
          email: data.email,
          avatar: response.user.avatar,
        };
        localStorage.setItem("session", JSON.stringify(session));
      }

      toast.success("Profile updated successfully!");
      console.log("Profile updated successfully", response);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error updating profile");
      } else {
        toast.error("Error updating profile");
      }
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
            accept="image/jpeg,image/png,image/jpg,image/gif"
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
      {errors.avatar && (
        <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>
      )}

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

      <Button type="submit" className="mt-6 text-lg py-6">
        Save Changes
      </Button>
    </form>
  );
};

export default ProfileUpdateForm;
