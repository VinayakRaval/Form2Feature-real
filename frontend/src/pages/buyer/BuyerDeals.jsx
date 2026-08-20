import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerNavbar from "../../components/BuyerNavbar";

const BuyerDeals = () => {
  const navigate = useNavigate();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ============================================================
  // FETCH BUYER DEALS
  // ============================================================
  const fetchDeals = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken");

      const response = await fetch(
        "http://localhost:5000/api/deals/buyer",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const data = await response.json();

      console.log("BUYER DEALS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load buyer deals"
        );
      }

      let dealList = [];

      if (Array.isArray(data)) {
        dealList = data;
      } else if (Array.isArray(data.deals)) {
        dealList = data.deals;
      } else if (Array.isArray(data.data)) {
        dealList = data.data;
      } else if (Array.isArray(data.results)) {
        dealList = data.results;
      }

      setDeals(dealList);
    } catch (err) {
      console.error("FETCH BUYER DEALS ERROR:", err);

      setError(
        err.message || "Unable to load your purchase deals."
      );

      setDeals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================
  useEffect(() => {
    fetchDeals();
  }, []);

  // ============================================================
  // SEARCH + STATUS FILTER
  // ============================================================
  const filteredDeals = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return deals.filter((deal) => {
      const cropName = String(
        deal.crop_name ||
          deal.cropName ||
          deal.crop ||
          ""
      ).toLowerCase();

      const variety = String(
        deal.crop_variety ||
          deal.cropVariety ||
          deal.variety ||
          ""
      ).toLowerCase();

      const farmerName = String(
        deal.farmer_name ||
          deal.farmerName ||
          deal.farmer ||
          ""
      ).toLowerCase();

      const dealId = String(deal.id || "");

      const status = String(
        deal.status || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        cropName.includes(search) ||
        variety.includes(search) ||
        farmerName.includes(search) ||
        dealId.includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [deals, searchTerm, statusFilter]);

  // ============================================================
  // ACTIVE DEALS
  // ============================================================
  const activeDealsCount = useMemo(() => {
    return deals.filter((deal) => {
      const status = String(
        deal.status || ""
      ).toLowerCase();

      return (
        status === "accepted" ||
        status === "payment_pending" ||
        status === "paid"
      );
    }).length;
  }, [deals]);

  // ============================================================
  // FORMAT PRICE
  // ============================================================
  const formatPrice = (price) => {
    const number = Number(price || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================
  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // STATUS BADGE
  // ============================================================
  const getStatusBadge = (status) => {
    const value = String(
      status || "accepted"
    ).toLowerCase();

    let background = "#fff7ed";
    let color = "#ea580c";
    let border = "#fed7aa";

    let label =
      status
        ? String(status)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
              char.toUpperCase()
            )
        : "Accepted";

    if (
      value === "completed" ||
      value === "paid"
    ) {
      background = "#f0fdf4";
      color = "#15803d";
      border = "#bbf7d0";
    }

    if (value === "cancelled") {
      background = "#fef2f2";
      color = "#dc2626";
      border = "#fecaca";
    }

    if (
      value === "payment_pending" ||
      value === "pending"
    ) {
      background = "#fff7ed";
      color = "#c2410c";
      border = "#fed7aa";
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 10px",
          borderRadius: "20px",
          backgroundColor: background,
          color: color,
          border: `1px solid ${border}`,
          fontSize: "11px",
          fontWeight: "700",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />

        {label}
      </span>
    );
  };

  // ============================================================
  // STYLES
  // ============================================================
  const styles = {
    page: {
      minHeight: "calc(100vh - 150px)",
      backgroundColor: "#f8fafc",
      padding: "34px 20px 80px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    },

    container: {
      maxWidth: "1140px",
      margin: "0 auto",
    },

    header: {
      marginBottom: "20px",
    },

    portal: {
      color: "#ea580c",
      fontSize: "13px",
      fontWeight: "800",
      letterSpacing: "0.7px",
      marginBottom: "4px",
    },

    title: {
      color: "#0f2747",
      fontSize: "38px",
      fontWeight: "800",
      margin: "0 0 8px",
      lineHeight: "1.15",
    },

    subtitle: {
      color: "#526b87",
      fontSize: "16px",
      margin: 0,
    },

    filterCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "14px",
    },

    filterGrid: {
      display: "grid",
      gridTemplateColumns:
        "minmax(250px, 1fr) 180px 150px",
      gap: "12px",
      alignItems: "end",
    },

    field: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },

    label: {
      color: "#1e293b",
      fontSize: "12px",
      fontWeight: "700",
    },

    input: {
      width: "100%",
      height: "42px",
      boxSizing: "border-box",
      border: "1px solid #cbd5e1",
      borderRadius: "7px",
      padding: "0 12px",
      fontSize: "13px",
      color: "#1e293b",
      outline: "none",
      backgroundColor: "#ffffff",
    },

    select: {
      width: "100%",
      height: "42px",
      boxSizing: "border-box",
      border: "1px solid #cbd5e1",
      borderRadius: "7px",
      padding: "0 10px",
      fontSize: "13px",
      color: "#1e293b",
      backgroundColor: "#ffffff",
      outline: "none",
      cursor: "pointer",
    },

    refreshButton: {
      height: "42px",
      border: "none",
      borderRadius: "7px",
      backgroundColor: "#f4510b",
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "700",
      cursor: refreshing
        ? "not-allowed"
        : "pointer",
      opacity: refreshing ? 0.7 : 1,
      padding: "0 14px",
    },

    summaryCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "18px",
    },

    summaryTitle: {
      color: "#0f172a",
      fontSize: "15px",
      fontWeight: "800",
      margin: "0 0 3px",
    },

    summaryText: {
      color: "#64748b",
      fontSize: "12px",
      margin: 0,
    },

    grid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
      gap: "16px",
    },

    dealCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "10px",
      padding: "14px",
      boxSizing: "border-box",
    },

    cardTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "10px",
      paddingBottom: "12px",
      borderBottom: "1px solid #e5e7eb",
    },

    cropName: {
      color: "#0f172a",
      fontSize: "15px",
      fontWeight: "800",
      margin: 0,
    },

    variety: {
      color: "#64748b",
      fontSize: "11px",
      margin: "3px 0 0",
    },

    farmerBox: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "7px",
      padding: "8px 10px",
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      gap: "9px",
    },

    farmerAvatar: {
      width: "28px",
      height: "28px",
      minWidth: "28px",
      borderRadius: "50%",
      backgroundColor: "#fff1e8",
      color: "#f4510b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: "800",
    },

    sellerLabel: {
      color: "#64748b",
      fontSize: "9px",
      fontWeight: "700",
      textTransform: "uppercase",
      marginBottom: "2px",
    },

    sellerName: {
      color: "#0f2747",
      fontSize: "11px",
      fontWeight: "700",
    },

    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px 10px",
      marginTop: "13px",
    },

    detailLabel: {
      color: "#64748b",
      fontSize: "9px",
      fontWeight: "700",
      textTransform: "uppercase",
      marginBottom: "3px",
      letterSpacing: "0.4px",
    },

    detailValue: {
      color: "#0f2747",
      fontSize: "12px",
      fontWeight: "700",
    },

    price: {
      color: "#f4510b",
      fontSize: "14px",
      fontWeight: "800",
    },

    note: {
      marginTop: "12px",
      padding: "7px 9px",
      backgroundColor: "#fff7ed",
      borderLeft: "2px solid #f4510b",
      borderRadius: "0 5px 5px 0",
      color: "#9a3412",
      fontSize: "10px",
      lineHeight: "1.4",
    },

    viewButton: {
      width: "100%",
      marginTop: "12px",
      height: "36px",
      border: "none",
      borderRadius: "7px",
      backgroundColor: "#f4510b",
      color: "#ffffff",
      fontSize: "12px",
      fontWeight: "700",
      cursor: "pointer",
    },

    error: {
      backgroundColor: "#fef2f2",
      color: "#991b1b",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      padding: "12px 15px",
      marginBottom: "18px",
      fontSize: "13px",
    },

    loading: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "10px",
      textAlign: "center",
      padding: "45px 20px",
      color: "#64748b",
      fontSize: "13px",
    },

    empty: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "10px",
      textAlign: "center",
      padding: "45px 20px",
    },
  };

  return (
    <>
      {/* =====================================================
          BUYER NAVBAR
      ===================================================== */}
      <BuyerNavbar />

      {/* =====================================================
          PAGE
      ===================================================== */}
      <main style={styles.page}>
        <div style={styles.container}>

          {/* =================================================
              HEADER
          ================================================= */}
          <section style={styles.header}>
            <div style={styles.portal}>
              BUYER PORTAL
            </div>

            <h1 style={styles.title}>
              My Deals
            </h1>

            <p style={styles.subtitle}>
              Manage and track your active crop
              purchase agreements.
            </p>
          </section>

          {/* =================================================
              SEARCH / FILTER
          ================================================= */}
          <section style={styles.filterCard}>
            <div style={styles.filterGrid}>

              {/* SEARCH */}
              <div style={styles.field}>
                <label style={styles.label}>
                  Search Deals
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search crop, variety, or farmer..."
                  style={styles.input}
                />
              </div>

              {/* STATUS */}
              <div style={styles.field}>
                <label style={styles.label}>
                  Deal Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="ALL">
                    All Deals
                  </option>

                  <option value="accepted">
                    Accepted
                  </option>

                  <option value="payment_pending">
                    Payment Pending
                  </option>

                  <option value="paid">
                    Paid
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* REFRESH */}
              <button
                type="button"
                onClick={() =>
                  fetchDeals(true)
                }
                disabled={refreshing}
                style={styles.refreshButton}
              >
                ↻{" "}
                {refreshing
                  ? "Refreshing..."
                  : "Refresh Deals"}
              </button>
            </div>
          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}
          <section style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>
              Agreed Purchases
            </h2>

            <p style={styles.summaryText}>
              Showing{" "}
              <strong>
                {filteredDeals.length}
              </strong>{" "}
              of{" "}
              <strong>
                {deals.length}
              </strong>{" "}
              total agreements (
              <strong>
                {activeDealsCount}
              </strong>{" "}
              active)
            </p>
          </section>

          {/* =================================================
              ERROR
          ================================================= */}
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}
          {loading && (
            <div style={styles.loading}>
              Loading your purchase deals...
            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}
          {!loading &&
            filteredDeals.length === 0 &&
            !error && (
              <div style={styles.empty}>
                <h3
                  style={{
                    margin: "0 0 6px",
                    color: "#0f172a",
                    fontSize: "16px",
                  }}
                >
                  No deals found
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {searchTerm ||
                  statusFilter !== "ALL"
                    ? "Try changing your search or status filter."
                    : "When a farmer accepts your offer, the purchase deal will appear here."}
                </p>
              </div>
            )}

          {/* =================================================
              DEAL CARDS
          ================================================= */}
          {!loading &&
            filteredDeals.length > 0 && (
              <section style={styles.grid}>
                {filteredDeals.map((deal) => {

                  const farmerName =
                    deal.farmer_name ||
                    deal.farmerName ||
                    deal.farmer ||
                    "Farmer";

                  const cropName =
                    deal.crop_name ||
                    deal.cropName ||
                    deal.crop ||
                    `Crop #${deal.crop_id || ""}`;

                  const variety =
                    deal.crop_variety ||
                    deal.cropVariety ||
                    deal.variety ||
                    "";

                  const quantity =
                    Number(
                      deal.quantity || 0
                    ).toLocaleString(
                      "en-IN"
                    );

                  const dealDate =
                    deal.created_at ||
                    deal.deal_date ||
                    deal.createdAt;

                  return (
                    <article
                      key={deal.id}
                      style={styles.dealCard}
                    >

                      {/* CARD HEADER */}
                      <div style={styles.cardTop}>
                        <div>
                          <h3
                            style={styles.cropName}
                          >
                            {cropName}
                          </h3>

                          {variety && (
                            <p
                              style={
                                styles.variety
                              }
                            >
                              Var: {variety}
                            </p>
                          )}
                        </div>

                        {getStatusBadge(
                          deal.status
                        )}
                      </div>

                      {/* SELLER */}
                      <div
                        style={
                          styles.farmerBox
                        }
                      >
                        <div
                          style={
                            styles.farmerAvatar
                          }
                        >
                          {farmerName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div
                            style={
                              styles.sellerLabel
                            }
                          >
                            Seller
                          </div>

                          <div
                            style={
                              styles.sellerName
                            }
                          >
                            {farmerName}
                          </div>
                        </div>
                      </div>

                      {/* DEAL DETAILS */}
                      <div
                        style={
                          styles.detailsGrid
                        }
                      >

                        {/* QUANTITY */}
                        <div>
                          <div
                            style={
                              styles.detailLabel
                            }
                          >
                            Quantity
                          </div>

                          <div
                            style={
                              styles.detailValue
                            }
                          >
                            {quantity} kg
                          </div>
                        </div>

                        {/* PRICE */}
                        <div>
                          <div
                            style={
                              styles.detailLabel
                            }
                          >
                            Agreed Price
                          </div>

                          <div
                            style={
                              styles.price
                            }
                          >
                            {formatPrice(
                              deal.agreed_price
                            )}
                          </div>
                        </div>

                        {/* DATE */}
                        <div>
                          <div
                            style={
                              styles.detailLabel
                            }
                          >
                            Date
                          </div>

                          <div
                            style={
                              styles.detailValue
                            }
                          >
                            {formatDate(
                              dealDate
                            )}
                          </div>
                        </div>

                        {/* REF ID */}
                        <div>
                          <div
                            style={
                              styles.detailLabel
                            }
                          >
                            Ref ID
                          </div>

                          <div
                            style={
                              styles.detailValue
                            }
                          >
                            #{deal.id}
                          </div>
                        </div>

                      </div>

                      {/* MESSAGE */}
                      {deal.message && (
                        <div
                          style={styles.note}
                        >
                          <strong>
                            Note:
                          </strong>{" "}
                          {deal.message}
                        </div>
                      )}

                      {/* VIEW DEAL */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/buyer/deals/${deal.id}`
                          )
                        }
                        style={
                          styles.viewButton
                        }
                      >
                        View Deal
                      </button>

                    </article>
                  );
                })}
              </section>
            )}
        </div>
      </main>
    </>
  );
};

export default BuyerDeals;