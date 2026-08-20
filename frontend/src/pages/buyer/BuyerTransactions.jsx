import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import BuyerNavbar from "../../components/BuyerNavbar";


// ============================================================
// API
// ============================================================

const API_BASE =
    "http://localhost:5000/api";


// ============================================================
// GET AUTH TOKEN
// ============================================================

const getAuthToken = () => {

    const keys = [
        "token",
        "authToken",
        "accessToken",
        "jwt",
        "access_token"
    ];

    for (const key of keys) {

        const token =
            localStorage.getItem(key) ||
            sessionStorage.getItem(key);

        if (token) {
            return token;
        }

    }


    // Check stored user object
    try {

        const user =
            JSON.parse(
                localStorage.getItem(
                    "user"
                ) || "null"
            );

        if (user?.token) {
            return user.token;
        }

        if (user?.accessToken) {
            return user.accessToken;
        }

    } catch (error) {

        console.warn(
            "Unable to read stored user"
        );

    }


    return "";
};


// ============================================================
// FORMAT MONEY
// ============================================================

const formatMoney = (amount) => {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(
        Number(amount || 0)
    );

};


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (dateValue) => {

    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

};


// ============================================================
// FORMAT DATE TIME
// ============================================================

const formatDateTime = (
    dateValue
) => {

    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleString(
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
// NORMALIZE STATUS
// ============================================================

const normalizeStatus = (
    status
) => {

    return String(
        status || ""
    )
        .trim()
        .toLowerCase();

};


// ============================================================
// ESCAPE HTML
// ============================================================

const escapeHtml = (
    value
) => {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

};


// ============================================================
// COMPONENT
// ============================================================

const BuyerTransactions = () => {

    const [
        transactions,
        setTransactions
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        search,
        setSearch
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter
    ] = useState("all");

    const [
        selectedTransaction,
        setSelectedTransaction
    ] = useState(null);


    // ========================================================
    // FETCH TRANSACTIONS
    // ========================================================

    const fetchTransactions =
        async () => {

            try {

                setLoading(true);
                setError("");


                const token =
                    getAuthToken();


                console.log(
                    "================================"
                );

                console.log(
                    "GET BUYER TRANSACTIONS"
                );

                console.log(
                    "AUTH TOKEN:",
                    token
                        ? "TOKEN FOUND"
                        : "NO TOKEN"
                );

                console.log(
                    "================================"
                );


                if (!token) {

                    throw new Error(
                        "Authentication token not found. Please login again."
                    );

                }


                const response =
                    await fetch(
                        `${API_BASE}/buyer/transactions`,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                let result = {};


                try {

                    result =
                        await response.json();

                } catch {

                    result = {
                        success: false,
                        message:
                            "Invalid server response"
                    };

                }


                console.log(
                    "TRANSACTIONS STATUS:",
                    response.status
                );

                console.log(
                    "TRANSACTIONS RESPONSE:",
                    result
                );


                if (
                    response.status ===
                    401
                ) {

                    throw new Error(
                        "Your session has expired. Please login again."
                    );

                }


                if (
                    !response.ok
                ) {

                    throw new Error(
                        result.message ||
                        result.error ||
                        "Failed to load buyer transactions"
                    );

                }


                const data =
                    result.transactions ||
                    result.data ||
                    result.rows ||
                    [];


                if (
                    !Array.isArray(data)
                ) {

                    throw new Error(
                        "Invalid transaction data received from server"
                    );

                }


                setTransactions(
                    data
                );


            } catch (err) {

                console.error(
                    "TRANSACTIONS ERROR:",
                    err
                );


                setTransactions([]);


                setError(
                    err.message ||
                    "Failed to load buyer transactions"
                );


            } finally {

                setLoading(false);

            }

        };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        fetchTransactions();

    }, []);


    // ========================================================
    // GET STATUS
    // ========================================================

    const getTransactionStatus =
        (transaction) => {

            return normalizeStatus(
                transaction.payment_status ||
                transaction.status ||
                transaction.paymentStatus ||
                transaction.deal_status
            );

        };


    // ========================================================
    // FILTER
    // ========================================================

    const filteredTransactions =
        useMemo(() => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            return transactions.filter(
                (transaction) => {

                    const status =
                        getTransactionStatus(
                            transaction
                        );


                    const searchableText = [

                        transaction.crop_name,

                        transaction.crop_variety,

                        transaction.farmer_name,

                        transaction.farmer_mobile,

                        transaction.farmer_email,

                        transaction.farmer_village,

                        transaction.farmer_district,

                        transaction.transaction_id,

                        transaction.payment_method,

                        transaction.deal_id,

                        transaction.payment_id

                    ]
                        .filter(
                            Boolean
                        )
                        .join(" ")
                        .toLowerCase();


                    const matchesSearch =
                        !searchText ||
                        searchableText.includes(
                            searchText
                        );


                    const matchesStatus =
                        statusFilter ===
                            "all" ||
                        status ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }, [
            transactions,
            search,
            statusFilter
        ]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const successfulPayments =
        transactions.filter(
            (transaction) => {

                const status =
                    getTransactionStatus(
                        transaction
                    );

                return [

                    "success",
                    "successful",
                    "paid",
                    "completed"

                ].includes(status);

            }
        );


    const pendingPayments =
        transactions.filter(
            (transaction) => {

                const status =
                    getTransactionStatus(
                        transaction
                    );

                return [

                    "pending",
                    "processing"

                ].includes(status);

            }
        );


    const totalAmountPaid =
        successfulPayments.reduce(
            (
                total,
                transaction
            ) => {

                return (
                    total +
                    Number(
                        transaction.amount ||
                        0
                    )
                );

            },
            0
        );


    // ========================================================
    // STATUS CLASS
    // ========================================================

    const getStatusClass =
        (status) => {

            const value =
                normalizeStatus(
                    status
                );


            if (
                [
                    "success",
                    "successful",
                    "paid",
                    "completed"
                ].includes(value)
            ) {

                return "status-success";

            }


            if (
                [
                    "pending",
                    "processing"
                ].includes(value)
            ) {

                return "status-pending";

            }


            if (
                [
                    "failed",
                    "cancelled",
                    "canceled"
                ].includes(value)
            ) {

                return "status-failed";

            }


            return "status-default";

        };


    // ========================================================
    // STATUS TEXT
    // ========================================================

    const getStatusText =
        (status) => {

            const value =
                normalizeStatus(
                    status
                );


            if (
                [
                    "success",
                    "successful",
                    "paid",
                    "completed"
                ].includes(value)
            ) {

                return "Success";

            }


            if (
                value === "pending"
            ) {

                return "Pending";

            }


            if (
                value === "processing"
            ) {

                return "Processing";

            }


            if (
                value === "failed"
            ) {

                return "Failed";

            }


            if (
                [
                    "cancelled",
                    "canceled"
                ].includes(value)
            ) {

                return "Cancelled";

            }


            return status ||
                "Unknown";

        };


    // ========================================================
    // OPEN RECEIPT
    // ========================================================

    const openReceipt =
        (transaction) => {

            setSelectedTransaction(
                transaction
            );

        };


    // ========================================================
    // CLOSE RECEIPT
    // ========================================================

    const closeReceipt =
        () => {

            setSelectedTransaction(
                null
            );

        };


    // ========================================================
    // DOWNLOAD RECEIPT
    // Browser Print → Save as PDF
    // ========================================================

    const downloadReceipt =
        (transaction) => {

            const farmerName =
                transaction.farmer_name ||
                "—";

            const farmerMobile =
                transaction.farmer_mobile ||
                "—";

            const farmerEmail =
                transaction.farmer_email ||
                "—";

            const farmerVillage =
                transaction.profile_village ||
                transaction.farmer_village ||
                "—";

            const farmerDistrict =
                transaction.profile_district ||
                transaction.farmer_district ||
                "—";

            const farmerState =
                transaction.profile_state ||
                transaction.farmer_state ||
                "—";


            const cropName =
                transaction.crop_name ||
                "—";

            const cropVariety =
                transaction.crop_variety ||
                "—";


            const quantity =
                transaction.quantity ??
                transaction.deal_quantity ??
                transaction.crop_quantity ??
                "—";


            const quantityUnit =
                transaction.quantity_unit ||
                "kg";


            const paymentId =
                transaction.payment_id ||
                "—";


            const dealId =
                transaction.deal_id ||
                "—";


            const transactionId =
                transaction.transaction_id ||
                "—";


            const amount =
                formatMoney(
                    transaction.amount
                );


            const paymentMethod =
                String(
                    transaction.payment_method ||
                    "—"
                ).toUpperCase();


            const status =
                getStatusText(
                    transaction.payment_status ||
                    transaction.status
                );


            const date =
                formatDateTime(
                    transaction.payment_date
                );


            const receiptHTML = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
Form2Feature Payment Receipt
</title>

<style>

body {

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background:
        #f4f6f8;

    padding:
        30px;

    color:
        #172033;

}


.receipt {

    max-width:
        760px;

    margin:
        auto;

    background:
        white;

    padding:
        40px;

    border:
        1px solid #ddd;

    border-radius:
        12px;

}


.brand {

    color:
        #f4511e;

    font-size:
        28px;

    font-weight:
        800;

    margin-bottom:
        5px;

}


.subtitle {

    color:
        #64748b;

    margin-bottom:
        30px;

}


.title {

    text-align:
        center;

    font-size:
        25px;

    font-weight:
        800;

    margin:
        25px 0;

}


.success {

    text-align:
        center;

    background:
        #dcfce7;

    color:
        #15803d;

    padding:
        10px;

    border-radius:
        8px;

    font-weight:
        700;

}


.amount {

    text-align:
        center;

    font-size:
        32px;

    font-weight:
        800;

    color:
        #15803d;

    margin:
        25px 0;

}


.section-title {

    font-size:
        16px;

    font-weight:
        800;

    margin-top:
        25px;

    margin-bottom:
        10px;

    color:
        #f4511e;

}


.row {

    display:
        flex;

    justify-content:
        space-between;

    gap:
        20px;

    padding:
        10px 0;

    border-bottom:
        1px solid #eee;

}


.label {

    color:
        #64748b;

}


.value {

    font-weight:
        700;

    text-align:
        right;

}


.footer {

    margin-top:
        30px;

    text-align:
        center;

    color:
        #64748b;

    font-size:
        12px;

}


@media print {

    body {

        background:
            white;

        padding:
            0;

    }


    .receipt {

        border:
            none;

        box-shadow:
            none;

    }

}

</style>

</head>


<body>


<div class="receipt">


<div class="brand">
Form2Feature
</div>


<div class="subtitle">
Smart Agriculture Platform
</div>


<div class="title">
Payment Receipt
</div>


<div class="success">
${escapeHtml(status)}
</div>


<div class="amount">
${escapeHtml(amount)}
</div>


<div class="section-title">
Payment Details
</div>


<div class="row">
<span class="label">
Payment ID
</span>

<span class="value">
${escapeHtml(paymentId)}
</span>
</div>


<div class="row">
<span class="label">
Deal ID
</span>

<span class="value">
#${escapeHtml(dealId)}
</span>
</div>


<div class="row">
<span class="label">
Transaction ID
</span>

<span class="value">
${escapeHtml(transactionId)}
</span>
</div>


<div class="row">
<span class="label">
Payment Method
</span>

<span class="value">
${escapeHtml(paymentMethod)}
</span>
</div>


<div class="row">
<span class="label">
Payment Date
</span>

<span class="value">
${escapeHtml(date)}
</span>
</div>


<div class="section-title">
Crop Details
</div>


<div class="row">
<span class="label">
Crop
</span>

<span class="value">
${escapeHtml(cropName)}
</span>
</div>


<div class="row">
<span class="label">
Variety
</span>

<span class="value">
${escapeHtml(cropVariety)}
</span>
</div>


<div class="row">
<span class="label">
Quantity
</span>

<span class="value">
${escapeHtml(
    `${quantity} ${quantityUnit}`
)}
</span>
</div>


<div class="section-title">
Farmer Details
</div>


<div class="row">
<span class="label">
Farmer Name
</span>

<span class="value">
${escapeHtml(farmerName)}
</span>
</div>


<div class="row">
<span class="label">
Mobile
</span>

<span class="value">
${escapeHtml(farmerMobile)}
</span>
</div>


<div class="row">
<span class="label">
Email
</span>

<span class="value">
${escapeHtml(farmerEmail)}
</span>
</div>


<div class="row">
<span class="label">
Village
</span>

<span class="value">
${escapeHtml(farmerVillage)}
</span>
</div>


<div class="row">
<span class="label">
District
</span>

<span class="value">
${escapeHtml(farmerDistrict)}
</span>
</div>


<div class="row">
<span class="label">
State
</span>

<span class="value">
${escapeHtml(farmerState)}
</span>
</div>


<div class="footer">

<p>
Thank you for using Form2Feature.
</p>

<p>
This receipt was generated electronically.
</p>

</div>


</div>


<script>

window.onload = function () {

    setTimeout(
        function () {

            window.print();

        },
        500
    );

};


window.onafterprint = function () {

    setTimeout(
        function () {

            window.close();

        },
        500
    );

};

</script>


</body>

</html>

`;


            const receiptWindow =
                window.open(
                    "",
                    "_blank",
                    "width=900,height=800"
                );


            if (!receiptWindow) {

                alert(
                    "Please allow pop-ups to download the receipt."
                );

                return;

            }


            receiptWindow.document.open();

            receiptWindow.document.write(
                receiptHTML
            );

            receiptWindow.document.close();

        };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div className="buyer-transactions-page">


            {/* ==================================================
                EXISTING BUYER NAVBAR
            ================================================== */}

            <BuyerNavbar />


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="transactions-container">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <section className="page-header">

                    <div>

                        <div className="portal-label">
                            BUYER PORTAL
                        </div>

                        <h1>
                            Transactions
                        </h1>

                        <p>
                            View and track your crop
                            purchase payments and
                            transaction history.
                        </p>

                    </div>

                </section>


                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <section className="stats-grid">


                    <div className="stat-card">

                        <span>
                            Total Transactions
                        </span>

                        <strong>
                            {transactions.length}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Successful Payments
                        </span>

                        <strong className="success-number">

                            {
                                successfulPayments.length
                            }

                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Pending Payments
                        </span>

                        <strong className="pending-number">

                            {
                                pendingPayments.length
                            }

                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Total Amount Paid
                        </span>

                        <strong className="amount-number">

                            {
                                formatMoney(
                                    totalAmountPaid
                                )
                            }

                        </strong>

                    </div>


                </section>


                {/* ==================================================
                    FILTERS
                ================================================== */}

                <section className="filter-card">


                    <div className="filter-field">

                        <label>
                            Search Transactions
                        </label>

                        <input
                            type="text"
                            placeholder="Search crop, farmer or transaction..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="filter-field">

                        <label>
                            Payment Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="all">
                                All Transactions
                            </option>

                            <option value="success">
                                Successful
                            </option>

                            <option value="paid">
                                Paid
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="processing">
                                Processing
                            </option>

                            <option value="failed">
                                Failed
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>


                    <button
                        className="refresh-button"
                        onClick={
                            fetchTransactions
                        }
                        disabled={loading}
                    >

                        ↻ Refresh

                    </button>


                </section>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="error-message">

                        ⚠ {error}

                    </div>

                )}


                {/* ==================================================
                    HISTORY
                ================================================== */}

                <section className="history-section">


                    <div className="history-header">

                        <div>

                            <h2>
                                Payment History
                            </h2>

                            <p>
                                Your successful and pending
                                payment transactions.
                            </p>

                        </div>


                        <div className="transaction-count">

                            {
                                filteredTransactions.length
                            }

                            {" "}

                            Transaction
                            {
                                filteredTransactions.length !== 1
                                    ? "s"
                                    : ""
                            }

                        </div>

                    </div>


                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {loading && (

                        <div className="loading-message">

                            <div className="spinner"></div>

                            Loading transactions...

                        </div>

                    )}


                    {/* ==================================================
                        EMPTY
                    ================================================== */}

                    {!loading &&
                        filteredTransactions.length === 0 && (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    💳
                                </div>

                                <h3>
                                    No Transactions Found
                                </h3>

                                <p>
                                    {
                                        transactions.length === 0
                                            ? "You don't have any payment transactions yet."
                                            : "No transactions match your current search or filter."
                                    }
                                </p>

                            </div>

                        )}


                    {/* ==================================================
                        TRANSACTION LIST
                    ================================================== */}

                    {!loading &&
                        filteredTransactions.length > 0 && (

                            <div className="transaction-list">


                                {
                                    filteredTransactions.map(
                                        (
                                            transaction,
                                            index
                                        ) => {

                                            const status =
                                                getTransactionStatus(
                                                    transaction
                                                );


                                            const farmerName =
                                                transaction.farmer_name ||
                                                "—";


                                            const farmerMobile =
                                                transaction.farmer_mobile ||
                                                "—";


                                            const farmerEmail =
                                                transaction.farmer_email ||
                                                "—";


                                            const village =
                                                transaction.profile_village ||
                                                transaction.farmer_village ||
                                                "—";


                                            const district =
                                                transaction.profile_district ||
                                                transaction.farmer_district ||
                                                "—";


                                            const state =
                                                transaction.profile_state ||
                                                transaction.farmer_state ||
                                                "—";


                                            const cropName =
                                                transaction.crop_name ||
                                                "—";


                                            const cropVariety =
                                                transaction.crop_variety ||
                                                "—";


                                            const quantity =
                                                transaction.quantity ??
                                                transaction.deal_quantity ??
                                                transaction.crop_quantity ??
                                                "—";


                                            const unit =
                                                transaction.quantity_unit ||
                                                "kg";


                                            return (

                                                <article
                                                    className="transaction-card"
                                                    key={
                                                        transaction.payment_id ||
                                                        transaction.id ||
                                                        index
                                                    }
                                                >


                                                    {/* ======================================
                                                        TOP
                                                    ====================================== */}

                                                    <div className="transaction-top">


                                                        <div>

                                                            <h3>
                                                                Deal #
                                                                {
                                                                    transaction.deal_id ||
                                                                    "—"
                                                                }
                                                            </h3>


                                                            <div className="transaction-id">

                                                                Transaction ID:

                                                                <strong>
                                                                    {
                                                                        transaction.transaction_id ||
                                                                        "—"
                                                                    }
                                                                </strong>

                                                            </div>

                                                        </div>


                                                        <span
                                                            className={
                                                                `status-badge ${
                                                                    getStatusClass(
                                                                        status
                                                                    )
                                                                }`
                                                            }
                                                        >

                                                            {
                                                                getStatusText(
                                                                    status
                                                                )
                                                            }

                                                        </span>


                                                    </div>


                                                    {/* ======================================
                                                        DETAILS
                                                    ====================================== */}

                                                    <div className="transaction-details">


                                                        <div className="detail-box">

                                                            <span>
                                                                Amount
                                                            </span>

                                                            <strong className="amount-green">

                                                                {
                                                                    formatMoney(
                                                                        transaction.amount
                                                                    )
                                                                }

                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Payment Method
                                                            </span>

                                                            <strong>

                                                                {
                                                                    String(
                                                                        transaction.payment_method ||
                                                                        "—"
                                                                    ).toUpperCase()
                                                                }

                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Deal ID
                                                            </span>

                                                            <strong>
                                                                #
                                                                {
                                                                    transaction.deal_id ||
                                                                    "—"
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Date
                                                            </span>

                                                            <strong>
                                                                {
                                                                    formatDate(
                                                                        transaction.payment_date
                                                                    )
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box farmer-box">

                                                            <span>
                                                                Farmer
                                                            </span>

                                                            <strong>
                                                                {
                                                                    farmerName
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Mobile
                                                            </span>

                                                            <strong>
                                                                {
                                                                    farmerMobile
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Email
                                                            </span>

                                                            <strong>
                                                                {
                                                                    farmerEmail
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Location
                                                            </span>

                                                            <strong>
                                                                {
                                                                    [
                                                                        village,
                                                                        district,
                                                                        state
                                                                    ]
                                                                        .filter(
                                                                            value =>
                                                                                value &&
                                                                                value !== "—"
                                                                        )
                                                                        .join(
                                                                            ", "
                                                                        ) ||
                                                                    "—"
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Crop
                                                            </span>

                                                            <strong>
                                                                {
                                                                    cropName
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Variety
                                                            </span>

                                                            <strong>
                                                                {
                                                                    cropVariety
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Quantity
                                                            </span>

                                                            <strong>
                                                                {
                                                                    quantity
                                                                }

                                                                {" "}

                                                                {
                                                                    unit
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="detail-box">

                                                            <span>
                                                                Payment ID
                                                            </span>

                                                            <strong>
                                                                #
                                                                {
                                                                    transaction.payment_id ||
                                                                    "—"
                                                                }
                                                            </strong>

                                                        </div>


                                                    </div>


                                                    {/* ======================================
                                                        FOOTER
                                                    ====================================== */}

                                                    <div className="transaction-footer">


                                                        <div>

                                                            <span>
                                                                Transaction Reference
                                                            </span>

                                                            <strong>
                                                                {
                                                                    transaction.transaction_id ||
                                                                    "—"
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="transaction-actions">


                                                            <button
                                                                className="view-receipt-button"
                                                                onClick={() =>
                                                                    openReceipt(
                                                                        transaction
                                                                    )
                                                                }
                                                            >

                                                                👁 View Receipt

                                                            </button>


                                                            <button
                                                                className="receipt-button"
                                                                onClick={() =>
                                                                    downloadReceipt(
                                                                        transaction
                                                                    )
                                                                }
                                                            >

                                                                ⬇ Download Payment Receipt

                                                            </button>


                                                        </div>


                                                    </div>


                                                </article>

                                            );

                                        }
                                    )
                                }


                            </div>

                        )}


                </section>


            </main>


            {/* ==================================================
                RECEIPT PREVIEW MODAL
            ================================================== */}

            {selectedTransaction && (

                <div
                    className="receipt-overlay"
                    onClick={
                        closeReceipt
                    }
                >


                    <div
                        className="receipt-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <div className="receipt-modal-header">

                            <div>

                                <h2>
                                    Payment Receipt
                                </h2>

                                <p>
                                    Transaction receipt preview
                                </p>

                            </div>


                            <button
                                className="close-button"
                                onClick={
                                    closeReceipt
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="receipt-preview">


                            <div className="receipt-brand">
                                Form2Feature
                            </div>

                            <div className="receipt-subtitle">
                                Smart Agriculture Platform
                            </div>


                            <div className="receipt-success">
                                ✓ Payment{" "}
                                {
                                    getStatusText(
                                        selectedTransaction.payment_status ||
                                        selectedTransaction.status
                                    )
                                }
                            </div>


                            <div className="receipt-amount">

                                {
                                    formatMoney(
                                        selectedTransaction.amount
                                    )
                                }

                            </div>


                            <div className="preview-section-title">
                                Payment Details
                            </div>


                            <div className="preview-row">

                                <span>
                                    Payment ID
                                </span>

                                <strong>
                                    #
                                    {
                                        selectedTransaction.payment_id ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Deal ID
                                </span>

                                <strong>
                                    #
                                    {
                                        selectedTransaction.deal_id ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Transaction ID
                                </span>

                                <strong>
                                    {
                                        selectedTransaction.transaction_id ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Amount
                                </span>

                                <strong>
                                    {
                                        formatMoney(
                                            selectedTransaction.amount
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Payment Method
                                </span>

                                <strong>
                                    {
                                        String(
                                            selectedTransaction.payment_method ||
                                            "—"
                                        ).toUpperCase()
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Date
                                </span>

                                <strong>
                                    {
                                        formatDateTime(
                                            selectedTransaction.payment_date
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="preview-section-title">
                                Crop Details
                            </div>


                            <div className="preview-row">

                                <span>
                                    Crop
                                </span>

                                <strong>
                                    {
                                        selectedTransaction.crop_name ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Variety
                                </span>

                                <strong>
                                    {
                                        selectedTransaction.crop_variety ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Quantity
                                </span>

                                <strong>

                                    {
                                        selectedTransaction.quantity ??
                                        selectedTransaction.deal_quantity ??
                                        selectedTransaction.crop_quantity ??
                                        "—"
                                    }

                                    {" "}

                                    {
                                        selectedTransaction.quantity_unit ||
                                        "kg"
                                    }

                                </strong>

                            </div>


                            <div className="preview-section-title">
                                Farmer Details
                            </div>


                            <div className="preview-row">

                                <span>
                                    Farmer
                                </span>

                                <strong>
                                    {
                                        selectedTransaction.farmer_name ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Mobile
                                </span>

                                <strong>
                                    {
                                        selectedTransaction.farmer_mobile ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {
                                        selectedTransaction.farmer_email ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="preview-row">

                                <span>
                                    Location
                                </span>

                                <strong>

                                    {
                                        [
                                            selectedTransaction.profile_village ||
                                            selectedTransaction.farmer_village,

                                            selectedTransaction.profile_district ||
                                            selectedTransaction.farmer_district,

                                            selectedTransaction.profile_state ||
                                            selectedTransaction.farmer_state
                                        ]
                                            .filter(
                                                Boolean
                                            )
                                            .join(
                                                ", "
                                            ) ||
                                        "—"
                                    }

                                </strong>

                            </div>


                        </div>


                        <div className="modal-actions">

                            <button
                                className="cancel-button"
                                onClick={
                                    closeReceipt
                                }
                            >
                                Close
                            </button>


                            <button
                                className="modal-download-button"
                                onClick={() =>
                                    downloadReceipt(
                                        selectedTransaction
                                    )
                                }
                            >

                                ↓ Download / Save as PDF

                            </button>

                        </div>


                    </div>

                </div>

            )}


            {/* ==================================================
                CSS
            ================================================== */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .buyer-transactions-page {
                    min-height: 100vh;
                    background: #f5f7fa;
                    color: #172033;
                }

                .transactions-container {
                    width: min(
                        1200px,
                        calc(100% - 40px)
                    );

                    margin: 0 auto;

                    padding:
                        45px 0 70px;
                }

                .page-header {
                    margin-bottom: 28px;
                }

                .portal-label {
                    color: #f4511e;
                    font-size: 13px;
                    font-weight: 800;
                    letter-spacing: .5px;
                    margin-bottom: 7px;
                }

                .page-header h1 {
                    margin: 0 0 8px;
                    font-size: 40px;
                    font-weight: 800;
                }

                .page-header p {
                    margin: 0;
                    color: #64748b;
                    font-size: 15px;
                }

                /* ==========================================
                   STATISTICS
                ========================================== */

                .stats-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);

                    gap: 18px;

                    margin-bottom: 22px;
                }

                .stat-card {
                    background: white;
                    border: 1px solid #dbe1ea;
                    border-radius: 14px;
                    padding: 25px;
                    min-height: 125px;

                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .stat-card span {
                    color: #64748b;
                    font-size: 14px;
                }

                .stat-card strong {
                    font-size: 29px;
                    margin-top: 12px;
                }

                .success-number {
                    color: #15803d;
                }

                .pending-number {
                    color: #ea580c;
                }

                .amount-number {
                    font-size: 24px !important;
                }

                /* ==========================================
                   FILTER
                ========================================== */

                .filter-card {
                    background: white;
                    border: 1px solid #dbe1ea;
                    border-radius: 14px;
                    padding: 22px;

                    display: grid;

                    grid-template-columns:
                        1.5fr 1fr auto;

                    gap: 16px;

                    align-items: end;

                    margin-bottom: 22px;
                }

                .filter-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .filter-field label {
                    font-size: 13px;
                    font-weight: 700;
                }

                .filter-field input,
                .filter-field select {
                    height: 44px;
                    border: 1px solid #b9c4d4;
                    border-radius: 8px;
                    padding: 0 13px;
                    background: white;
                    outline: none;
                    font-size: 14px;
                }

                .filter-field input:focus,
                .filter-field select:focus {
                    border-color: #f97316;
                    box-shadow:
                        0 0 0 3px
                        rgba(
                            249,
                            115,
                            22,
                            .12
                        );
                }

                .refresh-button {
                    height: 44px;
                    padding: 0 24px;
                    border: none;
                    border-radius: 8px;
                    background: #f4511e;
                    color: white;
                    font-weight: 800;
                }

                .refresh-button:hover {
                    background: #e64a19;
                }

                .refresh-button:disabled {
                    opacity: .6;
                }

                /* ==========================================
                   ERROR
                ========================================== */

                .error-message {
                    background: #fff1f2;
                    border: 1px solid #fecdd3;
                    color: #dc2626;
                    padding: 15px;
                    border-radius: 9px;
                    margin-bottom: 18px;
                }

                /* ==========================================
                   HISTORY
                ========================================== */

                .history-section {
                    background: white;
                    border: 1px solid #dbe1ea;
                    border-radius: 14px;
                    padding: 28px;
                }

                .history-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }

                .history-header h2 {
                    margin: 0 0 7px;
                    font-size: 29px;
                }

                .history-header p {
                    margin: 0;
                    color: #64748b;
                }

                .transaction-count {
                    border: 1px solid #fed7aa;
                    background: #fffaf5;
                    color: #f4511e;
                    padding: 11px 18px;
                    border-radius: 999px;
                    font-weight: 800;
                }

                /* ==========================================
                   TRANSACTION
                ========================================== */

                .transaction-list {
                    display: flex;
                    flex-direction: column;
                    gap: 17px;
                }

                .transaction-card {
                    border: 1px solid #e2e8f0;
                    border-radius: 13px;
                    padding: 20px;
                    transition: .2s ease;
                }

                .transaction-card:hover {
                    box-shadow:
                        0 8px 25px
                        rgba(
                            15,
                            23,
                            42,
                            .07
                        );
                }

                .transaction-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #eef2f7;
                }

                .transaction-top h3 {
                    margin: 0 0 7px;
                    font-size: 19px;
                }

                .transaction-id {
                    color: #64748b;
                    font-size: 13px;
                }

                .transaction-id strong {
                    color: #334155;
                    margin-left: 5px;
                    word-break: break-all;
                }

                .status-badge {
                    padding: 7px 13px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 800;
                }

                .status-success {
                    background: #dcfce7;
                    color: #15803d;
                }

                .status-pending {
                    background: #ffedd5;
                    color: #c2410c;
                }

                .status-failed {
                    background: #fee2e2;
                    color: #b91c1c;
                }

                .status-default {
                    background: #f1f5f9;
                    color: #475569;
                }

                /* ==========================================
                   DETAILS
                ========================================== */

                .transaction-details {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);

                    margin-top: 0;
                }

                .detail-box {
                    padding: 17px 15px;
                    border-right: 1px solid #edf0f2;
                    border-bottom: 1px solid #edf0f2;
                    min-width: 0;
                }

                .detail-box:nth-child(4n) {
                    border-right: none;
                }

                .detail-box span {
                    display: block;
                    color: #64748b;
                    font-size: 13px;
                    margin-bottom: 7px;
                }

                .detail-box strong {
                    display: block;
                    color: #172033;
                    font-size: 14px;
                    word-break: break-word;
                }

                .amount-green {
                    color: #15803d !important;
                    font-size: 16px !important;
                }

                .farmer-box strong {
                    color: #f4511e;
                }

                /* ==========================================
                   FOOTER
                ========================================== */

                .transaction-footer {
                    margin-top: 18px;
                    padding: 15px;
                    background: #f8fafc;
                    border-radius: 9px;

                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                }

                .transaction-footer span {
                    display: block;
                    color: #64748b;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .transaction-footer strong {
                    font-size: 13px;
                    word-break: break-all;
                }

                .transaction-actions {
                    display: flex;
                    gap: 10px;
                    flex-shrink: 0;
                }

                .view-receipt-button,
                .receipt-button {
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-size: 13px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .view-receipt-button {
                    background: white;
                    border: 1px solid #cbd5e1;
                    color: #334155;
                }

                .view-receipt-button:hover {
                    background: #f8fafc;
                }

                .receipt-button {
                    background: #fff4ed;
                    border: 1px solid #f4511e;
                    color: #f4511e;
                }

                .receipt-button:hover {
                    background: #f4511e;
                    color: white;
                }

                /* ==========================================
                   LOADING
                ========================================== */

                .loading-message {
                    padding: 50px;
                    text-align: center;
                    color: #64748b;
                }

                .spinner {
                    width: 36px;
                    height: 36px;
                    border: 4px solid #e5e7eb;
                    border-top-color: #f4511e;
                    border-radius: 50%;
                    animation:
                        transactionSpin
                        .8s
                        linear
                        infinite;
                    margin: 0 auto 15px;
                }

                @keyframes transactionSpin {
                    to {
                        transform:
                            rotate(360deg);
                    }
                }

                /* ==========================================
                   EMPTY
                ========================================== */

                .empty-state {
                    padding: 60px 20px;
                    text-align: center;
                }

                .empty-icon {
                    font-size: 45px;
                    margin-bottom: 10px;
                }

                .empty-state h3 {
                    margin: 0 0 8px;
                }

                .empty-state p {
                    margin: 0;
                    color: #64748b;
                }

                /* ==========================================
                   MODAL
                ========================================== */

                .receipt-overlay {
                    position: fixed;
                    inset: 0;
                    background:
                        rgba(
                            15,
                            23,
                            42,
                            .65
                        );
                    z-index: 9999;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 20px;
                }

                .receipt-modal {
                    width: min(
                        700px,
                        100%
                    );

                    max-height:
                        90vh;

                    overflow-y:
                        auto;

                    background: white;
                    border-radius: 14px;
                    box-shadow:
                        0 25px 60px
                        rgba(
                            0,
                            0,
                            0,
                            .25
                        );
                }

                .receipt-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 20px 24px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .receipt-modal-header h2 {
                    margin: 0 0 5px;
                }

                .receipt-modal-header p {
                    margin: 0;
                    color: #64748b;
                    font-size: 13px;
                }

                .close-button {
                    border: none;
                    background: #f1f5f9;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    font-size: 23px;
                    cursor: pointer;
                }

                .receipt-preview {
                    padding: 25px;
                }

                .receipt-brand {
                    color: #f4511e;
                    font-size: 26px;
                    font-weight: 800;
                }

                .receipt-subtitle {
                    color: #64748b;
                    margin-top: 3px;
                }

                .receipt-success {
                    margin-top: 20px;
                    background: #dcfce7;
                    color: #15803d;
                    padding: 10px;
                    text-align: center;
                    border-radius: 8px;
                    font-weight: 800;
                }

                .receipt-amount {
                    text-align: center;
                    color: #15803d;
                    font-size: 31px;
                    font-weight: 800;
                    padding: 22px 0;
                }

                .preview-section-title {
                    color: #f4511e;
                    font-weight: 800;
                    margin-top: 20px;
                    margin-bottom: 8px;
                }

                .preview-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    padding: 11px 13px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .preview-row span {
                    color: #64748b;
                    font-size: 13px;
                }

                .preview-row strong {
                    text-align: right;
                    font-size: 13px;
                    word-break: break-word;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding: 17px 24px;
                    border-top: 1px solid #e5e7eb;
                }

                .cancel-button {
                    background: white;
                    border: 1px solid #cbd5e1;
                    padding: 11px 18px;
                    border-radius: 8px;
                    font-weight: 700;
                }

                .modal-download-button {
                    background: #16a34a;
                    color: white;
                    border: none;
                    padding: 11px 18px;
                    border-radius: 8px;
                    font-weight: 800;
                }

                .modal-download-button:hover {
                    background: #15803d;
                }

                /* ==========================================
                   RESPONSIVE
                ========================================== */

                @media (max-width: 1000px) {

                    .stats-grid {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .transaction-details {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .detail-box:nth-child(4n) {
                        border-right:
                            1px solid #edf0f2;
                    }

                    .detail-box:nth-child(2n) {
                        border-right:
                            none;
                    }

                }


                @media (max-width: 700px) {

                    .transactions-container {
                        width:
                            calc(100% - 24px);

                        padding-top:
                            25px;
                    }

                    .page-header h1 {
                        font-size: 30px;
                    }

                    .stats-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .filter-card {
                        grid-template-columns:
                            1fr;
                    }

                    .refresh-button {
                        width: 100%;
                    }

                    .history-section {
                        padding: 17px;
                    }

                    .history-header {
                        flex-direction:
                            column;

                        align-items:
                            flex-start;

                        gap: 15px;
                    }

                    .transaction-details {
                        grid-template-columns:
                            1fr;
                    }

                    .detail-box,
                    .detail-box:nth-child(2n),
                    .detail-box:nth-child(4n) {
                        border-right:
                            none;
                    }

                    .transaction-footer {
                        flex-direction:
                            column;

                        align-items:
                            flex-start;
                    }

                    .transaction-actions {
                        width:
                            100%;

                        flex-direction:
                            column;
                    }

                    .view-receipt-button,
                    .receipt-button {
                        width:
                            100%;
                    }

                    .receipt-overlay {
                        padding:
                            10px;
                    }

                    .receipt-preview {
                        padding:
                            18px;
                    }

                    .preview-row {
                        flex-direction:
                            column;

                        gap: 4px;
                    }

                    .preview-row strong {
                        text-align:
                            left;
                    }

                    .modal-actions {
                        flex-direction:
                            column;
                    }

                    .cancel-button,
                    .modal-download-button {
                        width:
                            100%;
                    }

                }

            `}</style>

        </div>

    );

};


export default BuyerTransactions;