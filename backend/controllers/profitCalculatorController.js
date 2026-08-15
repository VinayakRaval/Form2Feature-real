const { pool } = require("../config/db");

// ============================================================
// SAVE PROFIT CALCULATION
// POST /api/profit-calculator
// ============================================================

const saveProfitCalculation = async (req, res) => {
    try {
        console.log("=================================");
        console.log("SAVE PROFIT CALCULATION");
        console.log("=================================");

        const farmerId = req.user?.id;

        console.log("Farmer ID:", farmerId);

        if (!farmerId) {
            return res.status(401).json({
                success: false,
                message: "Farmer authentication required"
            });
        }

        const {
            crop,
            quantity,
            selling_price,
            production_cost,
            transport_cost,
            other_expenses
        } = req.body;

        // ========================================================
        // VALIDATION
        // ========================================================

        if (!crop || String(crop).trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Crop is required"
            });
        }

        const quantityValue = Number(quantity);
        const sellingPriceValue = Number(selling_price);
        const productionCostValue = Number(production_cost);
        const transportCostValue = Number(transport_cost);
        const otherExpensesValue = Number(other_expenses);

        if (
            !Number.isFinite(quantityValue) ||
            quantityValue <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required"
            });
        }

        if (
            !Number.isFinite(sellingPriceValue) ||
            sellingPriceValue < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid selling price is required"
            });
        }

        if (
            !Number.isFinite(productionCostValue) ||
            productionCostValue < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid production cost is required"
            });
        }

        if (
            !Number.isFinite(transportCostValue) ||
            transportCostValue < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid transport cost is required"
            });
        }

        if (
            !Number.isFinite(otherExpensesValue) ||
            otherExpensesValue < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid other expenses are required"
            });
        }

        // ========================================================
        // CALCULATE
        // ========================================================

        const expectedRevenue =
            quantityValue * sellingPriceValue;

        const totalExpense =
            productionCostValue +
            transportCostValue +
            otherExpensesValue;

        const expectedProfit =
            expectedRevenue - totalExpense;

        const profitPercentage =
            totalExpense > 0
                ? (expectedProfit / totalExpense) * 100
                : 0;

        // ========================================================
        // INSERT
        // ========================================================

        const [result] = await pool.execute(
            `
            INSERT INTO profit_calculations
            (
                farmer_id,
                crop,
                quantity,
                selling_price,
                production_cost,
                transport_cost,
                other_expenses,
                expected_revenue,
                total_expense,
                expected_profit,
                profit_percentage
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                farmerId,
                String(crop).trim(),
                quantityValue,
                sellingPriceValue,
                productionCostValue,
                transportCostValue,
                otherExpensesValue,
                expectedRevenue,
                totalExpense,
                expectedProfit,
                profitPercentage
            ]
        );

        console.log(
            "Saved calculation ID:",
            result.insertId
        );

        return res.status(201).json({
            success: true,
            message: "Profit calculation saved successfully",

            calculation: {
                id: result.insertId,
                farmer_id: farmerId,
                crop: String(crop).trim(),
                quantity: quantityValue,
                selling_price: sellingPriceValue,
                production_cost: productionCostValue,
                transport_cost: transportCostValue,
                other_expenses: otherExpensesValue,
                expected_revenue: expectedRevenue,
                total_expense: totalExpense,
                expected_profit: expectedProfit,
                profit_percentage: profitPercentage
            }
        });

    } catch (error) {
        console.error(
            "SAVE PROFIT CALCULATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to save profit calculation",
            error: error.message
        });
    }
};


// ============================================================
// GET SAVED PROFIT CALCULATIONS
// GET /api/profit-calculator
// ============================================================

const getProfitCalculations = async (req, res) => {
    try {
        console.log("=================================");
        console.log("GET PROFIT CALCULATIONS");
        console.log("=================================");

        const farmerId = req.user?.id;

        console.log("Farmer ID:", farmerId);

        if (!farmerId) {
            return res.status(401).json({
                success: false,
                message: "Farmer authentication required"
            });
        }

        const [rows] = await pool.execute(
            `
            SELECT
                id,
                farmer_id,
                crop,
                quantity,
                selling_price,
                production_cost,
                transport_cost,
                other_expenses,
                expected_revenue,
                total_expense,
                expected_profit,
                profit_percentage,
                created_at
            FROM profit_calculations
            WHERE farmer_id = ?
            ORDER BY id DESC
            `,
            [farmerId]
        );

        console.log(
            "Saved calculations:",
            rows.length
        );

        return res.json({
            success: true,
            count: rows.length,
            calculations: rows
        });

    } catch (error) {
        console.error(
            "GET PROFIT CALCULATIONS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch profit calculations",
            error: error.message
        });
    }
};


// ============================================================
// DELETE PROFIT CALCULATION
// DELETE /api/profit-calculator/:id
// ============================================================

const deleteProfitCalculation = async (req, res) => {
    try {
        const farmerId = req.user?.id;

        const calculationId =
            Number(req.params.id);

        if (!farmerId) {
            return res.status(401).json({
                success: false,
                message: "Farmer authentication required"
            });
        }

        if (!Number.isInteger(calculationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid calculation ID"
            });
        }

        const [result] = await pool.execute(
            `
            DELETE FROM profit_calculations
            WHERE id = ?
            AND farmer_id = ?
            `,
            [
                calculationId,
                farmerId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Calculation not found"
            });
        }

        return res.json({
            success: true,
            message: "Profit calculation deleted successfully"
        });

    } catch (error) {
        console.error(
            "DELETE PROFIT CALCULATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to delete calculation",
            error: error.message
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    saveProfitCalculation,
    getProfitCalculations,
    deleteProfitCalculation
};