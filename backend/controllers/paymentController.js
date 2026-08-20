const db = require("../config/db");

// Your db config exports { pool }
const pool = db.pool || db;

// ============================================================
// GET USER ID
// ============================================================

function getUserId(req) {
    return Number(
        req.user?.id ||
        req.user?.user_id ||
        req.user?.userId
    );
}

// ============================================================
// CREATE MOCK PAYMENT
// POST /api/payments
// ============================================================

const createPayment = async (req, res) => {
    let connection;

    try {
        console.log("========================================");
        console.log("CREATE BUYER PAYMENT");
        console.log("USER:", req.user);
        console.log("BODY:", req.body);
        console.log("========================================");

        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        const buyerId = getUserId(req);

        if (!buyerId || !Number.isInteger(buyerId)) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ------------------------------------------------------
        // REQUEST DATA
        // ------------------------------------------------------

        const {
            deal_id,
            payment_method
        } = req.body;

        const dealId = Number(deal_id);

        const allowedMethods = [
            "upi",
            "card",
            "net_banking"
        ];

        if (!Number.isInteger(dealId) || dealId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid deal ID is required"
            });
        }

        if (!allowedMethods.includes(payment_method)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment method. Use upi, card or net_banking."
            });
        }

        // ------------------------------------------------------
        // GET DEAL
        // ------------------------------------------------------

        const [dealRows] = await pool.execute(
            `
            SELECT
                id,
                buyer_id,
                farmer_id,
                crop_id,
                quantity,
                agreed_price,
                status
            FROM deals
            WHERE id = ?
            LIMIT 1
            `,
            [dealId]
        );

        if (!dealRows || dealRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Deal not found"
            });
        }

        const deal = dealRows[0];

        // ------------------------------------------------------
        // SECURITY
        // ------------------------------------------------------

        if (Number(deal.buyer_id) !== buyerId) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not allowed to pay for this deal"
            });
        }

        // ------------------------------------------------------
        // DEAL STATUS
        // ------------------------------------------------------

        if (deal.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "This deal has already been paid"
            });
        }

        if (deal.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message:
                    `Payment is not available for deal status: ${deal.status}`
            });
        }

        // ------------------------------------------------------
        // AMOUNT
        // ------------------------------------------------------

        const amount = Number(deal.agreed_price);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid deal amount"
            });
        }

        // ------------------------------------------------------
        // CHECK EXISTING PAYMENT
        // ------------------------------------------------------

        const [existingPayments] = await pool.execute(
            `
            SELECT
                id,
                transaction_id,
                amount,
                payment_method,
                status,
                payment_date
            FROM payments
            WHERE deal_id = ?
              AND buyer_id = ?
            ORDER BY id DESC
            LIMIT 1
            `,
            [
                dealId,
                buyerId
            ]
        );

        if (
            existingPayments.length > 0 &&
            existingPayments[0].status === "success"
        ) {
            return res.status(409).json({
                success: false,
                message: "Payment already completed",
                payment: existingPayments[0]
            });
        }

        // ------------------------------------------------------
        // TRANSACTION
        // ------------------------------------------------------

        connection = await pool.getConnection();

        await connection.beginTransaction();

        // ------------------------------------------------------
        // MOCK TRANSACTION ID
        // ------------------------------------------------------

        const transactionId =
            `MOCK-${Date.now()}-${Math.floor(
                Math.random() * 10000
            )}`;

        // ------------------------------------------------------
        // INSERT PAYMENT
        // ------------------------------------------------------

        const [paymentResult] =
            await connection.execute(
                `
                INSERT INTO payments
                (
                    buyer_id,
                    deal_id,
                    farmer_id,
                    transaction_id,
                    payment_method,
                    amount,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, 'success')
                `,
                [
                    buyerId,
                    dealId,
                    deal.farmer_id,
                    transactionId,
                    payment_method,
                    amount
                ]
            );

        // ------------------------------------------------------
        // UPDATE DEAL
        // ------------------------------------------------------

        await connection.execute(
            `
            UPDATE deals
            SET status = 'paid'
            WHERE id = ?
            `,
            [dealId]
        );

        // ------------------------------------------------------
        // COMMIT
        // ------------------------------------------------------

        await connection.commit();

        console.log(
            "PAYMENT SUCCESS:",
            transactionId
        );

        return res.status(201).json({
            success: true,
            message: "Payment completed successfully",
            payment: {
                id: paymentResult.insertId,
                transaction_id: transactionId,
                deal_id: dealId,
                buyer_id: buyerId,
                farmer_id: deal.farmer_id,
                amount,
                payment_method,
                status: "success"
            }
        });

    } catch (error) {

        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "ROLLBACK ERROR:",
                    rollbackError
                );
            }
        }

        console.error("========================================");
        console.error("CREATE PAYMENT ERROR");
        console.error(error);
        console.error("========================================");

        return res.status(500).json({
            success: false,
            message: "Failed to process payment",
            error: error.message
        });

    } finally {

        if (connection) {
            connection.release();
        }

    }
};

// ============================================================
// GET BUYER PAYMENTS
// GET /api/payments/buyer
// ============================================================

const getBuyerPayments = async (req, res) => {

    try {

        const buyerId = getUserId(req);

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const [rows] = await pool.execute(
            `
            SELECT
                p.id,
                p.buyer_id,
                p.deal_id,
                p.transaction_id,
                p.payment_method,
                p.amount,
                p.status,
                p.payment_date,

                d.quantity,
                d.agreed_price,

                c.crop_name,
                c.crop_variety

            FROM payments p

            LEFT JOIN deals d
                ON d.id = p.deal_id

            LEFT JOIN crops c
                ON c.id = d.crop_id

            WHERE p.buyer_id = ?

            ORDER BY p.payment_date DESC
            `,
            [buyerId]
        );

        return res.status(200).json({
            success: true,
            payments: rows
        });

    } catch (error) {

        console.error(
            "GET BUYER PAYMENTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payments",
            error: error.message
        });
    }
};

// ============================================================
// GET SINGLE PAYMENT
// GET /api/payments/:id
// ============================================================

const getPaymentById = async (req, res) => {

    try {

        const buyerId = getUserId(req);
        const paymentId = Number(req.params.id);

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID"
            });
        }

        const [rows] = await pool.execute(
            `
            SELECT
                p.*,
                d.quantity,
                d.agreed_price,
                d.status AS deal_status,
                c.crop_name,
                c.crop_variety

            FROM payments p

            LEFT JOIN deals d
                ON d.id = p.deal_id

            LEFT JOIN crops c
                ON c.id = d.crop_id

            WHERE p.id = ?
              AND p.buyer_id = ?

            LIMIT 1
            `,
            [
                paymentId,
                buyerId
            ]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            payment: rows[0]
        });

    } catch (error) {

        console.error(
            "GET PAYMENT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payment",
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    getBuyerPayments,
    getPaymentById
};