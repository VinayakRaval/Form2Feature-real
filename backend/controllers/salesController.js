const { pool } = require("../config/db");

// ============================================================
// HELPER: NORMALIZE MANDI ID
// ============================================================

const normalizeMandiId = (mandi_id) => {

    if (
        mandi_id === undefined ||
        mandi_id === null ||
        mandi_id === "" ||
        mandi_id === "null" ||
        mandi_id === "undefined"
    ) {
        return null;
    }

    const mandiId = Number(mandi_id);

    if (
        !Number.isInteger(mandiId) ||
        mandiId <= 0
    ) {
        return null;
    }

    return mandiId;
};


// ============================================================
// HELPER: CHECK MANDI EXISTS
// ============================================================

const validateMandi = async (mandiId) => {

    // Mandi is optional
    if (mandiId === null) {
        return true;
    }

    const [rows] = await pool.execute(
        `
        SELECT id
        FROM mandis
        WHERE id = ?
        LIMIT 1
        `,
        [mandiId]
    );

    return rows.length > 0;
};


// ============================================================
// GET ALL SALES
// ============================================================

const getSales = async (req, res) => {

    try {

        const farmerId = req.user.id;

        console.log(
            "GET SALES:",
            farmerId
        );

        const [rows] = await pool.execute(
            `
            SELECT
                s.*,
                c.crop_name,
                m.name AS mandi_name
            FROM sales s

            LEFT JOIN crops c
                ON s.crop_id = c.id

            LEFT JOIN mandis m
                ON s.mandi_id = m.id

            WHERE s.farmer_id = ?

            ORDER BY
                s.sale_date DESC,
                s.id DESC
            `,
            [farmerId]
        );

        return res.json({

            success: true,

            sales: rows

        });

    } catch (error) {

        console.error(
            "GET SALES ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch sales",

            error:
                error.message

        });
    }
};


// ============================================================
// GET SALES SUMMARY
// ============================================================

const getSalesSummary = async (req, res) => {

    try {

        const farmerId = req.user.id;

        console.log(
            "GET SALES SUMMARY:",
            farmerId
        );

        const [rows] = await pool.execute(
            `
            SELECT

                COUNT(*) AS total_transactions,

                COALESCE(
                    SUM(quantity),
                    0
                ) AS total_quantity,

                COALESCE(
                    SUM(total_amount),
                    0
                ) AS total_revenue,

                COALESCE(
                    SUM(
                        CASE
                            WHEN payment_status = 'pending'
                            THEN total_amount

                            WHEN payment_status = 'partial'
                            THEN total_amount

                            ELSE 0
                        END
                    ),
                    0
                ) AS pending_amount,

                COALESCE(
                    SUM(
                        CASE
                            WHEN payment_status = 'paid'
                            THEN total_amount

                            ELSE 0
                        END
                    ),
                    0
                ) AS paid_amount

            FROM sales

            WHERE farmer_id = ?
            `,
            [farmerId]
        );

        const summary = rows[0] || {};

        return res.json({

            success: true,

            summary: {

                total_transactions:
                    Number(
                        summary.total_transactions || 0
                    ),

                total_quantity:
                    Number(
                        summary.total_quantity || 0
                    ),

                total_revenue:
                    Number(
                        summary.total_revenue || 0
                    ),

                pending_amount:
                    Number(
                        summary.pending_amount || 0
                    ),

                paid_amount:
                    Number(
                        summary.paid_amount || 0
                    )

            }

        });

    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "GET SALES SUMMARY ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================="
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch sales summary",

            error:
                error.message

        });
    }
};


// ============================================================
// GET SINGLE SALE
// ============================================================

const getSaleById = async (req, res) => {

    try {

        const saleId =
            Number(req.params.id);

        const farmerId =
            req.user.id;


        if (
            !Number.isInteger(saleId) ||
            saleId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid sale ID"

            });
        }


        const [rows] =
            await pool.execute(
                `
                SELECT

                    s.*,

                    c.crop_name,

                    m.name AS mandi_name

                FROM sales s

                LEFT JOIN crops c
                    ON s.crop_id = c.id

                LEFT JOIN mandis m
                    ON s.mandi_id = m.id

                WHERE
                    s.id = ?
                    AND s.farmer_id = ?

                LIMIT 1
                `,
                [
                    saleId,
                    farmerId
                ]
            );


        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Sale not found"

            });
        }


        return res.json({

            success: true,

            sale: rows[0]

        });

    } catch (error) {

        console.error(
            "GET SALE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch sale",

            error:
                error.message

        });
    }
};


// ============================================================
// ADD SALE
// ============================================================

const addSale = async (req, res) => {

    console.log(
        "================================="
    );

    console.log(
        "ADD SALE"
    );

    console.log(
        "Authenticated:",
        req.user?.id,
        req.user?.role
    );

    console.log(
        "REQUEST BODY:",
        req.body
    );

    console.log(
        "================================="
    );


    try {

        const farmerId =
            req.user?.id;


        // ====================================================
        // AUTHENTICATION
        // ====================================================

        if (!farmerId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required"

            });
        }


        const {

            crop_id,

            mandi_id,

            buyer_name,

            quantity,

            price_per_unit,

            total_amount,

            transportation_cost,

            other_cost,

            net_profit,

            sale_date,

            payment_status,

            notes

        } = req.body;


        // ====================================================
        // VALIDATE CROP ID
        // ====================================================

        const cropId =
            Number(crop_id);


        if (
            !Number.isInteger(cropId) ||
            cropId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid crop is required"

            });
        }


        // ====================================================
        // VALIDATE QUANTITY
        // ====================================================

        const quantityValue =
            Number(quantity);


        if (
            quantity === undefined ||
            quantity === null ||
            quantity === "" ||
            !Number.isFinite(quantityValue) ||
            quantityValue <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid quantity is required"

            });
        }


        // ====================================================
        // VALIDATE PRICE
        // ====================================================

        const priceValue =
            Number(price_per_unit);


        if (
            price_per_unit === undefined ||
            price_per_unit === null ||
            price_per_unit === "" ||
            !Number.isFinite(priceValue) ||
            priceValue <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Price per unit is required"

            });
        }


        // ====================================================
        // VALIDATE SALE DATE
        // ====================================================

        if (!sale_date) {

            return res.status(400).json({

                success: false,

                message:
                    "Sale date is required"

            });
        }


        // ====================================================
        // VERIFY CROP BELONGS TO FARMER
        // ====================================================

        const [cropRows] =
            await pool.execute(
                `
                SELECT id
                FROM crops
                WHERE
                    id = ?
                    AND farmer_id = ?
                LIMIT 1
                `,
                [
                    cropId,
                    farmerId
                ]
            );


        if (cropRows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Crop not found for this farmer"

            });
        }


        // ====================================================
        // NORMALIZE MANDI ID
        // ====================================================

        const mandiId =
            normalizeMandiId(mandi_id);


        console.log(
            "Normalized mandi ID:",
            mandiId
        );


        // ====================================================
        // VALIDATE MANDI
        // ====================================================

        if (mandiId !== null) {

            const mandiExists =
                await validateMandi(
                    mandiId
                );


            if (!mandiExists) {

                console.error(
                    "INVALID MANDI ID:",
                    mandiId
                );

                return res.status(400).json({

                    success: false,

                    message:
                        "Selected mandi does not exist. Please select a valid mandi or leave mandi empty."

                });
            }
        }


        // ====================================================
        // COSTS
        // ====================================================

        const transportationValue =
            Number(
                transportation_cost || 0
            );

        const otherCostValue =
            Number(
                other_cost || 0
            );


        if (
            !Number.isFinite(
                transportationValue
            ) ||
            transportationValue < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid transportation cost"

            });
        }


        if (
            !Number.isFinite(
                otherCostValue
            ) ||
            otherCostValue < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid other cost"

            });
        }


        // ====================================================
        // TOTAL AMOUNT
        // ====================================================

        const calculatedTotal =
            quantityValue *
            priceValue;


        const finalTotal =
            total_amount !== undefined &&
            total_amount !== null &&
            total_amount !== ""
                ? Number(total_amount)
                : calculatedTotal;


        if (
            !Number.isFinite(finalTotal) ||
            finalTotal < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid total amount"

            });
        }


        // ====================================================
        // NET PROFIT
        // ====================================================

        const calculatedNetProfit =
            finalTotal -
            transportationValue -
            otherCostValue;


        const finalNetProfit =
            net_profit !== undefined &&
            net_profit !== null &&
            net_profit !== ""
                ? Number(net_profit)
                : calculatedNetProfit;


        if (
            !Number.isFinite(
                finalNetProfit
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid net profit"

            });
        }


        // ====================================================
        // PAYMENT STATUS
        // ====================================================

        const allowedStatuses = [

            "pending",

            "paid",

            "partial"

        ];


        const finalPaymentStatus =
            allowedStatuses.includes(
                payment_status
            )
                ? payment_status
                : "pending";


        // ====================================================
        // INSERT SALE
        // ====================================================

        const [result] =
            await pool.execute(
                `
                INSERT INTO sales
                (
                    farmer_id,
                    crop_id,
                    mandi_id,
                    buyer_name,
                    quantity,
                    price_per_unit,
                    total_amount,
                    transportation_cost,
                    other_cost,
                    net_profit,
                    sale_date,
                    payment_status,
                    notes
                )

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,
                [

                    farmerId,

                    cropId,

                    // IMPORTANT:
                    // NULL if mandi not selected
                    mandiId,

                    buyer_name?.trim()
                        ? buyer_name.trim()
                        : null,

                    quantityValue,

                    priceValue,

                    finalTotal,

                    transportationValue,

                    otherCostValue,

                    finalNetProfit,

                    sale_date,

                    finalPaymentStatus,

                    notes?.trim()
                        ? notes.trim()
                        : null

                ]
            );


        console.log(
            "SALE CREATED:",
            result.insertId
        );


        // ====================================================
        // SUCCESS RESPONSE
        // ====================================================

        return res.status(201).json({

            success: true,

            message:
                "Sale recorded successfully",

            sale: {

                id:
                    result.insertId,

                farmer_id:
                    farmerId,

                crop_id:
                    cropId,

                mandi_id:
                    mandiId,

                buyer_name:
                    buyer_name?.trim()
                        ? buyer_name.trim()
                        : null,

                quantity:
                    quantityValue,

                price_per_unit:
                    priceValue,

                total_amount:
                    finalTotal,

                transportation_cost:
                    transportationValue,

                other_cost:
                    otherCostValue,

                net_profit:
                    finalNetProfit,

                sale_date:
                    sale_date,

                payment_status:
                    finalPaymentStatus,

                notes:
                    notes?.trim()
                        ? notes.trim()
                        : null

            }

        });

    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "ADD SALE ERROR"
        );

        console.error(
            "CODE:",
            error.code
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error(
            "SQL MESSAGE:",
            error.sqlMessage
        );

        console.error(
            "================================="
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to record sale",

            error:
                error.message

        });
    }
};


// ============================================================
// UPDATE SALE
// ============================================================

const updateSale = async (req, res) => {

    try {

        const saleId =
            Number(req.params.id);

        const farmerId =
            req.user.id;


        // ====================================================
        // VALIDATE SALE ID
        // ====================================================

        if (
            !Number.isInteger(saleId) ||
            saleId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid sale ID"

            });
        }


        const {

            crop_id,

            mandi_id,

            buyer_name,

            quantity,

            price_per_unit,

            total_amount,

            transportation_cost,

            other_cost,

            net_profit,

            sale_date,

            payment_status,

            notes

        } = req.body;


        // ====================================================
        // VALIDATE CROP
        // ====================================================

        const cropId =
            Number(crop_id);


        if (
            !Number.isInteger(cropId) ||
            cropId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid crop is required"

            });
        }


        // ====================================================
        // VALIDATE QUANTITY
        // ====================================================

        const quantityValue =
            Number(quantity);


        if (
            !Number.isFinite(quantityValue) ||
            quantityValue <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid quantity is required"

            });
        }


        // ====================================================
        // VALIDATE PRICE
        // ====================================================

        const priceValue =
            Number(price_per_unit);


        if (
            price_per_unit === undefined ||
            price_per_unit === null ||
            price_per_unit === "" ||
            !Number.isFinite(priceValue) ||
            priceValue <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Price per unit is required"

            });
        }


        // ====================================================
        // CHECK CROP
        // ====================================================

        const [cropRows] =
            await pool.execute(
                `
                SELECT id
                FROM crops
                WHERE
                    id = ?
                    AND farmer_id = ?
                LIMIT 1
                `,
                [
                    cropId,
                    farmerId
                ]
            );


        if (cropRows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Crop not found for this farmer"

            });
        }


        // ====================================================
        // MANDI
        // ====================================================

        const mandiId =
            normalizeMandiId(mandi_id);


        if (mandiId !== null) {

            const mandiExists =
                await validateMandi(
                    mandiId
                );


            if (!mandiExists) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Selected mandi does not exist. Please select a valid mandi or leave mandi empty."

                });
            }
        }


        // ====================================================
        // COSTS
        // ====================================================

        const transportationValue =
            Number(
                transportation_cost || 0
            );

        const otherCostValue =
            Number(
                other_cost || 0
            );


        // ====================================================
        // TOTAL
        // ====================================================

        const calculatedTotal =
            quantityValue *
            priceValue;


        const finalTotal =
            total_amount !== undefined &&
            total_amount !== null &&
            total_amount !== ""
                ? Number(total_amount)
                : calculatedTotal;


        // ====================================================
        // NET PROFIT
        // ====================================================

        const calculatedNetProfit =
            finalTotal -
            transportationValue -
            otherCostValue;


        const finalNetProfit =
            net_profit !== undefined &&
            net_profit !== null &&
            net_profit !== ""
                ? Number(net_profit)
                : calculatedNetProfit;


        // ====================================================
        // PAYMENT STATUS
        // ====================================================

        const allowedStatuses = [

            "pending",

            "paid",

            "partial"

        ];


        const finalPaymentStatus =
            allowedStatuses.includes(
                payment_status
            )
                ? payment_status
                : "pending";


        // ====================================================
        // UPDATE
        // ====================================================

        const [result] =
            await pool.execute(
                `
                UPDATE sales

                SET

                    crop_id = ?,

                    mandi_id = ?,

                    buyer_name = ?,

                    quantity = ?,

                    price_per_unit = ?,

                    total_amount = ?,

                    transportation_cost = ?,

                    other_cost = ?,

                    net_profit = ?,

                    sale_date = ?,

                    payment_status = ?,

                    notes = ?

                WHERE
                    id = ?
                    AND farmer_id = ?
                `,
                [

                    cropId,

                    mandiId,

                    buyer_name?.trim()
                        ? buyer_name.trim()
                        : null,

                    quantityValue,

                    priceValue,

                    finalTotal,

                    transportationValue,

                    otherCostValue,

                    finalNetProfit,

                    sale_date,

                    finalPaymentStatus,

                    notes?.trim()
                        ? notes.trim()
                        : null,

                    saleId,

                    farmerId

                ]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Sale not found"

            });
        }


        return res.json({

            success: true,

            message:
                "Sale updated successfully"

        });

    } catch (error) {

        console.error(
            "UPDATE SALE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update sale",

            error:
                error.message

        });
    }
};


// ============================================================
// DELETE SALE
// ============================================================

const deleteSale = async (req, res) => {

    try {

        const saleId =
            Number(req.params.id);

        const farmerId =
            req.user.id;


        // ====================================================
        // VALIDATE ID
        // ====================================================

        if (
            !Number.isInteger(saleId) ||
            saleId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid sale ID"

            });
        }


        // ====================================================
        // DELETE
        // ====================================================

        const [result] =
            await pool.execute(
                `
                DELETE FROM sales

                WHERE
                    id = ?
                    AND farmer_id = ?
                `,
                [
                    saleId,
                    farmerId
                ]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Sale not found"

            });
        }


        return res.json({

            success: true,

            message:
                "Sale deleted successfully"

        });

    } catch (error) {

        console.error(
            "DELETE SALE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to delete sale",

            error:
                error.message

        });
    }
};


// ============================================================
// EXPORT ALL CONTROLLERS
// ============================================================

module.exports = {

    getSales,

    getSalesSummary,

    getSaleById,

    addSale,

    updateSale,

    deleteSale

};