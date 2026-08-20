import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BuyerNavbar from "../../components/BuyerNavbar";

const BuyerDealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000/api";

  // ============================================================
  // FETCH DEAL
  // ============================================================

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication required. Please login again.");
          setLoading(false);
          return;
        }

        if (!id) {
          setError("Invalid deal ID.");
          setLoading(false);
          return;
        }

        console.log("================================");
        console.log("GET DEAL");
        console.log("Deal ID:", id);
        console.log("================================");

        const response = await fetch(
          `${API_BASE_URL}/deals/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Deal API Status:", response.status);

        const contentType =
          response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(
            text || `API returned status ${response.status}`
          );
        }

        console.log("Deal API Response:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              `Failed to load deal (${response.status})`
          );
        }

        /*
          Supports:

          {
            deal: {...}
          }

          OR

          {
            data: {...}
          }

          OR

          {...}
        */

        const dealData =
          data.deal ||
          data.data ||
          data;

        if (!dealData || !dealData.id) {
          throw new Error("Invalid deal data received from server.");
        }

        setDeal(dealData);
      } catch (err) {
        console.error("GET DEAL ERROR:", err);

        setError(
          err.message || "Failed to load deal"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(number);
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return {
          background: "#dcfce7",
          color: "#166534",
        };

      case "payment_pending":
        return {
          background: "#fef3c7",
          color: "#92400e",
        };

      case "paid":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };

      case "completed":
        return {
          background: "#e0e7ff",
          color: "#4338ca",
        };

      case "cancelled":
        return {
          background: "#fee2e2",
          color: "#991b1b",
        };

      default:
        return {
          background: "#f1f5f9",
          color: "#475569",
        };
    }
  };

  // ============================================================
  // STATUS TEXT
  // ============================================================

  const getStatusText = (status) => {
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

  // ============================================================
  // PAYMENT BUTTON
  // ============================================================

  const handlePayment = () => {
    if (!deal?.id) {
      return;
    }

    navigate(`/buyer/deals/${deal.id}/payment`);
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <>
        <BuyerNavbar />

        <main
          style={{
            minHeight: "70vh",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #ff5a00",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Loading deal...
          </p>

          <style>
            {`
              @keyframes spin {
                from {
                  transform: rotate(0deg);
                }

                to {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </main>
      </>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !deal) {
    return (
      <>
        <BuyerNavbar />

        <main
          style={{
            minHeight: "70vh",
            background: "#f8fafc",
            padding: "35px 7%",
          }}
        >
          <button
            onClick={() => navigate("/buyer/deals")}
            style={{
              border: "none",
              background: "transparent",
              color: "#172b4d",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              marginBottom: "30px",
            }}
          >
            ← Back to Deals
          </button>

          <div
            style={{
              maxWidth: "650px",
              margin: "50px auto",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "50px 30px",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 8px 30px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div
              style={{
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                background: "#fff7ed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "30px",
              }}
            >
              ⚠️
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#172b4d",
              }}
            >
              Deal Not Found
            </h2>

            <p
              style={{
                margin: "0 0 25px",
                color: "#64748b",
              }}
            >
              {error || "Unable to load deal."}
            </p>

            <button
              onClick={() => navigate("/buyer/deals")}
              style={{
                border: "none",
                background: "#ff5a00",
                color: "#ffffff",
                padding: "13px 22px",
                borderRadius: "9px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              View My Deals
            </button>
          </div>
        </main>
      </>
    );
  }

  const statusStyle = getStatusStyle(deal.status);

  const cropName =
    deal.crop_name ||
    deal.cropName ||
    "Crop";

  const cropVariety =
    deal.crop_variety ||
    deal.cropVariety ||
    "N/A";

  const farmerName =
    deal.farmer_name ||
    deal.farmerName ||
    "Farmer";

  const farmerMobile =
    deal.farmer_mobile ||
    deal.farmerMobile ||
    deal.mobile ||
    "";

  const quantity = Number(
    deal.quantity || 0
  );

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <>
      <BuyerNavbar />

      <main
        style={{
          minHeight: "calc(100vh - 170px)",
          background: "#f8fafc",
          padding: "35px 7% 60px",
        }}
      >
        {/* ====================================================
            BACK BUTTON
        ==================================================== */}

        <button
          onClick={() => navigate("/buyer/deals")}
          style={{
            border: "none",
            background: "transparent",
            color: "#172b4d",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          ← Back to Deals
        </button>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "30px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#ff5a00",
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "8px",
              }}
            >
              Buyer Portal
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                color: "#172b4d",
                fontWeight: "800",
              }}
            >
              Deal Details
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              View your crop purchase agreement and deal
              status.
            </p>
          </div>

          <div
            style={{
              ...statusStyle,
              padding: "9px 17px",
              borderRadius: "30px",
              fontSize: "14px",
              fontWeight: "800",
              whiteSpace: "nowrap",
            }}
          >
            {getStatusText(deal.status)}
          </div>
        </div>

        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 2fr) minmax(280px, 1fr)",
            gap: "24px",
          }}
        >
          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <div>
            {/* ==================================================
                CROP INFORMATION
            ================================================== */}

            <section
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                padding: "26px",
                marginBottom: "24px",
                boxShadow:
                  "0 5px 20px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "22px",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "21px",
                    color: "#172b4d",
                  }}
                >
                  Crop Information
                </h2>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Ref ID: #{deal.id}
                </span>
              </div>

              {/* Crop title */}

              <div
                style={{
                  background: "#fffaf7",
                  border: "1px solid #ffeadf",
                  borderRadius: "13px",
                  padding: "22px",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 7px",
                    fontSize: "25px",
                    color: "#172b4d",
                  }}
                >
                  {cropName}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                  }}
                >
                  Variety:{" "}
                  <strong>
                    {cropVariety}
                  </strong>
                </p>
              </div>

              {/* Information boxes */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "18px",
                  marginTop: "22px",
                }}
              >
                <InfoBox
                  label="Quantity"
                  value={`${quantity.toLocaleString(
                    "en-IN"
                  )} kg`}
                />

                <InfoBox
                  label="Agreed Price"
                  value={formatCurrency(
                    deal.agreed_price
                  )}
                />

                <InfoBox
                  label="Deal Date"
                  value={formatDate(
                    deal.created_at
                  )}
                />

                <InfoBox
                  label="Deal ID"
                  value={`#${deal.id}`}
                />
              </div>
            </section>

            {/* ==================================================
                DEAL NOTE
            ================================================== */}

            <section
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                padding: "26px",
                boxShadow:
                  "0 5px 20px rgba(15, 23, 42, 0.04)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 15px",
                  fontSize: "21px",
                  color: "#172b4d",
                }}
              >
                Deal Note
              </h2>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                  padding: "17px",
                  color: "#475569",
                  lineHeight: "1.6",
                  minHeight: "55px",
                }}
              >
                {deal.message ||
                  "No message provided."}
              </div>
            </section>
          </div>

          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <div>
            {/* ==================================================
                SELLER INFORMATION
            ================================================== */}

            <section
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                padding: "26px",
                marginBottom: "24px",
                boxShadow:
                  "0 5px 20px rgba(15, 23, 42, 0.04)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "21px",
                  color: "#172b4d",
                }}
              >
                Seller Information
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "13px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "#fff5ef",
                    color: "#ff5a00",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "19px",
                    fontWeight: "800",
                    flexShrink: 0,
                  }}
                >
                  {farmerName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: "800",
                      color: "#172b4d",
                    }}
                  >
                    {farmerName}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      marginTop: "3px",
                    }}
                  >
                    Farmer / Seller
                  </div>
                </div>
              </div>

              {farmerMobile && (
                <div
                  style={{
                    padding: "13px 0",
                    borderTop:
                      "1px solid #eef2f7",
                  }}
                >
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Mobile
                  </span>

                  <div
                    style={{
                      marginTop: "4px",
                      fontWeight: "700",
                      color: "#172b4d",
                    }}
                  >
                    {farmerMobile}
                  </div>
                </div>
              )}
            </section>

            {/* ==================================================
                DEAL SUMMARY
            ================================================== */}

            <section
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                padding: "26px",
                boxShadow:
                  "0 5px 20px rgba(15, 23, 42, 0.04)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "21px",
                  color: "#172b4d",
                }}
              >
                Deal Summary
              </h2>

              <SummaryRow
                label="Status"
                value={getStatusText(
                  deal.status
                )}
              />

              <SummaryRow
                label="Quantity"
                value={`${quantity.toLocaleString(
                  "en-IN"
                )} kg`}
              />

              <SummaryRow
                label="Agreed Price"
                value={formatCurrency(
                  deal.agreed_price
                )}
              />

              <SummaryRow
                label="Created"
                value={formatDate(
                  deal.created_at
                )}
              />

              {/* ==================================================
                  PAYMENT
              ================================================== */}

              {deal.status === "accepted" && (
                <button
                  onClick={handlePayment}
                  style={{
                    marginTop: "22px",
                    width: "100%",
                    padding: "14px",
                    border: "none",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "800",
                    cursor: "pointer",
                    boxShadow:
                      "0 5px 15px rgba(22, 163, 74, 0.2)",
                  }}
                >
                  💳 Make Payment
                </button>
              )}

              {deal.status === "payment_pending" && (
                <button
                  onClick={handlePayment}
                  style={{
                    marginTop: "22px",
                    width: "100%",
                    padding: "14px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#f59e0b",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  💳 Complete Payment
                </button>
              )}

              {deal.status === "paid" && (
                <div
                  style={{
                    marginTop: "22px",
                    padding: "14px",
                    borderRadius: "10px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  ✓ Payment Completed
                </div>
              )}

              {deal.status === "completed" && (
                <div
                  style={{
                    marginTop: "22px",
                    padding: "14px",
                    borderRadius: "10px",
                    background: "#eef2ff",
                    color: "#4338ca",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  ✓ Deal Completed
                </div>
              )}

              {deal.status === "cancelled" && (
                <div
                  style={{
                    marginTop: "22px",
                    padding: "14px",
                    borderRadius: "10px",
                    background: "#fef2f2",
                    color: "#991b1b",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  Deal Cancelled
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

// ============================================================
// INFO BOX
// ============================================================

const InfoBox = ({ label, value }) => {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "11px",
        padding: "16px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "17px",
          fontWeight: "800",
          color: "#172b4d",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
};

// ============================================================
// SUMMARY ROW
// ============================================================

const SummaryRow = ({ label, value }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "15px",
        padding: "13px 0",
        borderBottom:
          "1px solid #eef2f7",
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#172b4d",
          fontSize: "14px",
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
};

export default BuyerDealDetails;