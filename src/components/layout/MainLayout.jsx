// src/layouts/MainLayout.jsx (উদাহরণ)

import React from 'react';
import Navbar from '../components/Navbar'; // আপনার নেভিগেশন বার ইম্পোর্ট করুন
import Footer from '../components/Footer'; // আপনার ফুটার ইম্পোর্ট করুন
import { Outlet } from 'react-router-dom'; // Outlet ব্যবহার করা হয় যেখানে পেজগুলো রেন্ডার হবে

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar /> {/* নেভিগেশন বার */}
            <main className="flex-grow">
                {/* এখানে Outlet ব্যবহার করলে আপনার পেজ কম্পোনেন্টগুলো রেন্ডার হবে। */}
                {/* অথবা সরাসরি children ব্যবহার করতে পারেন। */}
                {children} 
                {/* <Outlet /> */}
            </main>
            <Footer /> {/* ফুটার */}
        </div>
    );
};

export default MainLayout;