import { useMemo, useState } from "react";
import FarmerLayout from "../../layouts/FarmerLayout";

import {
    saveProfitCalculation
} from "../../services/profitCalculatorService";

// ============================================================
// DEFAULT FORM
// ============================================================

const DEFAULT_FORM = {
    crop: "Onion",
    quantity: "",
    sellingPrice: "",
    productionCost: "",
    transportCost: "",
    otherExpenses: ""
};


// ============================================================
// PROFIT CALCULATOR
// ============================================================

function ProfitCalculator() {

    // ========================================================
    // FORM STATE
    // ========================================================

    const [form, setForm] = useState({
        ...DEFAULT_FORM
    });


    // ========================================================
    // UI STATE
    // ========================================================

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        // Prevent negative values
        if (
            name !== "crop" &&
            value !== "" &&
            Number(value) < 0
        ) {
            return;
        }


        setForm((previous) => ({
            ...previous,
            [name]: value
        }));


        // Remove old messages while editing
        setMessage("");
        setError("");
    };


    // ========================================================
    // CALCULATE PROFIT
    // ========================================================

    const calculation = useMemo(() => {

        const quantity =
            Number(form.quantity) || 0;

        const sellingPrice =
            Number(form.sellingPrice) || 0;

        const productionCost =
            Number(form.productionCost) || 0;

        const transportCost =
            Number(form.transportCost) || 0;

        const otherExpenses =
            Number(form.otherExpenses) || 0;


        // ----------------------------------------------------
        // EXPECTED REVENUE
        // ----------------------------------------------------

        const expectedRevenue =
            quantity * sellingPrice;


        // ----------------------------------------------------
        // TOTAL EXPENSE
        // ----------------------------------------------------

        const totalExpense =
            productionCost +
            transportCost +
            otherExpenses;


        // ----------------------------------------------------
        // EXPECTED PROFIT
        // ----------------------------------------------------

        const expectedProfit =
            expectedRevenue - totalExpense;


        // ----------------------------------------------------
        // PROFIT PERCENTAGE
        // ----------------------------------------------------

        const profitPercentage =
            totalExpense > 0
                ? (expectedProfit / totalExpense) * 100
                : 0;


        return {
            expectedRevenue,
            totalExpense,
            expectedProfit,
            profitPercentage
        };

    }, [form]);


    // ========================================================
    // MONEY FORMAT
    // ========================================================

    const money = (value) => {

        return `₹${Number(value || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )}`;
    };


    // ========================================================
    // RESET FORM
    // ========================================================

    const resetForm = () => {

        setForm({
            ...DEFAULT_FORM
        });
    };


    // ========================================================
    // MANUAL RESET
    // ========================================================

    const handleReset = () => {

        resetForm();

        setMessage("");

        setError("");
    };


    // ========================================================
    // SAVE CALCULATION
    // ========================================================

    const handleSave = async () => {

        // Clear previous messages
        setMessage("");
        setError("");


        // ====================================================
        // VALIDATION
        // ====================================================

        if (
            !form.crop ||
            String(form.crop).trim() === ""
        ) {

            setError(
                "Please select a crop."
            );

            return;
        }


        if (
            form.quantity === "" ||
            !Number.isFinite(Number(form.quantity)) ||
            Number(form.quantity) <= 0
        ) {

            setError(
                "Please enter a valid quantity."
            );

            return;
        }


        if (
            form.sellingPrice === "" ||
            !Number.isFinite(Number(form.sellingPrice)) ||
            Number(form.sellingPrice) < 0
        ) {

            setError(
                "Please enter a valid selling price."
            );

            return;
        }


        // ====================================================
        // SAVE
        // ====================================================

        try {

            setSaving(true);


            const data = {

                crop:
                    String(form.crop).trim(),

                quantity:
                    Number(form.quantity),

                selling_price:
                    Number(form.sellingPrice),

                production_cost:
                    Number(form.productionCost) || 0,

                transport_cost:
                    Number(form.transportCost) || 0,

                other_expenses:
                    Number(form.otherExpenses) || 0

            };


            console.log(
                "================================="
            );

            console.log(
                "SAVING PROFIT CALCULATION"
            );

            console.log(
                data
            );

            console.log(
                "================================="
            );


            const response =
                await saveProfitCalculation(data);


            console.log(
                "SAVE RESPONSE:",
                response
            );


            // =================================================
            // SUCCESS
            // =================================================

            if (
                response &&
                response.success
            ) {

                // ---------------------------------------------
                // IMPORTANT:
                // Reset calculator AFTER successful save
                // ---------------------------------------------

                resetForm();


                // ---------------------------------------------
                // Keep success message visible
                // ---------------------------------------------

                setMessage(
                    "✓ Profit calculation saved successfully. Calculator has been reset."
                );


                // ---------------------------------------------
                // Remove any old error
                // ---------------------------------------------

                setError("");


                // ---------------------------------------------
                // Scroll to top
                // ---------------------------------------------

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else {

                setError(
                    response?.message ||
                    "Unable to save calculation."
                );

            }

        } catch (err) {

            console.error(
                "SAVE PROFIT CALCULATION ERROR:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to save profit calculation."
            );

        } finally {

            setSaving(false);
        }
    };


    // ========================================================
    // PROFIT BAR
    // ========================================================

    const profitBarWidth =
        Math.min(
            Math.max(
                calculation.profitPercentage,
                0
            ),
            100
        );


    // ========================================================
    // UI
    // ========================================================

    return (

        <FarmerLayout>

            <main
                id="main-content"
                tabIndex="-1"
                className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8"
            >

                <div className="max-w-7xl mx-auto">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="bg-gray-950 text-white rounded-2xl p-8 mb-8">

                        <p className="text-orange-400 font-semibold">
                            FARMER FINANCE TOOL
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold mt-2">
                            💰 Profit Calculator
                        </h1>

                        <p className="text-gray-300 mt-3 max-w-3xl">
                            Calculate your expected revenue,
                            total expenses, expected profit and
                            profit percentage before selling your crop.
                        </p>

                    </div>


                    {/* =================================================
                        SUCCESS MESSAGE
                    ================================================= */}

                    {message && (

                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl flex items-center gap-3">

                            <span className="text-xl">
                                ✓
                            </span>

                            <span>
                                {message}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        ERROR MESSAGE
                    ================================================= */}

                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3">

                            <span className="text-xl">
                                ⚠
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        MAIN GRID
                    ================================================= */}

                    <div className="grid lg:grid-cols-2 gap-8">


                        {/* =================================================
                            LEFT SIDE - FORM
                        ================================================= */}

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                            <h2 className="text-2xl font-bold text-gray-900">
                                Crop & Expense Details
                            </h2>

                            <p className="text-gray-500 mt-1 mb-6">
                                Enter your crop selling and expense information.
                            </p>


                            {/* =================================================
                                CROP
                            ================================================= */}

                            <div className="mb-5">

                                <label
                                    htmlFor="crop"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Crop
                                </label>

                                <select
                                    id="crop"
                                    name="crop"
                                    value={form.crop}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                >

                                    <option value="Onion">
                                        Onion
                                    </option>

                                    <option value="Tomato">
                                        Tomato
                                    </option>

                                    <option value="Potato">
                                        Potato
                                    </option>

                                    <option value="Rice">
                                        Rice
                                    </option>

                                    <option value="Wheat">
                                        Wheat
                                    </option>

                                    <option value="Maize">
                                        Maize
                                    </option>

                                    <option value="Cotton">
                                        Cotton
                                    </option>

                                    <option value="Sugarcane">
                                        Sugarcane
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                QUANTITY
                            ================================================= */}

                            <div className="mb-5">

                                <label
                                    htmlFor="quantity"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Quantity
                                </label>

                                <div className="relative">

                                    <input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        disabled={saving}
                                        placeholder="Example: 100"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    />

                                    <span className="absolute right-4 top-3.5 text-gray-500 text-sm">
                                        quintal
                                    </span>

                                </div>

                            </div>


                            {/* =================================================
                                SELLING PRICE
                            ================================================= */}

                            <div className="mb-5">

                                <label
                                    htmlFor="sellingPrice"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Selling Price
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-3.5 text-gray-500">
                                        ₹
                                    </span>

                                    <input
                                        id="sellingPrice"
                                        name="sellingPrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.sellingPrice}
                                        onChange={handleChange}
                                        disabled={saving}
                                        placeholder="Price per quintal"
                                        className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                PRODUCTION COST
                            ================================================= */}

                            <div className="mb-5">

                                <label
                                    htmlFor="productionCost"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Production Cost
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-3.5 text-gray-500">
                                        ₹
                                    </span>

                                    <input
                                        id="productionCost"
                                        name="productionCost"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.productionCost}
                                        onChange={handleChange}
                                        disabled={saving}
                                        placeholder="Seeds, fertilizer, labour, etc."
                                        className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                TRANSPORT COST
                            ================================================= */}

                            <div className="mb-5">

                                <label
                                    htmlFor="transportCost"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Transport Cost
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-3.5 text-gray-500">
                                        ₹
                                    </span>

                                    <input
                                        id="transportCost"
                                        name="transportCost"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.transportCost}
                                        onChange={handleChange}
                                        disabled={saving}
                                        placeholder="Transportation expense"
                                        className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                OTHER EXPENSES
                            ================================================= */}

                            <div className="mb-6">

                                <label
                                    htmlFor="otherExpenses"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Other Expenses
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-3.5 text-gray-500">
                                        ₹
                                    </span>

                                    <input
                                        id="otherExpenses"
                                        name="otherExpenses"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.otherExpenses}
                                        onChange={handleChange}
                                        disabled={saving}
                                        placeholder="Other expenses"
                                        className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <div className="grid grid-cols-2 gap-3">

                                {/* RESET */}

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={saving}
                                    className="border border-gray-300 text-gray-700 px-5 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    🔄 Reset
                                </button>


                                {/* SAVE */}

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition disabled:opacity-60"
                                >

                                    {saving
                                        ? "Saving..."
                                        : "💾 Save Calculation"
                                    }

                                </button>

                            </div>

                        </section>


                        {/* =================================================
                            RIGHT SIDE - RESULT
                        ================================================= */}

                        <section>


                            {/* =================================================
                                PROFIT SUMMARY
                            ================================================= */}

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                                <h2 className="text-2xl font-bold text-gray-900">
                                    Profit Summary
                                </h2>

                                <p className="text-gray-500 mt-1 mb-6">
                                    Your estimated crop profitability.
                                </p>


                                {/* =================================================
                                    EXPECTED REVENUE
                                ================================================= */}

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4">

                                    <p className="text-sm text-blue-700 font-semibold">
                                        Expected Revenue
                                    </p>

                                    <h3 className="text-3xl font-bold text-blue-900 mt-2">
                                        {money(
                                            calculation.expectedRevenue
                                        )}
                                    </h3>

                                    <p className="text-sm text-blue-700 mt-2">

                                        {form.quantity || 0}

                                        {" quintal × "}

                                        {money(
                                            form.sellingPrice
                                        )}

                                    </p>

                                </div>


                                {/* =================================================
                                    TOTAL EXPENSE
                                ================================================= */}

                                <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-4">

                                    <p className="text-sm text-red-700 font-semibold">
                                        Total Expense
                                    </p>

                                    <h3 className="text-3xl font-bold text-red-900 mt-2">
                                        {money(
                                            calculation.totalExpense
                                        )}
                                    </h3>

                                    <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-red-700">

                                        <div>
                                            Production
                                            <br />

                                            <strong>
                                                {money(
                                                    form.productionCost
                                                )}
                                            </strong>
                                        </div>


                                        <div>
                                            Transport
                                            <br />

                                            <strong>
                                                {money(
                                                    form.transportCost
                                                )}
                                            </strong>
                                        </div>


                                        <div>
                                            Other
                                            <br />

                                            <strong>
                                                {money(
                                                    form.otherExpenses
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    EXPECTED PROFIT
                                ================================================= */}

                                <div
                                    className={`rounded-xl p-6 mb-4 border ${
                                        calculation.expectedProfit >= 0
                                            ? "bg-green-50 border-green-200"
                                            : "bg-red-50 border-red-200"
                                    }`}
                                >

                                    <p
                                        className={`text-sm font-semibold ${
                                            calculation.expectedProfit >= 0
                                                ? "text-green-700"
                                                : "text-red-700"
                                        }`}
                                    >
                                        Expected Profit
                                    </p>


                                    <h3
                                        className={`text-4xl font-bold mt-2 ${
                                            calculation.expectedProfit >= 0
                                                ? "text-green-800"
                                                : "text-red-800"
                                        }`}
                                    >
                                        {money(
                                            calculation.expectedProfit
                                        )}
                                    </h3>

                                </div>


                                {/* =================================================
                                    PROFIT PERCENTAGE
                                ================================================= */}

                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">

                                    <div className="flex items-center justify-between gap-4">

                                        <div>

                                            <p className="text-sm text-orange-700 font-semibold">
                                                Profit Percentage
                                            </p>

                                            <p className="text-gray-600 text-sm mt-1">
                                                Return compared with total expenses.
                                            </p>

                                        </div>


                                        <h3 className="text-3xl font-bold text-orange-700">

                                            {calculation.profitPercentage.toFixed(2)}
                                            %

                                        </h3>

                                    </div>


                                    <div className="mt-4 h-3 bg-orange-100 rounded-full overflow-hidden">

                                        <div
                                            className="h-full bg-orange-500 rounded-full transition-all duration-500"
                                            style={{
                                                width:
                                                    `${profitBarWidth}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                FORMULA
                            ================================================= */}

                            <div className="bg-gray-950 text-white rounded-2xl p-6 mt-6">

                                <h3 className="text-xl font-bold">
                                    How the calculation works
                                </h3>


                                <div className="mt-4 space-y-3 text-gray-300 text-sm">

                                    <p>

                                        <strong className="text-white">
                                            Expected Revenue
                                        </strong>

                                        {" = Quantity × Selling Price"}

                                    </p>


                                    <p>

                                        <strong className="text-white">
                                            Total Expense
                                        </strong>

                                        {" = Production Cost + Transport Cost + Other Expenses"}

                                    </p>


                                    <p>

                                        <strong className="text-white">
                                            Expected Profit
                                        </strong>

                                        {" = Expected Revenue − Total Expense"}

                                    </p>


                                    <p>

                                        <strong className="text-white">
                                            Profit %
                                        </strong>

                                        {" = (Expected Profit ÷ Total Expense) × 100"}

                                    </p>

                                </div>

                            </div>

                        </section>

                    </div>

                </div>

            </main>

        </FarmerLayout>
    );
}

export default ProfitCalculator;