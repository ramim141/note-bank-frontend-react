import React from "react";
// Ensure this path correctly points to your updated component
import PasswordChange from "../../components/Password/PasswordChange";

const PasswordChangePages = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 pt-32 pb-32 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      <PasswordChange />
    </div>
  );
};

export default PasswordChangePages;