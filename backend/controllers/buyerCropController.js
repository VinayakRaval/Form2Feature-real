const { pool } = require("../config/db");

// ============================================================
// GET ALL AVAILABLE CROPS FOR BUYER
// GET /api/buyer/crops
// ============================================================

const getBuyerCrops = async (req, res) => {
    try {
        console.log("======================================");
        console.log("GET BUYER CROPS");
        console.log("User:", req.user);

        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ------------------------------------------------------
        // BUYER ROLE
        // ------------------------------------------------------

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access required"
            });
        }

        // ------------------------------------------------------
        // QUERY PARAMETERS
        // ------------------------------------------------------

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        const cropType =
            typeof req.query.crop_type === "string"
                ? req.query.crop_type.trim()
                : "";

        // ------------------------------------------------------
        // BASE QUERY
        // ------------------------------------------------------

        let sql = `
            SELECT
                c.id,
                c.farmer_id,

                c.crop_name,
                c.crop_variety,

                c.quantity,
                c.quantity_unit,

                c.quality,
                c.description,
                c.image,

                c.expected_price,
                c.harvest_date,
                c.status,

                c.created_at,
                c.updated_at,

                u.full_name AS farmer_name,
                u.email AS farmer_email,
                u.mobile AS farmer_mobile

            FROM crops c

            LEFT JOIN users u
                ON c.farmer_id = u.id

            WHERE c.status = 'available'
        `;

        const params = [];

        // ------------------------------------------------------
        // SEARCH
        // ------------------------------------------------------

        if (search) {
            sql += `
                AND (
                    c.crop_name LIKE ?
                    OR c.crop_variety LIKE ?
                    OR c.quality LIKE ?
                    OR c.description LIKE ?
                    OR u.full_name LIKE ?
                )
            `;

            const searchValue = `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        // ------------------------------------------------------
        // CROP TYPE FILTER
        // ------------------------------------------------------

        if (
            cropType &&
            cropType.toLowerCase() !== "all" &&
            cropType.toLowerCase() !== "all crops"
        ) {
            sql += `
                AND LOWER(c.crop_name) = LOWER(?)
            `;

            params.push(cropType);
        }

        // ------------------------------------------------------
        // ORDER
        // ------------------------------------------------------

        sql += `
            ORDER BY c.created_at DESC
        `;

        // ------------------------------------------------------
        // DATABASE QUERY
        // ------------------------------------------------------

        const [rows] = await pool.execute(sql, params);

        console.log("Crops found:", rows.length);
        console.log("======================================");

        return res.status(200).json({
            success: true,
            message: "Crops fetched successfully",
            count: rows.length,
            crops: rows
        });

    } catch (error) {
        console.error("GET BUYER CROPS ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching crops",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};


// ============================================================
// GET SINGLE CROP FOR BUYER
// GET /api/buyer/crops/:id
// ============================================================

const getBuyerCropById = async (req, res) => {
    try {
        console.log("======================================");
        console.log("GET BUYER CROP DETAILS");
        console.log("Crop ID:", req.params.id);
        console.log("User:", req.user);

        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ------------------------------------------------------
        // BUYER ROLE
        // ------------------------------------------------------

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access required"
            });
        }

        // ------------------------------------------------------
        // VALIDATE ID
        // ------------------------------------------------------

        const cropId = Number(req.params.id);

        if (!Number.isInteger(cropId) || cropId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid crop ID"
            });
        }

        // ------------------------------------------------------
        // GET CROP
        // ------------------------------------------------------

        const [rows] = await pool.execute(
            `
            SELECT
                c.id,
                c.farmer_id,

                c.crop_name,
                c.crop_variety,

                c.quantity,
                c.quantity_unit,

                c.quality,
                c.description,
                c.image,

                c.expected_price,
                c.harvest_date,
                c.status,

                c.created_at,
                c.updated_at,

                u.full_name AS farmer_name,
                u.email AS farmer_email,
                u.mobile AS farmer_mobile

            FROM crops c

            LEFT JOIN users u
                ON c.farmer_id = u.id

            WHERE c.id = ?
            AND c.status = 'available'

            LIMIT 1
            `,
            [cropId]
        );

        // ------------------------------------------------------
        // NOT FOUND
        // ------------------------------------------------------

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found or no longer available"
            });
        }

        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        console.log("Crop found:", rows[0]);
        console.log("======================================");

        return res.status(200).json({
            success: true,
            message: "Crop fetched successfully",
            crop: rows[0]
        });

    } catch (error) {
        console.error("GET BUYER CROP ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching crop",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getBuyerCrops,
    getBuyerCropById
};