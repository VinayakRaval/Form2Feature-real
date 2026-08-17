import React from "react";
import { Link } from "react-router-dom";

import BuyerNavbar from "../../components/BuyerNavbar";


function BuyerDashboard() {

    return (

        <div className="min-h-screen bg-[#f4f5f7]">

            {/* =====================================================
                BUYER NAVBAR
            ===================================================== */}

            <BuyerNavbar />


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main
                id="main-content"
                tabIndex="-1"
                className="max-w-7xl mx-auto px-6 py-10 outline-none"
            >

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="mb-8">

                    <p className="text-[#f95700] font-bold uppercase text-sm">
                        Buyer Portal
                    </p>

                    <h1 className="text-4xl font-bold text-[#111827]">
                        Buyer Dashboard
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Purchase agricultural products directly from farmers.
                    </p>

                </div>


                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <div className="grid md:grid-cols-4 gap-5 mb-8">


                    {/* AVAILABLE CROPS */}

                    <div className="bg-white border rounded-2xl p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    Available Crops
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    0
                                </h2>

                            </div>


                            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">

                                <span className="text-2xl">
                                    🌾
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* MY OFFERS */}

                    <div className="bg-white border rounded-2xl p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    My Offers
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    0
                                </h2>

                            </div>


                            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center">

                                <span className="text-2xl">
                                    💰
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ACCEPTED DEALS */}

                    <div className="bg-white border rounded-2xl p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    Accepted Deals
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    0
                                </h2>

                            </div>


                            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">

                                <span className="text-2xl">
                                    🤝
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* PURCHASES */}

                    <div className="bg-white border rounded-2xl p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    Purchases
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    ₹0
                                </h2>

                            </div>


                            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">

                                <span className="text-2xl">
                                    🛒
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    BUYER SERVICES
                ================================================= */}

                <div className="bg-white border rounded-2xl p-7">

                    <h2 className="text-2xl font-bold mb-6">
                        Buyer Services
                    </h2>


                    <div className="grid md:grid-cols-3 gap-5">


                        {/* =================================================
                            BROWSE CROPS
                        ================================================= */}

                        <Link
                            to="/buyer/crops"
                            className="border rounded-xl p-6 hover:border-[#f95700] hover:shadow-md transition"
                        >

                            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">

                                <span className="text-3xl">
                                    🌾
                                </span>

                            </div>


                            <h3 className="text-xl font-bold">
                                Browse Crops
                            </h3>


                            <p className="text-gray-500 mt-2">
                                Find crops available from farmers.
                            </p>

                        </Link>


                        {/* =================================================
                            MY OFFERS
                        ================================================= */}

                        <Link
                            to="/buyer/offers"
                            className="border rounded-xl p-6 hover:border-[#f95700] hover:shadow-md transition"
                        >

                            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">

                                <span className="text-3xl">
                                    💰
                                </span>

                            </div>


                            <h3 className="text-xl font-bold">
                                My Offers
                            </h3>


                            <p className="text-gray-500 mt-2">
                                Manage your crop offers.
                            </p>

                        </Link>


                        {/* =================================================
                            DEALS
                        ================================================= */}

                        <Link
                            to="/buyer/deals"
                            className="border rounded-xl p-6 hover:border-[#f95700] hover:shadow-md transition"
                        >

                            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">

                                <span className="text-3xl">
                                    🤝
                                </span>

                            </div>


                            <h3 className="text-xl font-bold">
                                Accepted Deals
                            </h3>


                            <p className="text-gray-500 mt-2">
                                View your accepted purchases.
                            </p>

                        </Link>

                    </div>

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="mt-8 bg-white border rounded-2xl p-7">

                    <h2 className="text-2xl font-bold mb-6">
                        Quick Actions
                    </h2>


                    <div className="grid md:grid-cols-3 gap-4">


                        <Link
                            to="/buyer/profile"
                            className="border rounded-xl px-5 py-4 hover:border-[#f95700] transition"
                        >

                            <p className="font-semibold">
                                👤 View Profile
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Manage your buyer information.
                            </p>

                        </Link>


                        <Link
                            to="/buyer/crops"
                            className="border rounded-xl px-5 py-4 hover:border-[#f95700] transition"
                        >

                            <p className="font-semibold">
                                🌱 Find Crops
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Browse crops listed by farmers.
                            </p>

                        </Link>


                        <Link
                            to="/buyer/transactions"
                            className="border rounded-xl px-5 py-4 hover:border-[#f95700] transition"
                        >

                            <p className="font-semibold">
                                📋 Transactions
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                View your purchase transactions.
                            </p>

                        </Link>

                    </div>

                </div>

            </main>

        </div>

    );
}

export default BuyerDashboard;