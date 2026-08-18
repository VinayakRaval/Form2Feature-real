import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FarmerNavbar from "../../components/Navbar";

const API_URL = "http://localhost:5000";

function FarmerDeals() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

    const loadDeals = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/deals/farmer`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch farmer deals"
                );
            }

            setDeals(Array.isArray(data.deals) ? data.deals : []);
        } catch (err) {
            console.error("FARMER DEALS ERROR:", err);
            setError(
                err.message || "Failed to fetch farmer deals"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeals();
    }, []);

    const formatPrice = (value) => {
        return Number(value || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const statusClass = (status) => {
        switch (status) {
            case "accepted":
                return "status accepted";

            case "payment_pending":
                return "status payment-pending";

            case "paid":
                return "status paid";

            case "completed":
                return "status completed";

            case "cancelled":
                return "status cancelled";

            default:
                return "status";
        }
    };

    const statusText = (status) => {
        switch (status) {
            case "accepted":
                return "Accepted";

            case "payment_pending":
                return "Payment Pending";

            case "paid":
                return "Paid";

            case "completed":
                return "Completed";

            case "cancelled":
                return "Cancelled";

            default:
                return status || "Unknown";
        }
    };

    return (
        <>
            {/* =====================================================
                FARMER NAVBAR
            ===================================================== */}
            <FarmerNavbar />

            <main className="farmer-deals-page">
                <div className="deals-container">

                    {/* =================================================
                        HEADER
                    ================================================= */}
                    <div className="deals-header">

                        <div>
                            <h1>My Deals</h1>

                            <p>
                                Manage crop deals created from
                                accepted buyer offers.
                            </p>
                        </div>

                        <div className="deal-count">
                            <strong>{deals.length}</strong>
                            <span>Total Deals</span>
                        </div>

                    </div>

                    {/* =================================================
                        LOADING
                    ================================================= */}
                    {loading && (
                        <div className="message-box">
                            <div className="loader"></div>
                            <p>Loading your deals...</p>
                        </div>
                    )}

                    {/* =================================================
                        ERROR
                    ================================================= */}
                    {!loading && error && (
                        <div className="message-box error-box">

                            <div className="error-icon">
                                !
                            </div>

                            <h2>
                                Unable to Load Deals
                            </h2>

                            <p>{error}</p>

                            <button
                                onClick={loadDeals}
                                className="retry-btn"
                            >
                                Try Again
                            </button>

                        </div>
                    )}

                    {/* =================================================
                        EMPTY
                    ================================================= */}
                    {!loading &&
                        !error &&
                        deals.length === 0 && (
                            <div className="message-box">

                                <div className="empty-icon">
                                    🤝
                                </div>

                                <h2>
                                    No Deals Yet
                                </h2>

                                <p>
                                    Deals will appear here when
                                    buyers make offers and you
                                    accept them.
                                </p>

                                <Link
                                    to="/farmer/offers"
                                    className="browse-btn"
                                >
                                    View Buyer Offers
                                </Link>

                            </div>
                        )}

                    {/* =================================================
                        DEAL LIST
                    ================================================= */}
                    {!loading &&
                        !error &&
                        deals.length > 0 && (
                            <div className="deal-list">

                                {deals.map((deal) => (
                                    <div
                                        className="deal-card"
                                        key={deal.id}
                                    >

                                        {/* TOP */}
                                        <div className="deal-top">

                                            <div>
                                                <h2>
                                                    {deal.crop_name ||
                                                        "Crop"}
                                                </h2>

                                                {deal.crop_variety && (
                                                    <p className="variety">
                                                        Variety:{" "}
                                                        {deal.crop_variety}
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={statusClass(
                                                    deal.status
                                                )}
                                            >
                                                {statusText(
                                                    deal.status
                                                )}
                                            </span>

                                        </div>

                                        {/* DETAILS */}
                                        <div className="deal-info">

                                            <div className="info-row">
                                                <span>
                                                    Buyer
                                                </span>

                                                <strong>
                                                    {deal.buyer_name ||
                                                        "Unknown Buyer"}
                                                </strong>
                                            </div>

                                            <div className="info-row">
                                                <span>
                                                    Quantity
                                                </span>

                                                <strong>
                                                    {Number(
                                                        deal.quantity || 0
                                                    ).toFixed(2)}{" "}
                                                    {deal.quantity_unit ||
                                                        "kg"}
                                                </strong>
                                            </div>

                                            <div className="info-row">
                                                <span>
                                                    Agreed Price
                                                </span>

                                                <strong className="price">
                                                    {formatPrice(
                                                        deal.agreed_price
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="info-row">
                                                <span>
                                                    Deal Date
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        deal.created_at
                                                    )}
                                                </strong>
                                            </div>

                                            {deal.message && (
                                                <div className="message-row">
                                                    <span>
                                                        Message
                                                    </span>

                                                    <p>
                                                        {deal.message}
                                                    </p>
                                                </div>
                                            )}

                                        </div>

                                        {/* ACTION */}
                                        <div className="deal-actions">

                                            <Link
                                                to={`/farmer/deals/${deal.id}`}
                                                className="view-btn"
                                            >
                                                View Deal
                                            </Link>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                </div>
            </main>

            {/* =====================================================
                PAGE CSS
            ===================================================== */}
            <style>{`

                * {
                    box-sizing: border-box;
                }

                .farmer-deals-page {
                    min-height: calc(100vh - 70px);
                    background: #f7f8fa;
                    padding: 32px;
                    font-family: Arial, sans-serif;
                }

                .deals-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .deals-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .deals-header h1 {
                    margin: 0 0 8px;
                    font-size: 32px;
                    color: #1f2937;
                }

                .deals-header p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 15px;
                }

                .deal-count {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 16px 24px;
                    min-width: 150px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .deal-count strong {
                    display: block;
                    font-size: 28px;
                    color: #111827;
                }

                .deal-count span {
                    display: block;
                    margin-top: 4px;
                    color: #6b7280;
                    font-size: 13px;
                }

                .deal-list {
                    display: grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(330px, 1fr));
                    gap: 20px;
                }

                .deal-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 22px;
                    box-shadow:
                        0 4px 16px rgba(0, 0, 0, 0.05);
                    transition: 0.2s ease;
                }

                .deal-card:hover {
                    transform: translateY(-2px);
                    box-shadow:
                        0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .deal-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 15px;
                    margin-bottom: 22px;
                }

                .deal-top h2 {
                    margin: 0;
                    font-size: 21px;
                    color: #111827;
                    text-transform: capitalize;
                }

                .variety {
                    margin: 6px 0 0;
                    color: #6b7280;
                    font-size: 13px;
                }

                .status {
                    padding: 6px 11px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    white-space: nowrap;
                    background: #f3f4f6;
                    color: #374151;
                }

                .status.accepted {
                    background: #dcfce7;
                    color: #166534;
                }

                .status.payment-pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status.paid {
                    background: #dbeafe;
                    color: #1e40af;
                }

                .status.completed {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status.cancelled {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .deal-info {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    padding-bottom: 11px;
                    border-bottom: 1px solid #f0f0f0;
                }

                .info-row span {
                    color: #6b7280;
                    font-size: 14px;
                }

                .info-row strong {
                    color: #111827;
                    font-size: 14px;
                    text-align: right;
                }

                .info-row .price {
                    color: #111827;
                    font-size: 17px;
                }

                .message-row {
                    padding: 12px;
                    background: #f9fafb;
                    border-radius: 9px;
                }

                .message-row span {
                    display: block;
                    margin-bottom: 6px;
                }

                .message-row p {
                    margin: 0;
                    color: #374151;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .deal-actions {
                    display: flex;
                }

                .view-btn {
                    width: 100%;
                    text-align: center;
                    text-decoration: none;
                    background: #111827;
                    color: white;
                    padding: 11px 15px;
                    border-radius: 9px;
                    font-size: 14px;
                    font-weight: 600;
                    transition: 0.2s;
                }

                .view-btn:hover {
                    background: #374151;
                }

                .message-box {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 55px 25px;
                    text-align: center;
                }

                .message-box h2 {
                    margin: 12px 0 8px;
                    color: #1f2937;
                }

                .message-box p {
                    color: #6b7280;
                    margin: 0 0 20px;
                }

                .error-box {
                    border-color: #fecaca;
                }

                .error-box h2 {
                    color: #991b1b;
                }

                .error-icon {
                    width: 45px;
                    height: 45px;
                    margin: 0 auto;
                    border-radius: 50%;
                    background: #fee2e2;
                    color: #991b1b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    font-weight: bold;
                }

                .empty-icon {
                    font-size: 40px;
                }

                .retry-btn,
                .browse-btn {
                    display: inline-block;
                    border: none;
                    background: #111827;
                    color: white;
                    padding: 10px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 600;
                }

                .retry-btn:hover,
                .browse-btn:hover {
                    background: #374151;
                }

                .loader {
                    width: 35px;
                    height: 35px;
                    border: 3px solid #e5e7eb;
                    border-top-color: #111827;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto 15px;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (max-width: 700px) {

                    .farmer-deals-page {
                        padding: 18px;
                    }

                    .deals-header {
                        flex-direction: column;
                    }

                    .deal-count {
                        width: 100%;
                    }

                    .deal-top {
                        flex-direction: column;
                    }

                    .info-row {
                        flex-direction: column;
                        gap: 5px;
                    }

                    .info-row strong {
                        text-align: left;
                    }

                }

            `}</style>
        </>
    );
}

export default FarmerDeals;