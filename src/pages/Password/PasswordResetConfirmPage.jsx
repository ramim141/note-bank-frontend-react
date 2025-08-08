"use client";

import { useParams } from "react-router-dom";
import PasswordResetConfirmForm from "../../components/Password/PasswordResetConfirmForm";

const PasswordResetConfirmPage = () => {
  // Extract uidb64 and token from URL parameters
  const { uidb64, token } = useParams();

  return (
    <div className="flex justify-center items-center p-4 pt-32 pb-32 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Pass the actual URL parameters to the form */}
      <PasswordResetConfirmForm uidb64={uidb64} token={token} />
    </div>
  );
};

export default PasswordResetConfirmPage;