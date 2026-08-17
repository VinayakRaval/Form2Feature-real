import React from "react";
import { Link } from "react-router-dom";
import BuyerNavbar from "../../components/BuyerNavbar";

function BuyerOffers() {
    return (
        <div className="min-h-screen bg-[#f4f5f7]">

            <BuyerNavbar />

            <main
                id="main-content"
                tabIndex="-1"
                className="max-w-7xl mx-auto px-6 py-10"
            >

                {/* PAGE HEADER */}

                <div className="mb-8">

                    <p className="text-[#f95700] font-bold uppercase text-sm">
                        Buyer Portal
                    </p>

                    <h1 className="text-4xl font-bold text-[#111827]">
                        My Offers
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Manage the offers you have made to farmers.
                    </p>

                </div>


                {/* SUMMARY */}

                <div className="grid md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white border rounded-2xl p-6">

                        <p className="text-gray-500">
                            Total Offers
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            0
                        </h2>

                    </div>


                    <div className="bg-white border rounded-2xl p-6">

                        <p className="text-gray-500">
                            Pending Offers
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            0
                        </h2>

                    </div>


                    <div className="bg-white border rounded-2xl p-6">

                        <p className="text-gray-500">
                            Accepted Offers
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            0
                        </h2>

                    </div>

                </div>


                {/* OFFERS */}

                <div className="bg-white border rounded-2xl p-7">

                    <div className="flex justify-between items-center mb-6">

                        <div>

                            <h2 className="text-2xl font-bold">
                                My Crop Offers
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Your submitted offers will appear here.
                            </p>

                        </div>

                        <Link
                            to="/buyer/crops"
                            className="bg-[#f95700] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#dc4b00]"
                        >
                            Browse Crops
                        </Link>

                    </div>


                    {/* EMPTY STATE */}

                    <div className="border-2 border-dashed rounded-2xl p-12 text-center">

                        <div className="text-6xl mb-4">
                            💰
                        </div>

                        <h3 className="text-xl font-bold text-gray-800">
                            No Offers Yet
                        </h3>

                        <p className="text-gray-500 mt-2">
                            You have not made any crop offers yet.
                        </p>

                        <p className="text-gray-500">
                            Browse available crops and make your first offer.
                        </p>

                        <Link
                            to="/buyer/crops"
                            className="inline-block mt-5 bg-[#f95700] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#dc4b00]"
                        >
                            Browse Available Crops
                        </Link>

                    </div>

                </div>


                {/* BACK */}

                <div className="mt-6">

                    <Link
                        to="/buyer/dashboard"
                        className="inline-block border bg-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-100"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>

            </main>

        </div>
    );
}

export default BuyerOffers;