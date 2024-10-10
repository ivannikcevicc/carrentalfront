import React from "react";
import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm";
const EditProfilePage: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-xl max-w-3xl mx-auto shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>
      <ProfileUpdateForm />
    </div>
  );
};

export default EditProfilePage;
