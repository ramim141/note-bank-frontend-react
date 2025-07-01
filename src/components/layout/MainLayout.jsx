// src/layouts/MainLayout.jsx (উদাহরণ)

import React from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import { Outlet } from 'react-router-dom'; 

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar /> 
            <main className="flex-grow">
           
                {children} 
          
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;