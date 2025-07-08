"use client";
// Ensure this path correctly points to your updated form component
import PasswordResetForm from "../../components/Password/PasswordResetForm";

const PasswordResetPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 pt-32 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100">
      <PasswordResetForm />
    </div>
  );
};

export default PasswordResetPage;