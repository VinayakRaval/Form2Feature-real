const { pool } = require("../config/db");

// =========================================
// GET FARMER CROPS
// =========================================

const getMyCrops = async (req, res) => {
    try {
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
                c.updated_at
            FROM crops c
            INNER JOIN farmers f
                ON c.farmer_id = f.id
            WHERE f.user_id = ?
            ORDER BY c.created_at DESC
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            crops: rows
        });

    } catch (error) {
        console.error("Get Crops Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch crops",
            error: error.message
        });
    }
};


// =========================================
// ADD CROP
// =========================================

const addCrop = async (req, res) => {
    try {
        // =====================================
        // DEBUG LOGS
        // =====================================
        console.log("========== CROP UPLOAD DEBUG ==========");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        console.log("========================================");

        const {
            crop_name,
            crop_variety,
            quantity,
            quantity_unit,
            quality,
            description,
            expected_price,
            harvest_date
        } = req.body;


        // =====================================
        // VALIDATION
        // =====================================

        if (!crop_name || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Crop name and quantity are required"
            });
        }


        // =====================================
        // GET FARMER ID
        // =====================================

        const [farmer] = await pool.execute(
            `
            SELECT id
            FROM farmers
            WHERE user_id = ?
            `,
            [req.user.id]
        );


        if (farmer.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Farmer profile not found"
            });
        }


        const farmerId = farmer[0].id;


        // =====================================
        // IMAGE
        // =====================================

        const image = req.file
            ? `/uploads/crops/${req.file.filename}`
            : null;


        // =====================================
        // INSERT CROP
        // =====================================

        const [result] = await pool.execute(
            `
            INSERT INTO crops
            (
                farmer_id,
                crop_name,
                crop_variety,
                quantity,
                quantity_unit,
                quality,
                description,
                image,
                expected_price,
                harvest_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                farmerId,
                crop_name,
                crop_variety || null,
                quantity,
                quantity_unit || "kg",
                quality || null,
                description || null,
                image,
                expected_price || null,
                harvest_date || null
            ]
        );


        res.status(201).json({
            success: true,
            message: "Crop added successfully",
            cropId: result.insertId
        });


    } catch (error) {
        console.error("Add Crop Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add crop",
            error: error.message
        });
    }
};


// =========================================
// DELETE CROP
// =========================================

const deleteCrop = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            `
            DELETE c
            FROM crops c
            INNER JOIN farmers f
                ON c.farmer_id = f.id
            WHERE c.id = ?
            AND f.user_id = ?
            `,
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        res.json({
            success: true,
            message: "Crop deleted successfully"
        });

    } catch (error) {
        console.error("Delete Crop Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete crop",
            error: error.message
        });
    }
};


// =========================================
// UPDATE CROP
// =========================================

const updateCrop = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            crop_name,
            crop_variety,
            quantity,
            quantity_unit,
            quality,
            description,
            expected_price,
            harvest_date,
            status
        } = req.body;


        // =====================================
        // VALIDATION
        // =====================================

        if (!crop_name || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Crop name and quantity are required"
            });
        }


        // =====================================
        // UPDATE WITH IMAGE
        // =====================================

        if (req.file) {
            const image = `/uploads/crops/${req.file.filename}`;

            const [result] = await pool.execute(
                `
                UPDATE crops c
                INNER JOIN farmers f
                    ON c.farmer_id = f.id
                SET
                    c.crop_name = ?,
                    c.crop_variety = ?,
                    c.quantity = ?,
                    c.quantity_unit = ?,
                    c.quality = ?,
                    c.description = ?,
                    c.image = ?,
                    c.expected_price = ?,
                    c.harvest_date = ?,
                    c.status = ?
                WHERE c.id = ?
                AND f.user_id = ?
                `,
                [
                    crop_name,
                    crop_variety || null,
                    quantity,
                    quantity_unit || "kg",
                    quality || null,
                    description || null,
                    image,
                    expected_price || null,
                    harvest_date || null,
                    status || "available",
                    id,
                    req.user.id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Crop not found"
                });
            }

            return res.json({
                success: true,
                message: "Crop updated successfully"
            });
        }


        // =====================================
        // UPDATE WITHOUT IMAGE
        // =====================================

        const [result] = await pool.execute(
            `
            UPDATE crops c
            INNER JOIN farmers f
                ON c.farmer_id = f.id
            SET
                c.crop_name = ?,
                c.crop_variety = ?,
                c.quantity = ?,
                c.quantity_unit = ?,
                c.quality = ?,
                c.description = ?,
                c.expected_price = ?,
                c.harvest_date = ?,
                c.status = ?
            WHERE c.id = ?
            AND f.user_id = ?
            `,
            [
                crop_name,
                crop_variety || null,
                quantity,
                quantity_unit || "kg",
                quality || null,
                description || null,
                expected_price || null,
                harvest_date || null,
                status || "available",
                id,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        res.json({
            success: true,
            message: "Crop updated successfully"
        });

    } catch (error) {
        console.error("Update Crop Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update crop",
            error: error.message
        });
    }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
    getMyCrops,
    addCrop,
    updateCrop,
    deleteCrop
};