import React, { useEffect, useState, useMemo } from "react";
import BuyerNavbar from "../../components/BuyerNavbar";

const BuyerDeals = () => {
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

      const response = await fetch("http://localhost:5000/api/deals/buyer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load buyer deals");
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
      setError(err.message || "Unable to load your purchase deals.");
      setDeals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // ============================================================
  // COMPUTED PROPERTIES & HELPERS
  // ============================================================
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const cropName = (
        deal.crop_name ||
        deal.cropName ||
        deal.crop ||
        ""
      ).toLowerCase();
      const farmerName = (
        deal.farmer_name ||
        deal.farmerName ||
        deal.farmer ||
        ""
      ).toLowerCase();
      const status = String(deal.status || "").toLowerCase();

      const matchesSearch =
        cropName.includes(searchTerm.toLowerCase()) ||
        farmerName.includes(searchTerm.toLowerCase()) ||
        String(deal.id).includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [deals, searchTerm, statusFilter]);

  const activeDealsCount = useMemo(() => {
    return deals.filter((deal) => {
      const status = String(deal.status || "").toLowerCase();
      return (
        status === "accepted" ||
        status === "payment_pending" ||
        status === "paid"
      );
    }).length;
  }, [deals]);

  const formatPrice = (price) => {
    const number = Number(price || 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const value = String(status || "accepted").toLowerCase();
    let bg = "#fff7ed";
    let color = "#ea580c";
    let border = "#ffedd5";
    let label = status ? status.replace("_", " ") : "Accepted";

    if (value === "cancelled") {
      bg = "#fef2f2";
      color = "#dc2626";
      border = "#fecaca";
    } else if (value === "completed" || value === "paid") {
      bg = "#f0fdf4";
      color = "#16a34a";
      border = "#bbf7d0";
    }

    return (
      <span
        style={{
          backgroundColor: bg,
          color: color,
          border: `1px solid ${border}`,
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "capitalize",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
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
  // BRANDED STYLES (MATCHES FARM2FEATURE DESIGN)
  // ============================================================
  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "32px 20px 80px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    container: {
      maxWidth: "1140px",
      margin: "0 auto",
    },
    headerRow: {
      marginBottom: "24px",
    },
    badge: {
      color: "#ea580c",
      fontSize: "12px",
      fontWeight: "800",
      letterSpacing: "0.8px",
      textTransform: "uppercase",
      display: "block",
      marginBottom: "4px",
    },
    heading: {
      color: "#0f172a",
      fontSize: "28px",
      fontWeight: "800",
      margin: "0 0 4px",
    },
    subheading: {
      color: "#64748b",
      fontSize: "14px",
      margin: 0,
    },
    filterCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "12px",
      padding: "16px 20px",
      marginBottom: "20px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
    },
    filterGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 220px 180px",
      gap: "16px",
      alignItems: "center",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "700",
      color: "#334155",
    },
    searchInput: {
      height: "42px",
      padding: "0 14px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "#ffffff",
    },
    filterSelect: {
      height: "42px",
      padding: "0 12px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      backgroundColor: "#ffffff",
      color: "#334155",
      cursor: "pointer",
      outline: "none",
    },
    brandBtn: {
      height: "42px",
      backgroundColor: "#ea580c",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: refreshing ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "background-color 0.2s ease",
      marginTop: "auto",
    },
    panelCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "12px",
      padding: "20px 24px",
      marginBottom: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    panelTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#0f172a",
      margin: 0,
    },
    panelMeta: {
      fontSize: "13px",
      color: "#64748b",
      margin: "2px 0 0",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
      gap: "20px",
    },
    dealCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      display: "flex",
      flexDirection: "column",
    },
    cardBody: {
      padding: "20px",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "12px",
      paddingBottom: "14px",
      borderBottom: "1px solid #f1f5f9",
      marginBottom: "14px",
    },
    cropTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#0f172a",
      margin: 0,
    },
    varietyText: {
      fontSize: "13px",
      color: "#64748b",
      margin: "2px 0 0",
    },
    farmerBox: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "16px",
    },
    avatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: "#ffedd5",
      color: "#ea580c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "800",
      fontSize: "13px",
    },
    metaGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    metaLabel: {
      fontSize: "11px",
      color: "#64748b",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "2px",
    },
    metaValue: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1e293b",
    },
    priceHighlight: {
      fontSize: "16px",
      fontWeight: "800",
      color: "#ea580c",
    },
    messageBox: {
      backgroundColor: "#fff7ed",
      borderLeft: "3px solid #ea580c",
      padding: "8px 12px",
      fontSize: "12px",
      color: "#9a3412",
      marginTop: "14px",
      borderRadius: "0 6px 6px 0",
    },
  };

  return (
    <>
      <BuyerNavbar />

      <main style={styles.page}>
        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.headerRow}>
            <span style={styles.badge}>BUYER PORTAL</span>
            <h1 style={styles.heading}>My Deals</h1>
            <p style={styles.subheading}>
              Manage and track your active crop purchase agreements.
            </p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div style={styles.filterCard}>
            <div style={styles.filterGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Search Deals</label>
                <input
                  type="text"
                  placeholder="Search crop, variety, or farmer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Deal Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="ALL">All Deals</option>
                  <option value="accepted">Accepted</option>
                  <option value="payment_pending">Payment Pending</option>
                  <option value="paid">Paid</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => fetchDeals(true)}
                disabled={refreshing}
                style={styles.brandBtn}
              >
                ↻ {refreshing ? "Refreshing..." : "Refresh Deals"}
              </button>
            </div>
          </div>

          {/* RESULTS SUMMARY BAR */}
          <div style={styles.panelCard}>
            <div>
              <h2 style={styles.panelTitle}>Agreed Purchases</h2>
              <p style={styles.panelMeta}>
                Showing {filteredDeals.length} of {deals.length} total agreements ({activeDealsCount} active)
              </p>
            </div>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "14px 18px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              Loading your purchase deals...
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredDeals.length === 0 && !error && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>
                No deals found
              </h3>
              <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your search terms or status filter."
                  : "When a farmer accepts your price offer, the deal will appear here."}
              </p>
            </div>
          )}

          {/* DEALS GRID */}
          {!loading && filteredDeals.length > 0 && (
            <div style={styles.cardGrid}>
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
                  `Crop #${deal.crop_id}`;
                const variety = deal.crop_variety || deal.variety;

                return (
                  <article key={deal.id} style={styles.dealCard}>
                    <div style={styles.cardBody}>
                      <div style={styles.cardHeader}>
                        <div>
                          <h3 style={styles.cropTitle}>{cropName}</h3>
                          {variety && <p style={styles.varietyText}>Var: {variety}</p>}
                        </div>
                        {getStatusBadge(deal.status)}
                      </div>

                      <div style={styles.farmerBox}>
                        <div style={styles.avatar}>
                          {farmerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>
                            SELLER
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                            {farmerName}
                          </div>
                        </div>
                      </div>

                      <div style={styles.metaGrid}>
                        <div>
                          <div style={styles.metaLabel}>Quantity</div>
                          <div style={styles.metaValue}>
                            {Number(deal.quantity || 0).toLocaleString("en-IN")} kg
                          </div>
                        </div>

                        <div>
                          <div style={styles.metaLabel}>Agreed Price</div>
                          <div style={styles.priceHighlight}>
                            {formatPrice(deal.agreed_price)}
                          </div>
                        </div>

                        <div>
                          <div style={styles.metaLabel}>Date</div>
                          <div style={styles.metaValue}>
                            {formatDate(deal.created_at || deal.deal_date)}
                          </div>
                        </div>

                        <div>
                          <div style={styles.metaLabel}>Ref ID</div>
                          <div style={styles.metaValue}>#{deal.id}</div>
                        </div>
                      </div>

                      {deal.message && (
                        <div style={styles.messageBox}>
                          <strong>Note:</strong> {deal.message}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default BuyerDeals;