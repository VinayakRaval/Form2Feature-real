import { useEffect, useState } from "react";
import FarmerLayout from "../../layouts/FarmerLayout";
import {
    getProfitCalculations,
    deleteProfitCalculation
} from "../../services/profitCalculatorService";

function ProfitHistory() {

    const [calculations, setCalculations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState(null);


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
                "Profit history response:",
                response
            );

            if (response?.success) {

                setCalculations(
                    response.calculations || []
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load saved calculations."
                );

            }

        } catch (err) {

            console.error(
                "LOAD PROFIT HISTORY ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load saved profit calculations."
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // LOAD WHEN PAGE OPENS
    // ============================================================

    useEffect(() => {

        loadCalculations();

    }, []);


    // ============================================================
    // DELETE CALCULATION
    // ============================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this profit calculation?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(id);

            setError("");

            const response =
                await deleteProfitCalculation(id);


            if (response?.success) {

                // Remove deleted item immediately
                setCalculations((previous) =>
                    previous.filter(
                        (item) =>
                            Number(item.id) !== Number(id)
                    )
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to delete calculation."
                );

            }

        } catch (err) {

            console.error(
                "DELETE PROFIT ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to delete calculation."
            );

        } finally {

            setDeletingId(null);

        }
    };


    // ============================================================
    // MONEY FORMAT
    // ============================================================

    const money = (value) => {

        return `₹${Number(value || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )}`;
    };


    // ============================================================
    // DATE FORMAT
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <FarmerLayout>

            <main
                id="main-content"
                tabIndex="-1"
                className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8"
            >

                <div className="max-w-7xl mx-auto">


                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="bg-gray-950 text-white rounded-2xl p-8 mb-8">

                        <p className="text-orange-400 font-semibold">
                            FARMER FINANCE
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold mt-2">
                            📊 Saved Profit Calculations
                        </h1>

                        <p className="text-gray-300 mt-3 max-w-3xl">
                            View your previous crop profit calculations,
                            expenses, revenue and expected profit.
                        </p>

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">

                            ⚠️ {error}

                        </div>

                    )}


                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {loading && (

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">

                            <div className="text-4xl mb-3">
                                ⏳
                            </div>

                            <p className="text-gray-600">
                                Loading saved calculations...
                            </p>

                        </div>

                    )}


                    {/* ==================================================
                        EMPTY
                    ================================================== */}

                    {!loading &&
                        calculations.length === 0 && (

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">

                                <div className="text-6xl mb-4">
                                    📊
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    No Saved Calculations
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    You haven't saved any profit calculations yet.
                                </p>

                                <a
                                    href="/farmer/profit-calculator"
                                    className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    💰 Calculate Profit
                                </a>

                            </div>

                        )}


                    {/* ==================================================
                        RESULTS
                    ================================================== */}

                    {!loading &&
                        calculations.length > 0 && (

                            <div className="space-y-6">


                                {/* ==================================================
                                    SUMMARY
                                ================================================== */}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

                                        <p className="text-gray-500 text-sm">
                                            Total Calculations
                                        </p>

                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {calculations.length}
                                        </p>

                                    </div>


                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

                                        <p className="text-gray-500 text-sm">
                                            Total Expected Revenue
                                        </p>

                                        <p className="text-3xl font-bold text-blue-700 mt-2">

                                            {money(
                                                calculations.reduce(
                                                    (total, item) =>
                                                        total +
                                                        Number(
                                                            item.expected_revenue || 0
                                                        ),
                                                    0
                                                )
                                            )}

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

                                        <p className="text-gray-500 text-sm">
                                            Total Expected Profit
                                        </p>

                                        <p className="text-3xl font-bold text-green-700 mt-2">

                                            {money(
                                                calculations.reduce(
                                                    (total, item) =>
                                                        total +
                                                        Number(
                                                            item.expected_profit || 0
                                                        ),
                                                    0
                                                )
                                            )}

                                        </p>

                                    </div>

                                </div>


                                {/* ==================================================
                                    DESKTOP TABLE
                                ================================================== */}

                                <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                                    <div className="px-6 py-5 border-b border-gray-200">

                                        <h2 className="text-xl font-bold text-gray-900">
                                            Profit History
                                        </h2>

                                        <p className="text-gray-500 text-sm mt-1">
                                            Your saved calculations from newest to oldest.
                                        </p>

                                    </div>


                                    <div className="overflow-x-auto">

                                        <table className="w-full">

                                            <thead className="bg-gray-50">

                                                <tr>

                                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Crop
                                                    </th>

                                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Quantity
                                                    </th>

                                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Selling Price
                                                    </th>

                                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Revenue
                                                    </th>

                                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Expense
                                                    </th>

                                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Profit
                                                    </th>

                                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Profit %
                                                    </th>

                                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Date
                                                    </th>

                                                    <th className="text-center px-5 py-4 text-sm font-semibold text-gray-600">
                                                        Action
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody className="divide-y divide-gray-100">

                                                {calculations.map(
                                                    (item) => {

                                                        const profit =
                                                            Number(
                                                                item.expected_profit || 0
                                                            );

                                                        return (

                                                            <tr
                                                                key={item.id}
                                                                className="hover:bg-gray-50 transition"
                                                            >

                                                                <td className="px-5 py-4">

                                                                    <span className="font-bold text-gray-900">
                                                                        {item.crop}
                                                                    </span>

                                                                </td>


                                                                <td className="px-5 py-4 text-gray-700">

                                                                    {Number(
                                                                        item.quantity || 0
                                                                    ).toLocaleString(
                                                                        "en-IN"
                                                                    )}

                                                                    <span className="text-xs text-gray-500 ml-1">
                                                                        qtl
                                                                    </span>

                                                                </td>


                                                                <td className="px-5 py-4 text-gray-700">
                                                                    {money(
                                                                        item.selling_price
                                                                    )}
                                                                </td>


                                                                <td className="px-5 py-4 text-blue-700 font-semibold">
                                                                    {money(
                                                                        item.expected_revenue
                                                                    )}
                                                                </td>


                                                                <td className="px-5 py-4 text-red-600 font-semibold">
                                                                    {money(
                                                                        item.total_expense
                                                                    )}
                                                                </td>


                                                                <td
                                                                    className={`px-5 py-4 font-bold ${
                                                                        profit >= 0
                                                                            ? "text-green-700"
                                                                            : "text-red-700"
                                                                    }`}
                                                                >
                                                                    {money(profit)}
                                                                </td>


                                                                <td className="px-5 py-4">

                                                                    <span
                                                                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                                            Number(
                                                                                item.profit_percentage || 0
                                                                            ) >= 0
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "bg-red-100 text-red-700"
                                                                        }`}
                                                                    >
                                                                        {Number(
                                                                            item.profit_percentage || 0
                                                                        ).toFixed(2)}
                                                                        %
                                                                    </span>

                                                                </td>


                                                                <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">

                                                                    {formatDate(
                                                                        item.created_at
                                                                    )}

                                                                </td>


                                                                <td className="px-5 py-4 text-center">

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                item.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            deletingId ===
                                                                            item.id
                                                                        }
                                                                        className="text-red-600 hover:text-red-800 font-semibold text-sm disabled:opacity-50"
                                                                    >

                                                                        {deletingId === item.id
                                                                            ? "Deleting..."
                                                                            : "🗑 Delete"
                                                                        }

                                                                    </button>

                                                                </td>

                                                            </tr>

                                                        );

                                                    }
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>


                                {/* ==================================================
                                    MOBILE CARDS
                                ================================================== */}

                                <div className="lg:hidden space-y-5">

                                    {calculations.map(
                                        (item) => {

                                            const profit =
                                                Number(
                                                    item.expected_profit || 0
                                                );

                                            return (

                                                <div
                                                    key={item.id}
                                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                                                >

                                                    <div className="flex justify-between items-start">

                                                        <div>

                                                            <p className="text-xs text-orange-600 font-semibold">
                                                                CROP
                                                            </p>

                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                {item.crop}
                                                            </h3>

                                                        </div>


                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                profit >= 0
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}
                                                        >

                                                            {profit >= 0
                                                                ? "Profit"
                                                                : "Loss"
                                                            }

                                                        </span>

                                                    </div>


                                                    <div className="grid grid-cols-2 gap-4 mt-5">

                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Quantity
                                                            </p>

                                                            <p className="font-semibold">
                                                                {item.quantity} qtl
                                                            </p>
                                                        </div>


                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Selling Price
                                                            </p>

                                                            <p className="font-semibold">
                                                                {money(
                                                                    item.selling_price
                                                                )}
                                                            </p>
                                                        </div>


                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Revenue
                                                            </p>

                                                            <p className="font-semibold text-blue-700">
                                                                {money(
                                                                    item.expected_revenue
                                                                )}
                                                            </p>
                                                        </div>


                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Total Expense
                                                            </p>

                                                            <p className="font-semibold text-red-600">
                                                                {money(
                                                                    item.total_expense
                                                                )}
                                                            </p>
                                                        </div>


                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Expected Profit
                                                            </p>

                                                            <p
                                                                className={`font-bold ${
                                                                    profit >= 0
                                                                        ? "text-green-700"
                                                                        : "text-red-700"
                                                                }`}
                                                            >
                                                                {money(profit)}
                                                            </p>
                                                        </div>


                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Profit %
                                                            </p>

                                                            <p className="font-bold text-orange-600">
                                                                {Number(
                                                                    item.profit_percentage || 0
                                                                ).toFixed(2)}
                                                                %
                                                            </p>
                                                        </div>

                                                    </div>


                                                    <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">

                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(
                                                                item.created_at
                                                            )}
                                                        </p>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                item.id
                                                            }
                                                            className="text-red-600 font-semibold text-sm disabled:opacity-50"
                                                        >

                                                            {deletingId === item.id
                                                                ? "Deleting..."
                                                                : "🗑 Delete"
                                                            }

                                                        </button>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>


                                {/* ==================================================
                                    REFRESH
                                ================================================== */}

                                <div className="flex justify-center">

                                    <button
                                        type="button"
                                        onClick={loadCalculations}
                                        disabled={loading}
                                        className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                                    >
                                        🔄 Refresh History
                                    </button>

                                </div>

                            </div>

                        )}

                </div>

            </main>

        </FarmerLayout>
    );
}

export default ProfitHistory;