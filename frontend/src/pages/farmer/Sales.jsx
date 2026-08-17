import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FarmerLayout from "../../layouts/FarmerLayout";

import {
    addSale,
    getMySales,
    getSalesSummary,
    deleteSale
} from "../../services/salesService";

import {
    getMyCrops
} from "../../services/cropService";


// ============================================================
// SALES PAGE
// ============================================================

function Sales() {

    const navigate = useNavigate();

    // ============================================================
    // STATE
    // ============================================================

    const [sales, setSales] = useState([]);
    const [crops, setCrops] = useState([]);

    const [summary, setSummary] = useState({
        total_transactions: 0,
        total_quantity: 0,
        total_revenue: 0,
        paid_amount: 0,
        pending_amount: 0
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ============================================================
    // INITIAL FORM
    // ============================================================

    const getInitialForm = () => ({
        crop_id: "",
        quantity: "",
        price_per_unit: "",

        buyer_name: "",

        // IMPORTANT:
        // Empty string means no mandi selected.
        mandi_id: "",

        transportation_cost: "0",
        other_cost: "0",

        sale_date: new Date()
            .toISOString()
            .split("T")[0],

        payment_status: "pending",

        notes: ""
    });


    const [form, setForm] = useState(
        getInitialForm()
    );


    // ============================================================
    // FORMAT MONEY
    // ============================================================

    const formatMoney = (value) => {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );
    };


    // ============================================================
    // SELECTED CROP
    // ============================================================

    const selectedCrop = crops.find(
        (crop) =>
            String(crop.id) ===
            String(form.crop_id)
    );


    // ============================================================
    // CALCULATE SALE AMOUNT
    // ============================================================

    const calculateTotal = () => {

        const quantity =
            Number(form.quantity || 0);

        const price =
            Number(form.price_per_unit || 0);

        if (
            !Number.isFinite(quantity) ||
            !Number.isFinite(price)
        ) {
            return 0;
        }

        return quantity * price;
    };


    // ============================================================
    // CALCULATE NET PROFIT
    // ============================================================

    const calculateNetProfit = () => {

        const total =
            calculateTotal();

        const transportation =
            Number(
                form.transportation_cost || 0
            );

        const other =
            Number(
                form.other_cost || 0
            );

        return (
            total -
            transportation -
            other
        );
    };


    // ============================================================
    // LOAD SALES
    // ============================================================

    const loadSales = async () => {

        try {

            const result =
                await getMySales();

            console.log(
                "GET SALES RESULT:",
                result
            );


            if (
                result?.success &&
                Array.isArray(result.sales)
            ) {

                setSales(
                    result.sales
                );

                return;
            }


            if (
                Array.isArray(result)
            ) {

                setSales(
                    result
                );

                return;
            }


            setSales([]);

        } catch (err) {

            console.error(
                "LOAD SALES ERROR:",
                err
            );

            setSales([]);

        }
    };


    // ============================================================
    // LOAD SUMMARY
    // ============================================================

    const loadSummary = async () => {

        try {

            const result =
                await getSalesSummary();

            console.log(
                "GET SALES SUMMARY RESULT:",
                result
            );


            if (
                result?.success &&
                result.summary
            ) {

                setSummary({

                    total_transactions:
                        Number(
                            result.summary.total_transactions || 0
                        ),

                    total_quantity:
                        Number(
                            result.summary.total_quantity || 0
                        ),

                    total_revenue:
                        Number(
                            result.summary.total_revenue || 0
                        ),

                    paid_amount:
                        Number(
                            result.summary.paid_amount || 0
                        ),

                    pending_amount:
                        Number(
                            result.summary.pending_amount || 0
                        )

                });

                return;
            }


            setSummary({
                total_transactions: 0,
                total_quantity: 0,
                total_revenue: 0,
                paid_amount: 0,
                pending_amount: 0
            });

        } catch (err) {

            console.error(
                "LOAD SUMMARY ERROR:",
                err
            );

            setSummary({
                total_transactions: 0,
                total_quantity: 0,
                total_revenue: 0,
                paid_amount: 0,
                pending_amount: 0
            });

        }
    };


    // ============================================================
    // LOAD CROPS
    // ============================================================

    const loadCrops = async () => {

        try {

            const result =
                await getMyCrops();

            console.log(
                "GET CROPS RESULT:",
                result
            );


            if (
                result?.success &&
                Array.isArray(result.crops)
            ) {

                setCrops(
                    result.crops
                );

                return;
            }


            if (
                Array.isArray(result)
            ) {

                setCrops(
                    result
                );

                return;
            }


            setCrops([]);

        } catch (err) {

            console.error(
                "LOAD CROPS ERROR:",
                err
            );

            setCrops([]);

        }
    };


    // ============================================================
    // LOAD EVERYTHING
    // ============================================================

    const loadData = async () => {

        try {

            setLoading(true);

            await Promise.all([
                loadSales(),
                loadSummary(),
                loadCrops()
            ]);

        } catch (err) {

            console.error(
                "LOAD DATA ERROR:",
                err
            );

            setError(
                "Unable to load sales data."
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        loadData();

    }, []);


    // ============================================================
    // HANDLE INPUT CHANGE
    // ============================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );


        // Clear old messages while editing.
        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };


    // ============================================================
    // SUBMIT SALE
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ========================================================
        // CROP
        // ========================================================

        if (!form.crop_id) {

            setError(
                "Please select a crop."
            );

            return;
        }


        const cropId =
            Number(form.crop_id);


        if (
            !Number.isInteger(cropId) ||
            cropId <= 0
        ) {

            setError(
                "Please select a valid crop."
            );

            return;
        }


        // ========================================================
        // QUANTITY
        // ========================================================

        const quantity =
            Number(form.quantity);


        if (
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {

            setError(
                "Please enter a valid quantity."
            );

            return;
        }


        // ========================================================
        // PRICE PER UNIT
        // ========================================================

        const pricePerUnit =
            Number(
                form.price_per_unit
            );


        if (
            !Number.isFinite(pricePerUnit) ||
            pricePerUnit <= 0
        ) {

            setError(
                "Please enter a valid selling price per unit."
            );

            return;
        }


        // ========================================================
        // SALE DATE
        // ========================================================

        if (!form.sale_date) {

            setError(
                "Please select the sale date."
            );

            return;
        }


        // ========================================================
        // TRANSPORTATION COST
        // ========================================================

        const transportationCost =
            form.transportation_cost === ""
                ? 0
                : Number(
                    form.transportation_cost
                );


        if (
            !Number.isFinite(
                transportationCost
            ) ||
            transportationCost < 0
        ) {

            setError(
                "Please enter a valid transportation cost."
            );

            return;
        }


        // ========================================================
        // OTHER COST
        // ========================================================

        const otherCost =
            form.other_cost === ""
                ? 0
                : Number(
                    form.other_cost
                );


        if (
            !Number.isFinite(
                otherCost
            ) ||
            otherCost < 0
        ) {

            setError(
                "Please enter a valid other cost."
            );

            return;
        }


        // ========================================================
        // TOTAL
        // ========================================================

        const totalAmount =
            quantity *
            pricePerUnit;


        // ========================================================
        // NET PROFIT
        // ========================================================

        const netProfit =
            totalAmount -
            transportationCost -
            otherCost;


        // ========================================================
        // MANDI
        //
        // VERY IMPORTANT
        //
        // Do NOT send:
        //
        // mandi_id: 0
        //
        // Do NOT send:
        //
        // mandi_id: Number("")
        //
        // Send null when no mandi is selected.
        // ========================================================

        let mandiId = null;


        if (
            form.mandi_id !== undefined &&
            form.mandi_id !== null &&
            String(form.mandi_id).trim() !== ""
        ) {

            const parsedMandiId =
                Number(form.mandi_id);


            if (
                !Number.isInteger(
                    parsedMandiId
                ) ||
                parsedMandiId <= 0
            ) {

                setError(
                    "Please enter a valid mandi ID or leave it empty."
                );

                return;
            }


            mandiId =
                parsedMandiId;
        }


        // ========================================================
        // BUYER
        // ========================================================

        const buyerName =
            form.buyer_name.trim();


        // ========================================================
        // NOTES
        // ========================================================

        const notes =
            form.notes.trim();


        // ========================================================
        // PAYMENT STATUS
        // ========================================================

        const paymentStatus =
            [
                "pending",
                "paid",
                "partial"
            ].includes(
                form.payment_status
            )
                ? form.payment_status
                : "pending";


        // ========================================================
        // FINAL PAYLOAD
        // ========================================================

        const payload = {

            crop_id:
                cropId,

            quantity:
                quantity,

            price_per_unit:
                pricePerUnit,

            total_amount:
                totalAmount,

            transportation_cost:
                transportationCost,

            other_cost:
                otherCost,

            net_profit:
                netProfit,

            sale_date:
                form.sale_date,

            payment_status:
                paymentStatus,

            buyer_name:
                buyerName || null,

            mandi_id:
                mandiId,

            notes:
                notes || null
        };


        // ========================================================
        // DEBUG
        // ========================================================

        console.log(
            "================================="
        );

        console.log(
            "SALE SUBMIT"
        );

        console.log(
            "PAYLOAD:",
            payload
        );

        console.log(
            "crop_id:",
            payload.crop_id
        );

        console.log(
            "quantity:",
            payload.quantity
        );

        console.log(
            "price_per_unit:",
            payload.price_per_unit
        );

        console.log(
            "total_amount:",
            payload.total_amount
        );

        console.log(
            "transportation_cost:",
            payload.transportation_cost
        );

        console.log(
            "other_cost:",
            payload.other_cost
        );

        console.log(
            "net_profit:",
            payload.net_profit
        );

        console.log(
            "mandi_id:",
            payload.mandi_id
        );

        console.log(
            "================================="
        );


        // ========================================================
        // SAVE
        // ========================================================

        try {

            setSaving(true);


            const result =
                await addSale(
                    payload
                );


            console.log(
                "SERVER RESPONSE:",
                result
            );


            // ====================================================
            // CHECK SUCCESS
            // ====================================================

            if (
                !result ||
                result.success !== true
            ) {

                throw new Error(
                    result?.message ||
                    "Failed to record sale."
                );
            }


            // ====================================================
            // SUCCESS
            // ====================================================

            setSuccess(
                "Sale recorded successfully."
            );

            setError("");


            // ====================================================
            // RESET FORM
            // ====================================================

            setForm(
                getInitialForm()
            );


            // ====================================================
            // REFRESH DATA
            // ====================================================

            await Promise.all([
                loadSales(),
                loadSummary(),
                loadCrops()
            ]);

        } catch (err) {

            console.error(
                "================================="
            );

            console.error(
                "SAVE SALE ERROR:",
                err
            );

            console.error(
                "SERVER RESPONSE:",
                err?.response?.data
            );

            console.error(
                "================================="
            );


            const serverMessage =
                err?.response?.data?.message;


            const serverError =
                err?.response?.data?.error;


            setError(
                serverMessage ||
                serverError ||
                err.message ||
                "Failed to record sale."
            );

        } finally {

            setSaving(false);

        }
    };


    // ============================================================
    // DELETE SALE
    // ============================================================

    const handleDelete = async (id) => {

        const saleId =
            Number(id);


        if (
            !Number.isInteger(saleId) ||
            saleId <= 0
        ) {

            setError(
                "Invalid sale ID."
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this sale?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeleting(true);

            setError("");
            setSuccess("");


            const result =
                await deleteSale(
                    saleId
                );


            console.log(
                "DELETE SALE RESPONSE:",
                result
            );


            if (
                !result ||
                result.success !== true
            ) {

                throw new Error(
                    result?.message ||
                    "Failed to delete sale."
                );
            }


            setSuccess(
                "Sale deleted successfully."
            );


            await Promise.all([
                loadSales(),
                loadSummary()
            ]);

        } catch (err) {

            console.error(
                "DELETE SALE ERROR:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err.message ||
                "Failed to delete sale."
            );

        } finally {

            setDeleting(false);

        }
    };


    // ============================================================
    // CLEAR FORM
    // ============================================================

    const clearForm = () => {

        setForm(
            getInitialForm()
        );

        setError("");
        setSuccess("");
    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <FarmerLayout>

            <main
                id="main-content"
                className="min-h-screen bg-gray-100 px-5 py-10"
            >

                <div className="max-w-7xl mx-auto">


                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="mb-8">

                        <p className="text-orange-600 font-bold text-sm uppercase tracking-wide">
                            Farmer Finance
                        </p>

                        <h1 className="text-4xl font-bold text-slate-900 mt-1">
                            Sales & Transactions
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Record your crop sales and track your farming revenue.
                        </p>

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

                            <div className="flex items-start gap-3">

                                <span className="text-xl">
                                    ⚠️
                                </span>

                                <div>

                                    <p className="font-bold">
                                        {error}
                                    </p>

                                    {error.includes(
                                        "mandi"
                                    ) && (

                                        <p className="text-sm mt-1">
                                            Leave the Mandi / Market field empty if you do not have a valid mandi ID.
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (

                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">

                            <p className="font-semibold">
                                ✅ {success}
                            </p>

                        </div>

                    )}


                    {/* ==================================================
                        SUMMARY CARDS
                    ================================================== */}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">


                        {/* TOTAL TRANSACTIONS */}

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                            <p className="text-gray-500 text-sm">
                                Total Transactions
                            </p>

                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                {formatMoney(
                                    summary.total_transactions
                                )}
                            </p>

                        </div>


                        {/* TOTAL QUANTITY */}

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                            <p className="text-gray-500 text-sm">
                                Total Quantity
                            </p>

                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                {formatMoney(
                                    summary.total_quantity
                                )}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Units sold
                            </p>

                        </div>


                        {/* REVENUE */}

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                            <p className="text-gray-500 text-sm">
                                Total Revenue
                            </p>

                            <p className="text-3xl font-bold text-orange-600 mt-2">
                                ₹
                                {formatMoney(
                                    summary.total_revenue
                                )}
                            </p>

                        </div>


                        {/* PENDING */}

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                            <p className="text-gray-500 text-sm">
                                Pending Payment
                            </p>

                            <p className="text-3xl font-bold text-red-600 mt-2">
                                ₹
                                {formatMoney(
                                    summary.pending_amount
                                )}
                            </p>

                        </div>

                    </div>


                    {/* ==================================================
                        RECORD SALE
                    ================================================== */}

                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-8">

                        <div className="mb-6">

                            <h2 className="text-2xl font-bold text-slate-900">
                                Record New Sale
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Enter the details of your crop transaction.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="grid md:grid-cols-2 gap-5"
                        >


                            {/* ==================================================
                                CROP
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Crop *
                                </label>

                                <select
                                    name="crop_id"
                                    value={form.crop_id}
                                    onChange={handleChange}
                                    required
                                    disabled={
                                        loading ||
                                        saving
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                >

                                    <option value="">
                                        Select your crop
                                    </option>

                                    {crops.map(
                                        (crop) => (

                                            <option
                                                key={crop.id}
                                                value={crop.id}
                                            >
                                                {
                                                    crop.crop_name ||
                                                    crop.name ||
                                                    `Crop #${crop.id}`
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                                {crops.length === 0 &&
                                    !loading && (

                                        <p className="text-sm text-red-600 mt-2">
                                            No crops found. Add a crop first.
                                        </p>

                                    )}

                            </div>


                            {/* ==================================================
                                CROP NAME
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Crop Name *
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedCrop?.crop_name ||
                                        selectedCrop?.name ||
                                        ""
                                    }
                                    readOnly
                                    placeholder="Select your crop"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                                />

                            </div>


                            {/* ==================================================
                                QUANTITY
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Quantity *
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    required
                                    disabled={saving}
                                    placeholder="Example: 600"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                    Enter the quantity sold.
                                </p>

                            </div>


                            {/* ==================================================
                                PRICE PER UNIT
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Selling Price / Unit *
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-600">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="price_per_unit"
                                        value={form.price_per_unit}
                                        onChange={handleChange}
                                        min="0.01"
                                        step="0.01"
                                        required
                                        disabled={saving}
                                        placeholder="Example: 3000"
                                        className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    />

                                </div>

                                <p className="text-xs text-gray-500 mt-1">
                                    Price is stored as price per unit.
                                </p>

                            </div>


                            {/* ==================================================
                                BUYER
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Buyer Name
                                </label>

                                <input
                                    type="text"
                                    name="buyer_name"
                                    value={form.buyer_name}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="Example: Ramesh Traders"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                />

                            </div>


                            {/* ==================================================
                                MANDI
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Mandi / Market
                                </label>

                                <input
                                    type="number"
                                    name="mandi_id"
                                    value={form.mandi_id}
                                    onChange={handleChange}
                                    min="1"
                                    step="1"
                                    disabled={saving}
                                    placeholder="Optional mandi ID"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                    Optional. Leave empty if you do not have a valid mandi ID.
                                </p>

                            </div>


                            {/* ==================================================
                                TRANSPORTATION
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Transportation Cost
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="transportation_cost"
                                        value={form.transportation_cost}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        disabled={saving}
                                        className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    />

                                </div>

                            </div>


                            {/* ==================================================
                                OTHER COST
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Other Cost
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="other_cost"
                                        value={form.other_cost}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        disabled={saving}
                                        className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                    />

                                </div>

                            </div>


                            {/* ==================================================
                                SALE DATE
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Sale Date *
                                </label>

                                <input
                                    type="date"
                                    name="sale_date"
                                    value={form.sale_date}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                />

                            </div>


                            {/* ==================================================
                                PAYMENT
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Payment Status
                                </label>

                                <select
                                    name="payment_status"
                                    value={form.payment_status}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                >

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="paid">
                                        Paid
                                    </option>

                                    <option value="partial">
                                        Partial
                                    </option>

                                </select>

                            </div>


                            {/* ==================================================
                                NOTES
                            ================================================== */}

                            <div className="md:col-span-2">

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    disabled={saving}
                                    placeholder="Optional notes about this sale..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                                />

                            </div>


                            {/* ==================================================
                                ESTIMATED SALE
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Estimated Sale Amount
                                </label>

                                <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-4">

                                    <p className="text-2xl font-bold text-orange-600">

                                        ₹
                                        {formatMoney(
                                            calculateTotal()
                                        )}

                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Quantity × Selling Price
                                    </p>

                                </div>

                            </div>


                            {/* ==================================================
                                ESTIMATED PROFIT
                            ================================================== */}

                            <div>

                                <label className="block font-semibold text-gray-800 mb-2">
                                    Estimated Net Profit
                                </label>

                                <div
                                    className={
                                        calculateNetProfit() >= 0
                                            ? "bg-green-50 border border-green-200 rounded-lg px-4 py-4"
                                            : "bg-red-50 border border-red-200 rounded-lg px-4 py-4"
                                    }
                                >

                                    <p
                                        className={
                                            calculateNetProfit() >= 0
                                                ? "text-2xl font-bold text-green-700"
                                                : "text-2xl font-bold text-red-700"
                                        }
                                    >

                                        ₹
                                        {formatMoney(
                                            calculateNetProfit()
                                        )}

                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Sale amount − transportation − other cost
                                    </p>

                                </div>

                            </div>


                            {/* ==================================================
                                BUTTONS
                            ================================================== */}

                            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        loading ||
                                        !form.crop_id ||
                                        !form.quantity ||
                                        !form.price_per_unit
                                    }
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save Sale"}

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        clearForm
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="border border-gray-300 bg-white px-7 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Clear
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/farmer/dashboard"
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="border border-gray-300 bg-white px-7 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </section>


                    {/* ==================================================
                        SALE HISTORY
                    ================================================== */}

                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                        <div className="p-7 border-b border-gray-200">

                            <h2 className="text-2xl font-bold text-slate-900">
                                Sale History
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Your recorded crop transactions.
                            </p>

                        </div>


                        {/* ==================================================
                            LOADING
                        ================================================== */}

                        {loading ? (

                            <div className="p-16 text-center">

                                <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4">
                                </div>

                                <p className="text-gray-600">
                                    Loading sales...
                                </p>

                            </div>

                        ) : sales.length === 0 ? (

                            /* ==================================================
                               EMPTY
                            ================================================== */

                            <div className="p-16 text-center">

                                <h3 className="text-xl font-bold text-slate-900">
                                    No Sales Recorded
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    Record your first crop sale above.
                                </p>

                            </div>

                        ) : (

                            /* ==================================================
                               TABLE
                            ================================================== */

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-sm font-semibold">
                                                Crop
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold">
                                                Quantity
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold">
                                                Price / Unit
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold">
                                                Total
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold">
                                                Payment
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold">
                                                Date
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {sales.map(
                                            (sale) => {

                                                const paymentStatus =
                                                    sale.payment_status ||
                                                    "pending";


                                                return (

                                                    <tr
                                                        key={
                                                            sale.id
                                                        }
                                                        className="border-t border-gray-200 hover:bg-gray-50"
                                                    >

                                                        {/* CROP */}

                                                        <td className="px-6 py-4">

                                                            <p className="font-semibold text-slate-900">

                                                                {
                                                                    sale.crop_name ||
                                                                    sale.cropName ||
                                                                    "Unknown Crop"
                                                                }

                                                            </p>


                                                            {sale.buyer_name && (

                                                                <p className="text-xs text-gray-500 mt-1">

                                                                    Buyer:{" "}
                                                                    {
                                                                        sale.buyer_name
                                                                    }

                                                                </p>

                                                            )}


                                                            {sale.mandi_name && (

                                                                <p className="text-xs text-gray-500">

                                                                    Mandi:{" "}
                                                                    {
                                                                        sale.mandi_name
                                                                    }

                                                                </p>

                                                            )}

                                                        </td>


                                                        {/* QUANTITY */}

                                                        <td className="px-6 py-4">

                                                            {formatMoney(
                                                                sale.quantity
                                                            )}

                                                        </td>


                                                        {/* PRICE */}

                                                        <td className="px-6 py-4">

                                                            ₹
                                                            {formatMoney(
                                                                sale.price_per_unit
                                                            )}

                                                        </td>


                                                        {/* TOTAL */}

                                                        <td className="px-6 py-4 font-bold text-orange-600">

                                                            ₹
                                                            {formatMoney(
                                                                sale.total_amount
                                                            )}

                                                        </td>


                                                        {/* PAYMENT */}

                                                        <td className="px-6 py-4">

                                                            <span
                                                                className={
                                                                    paymentStatus === "paid"
                                                                        ? "inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                                                                        : paymentStatus === "partial"
                                                                            ? "inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"
                                                                            : "inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
                                                                }
                                                            >

                                                                {
                                                                    paymentStatus
                                                                        .charAt(0)
                                                                        .toUpperCase() +
                                                                    paymentStatus.slice(1)
                                                                }

                                                            </span>

                                                        </td>


                                                        {/* DATE */}

                                                        <td className="px-6 py-4 whitespace-nowrap">

                                                            {
                                                                sale.sale_date
                                                                    ? new Date(
                                                                        sale.sale_date
                                                                    ).toLocaleDateString(
                                                                        "en-IN"
                                                                    )
                                                                    : "—"
                                                            }

                                                        </td>


                                                        {/* DELETE */}

                                                        <td className="px-6 py-4">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        sale.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleting
                                                                }
                                                                className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
                                                            >

                                                                {deleting
                                                                    ? "Deleting..."
                                                                    : "Delete"}

                                                            </button>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                </div>

            </main>

        </FarmerLayout>
    );
}


export default Sales;