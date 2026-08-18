import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const API_URL = "http://localhost:5000";

const FarmerOffers = () => {
    const navigate = useNavigate();

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    const [showRejectBox, setShowRejectBox] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [rejectMessage, setRejectMessage] = useState("");

    // ============================================================
    // GET TOKEN
    // ============================================================

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("token") ||
            sessionStorage.getItem("accessToken")
        );
    };

    // ============================================================
    // HEADERS
    // ============================================================

    const getHeaders = () => {
        const token = getToken();

        return {
            "Content-Type": "application/json",
            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),
        };
    };

    // ============================================================
    // LOAD OFFERS
    // ============================================================

    const loadOffers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                setError("Authentication token not found. Please login again.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${API_URL}/api/farmer/offers`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch buyer offers"
                );
            }

            const offerList = Array.isArray(data.offers)
                ? data.offers
                : Array.isArray(data.data)
                ? data.data
                : [];

            setOffers(offerList);
        } catch (err) {
            console.error("LOAD FARMER OFFERS ERROR:", err);

            setError(
                err.message ||
                    "Unable to load buyer offers."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadOffers();
    }, []);

    // ============================================================
    // ACCEPT OFFER
    // ============================================================

    const acceptOffer = async (offerId) => {
        if (!offerId) return;

        const confirmed = window.confirm(
            "Are you sure you want to accept this buyer offer?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(offerId);

            const response = await fetch(
                `${API_URL}/api/farmer/offers/${offerId}/accept`,
                {
                    method: "PUT",
                    headers: getHeaders(),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to accept offer"
                );
            }

            alert(
                data.message ||
                    "Offer accepted successfully."
            );

            await loadOffers();
        } catch (err) {
            console.error(
                "ACCEPT OFFER ERROR:",
                err
            );

            alert(
                err.message ||
                    "Unable to accept offer."
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ============================================================
    // OPEN REJECT MODAL
    // ============================================================

    const openRejectBox = (offer) => {
        setSelectedOffer(offer);
        setRejectMessage("");
        setShowRejectBox(true);
    };

    // ============================================================
    // CLOSE REJECT MODAL
    // ============================================================

    const closeRejectBox = () => {
        if (actionLoading !== null) {
            return;
        }

        setShowRejectBox(false);
        setSelectedOffer(null);
        setRejectMessage("");
    };

    // ============================================================
    // REJECT OFFER
    // ============================================================

    const rejectOffer = async () => {
        if (!selectedOffer) {
            return;
        }

        const message = rejectMessage.trim();

        if (!message) {
            alert(
                "Please provide a reason for rejecting this offer."
            );
            return;
        }

        try {
            setActionLoading(selectedOffer.id);

            const response = await fetch(
                `${API_URL}/api/farmer/offers/${selectedOffer.id}/reject`,
                {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        message,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to reject offer"
                );
            }

            alert(
                data.message ||
                    "Offer rejected successfully."
            );

            setShowRejectBox(false);
            setSelectedOffer(null);
            setRejectMessage("");

            await loadOffers();
        } catch (err) {
            console.error(
                "REJECT OFFER ERROR:",
                err
            );

            alert(
                err.message ||
                    "Unable to reject offer."
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return String(date);
        }

        return value.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // ============================================================
    // FORMAT PRICE
    // ============================================================

    const formatPrice = (price) => {
        const value = Number(price);

        if (Number.isNaN(value)) {
            return "₹0.00";
        }

        return `₹${value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // ============================================================
    // STATUS CLASS
    // ============================================================

    const getStatusClass = (status) => {
        const value = String(
            status || "pending"
        ).toLowerCase();

        if (value === "accepted") {
            return "offer-status accepted";
        }

        if (value === "rejected") {
            return "offer-status rejected";
        }

        if (value === "cancelled") {
            return "offer-status cancelled";
        }

        return "offer-status pending";
    };

    // ============================================================
    // STATUS COUNTS
    // ============================================================

    const totalOffers = offers.length;

    const pendingOffers = offers.filter(
        (offer) =>
            String(offer.status).toLowerCase() ===
            "pending"
    ).length;

    const acceptedOffers = offers.filter(
        (offer) =>
            String(offer.status).toLowerCase() ===
            "accepted"
    ).length;

    const rejectedOffers = offers.filter(
        (offer) =>
            String(offer.status).toLowerCase() ===
            "rejected"
    ).length;

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="farmer-offers-page">

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <Navbar />

            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="farmer-offers-container">

                {/* PAGE HEADER */}

                <section className="page-header">

                    <div className="header-left">

                        <div className="portal-label">
                            SMART AGRICULTURE
                        </div>

                        <h1>
                            Buyer Offers
                        </h1>

                        <p>
                            Review and manage offers
                            submitted by buyers for
                            your crops.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="refresh-btn"
                        onClick={loadOffers}
                        disabled={loading}
                    >
                        <span className="refresh-icon">
                            ↻
                        </span>

                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </section>

                {/* ERROR */}

                {error && (
                    <div className="error-box">

                        <div className="error-icon">
                            !
                        </div>

                        <div className="error-content">

                            <h3>
                                Unable to load offers
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadOffers}
                            >
                                Try Again
                            </button>

                        </div>

                    </div>
                )}

                {/* LOADING */}

                {loading ? (
                    <div className="loading-box">

                        <div className="spinner"></div>

                        <h3>
                            Loading Buyer Offers
                        </h3>

                        <p>
                            Please wait while we
                            fetch your offers.
                        </p>

                    </div>
                ) : offers.length === 0 ? (

                    /* ==================================================
                       EMPTY
                    ================================================== */

                    <div className="empty-box">

                        <div className="empty-icon">
                            <span>₹</span>
                        </div>

                        <h2>
                            No Buyer Offers Yet
                        </h2>

                        <p>
                            You have not received any
                            offers from buyers yet.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/farmer/crops"
                                )
                            }
                        >
                            View My Crops
                        </button>

                    </div>

                ) : (

                    /* ==================================================
                       OFFERS
                    ================================================== */

                    <section className="offers-section">

                        {/* ==================================================
                           SUMMARY
                        ================================================== */}

                        <div className="summary-grid">

                            <div className="summary-card">

                                <div className="summary-label">
                                    Total Offers
                                </div>

                                <div className="summary-number">
                                    {totalOffers}
                                </div>

                            </div>

                            <div className="summary-card">

                                <div className="summary-label">
                                    Pending Offers
                                </div>

                                <div className="summary-number">
                                    {pendingOffers}
                                </div>

                            </div>

                            <div className="summary-card">

                                <div className="summary-label">
                                    Accepted Offers
                                </div>

                                <div className="summary-number">
                                    {acceptedOffers}
                                </div>

                            </div>

                            <div className="summary-card">

                                <div className="summary-label">
                                    Rejected Offers
                                </div>

                                <div className="summary-number">
                                    {rejectedOffers}
                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                           TITLE
                        ================================================== */}

                        <div className="section-title">

                            <div>
                                <div className="section-kicker">
                                    BUYER REQUESTS
                                </div>

                                <h2>
                                    Received Offers
                                </h2>

                                <p>
                                    Review buyer price,
                                    quantity and message
                                    before accepting or
                                    rejecting.
                                </p>
                            </div>

                        </div>

                        {/* ==================================================
                           OFFER LIST
                        ================================================== */}

                        <div className="offers-list">

                            {offers.map((offer) => {

                                const status =
                                    String(
                                        offer.status ||
                                            "pending"
                                    ).toLowerCase();

                                return (
                                    <article
                                        className="offer-card"
                                        key={offer.id}
                                    >

                                        {/* CARD HEADER */}

                                        <div className="offer-card-header">

                                            <div>

                                                <div className="crop-label">
                                                    CROP OFFER
                                                </div>

                                                <h2>
                                                    {offer.crop_name ||
                                                        "Crop"}
                                                </h2>

                                                {offer.crop_variety && (
                                                    <p className="variety">
                                                        Variety:
                                                        {" "}
                                                        <strong>
                                                            {
                                                                offer.crop_variety
                                                            }
                                                        </strong>
                                                    </p>
                                                )}

                                            </div>

                                            <span
                                                className={getStatusClass(
                                                    status
                                                )}
                                            >
                                                {status}
                                            </span>

                                        </div>

                                        {/* DETAILS */}

                                        <div className="offer-details">

                                            <div className="detail-item">

                                                <span>
                                                    Buyer
                                                </span>

                                                <strong>
                                                    {offer.buyer_name ||
                                                        offer.full_name ||
                                                        "Buyer"}
                                                </strong>

                                            </div>

                                            <div className="detail-item">

                                                <span>
                                                    Offered Price
                                                </span>

                                                <strong className="orange-price">
                                                    {formatPrice(
                                                        offer.offered_price
                                                    )}
                                                </strong>

                                            </div>

                                            <div className="detail-item">

                                                <span>
                                                    Quantity
                                                </span>

                                                <strong>
                                                    {offer.quantity ||
                                                        "0"}{" "}
                                                    {offer.quantity_unit ||
                                                        "kg"}
                                                </strong>

                                            </div>

                                            <div className="detail-item">

                                                <span>
                                                    Expected Price
                                                </span>

                                                <strong>
                                                    {formatPrice(
                                                        offer.expected_price
                                                    )}
                                                </strong>

                                            </div>

                                            <div className="detail-item">

                                                <span>
                                                    Offer Date
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        offer.created_at
                                                    )}
                                                </strong>

                                            </div>

                                            {offer.buyer_mobile && (
                                                <div className="detail-item">

                                                    <span>
                                                        Buyer Contact
                                                    </span>

                                                    <strong>
                                                        {
                                                            offer.buyer_mobile
                                                        }
                                                    </strong>

                                                </div>
                                            )}

                                        </div>

                                        {/* BUYER MESSAGE */}

                                        {offer.message && (
                                            <div className="buyer-message">

                                                <div className="message-heading">
                                                    <span className="message-icon">
                                                        💬
                                                    </span>

                                                    Buyer Message
                                                </div>

                                                <p>
                                                    {
                                                        offer.message
                                                    }
                                                </p>

                                            </div>
                                        )}

                                        {/* ACCEPT / REJECT */}

                                        {status === "pending" && (
                                            <div className="offer-actions">

                                                <button
                                                    type="button"
                                                    className="accept-btn"
                                                    onClick={() =>
                                                        acceptOffer(
                                                            offer.id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        offer.id
                                                    }
                                                >
                                                    {actionLoading ===
                                                    offer.id
                                                        ? "Processing..."
                                                        : "✓ Accept Offer"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="reject-btn"
                                                    onClick={() =>
                                                        openRejectBox(
                                                            offer
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        offer.id
                                                    }
                                                >
                                                    ✕ Reject Offer
                                                </button>

                                            </div>
                                        )}

                                        {/* REJECTION MESSAGE */}

                                        {status === "rejected" &&
                                            offer.rejection_message && (
                                                <div className="rejection-info">

                                                    <div className="rejection-title">
                                                        Rejection Message
                                                    </div>

                                                    <p>
                                                        {
                                                            offer.rejection_message
                                                        }
                                                    </p>

                                                </div>
                                            )}

                                    </article>
                                );
                            })}

                        </div>

                    </section>
                )}

            </main>

            {/* ==================================================
                REJECT MODAL
            ================================================== */}

            {showRejectBox &&
                selectedOffer && (
                    <div
                        className="modal-overlay"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeRejectBox();
                            }
                        }}
                    >

                        <div className="reject-modal">

                            {/* MODAL HEADER */}

                            <div className="modal-header">

                                <div>

                                    <div className="modal-kicker">
                                        BUYER OFFER
                                    </div>

                                    <h2>
                                        Reject Offer
                                    </h2>

                                    <p>
                                        Give the buyer a
                                        clear reason so
                                        they understand
                                        why the offer was
                                        not accepted.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="close-btn"
                                    onClick={
                                        closeRejectBox
                                    }
                                    disabled={
                                        actionLoading !==
                                        null
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            {/* SELECTED OFFER */}

                            <div className="selected-offer">

                                <div>
                                    <span>
                                        Crop
                                    </span>

                                    <strong>
                                        {
                                            selectedOffer.crop_name
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Buyer
                                    </span>

                                    <strong>
                                        {selectedOffer.buyer_name ||
                                            "Buyer"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Offered Price
                                    </span>

                                    <strong className="orange-price">
                                        {formatPrice(
                                            selectedOffer.offered_price
                                        )}
                                    </strong>
                                </div>

                            </div>

                            {/* MESSAGE */}

                            <label
                                htmlFor="rejectMessage"
                                className="message-label"
                            >
                                Message to Buyer
                                <span>
                                    *
                                </span>
                            </label>

                            <textarea
                                id="rejectMessage"
                                value={rejectMessage}
                                onChange={(event) =>
                                    setRejectMessage(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Example: Thank you for your offer. I cannot accept this price because the current market price is higher."
                                rows={6}
                                maxLength={500}
                            />

                            <div className="character-count">
                                {rejectMessage.length}
                                {" / "}
                                500
                            </div>

                            {/* QUICK MESSAGES */}

                            <div className="suggestions">

                                <div className="suggestions-title">
                                    Quick Messages
                                </div>

                                <div className="suggestion-buttons">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRejectMessage(
                                                "Thank you for your offer. The offered price is lower than my expected price."
                                            )
                                        }
                                    >
                                        Price is low
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRejectMessage(
                                                "Thank you for your offer. I have decided to sell this crop to another buyer."
                                            )
                                        }
                                    >
                                        Sold to another buyer
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRejectMessage(
                                                "Thank you for your offer. I am currently not accepting offers for this crop."
                                            )
                                        }
                                    >
                                        Not accepting
                                    </button>

                                </div>

                            </div>

                            {/* MODAL BUTTONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-modal-btn"
                                    onClick={
                                        closeRejectBox
                                    }
                                    disabled={
                                        actionLoading !==
                                        null
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="confirm-reject-btn"
                                    onClick={
                                        rejectOffer
                                    }
                                    disabled={
                                        !rejectMessage.trim() ||
                                        actionLoading !==
                                            null
                                    }
                                >
                                    {actionLoading !==
                                    null
                                        ? "Rejecting..."
                                        : "Reject Offer"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            {/* ==================================================
                PAGE CSS
            ================================================== */}

            <style>{`

                /* ==================================================
                   THEME
                ================================================== */

                .farmer-offers-page {
                    min-height: 100vh;
                    background: #f4f5f7;
                    color: #101828;
                }

                .farmer-offers-container {
                    width: min(1180px, 92%);
                    margin: 0 auto;
                    padding: 42px 0 70px;
                }

                /* ==================================================
                   HEADER
                ================================================== */

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 25px;
                    margin-bottom: 32px;
                }

                .portal-label {
                    color: #ff6900;
                    font-size: 14px;
                    font-weight: 900;
                    letter-spacing: 1.5px;
                    margin-bottom: 8px;
                }

                .page-header h1 {
                    margin: 0;
                    color: #101828;
                    font-size: 38px;
                    line-height: 1.1;
                    font-weight: 850;
                }

                .page-header p {
                    margin: 10px 0 0;
                    color: #667085;
                    font-size: 16px;
                    line-height: 1.6;
                }

                .refresh-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid #ff6900;
                    background: #ff6900;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 800;
                    white-space: nowrap;
                    transition: 0.2s ease;
                }

                .refresh-btn:hover {
                    background: #e85f00;
                    border-color: #e85f00;
                }

                .refresh-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .refresh-icon {
                    font-size: 20px;
                    line-height: 1;
                }

                /* ==================================================
                   ERROR
                ================================================== */

                .error-box {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    background: #fff5f5;
                    border: 1px solid #f2c5c5;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 25px;
                }

                .error-icon {
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    background: #d92d20;
                    color: white;
                    border-radius: 50%;
                    font-weight: 900;
                }

                .error-content h3 {
                    margin: 0;
                    color: #b42318;
                    font-size: 17px;
                }

                .error-content p {
                    margin: 6px 0 12px;
                    color: #7a271a;
                }

                .error-content button {
                    border: 0;
                    background: #ff6900;
                    color: white;
                    padding: 9px 16px;
                    border-radius: 7px;
                    cursor: pointer;
                    font-weight: 800;
                }

                /* ==================================================
                   LOADING
                ================================================== */

                .loading-box {
                    background: white;
                    border: 1px solid #e4e7ec;
                    border-radius: 14px;
                    text-align: center;
                    padding: 70px 20px;
                    box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04);
                }

                .spinner {
                    width: 42px;
                    height: 42px;
                    border: 4px solid #ffe2cc;
                    border-top-color: #ff6900;
                    border-radius: 50%;
                    animation: farmerOfferSpin 0.8s linear infinite;
                    margin: 0 auto 18px;
                }

                @keyframes farmerOfferSpin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .loading-box h3 {
                    margin: 0 0 7px;
                    font-size: 20px;
                    color: #101828;
                }

                .loading-box p {
                    margin: 0;
                    color: #667085;
                }

                /* ==================================================
                   EMPTY
                ================================================== */

                .empty-box {
                    background: white;
                    border: 1px solid #e4e7ec;
                    border-radius: 16px;
                    text-align: center;
                    padding: 75px 25px;
                    box-shadow: 0 2px 10px rgba(16, 24, 40, 0.04);
                }

                .empty-icon {
                    width: 72px;
                    height: 72px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    background: #fff0e6;
                    color: #ff6900;
                    border-radius: 50%;
                    font-size: 32px;
                    font-weight: 900;
                }

                .empty-box h2 {
                    margin: 0;
                    color: #101828;
                    font-size: 26px;
                }

                .empty-box p {
                    margin: 10px auto 25px;
                    color: #667085;
                    max-width: 500px;
                    line-height: 1.6;
                }

                .empty-box button {
                    border: 0;
                    background: #ff6900;
                    color: white;
                    padding: 12px 22px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 800;
                    font-size: 15px;
                }

                .empty-box button:hover {
                    background: #e85f00;
                }

                /* ==================================================
                   SUMMARY
                ================================================== */

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                    margin-bottom: 38px;
                }

                .summary-card {
                    background: white;
                    border: 1px solid #e4e7ec;
                    border-radius: 12px;
                    padding: 21px;
                    box-shadow: 0 2px 8px rgba(16, 24, 40, 0.035);
                }

                .summary-label {
                    color: #667085;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .summary-number {
                    color: #101828;
                    font-size: 30px;
                    font-weight: 850;
                }

                /* ==================================================
                   SECTION TITLE
                ================================================== */

                .section-title {
                    margin-bottom: 20px;
                }

                .section-kicker {
                    color: #ff6900;
                    font-size: 12px;
                    font-weight: 900;
                    letter-spacing: 1.4px;
                    margin-bottom: 5px;
                }

                .section-title h2 {
                    margin: 0;
                    color: #101828;
                    font-size: 28px;
                }

                .section-title p {
                    margin: 7px 0 0;
                    color: #667085;
                }

                /* ==================================================
                   OFFER LIST
                ================================================== */

                .offers-list {
                    display: grid;
                    gap: 18px;
                }

                .offer-card {
                    background: white;
                    border: 1px solid #e4e7ec;
                    border-radius: 14px;
                    padding: 24px;
                    box-shadow: 0 2px 10px rgba(16, 24, 40, 0.045);
                    transition: 0.2s ease;
                }

                .offer-card:hover {
                    border-color: #ffbd91;
                    box-shadow: 0 5px 18px rgba(16, 24, 40, 0.07);
                }

                .offer-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    padding-bottom: 18px;
                    border-bottom: 1px solid #eaecf0;
                }

                .crop-label {
                    color: #ff6900;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 1.2px;
                    margin-bottom: 5px;
                }

                .offer-card-header h2 {
                    margin: 0;
                    color: #101828;
                    font-size: 23px;
                    font-weight: 850;
                }

                .variety {
                    margin: 7px 0 0;
                    color: #667085;
                    font-size: 14px;
                }

                .offer-status {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 7px 13px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 900;
                    text-transform: capitalize;
                    white-space: nowrap;
                }

                .offer-status.pending {
                    background: #fff4cc;
                    color: #8a6100;
                }

                .offer-status.accepted {
                    background: #e7f6ec;
                    color: #18794e;
                }

                .offer-status.rejected {
                    background: #fee4e2;
                    color: #b42318;
                }

                .offer-status.cancelled {
                    background: #f2f4f7;
                    color: #667085;
                }

                /* ==================================================
                   OFFER DETAILS
                ================================================== */

                .offer-details {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 18px;
                    padding: 22px 0;
                }

                .detail-item span {
                    display: block;
                    color: #667085;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 7px;
                }

                .detail-item strong {
                    color: #101828;
                    font-size: 15px;
                    font-weight: 800;
                }

                .orange-price {
                    color: #ff6900 !important;
                    font-size: 18px !important;
                }

                /* ==================================================
                   BUYER MESSAGE
                ================================================== */

                .buyer-message {
                    background: #fff8f3;
                    border: 1px solid #ffd9c2;
                    border-left: 4px solid #ff6900;
                    border-radius: 8px;
                    padding: 15px 17px;
                    margin-bottom: 20px;
                }

                .message-heading {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #101828;
                    font-size: 14px;
                    font-weight: 850;
                    margin-bottom: 8px;
                }

                .message-icon {
                    font-size: 17px;
                }

                .buyer-message p {
                    margin: 0;
                    color: #475467;
                    line-height: 1.6;
                    font-size: 14px;
                }

                /* ==================================================
                   ACTIONS
                ================================================== */

                .offer-actions {
                    display: flex;
                    gap: 10px;
                    padding-top: 19px;
                    border-top: 1px solid #eaecf0;
                }

                .accept-btn,
                .reject-btn {
                    padding: 11px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 850;
                    transition: 0.2s ease;
                }

                .accept-btn {
                    border: 1px solid #ff6900;
                    background: #ff6900;
                    color: white;
                }

                .accept-btn:hover {
                    background: #e85f00;
                    border-color: #e85f00;
                }

                .reject-btn {
                    border: 1px solid #f0b5b1;
                    background: white;
                    color: #b42318;
                }

                .reject-btn:hover {
                    background: #fff5f5;
                }

                .accept-btn:disabled,
                .reject-btn:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                /* ==================================================
                   REJECTION INFO
                ================================================== */

                .rejection-info {
                    background: #fff5f5;
                    border: 1px solid #fecdca;
                    border-radius: 9px;
                    padding: 15px;
                }

                .rejection-title {
                    color: #b42318;
                    font-size: 14px;
                    font-weight: 850;
                    margin-bottom: 7px;
                }

                .rejection-info p {
                    margin: 0;
                    color: #667085;
                    line-height: 1.6;
                }

                /* ==================================================
                   MODAL
                ================================================== */

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: rgba(16, 24, 40, 0.62);
                }

                .reject-modal {
                    width: min(620px, 100%);
                    max-height: 92vh;
                    overflow-y: auto;
                    background: white;
                    border-radius: 15px;
                    padding: 27px;
                    box-shadow: 0 24px 70px rgba(16, 24, 40, 0.25);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                }

                .modal-kicker {
                    color: #ff6900;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 1.3px;
                    margin-bottom: 6px;
                }

                .modal-header h2 {
                    margin: 0;
                    color: #101828;
                    font-size: 25px;
                }

                .modal-header p {
                    margin: 8px 0 0;
                    color: #667085;
                    line-height: 1.55;
                    font-size: 14px;
                }

                .close-btn {
                    width: 36px;
                    height: 36px;
                    flex-shrink: 0;
                    border: 1px solid #eaecf0;
                    border-radius: 50%;
                    background: white;
                    color: #475467;
                    font-size: 24px;
                    line-height: 1;
                    cursor: pointer;
                }

                .close-btn:hover {
                    background: #f9fafb;
                }

                .selected-offer {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    background: #fff8f3;
                    border: 1px solid #ffd9c2;
                    border-radius: 10px;
                    padding: 16px;
                    margin: 22px 0;
                }

                .selected-offer span {
                    display: block;
                    color: #667085;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .selected-offer strong {
                    color: #101828;
                    font-size: 14px;
                }

                .message-label {
                    display: block;
                    color: #101828;
                    font-size: 14px;
                    font-weight: 850;
                    margin-bottom: 8px;
                }

                .message-label span {
                    color: #d92d20;
                    margin-left: 3px;
                }

                .reject-modal textarea {
                    width: 100%;
                    min-height: 135px;
                    resize: vertical;
                    border: 1px solid #d0d5dd;
                    border-radius: 8px;
                    padding: 13px;
                    outline: none;
                    font-family: inherit;
                    font-size: 14px;
                    color: #101828;
                    line-height: 1.5;
                }

                .reject-modal textarea::placeholder {
                    color: #98a2b3;
                }

                .reject-modal textarea:focus {
                    border-color: #ff6900;
                    box-shadow: 0 0 0 3px rgba(255, 105, 0, 0.12);
                }

                .character-count {
                    text-align: right;
                    color: #98a2b3;
                    font-size: 12px;
                    margin-top: 5px;
                }

                /* ==================================================
                   QUICK MESSAGES
                ================================================== */

                .suggestions {
                    margin-top: 18px;
                }

                .suggestions-title {
                    color: #475467;
                    font-size: 13px;
                    font-weight: 800;
                    margin-bottom: 9px;
                }

                .suggestion-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .suggestion-buttons button {
                    border: 1px solid #d0d5dd;
                    background: white;
                    color: #344054;
                    padding: 8px 11px;
                    border-radius: 7px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 650;
                }

                .suggestion-buttons button:hover {
                    border-color: #ff6900;
                    background: #fff8f3;
                    color: #d95600;
                }

                /* ==================================================
                   MODAL ACTIONS
                ================================================== */

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 25px;
                    padding-top: 18px;
                    border-top: 1px solid #eaecf0;
                }

                .cancel-modal-btn,
                .confirm-reject-btn {
                    padding: 11px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 850;
                }

                .cancel-modal-btn {
                    border: 1px solid #d0d5dd;
                    background: white;
                    color: #344054;
                }

                .cancel-modal-btn:hover {
                    background: #f9fafb;
                }

                .confirm-reject-btn {
                    border: 1px solid #d92d20;
                    background: #d92d20;
                    color: white;
                }

                .confirm-reject-btn:hover {
                    background: #b42318;
                    border-color: #b42318;
                }

                .confirm-reject-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* ==================================================
                   RESPONSIVE
                ================================================== */

                @media (max-width: 1000px) {

                    .offer-details {
                        grid-template-columns: repeat(3, 1fr);
                    }

                    .summary-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                }

                @media (max-width: 700px) {

                    .farmer-offers-container {
                        width: 92%;
                        padding: 28px 0 50px;
                    }

                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .page-header h1 {
                        font-size: 31px;
                    }

                    .refresh-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .offer-details {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .selected-offer {
                        grid-template-columns: 1fr;
                    }

                    .offer-actions {
                        flex-direction: column;
                    }

                    .accept-btn,
                    .reject-btn {
                        width: 100%;
                    }

                }

                @media (max-width: 480px) {

                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .offer-details {
                        grid-template-columns: 1fr;
                    }

                    .offer-card {
                        padding: 18px;
                    }

                    .offer-card-header {
                        flex-direction: column;
                    }

                    .offer-status {
                        align-self: flex-start;
                    }

                    .reject-modal {
                        padding: 20px;
                    }

                    .modal-actions {
                        flex-direction: column;
                    }

                    .cancel-modal-btn,
                    .confirm-reject-btn {
                        width: 100%;
                    }

                }

            `}</style>

        </div>
    );
};

export default FarmerOffers;