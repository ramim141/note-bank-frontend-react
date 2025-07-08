"use client";

// Ensure this path correctly points to your updated form component
import PasswordResetConfirmForm from "../../components/Password/PasswordResetConfirmForm";
import { useState } from "react"; // Needed if you were to pass props dynamically, but not strictly for this static render.

// Example of how you might get uidb64 and token if they were dynamic
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

const PasswordResetConfirmPage = () => {
  // In a real app, you would fetch these from URL parameters
  // const router = useRouter();
  // const [uidb64, setUidb64] = useState(null);
  // const [token, setToken] = useState(null);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   setUidb64(params.get('uidb64'));
  //   setToken(params.get('token'));
  // }, []);

  // For demonstration, hardcoding placeholders
  const demoUidb64 = "some-base64-encoded-user-id";
  const demoToken = "a-valid-reset-token";


  return (
    <div className="flex items-center justify-center min-h-screen p-4 pt-32 pb-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Pass the required props to the form */}
      <PasswordResetConfirmForm uidb64={demoUidb64} token={demoToken} />
    </div>
  );
};

export default PasswordResetConfirmPage;