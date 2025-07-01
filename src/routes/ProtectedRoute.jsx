// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // AuthContext থেকে hook ইম্পোর্ট করুন

// ProtectedRoute কম্পোনেন্টটি চিলড্রেন (children) Props গ্রহণ করবে, যা একটি নির্দিষ্ট রুট।
const ProtectedRoute = ({ children }) => {
  // AuthContext থেকে authentication অবস্থা এবং লোডিং স্টেট নিন
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // বর্তমান লোকেশন সেভ করার জন্য, যাতে লগইনের পর এখানে ফেরত আসা যায়

  // যদি authentication স্টেট লোড হতে থাকে
  if (isLoading) {
    // লোডিং অবস্থা দেখানোর জন্য একটি সুন্দর উপাদান যোগ করতে পারেন
    return (
        <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
            প্রমাণীকরণ লোড হচ্ছে...
        </div>
    );
  }

  // যদি ব্যবহারকারী লগইন করা না থাকে
  if (!isAuthenticated) {
    // লগইন পেজে রিডাইরেক্ট করুন এবং বর্তমান লোকেশনটি state এ Save করুন।
    // 'replace' prop ব্যবহার করলে ব্রাউজার হিস্টোরিতে বর্তমান পেজটি রিপ্লেস হবে।
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // যদি ব্যবহারকারী লগইন করা থাকে, তাহলে ভেতরের চিলড্রেন কম্পোনেন্টগুলো রেন্ডার করুন
  // অর্থাৎ, ProtectedRoute যার মধ্যে wrap করা আছে সেই পেজটি রেন্ডার হবে।
  return children;
};

export default ProtectedRoute;