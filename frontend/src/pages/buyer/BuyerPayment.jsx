import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import BuyerNavbar from "../../components/BuyerNavbar";

const API_BASE_URL =
    "http://localhost:5000/api";

const BuyerPayment = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [deal, setDeal] =
        useState(null);

    const [paymentMethod, setPaymentMethod] =
        useState("upi");

    const [loading, setLoading] =
        useState(true);

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const getToken = () => {

        return (
            localStorage.getItem(
                "form2feature_token"
            ) ||
            localStorage.getItem(
                "token"
            ) ||
            localStorage.getItem(
                "authToken"
            ) ||
            localStorage.getItem(
                "accessToken"
            )
        );
    };

    // ========================================================
    // FETCH DEAL
    // ========================================================

    const fetchDeal = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication required"
                );
            }

            if (!id) {
                throw new Error(
                    "Invalid deal ID"
                );
            }

            const response =
                await fetch(
                    `${API_BASE_URL}/deals/${id}`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            const data =
                await response.json();

            console.log(
                "DEAL API RESPONSE:",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to load deal"
                );
            }

            setDeal(
                data.deal ||
                data.data ||
                data
            );

        } catch (err) {

            console.error(
                "FETCH DEAL ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to load deal"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchDeal();

    }, [id]);

    // ========================================================
    // FORMAT CURRENCY
    // ========================================================

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        ).format(
            Number(value || 0)
        );
    };

    // ========================================================
    // PAYMENT
    // ========================================================

    const handlePayment = async () => {

        try {

            setProcessing(true);
            setError("");
            setSuccess("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication required"
                );
            }

            if (!deal?.id) {
                throw new Error(
                    "Invalid deal"
                );
            }

            console.log(
                "PAYMENT REQUEST:",
                {
                    deal_id: Number(deal.id),
                    payment_method:
                        paymentMethod
                }
            );

            const response =
                await fetch(
                    `${API_BASE_URL}/payments`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            deal_id:
                                Number(deal.id),

                            payment_method:
                                paymentMethod
                        })
                    }
                );

            const data =
                await response.json();

            console.log(
                "PAYMENT RESPONSE:",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to process payment"
                );
            }

            setSuccess(
                "Payment completed successfully."
            );

            // Give UI time to show success
            setTimeout(() => {

                navigate(
                    `/buyer/deals/${deal.id}`
                );

            }, 1200);

        } catch (err) {

            console.error(
                "PAYMENT ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to process payment"
            );

        } finally {

            setProcessing(false);

        }
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <>
                <BuyerNavbar />

                <div
                    style={{
                        minHeight:
                            "70vh",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        color:
                            "#64748b",
                        fontSize:
                            "18px"
                    }}
                >
                    Loading payment details...
                </div>
            </>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error && !deal) {

        return (
            <>
                <BuyerNavbar />

                <div
                    style={{
                        minHeight:
                            "70vh",
                        background:
                            "#f6f7f9",
                        padding:
                            "50px 20px"
                    }}
                >

                    <div
                        style={{
                            maxWidth:
                                "700px",
                            margin:
                                "0 auto",
                            background:
                                "#fff",
                            border:
                                "1px solid #e5e7eb",
                            borderRadius:
                                "16px",
                            padding:
                                "40px",
                            textAlign:
                                "center"
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "42px",
                                marginBottom:
                                    "15px"
                            }}
                        >
                            ⚠️
                        </div>

                        <h2
                            style={{
                                margin:
                                    "0 0 10px",
                                color:
                                    "#172b4d"
                            }}
                        >
                            Payment Unavailable
                        </h2>

                        <p
                            style={{
                                color:
                                    "#64748b"
                            }}
                        >
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/buyer/deals"
                                )
                            }
                            style={{
                                marginTop:
                                    "20px",
                                padding:
                                    "12px 24px",
                                border:
                                    "none",
                                borderRadius:
                                    "8px",
                                background:
                                    "#ff6500",
                                color:
                                    "#fff",
                                fontWeight:
                                    "700",
                                cursor:
                                    "pointer"
                            }}
                        >
                            View My Deals
                        </button>

                    </div>

                </div>
            </>
        );
    }

    // ========================================================
    // MAIN
    // ========================================================

    return (
        <>
            <BuyerNavbar />

            <div
                style={{
                    minHeight:
                        "calc(100vh - 150px)",
                    background:
                        "#f6f7f9",
                    padding:
                        "45px 20px"
                }}
            >

                <div
                    style={{
                        maxWidth:
                            "1100px",
                        margin:
                            "0 auto"
                    }}
                >

                    {/* BACK */}

                    <button
                        onClick={() =>
                            navigate(
                                `/buyer/deals/${deal.id}`
                            )
                        }
                        style={{
                            background:
                                "transparent",
                            border:
                                "none",
                            color:
                                "#334155",
                            fontSize:
                                "15px",
                            fontWeight:
                                "600",
                            cursor:
                                "pointer",
                            marginBottom:
                                "25px"
                        }}
                    >
                        ← Back to Deal
                    </button>

                    {/* HEADER */}

                    <div
                        style={{
                            marginBottom:
                                "30px"
                        }}
                    >

                        <div
                            style={{
                                color:
                                    "#ff6500",
                                fontWeight:
                                    "800",
                                fontSize:
                                    "14px",
                                letterSpacing:
                                    "0.5px"
                            }}
                        >
                            BUYER PORTAL
                        </div>

                        <h1
                            style={{
                                fontSize:
                                    "36px",
                                margin:
                                    "6px 0",
                                color:
                                    "#172b4d"
                            }}
                        >
                            Make Payment
                        </h1>

                        <p
                            style={{
                                color:
                                    "#64748b",
                                margin:
                                    "0"
                            }}
                        >
                            Complete your payment
                            for this crop purchase.
                        </p>

                    </div>

                    {/* SUCCESS */}

                    {success && (

                        <div
                            style={{
                                background:
                                    "#ecfdf5",
                                border:
                                    "1px solid #86efac",
                                color:
                                    "#166534",
                                padding:
                                    "15px 18px",
                                borderRadius:
                                    "10px",
                                marginBottom:
                                    "20px",
                                fontWeight:
                                    "600"
                            }}
                        >
                            ✓ {success}
                        </div>

                    )}

                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                background:
                                    "#fef2f2",
                                border:
                                    "1px solid #fecaca",
                                color:
                                    "#dc2626",
                                padding:
                                    "15px 18px",
                                borderRadius:
                                    "10px",
                                marginBottom:
                                    "20px"
                            }}
                        >
                            ⚠️ {error}
                        </div>

                    )}

                    <div
                        style={{
                            display:
                                "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap:
                                "25px"
                        }}
                    >

                        {/* =================================================
                            PURCHASE SUMMARY
                        ================================================= */}

                        <div
                            style={{
                                background:
                                    "#fff",
                                border:
                                    "1px solid #e2e8f0",
                                borderRadius:
                                    "16px",
                                padding:
                                    "25px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.04)"
                            }}
                        >

                            <h2
                                style={{
                                    marginTop:
                                        "0",
                                    color:
                                        "#172b4d",
                                    fontSize:
                                        "20px"
                                }}
                            >
                                Purchase Summary
                            </h2>

                            <h3
                                style={{
                                    fontSize:
                                        "24px",
                                    color:
                                        "#166534",
                                    margin:
                                        "25px 0 20px",
                                    textTransform:
                                        "capitalize"
                                }}
                            >
                                {deal.crop_name ||
                                    deal.cropName ||
                                    "Crop"}
                            </h3>

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap:
                                        "20px",
                                    color:
                                        "#334155"
                                }}
                            >

                                <div>
                                    <small
                                        style={{
                                            color:
                                                "#64748b"
                                        }}
                                    >
                                        Farmer
                                    </small>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "5px"
                                        }}
                                    >
                                        {deal.farmer_name ||
                                            "Farmer"}
                                    </strong>
                                </div>

                                <div>
                                    <small
                                        style={{
                                            color:
                                                "#64748b"
                                        }}
                                    >
                                        Quantity
                                    </small>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "5px"
                                        }}
                                    >
                                        {deal.quantity}{" "}
                                        {deal.quantity_unit ||
                                            "kg"}
                                    </strong>
                                </div>

                                <div>
                                    <small
                                        style={{
                                            color:
                                                "#64748b"
                                        }}
                                    >
                                        Deal ID
                                    </small>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "5px"
                                        }}
                                    >
                                        #{deal.id}
                                    </strong>
                                </div>

                                <div>
                                    <small
                                        style={{
                                            color:
                                                "#64748b"
                                        }}
                                    >
                                        Status
                                    </small>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "5px",
                                            color:
                                                "#16a34a",
                                            textTransform:
                                                "capitalize"
                                        }}
                                    >
                                        {deal.status}
                                    </strong>
                                </div>

                            </div>

                            <div
                                style={{
                                    marginTop:
                                        "25px",
                                    background:
                                        "#ecfdf5",
                                    borderRadius:
                                        "12px",
                                    padding:
                                        "18px",
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center"
                                }}
                            >

                                <span>
                                    Total Amount
                                </span>

                                <strong
                                    style={{
                                        fontSize:
                                            "20px",
                                        color:
                                            "#166534"
                                    }}
                                >
                                    {formatCurrency(
                                        deal.agreed_price
                                    )}
                                </strong>

                            </div>

                        </div>

                        {/* =================================================
                            PAYMENT METHOD
                        ================================================= */}

                        <div
                            style={{
                                background:
                                    "#fff",
                                border:
                                    "1px solid #e2e8f0",
                                borderRadius:
                                    "16px",
                                padding:
                                    "25px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.04)"
                            }}
                        >

                            <h2
                                style={{
                                    marginTop:
                                        "0",
                                    color:
                                        "#172b4d",
                                    fontSize:
                                        "20px"
                                }}
                            >
                                Payment Method
                            </h2>

                            <p
                                style={{
                                    color:
                                        "#64748b"
                                }}
                            >
                                Select a payment method.
                                This is a mock payment
                                for the project demo.
                            </p>

                            {/* UPI */}

                            <label
                                style={{
                                    display:
                                        "block",
                                    border:
                                        paymentMethod ===
                                        "upi"
                                            ? "2px solid #16a34a"
                                            : "1px solid #e2e8f0",
                                    borderRadius:
                                        "12px",
                                    padding:
                                        "16px",
                                    marginBottom:
                                        "12px",
                                    cursor:
                                        "pointer"
                                }}
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="upi"
                                    checked={
                                        paymentMethod ===
                                        "upi"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <strong
                                    style={{
                                        marginLeft:
                                            "10px"
                                    }}
                                >
                                    UPI
                                </strong>

                                <div
                                    style={{
                                        marginLeft:
                                            "26px",
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "14px"
                                    }}
                                >
                                    Google Pay /
                                    PhonePe / Paytm
                                </div>

                            </label>

                            {/* CARD */}

                            <label
                                style={{
                                    display:
                                        "block",
                                    border:
                                        paymentMethod ===
                                        "card"
                                            ? "2px solid #16a34a"
                                            : "1px solid #e2e8f0",
                                    borderRadius:
                                        "12px",
                                    padding:
                                        "16px",
                                    marginBottom:
                                        "12px",
                                    cursor:
                                        "pointer"
                                }}
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={
                                        paymentMethod ===
                                        "card"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <strong
                                    style={{
                                        marginLeft:
                                            "10px"
                                    }}
                                >
                                    Card
                                </strong>

                                <div
                                    style={{
                                        marginLeft:
                                            "26px",
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "14px"
                                    }}
                                >
                                    Credit / Debit Card
                                </div>

                            </label>

                            {/* NET BANKING */}

                            <label
                                style={{
                                    display:
                                        "block",
                                    border:
                                        paymentMethod ===
                                        "net_banking"
                                            ? "2px solid #16a34a"
                                            : "1px solid #e2e8f0",
                                    borderRadius:
                                        "12px",
                                    padding:
                                        "16px",
                                    marginBottom:
                                        "20px",
                                    cursor:
                                        "pointer"
                                }}
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="net_banking"
                                    checked={
                                        paymentMethod ===
                                        "net_banking"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <strong
                                    style={{
                                        marginLeft:
                                            "10px"
                                    }}
                                >
                                    Net Banking
                                </strong>

                                <div
                                    style={{
                                        marginLeft:
                                            "26px",
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "14px"
                                    }}
                                >
                                    Pay using your bank
                                    account
                                </div>

                            </label>

                            {/* PAY BUTTON */}

                            <button
                                onClick={
                                    handlePayment
                                }
                                disabled={
                                    processing ||
                                    deal.status !==
                                        "accepted"
                                }
                                style={{
                                    width:
                                        "100%",
                                    padding:
                                        "15px",
                                    border:
                                        "none",
                                    borderRadius:
                                        "10px",
                                    background:
                                        processing ||
                                        deal.status !==
                                            "accepted"
                                            ? "#94a3b8"
                                            : "#16a34a",
                                    color:
                                        "#fff",
                                    fontSize:
                                        "16px",
                                    fontWeight:
                                        "700",
                                    cursor:
                                        processing
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >
                                {processing
                                    ? "Processing..."
                                    : `Pay ${formatCurrency(
                                          deal.agreed_price
                                      )}`}
                            </button>

                            <p
                                style={{
                                    textAlign:
                                        "center",
                                    color:
                                        "#64748b",
                                    fontSize:
                                        "12px",
                                    marginTop:
                                        "15px"
                                }}
                            >
                                🔒 Demo payment —
                                no real money will
                                be charged.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
};

export default BuyerPayment;