import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FarmerLayout from "../../layouts/FarmerLayout";

import {
    getProfitCalculations,
    deleteProfitCalculation
} from "../../services/profitCalculatorService";


function SavedProfits() {

    const navigate = useNavigate();

    const [calculations, setCalculations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ============================================================
    // LOAD SAVED CALCULATIONS
    // ============================================================

    const loadCalculations = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getProfitCalculations();

            console.log(
                "Saved profit response:",
                response
            );

            if (response?.success) {

                setCalculations(
                    response.calculations || []
                );

            } else {

                setCalculations([]);

                setError(
                    response?.message ||
                    "Unable to fetch saved calculations"
                );
            }

        } catch (error) {

            console.error(
                "GET SAVED PROFITS ERROR:",
                error
            );

            setCalculations([]);

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to fetch saved calculations";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // LOAD ON PAGE OPEN
    // ============================================================

    useEffect(() => {

        loadCalculations();

    }, []);


    // ============================================================
    // DELETE
    // ============================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Delete this profit calculation?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteProfitCalculation(id);

            setCalculations(
                previous =>
                    previous.filter(
                        item =>
                            Number(item.id) !== Number(id)
                    )
            );

        } catch (error) {

            console.error(
                "DELETE PROFIT ERROR:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Unable to delete calculation"
            );
        }
    };


    // ============================================================
    // CURRENCY
    // ============================================================

    const money = (value) => {

        const number =
            Number(value) || 0;

        return `₹${number.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )}`;
    };


    // ============================================================
    // DATE
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "Date unavailable";
        }

        const parsed =
            new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return date;
        }

        return parsed.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    return (
        <FarmerLayout>

            <main
                id="main-content"
                tabIndex="-1"
                className="max-w-7xl mx-auto px-6 py-10"
            >

                {/* ====================================================
                    HEADER
                ==================================================== */}

                <section className="mb-8">

                    <p className="text-[#ff6500] font-bold text-sm">
                        FARMER FINANCE
                    </p>

                    <h1 className="text-4xl font-bold text-gray-900 mt-2">
                        📊 Saved Profit Calculations
                    </h1>

                    <p className="text-gray-600 mt-3 max-w-2xl">
                        View your previous crop profit calculations,
                        expenses, revenue and expected profit.
                    </p>

                </section>


                {/* ====================================================
                    ERROR
                ==================================================== */}

                {error && (

                    <div className="
                        mb-6
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        text-red-700
                        px-5
                        py-4
                    ">

                        ⚠️ {error}

                    </div>

                )}


                {/* ====================================================
                    LOADING
                ==================================================== */}

                {loading && (

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow
                        p-10
                        text-center
                    ">

                        <div className="text-4xl mb-3">
                            ⏳
                        </div>

                        <p className="text-gray-600">
                            Loading saved calculations...
                        </p>

                    </div>

                )}


                {/* ====================================================
                    EMPTY
                ==================================================== */}

                {!loading &&
                    !error &&
                    calculations.length === 0 && (

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow
                        border
                        p-12
                        text-center
                    ">

                        <div className="text-6xl mb-5">
                            📊
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            No Saved Calculations
                        </h2>

                        <p className="text-gray-600 mt-3">
                            You haven't saved any profit
                            calculations yet.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/farmer/profit"
                                )
                            }
                            className="
                                mt-7
                                bg-[#ff6500]
                                hover:bg-[#e85b00]
                                text-white
                                px-6
                                py-3
                                rounded-lg
                                font-semibold
                                transition
                            "
                        >
                            💰 Calculate Profit
                        </button>

                    </div>
                )}


                {/* ====================================================
                    CALCULATIONS
                ==================================================== */}

                {!loading &&
                    calculations.length > 0 && (

                    <>

                        <div className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-4
                            mb-6
                        ">

                            <div>

                                <h2 className="text-xl font-bold">
                                    Your Calculations
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    {calculations.length} saved calculation
                                    {calculations.length !== 1
                                        ? "s"
                                        : ""}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/farmer/profit"
                                    )
                                }
                                className="
                                    bg-[#ff6500]
                                    hover:bg-[#e85b00]
                                    text-white
                                    px-5
                                    py-2.5
                                    rounded-lg
                                    font-semibold
                                    transition
                                "
                            >
                                + New Calculation
                            </button>

                        </div>


                        <div className="
                            grid
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-6
                        ">

                            {calculations.map(
                                (calculation) => {

                                    const profit =
                                        Number(
                                            calculation.expected_profit
                                        ) || 0;

                                    const percentage =
                                        Number(
                                            calculation.profit_percentage
                                        ) || 0;

                                    const isProfit =
                                        profit >= 0;

                                    return (

                                        <div
                                            key={
                                                calculation.id
                                            }
                                            className="
                                                bg-white
                                                rounded-2xl
                                                shadow
                                                border
                                                p-6
                                                hover:shadow-lg
                                                transition
                                            "
                                        >

                                            {/* TOP */}

                                            <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            ">

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-gray-500
                                                        uppercase
                                                        font-semibold
                                                    ">
                                                        Crop
                                                    </p>

                                                    <h3 className="
                                                        text-2xl
                                                        font-bold
                                                        text-gray-900
                                                        mt-1
                                                    ">
                                                        {calculation.crop}
                                                    </h3>

                                                </div>


                                                <span className="
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-orange-50
                                                    text-[#ff6500]
                                                    text-xs
                                                    font-bold
                                                ">
                                                    {formatDate(
                                                        calculation.created_at
                                                    )}
                                                </span>

                                            </div>


                                            {/* DETAILS */}

                                            <div className="
                                                grid
                                                grid-cols-2
                                                gap-4
                                                mt-6
                                            ">

                                                <div className="bg-gray-50 rounded-lg p-3">

                                                    <p className="text-xs text-gray-500">
                                                        Quantity
                                                    </p>

                                                    <p className="font-bold mt-1">
                                                        {
                                                            calculation.quantity
                                                        }
                                                    </p>

                                                </div>


                                                <div className="bg-gray-50 rounded-lg p-3">

                                                    <p className="text-xs text-gray-500">
                                                        Selling Price
                                                    </p>

                                                    <p className="font-bold mt-1">
                                                        {money(
                                                            calculation.selling_price
                                                        )}
                                                    </p>

                                                </div>


                                                <div className="bg-gray-50 rounded-lg p-3">

                                                    <p className="text-xs text-gray-500">
                                                        Production
                                                    </p>

                                                    <p className="font-bold mt-1">
                                                        {money(
                                                            calculation.production_cost
                                                        )}
                                                    </p>

                                                </div>


                                                <div className="bg-gray-50 rounded-lg p-3">

                                                    <p className="text-xs text-gray-500">
                                                        Transport
                                                    </p>

                                                    <p className="font-bold mt-1">
                                                        {money(
                                                            calculation.transport_cost
                                                        )}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* REVENUE */}

                                            <div className="
                                                border-t
                                                mt-5
                                                pt-5
                                            ">

                                                <div className="
                                                    flex
                                                    justify-between
                                                    mb-2
                                                ">

                                                    <span className="text-gray-600">
                                                        Expected Revenue
                                                    </span>

                                                    <strong>
                                                        {money(
                                                            calculation.expected_revenue
                                                        )}
                                                    </strong>

                                                </div>


                                                <div className="
                                                    flex
                                                    justify-between
                                                    mb-2
                                                ">

                                                    <span className="text-gray-600">
                                                        Total Expense
                                                    </span>

                                                    <strong>
                                                        {money(
                                                            calculation.total_expense
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* PROFIT */}

                                            <div className={`
                                                mt-4
                                                rounded-xl
                                                p-4
                                                ${
                                                    isProfit
                                                        ? "bg-green-50"
                                                        : "bg-red-50"
                                                }
                                            `}>

                                                <div className="
                                                    flex
                                                    justify-between
                                                    items-center
                                                ">

                                                    <div>

                                                        <p className="text-sm text-gray-600">
                                                            Expected Profit
                                                        </p>

                                                        <p className={`
                                                            text-2xl
                                                            font-bold
                                                            mt-1
                                                            ${
                                                                isProfit
                                                                    ? "text-green-700"
                                                                    : "text-red-700"
                                                            }
                                                        `}>
                                                            {money(profit)}
                                                        </p>

                                                    </div>


                                                    <div className="text-right">

                                                        <p className="text-sm text-gray-600">
                                                            Profit %
                                                        </p>

                                                        <p className={`
                                                            text-lg
                                                            font-bold
                                                            ${
                                                                isProfit
                                                                    ? "text-green-700"
                                                                    : "text-red-700"
                                                            }
                                                        `}>
                                                            {percentage.toFixed(2)}%
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        calculation.id
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    mt-5
                                                    border
                                                    border-red-300
                                                    text-red-600
                                                    hover:bg-red-50
                                                    py-2.5
                                                    rounded-lg
                                                    font-semibold
                                                    transition
                                                "
                                            >
                                                🗑 Delete Calculation
                                            </button>

                                        </div>

                                    );
                                }
                            )}

                        </div>

                    </>
                )}

            </main>

        </FarmerLayout>
    );
}

export default SavedProfits;