import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import BuyerNavbar from "../../components/BuyerNavbar";

const BuyerDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD BUYER DEALS
  // GET /api/deals/buyer
  // ============================================================

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("=================================");
      console.log("GET BUYER DEALS");
      console.log("=================================");

      const response = await api.get("/deals/buyer");

      console.log("BUYER DEALS RESPONSE:", response);

      if (response?.success === false) {
        throw new Error(
          response.message || "Failed to fetch buyer deals"
        );
      }

      const dealData = Array.isArray(response?.deals)
        ? response.deals
        : Array.isArray(response?.data?.deals)
        ? response.data.deals
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setDeals(dealData);
    } catch (err) {
      console.error("BUYER DEALS ERROR:", err);

      let message = "Failed to fetch buyer deals";

      if (err?.message) {
        message = err.message;
      }

      if (err?.response?.message) {
        message = err.response.message;
      }

      if (err?.response?.data?.message) {
        message = err.response.data.message;
      }

      setError(message);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadDeals();
  }, []);

  // ============================================================
  // HELPERS
  // ============================================================

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(number);
  };

  const formatNumber = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
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

  const getStatusText = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "payment_pending":
        return "Payment Pending";

      case "accepted":
        return "Accepted";

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

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .buyer-deals-page {
          min-height: 100vh;
          background: #f7f8fa;
          color: #1f2937;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 38px 24px 60px;
        }

        .portal-label {
          color: #6b7280;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .page-title {
          margin: 0;
          color: #111827;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 750;
        }

        .page-description {
          margin: 10px 0 28px;
          color: #6b7280;
          font-size: 15px;
        }

        /* ======================================================
           SUMMARY
        ====================================================== */

        .summary-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 22px;
          width: 220px;
          margin-bottom: 30px;
        }

        .summary-number {
          font-size: 30px;
          font-weight: 750;
          color: #111827;
        }

        .summary-label {
          margin-top: 4px;
          font-size: 13px;
          color: #6b7280;
        }

        /* ======================================================
           STATES
        ====================================================== */

        .state-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 42px 25px;
          text-align: center;
        }

        .state-title {
          margin: 0 0 8px;
          font-size: 20px;
          color: #111827;
        }

        .state-message {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .retry-button,
        .browse-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 8px;
          border: 1px solid #111827;
          background: #111827;
          color: #ffffff;
          text-decoration: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }

        .retry-button:hover,
        .browse-button:hover {
          background: #374151;
        }

        /* ======================================================
           DEALS
        ====================================================== */

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 16px;
        }

        .deals-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .deal-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 22px;
          transition: box-shadow 0.2s ease;
        }

        .deal-card:hover {
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.06);
        }

        .deal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
        }

        .crop-name {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          color: #111827;
        }

        .crop-variety {
          margin-top: 4px;
          color: #6b7280;
          font-size: 13px;
        }

        .status {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border-radius: 999px;
          background: #f3f4f6;
          color: #374151;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status.accepted {
          background: #f3f4f6;
          color: #111827;
        }

        .status.payment-pending {
          background: #f3f4f6;
          color: #374151;
        }

        .status.paid {
          background: #e5e7eb;
          color: #111827;
        }

        .status.completed {
          background: #111827;
          color: #ffffff;
        }

        .status.cancelled {
          background: #e5e7eb;
          color: #6b7280;
        }

        .deal-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .detail-item {
          min-width: 0;
        }

        .detail-label {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .detail-value {
          color: #111827;
          font-size: 14px;
          font-weight: 600;
          word-break: break-word;
        }

        .price-value {
          font-size: 17px;
          font-weight: 750;
        }

        .deal-message {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .message-text {
          margin-top: 5px;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.5;
        }

        /* ======================================================
           MOBILE
        ====================================================== */

        @media (max-width: 800px) {
          .content-wrapper {
            padding: 28px 16px 50px;
          }

          .deals-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .page-title {
            font-size: 25px;
          }

          .deal-header {
            flex-direction: column;
          }

          .deal-details {
            grid-template-columns: 1fr;
          }

          .summary-card {
            width: 100%;
          }
        }
      `}</style>

      <div className="buyer-deals-page">

        {/* ======================================================
            COMMON BUYER NAVBAR
        ====================================================== */}

        <BuyerNavbar />

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <main className="content-wrapper">

          <div className="portal-label">
            Buyer Portal
          </div>

          <h1 className="page-title">
            My Deals
          </h1>

          <p className="page-description">
            Manage your accepted crop offers and purchase deals
            with farmers.
          </p>

          {/* ====================================================
              SUMMARY
          ==================================================== */}

          <div className="summary-card">

            <div className="summary-number">
              {loading ? "..." : deals.length}
            </div>

            <div className="summary-label">
              Total Deals
            </div>

          </div>

          {/* ====================================================
              LOADING
          ==================================================== */}

          {loading && (
            <div className="state-card">

              <h2 className="state-title">
                Loading Deals
              </h2>

              <p className="state-message">
                Please wait while we load your purchase deals.
              </p>

            </div>
          )}

          {/* ====================================================
              ERROR
          ==================================================== */}

          {!loading && error && (
            <div className="state-card">

              <h2 className="state-title">
                Unable to Load Deals
              </h2>

              <p className="state-message">
                {error}
              </p>

              <button
                type="button"
                className="retry-button"
                onClick={loadDeals}
              >
                Try Again
              </button>

            </div>
          )}

          {/* ====================================================
              NO DEALS
          ==================================================== */}

          {!loading && !error && deals.length === 0 && (
            <div className="state-card">

              <h2 className="state-title">
                No Deals Yet
              </h2>

              <p className="state-message">
                When a farmer accepts one of your offers,
                the deal will appear here.
              </p>

              <Link
                to="/buyer/crops"
                className="browse-button"
              >
                Browse Crops
              </Link>

            </div>
          )}

          {/* ====================================================
              DEAL LIST
          ==================================================== */}

          {!loading && !error && deals.length > 0 && (
            <section>

              <h2 className="section-title">
                My Purchase Deals
              </h2>

              <div className="deals-grid">

                {deals.map((deal) => (

                  <article
                    className="deal-card"
                    key={deal.id}
                  >

                    <div className="deal-header">

                      <div>

                        <h3 className="crop-name">
                          {deal.crop_name || "Crop"}
                        </h3>

                        {deal.crop_variety && (
                          <div className="crop-variety">
                            Variety: {deal.crop_variety}
                          </div>
                        )}

                      </div>

                      <span
                        className={getStatusClass(
                          deal.status
                        )}
                      >
                        {getStatusText(
                          deal.status
                        )}
                      </span>

                    </div>

                    <div className="deal-details">

                      <div className="detail-item">

                        <div className="detail-label">
                          Farmer
                        </div>

                        <div className="detail-value">
                          {deal.farmer_name || "Farmer"}
                        </div>

                      </div>

                      <div className="detail-item">

                        <div className="detail-label">
                          Quantity
                        </div>

                        <div className="detail-value">
                          {formatNumber(deal.quantity)}{" "}
                          {deal.quantity_unit || "kg"}
                        </div>

                      </div>

                      <div className="detail-item">

                        <div className="detail-label">
                          Agreed Price
                        </div>

                        <div className="detail-value price-value">
                          {formatCurrency(deal.agreed_price)}
                        </div>

                      </div>

                      <div className="detail-item">

                        <div className="detail-label">
                          Deal Date
                        </div>

                        <div className="detail-value">
                          {formatDate(deal.created_at)}
                        </div>

                      </div>

                    </div>

                    {deal.message && (
                      <div className="deal-message">

                        <div className="detail-label">
                          Message
                        </div>

                        <div className="message-text">
                          {deal.message}
                        </div>

                      </div>
                    )}

                  </article>

                ))}

              </div>

            </section>
          )}

        </main>

      </div>
    </>
  );
};

export default BuyerDeals;