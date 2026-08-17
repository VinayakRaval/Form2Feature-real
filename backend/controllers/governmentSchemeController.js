const { pool } = require("../config/db");

// ============================================================
// GET GOVERNMENT SCHEMES
// GET /api/government-schemes
// ============================================================

const getGovernmentSchemes = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `
            SELECT
                id,
                scheme_name,
                description,
                eligibility,
                benefits,
                official_link,
                created_at
            FROM government_schemes
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            success: true,
            count: rows.length,
            schemes: rows
        });

    } catch (error) {

        console.error(
            "GET GOVERNMENT SCHEMES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch government schemes",
            error: error.message
        });
    }
};


// ============================================================
// GET SINGLE GOVERNMENT SCHEME
// GET /api/government-schemes/:id
// ============================================================

const getGovernmentSchemeById = async (req, res) => {

    try {

        const schemeId =
            Number(req.params.id);

        if (!Number.isInteger(schemeId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid scheme ID"
            });

        }

        const [rows] =
            await pool.execute(
                `
                SELECT
                    id,
                    scheme_name,
                    description,
                    eligibility,
                    benefits,
                    official_link,
                    created_at
                FROM government_schemes
                WHERE id = ?
                LIMIT 1
                `,
                [schemeId]
            );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Government scheme not found"
            });

        }

        return res.status(200).json({
            success: true,
            scheme: rows[0]
        });

    } catch (error) {

        console.error(
            "GET GOVERNMENT SCHEME ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch government scheme",
            error: error.message
        });

    }
};


// ============================================================
// SEARCH GOVERNMENT SCHEMES
// GET /api/government-schemes/search?q=farmer
// ============================================================

const searchGovernmentSchemes = async (req, res) => {

    try {

        const search =
            String(
                req.query.q || ""
            ).trim();

        if (!search) {

            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });

        }

        const keyword =
            `%${search}%`;

        const [rows] =
            await pool.execute(
                `
                SELECT
                    id,
                    scheme_name,
                    description,
                    eligibility,
                    benefits,
                    official_link,
                    created_at
                FROM government_schemes
                WHERE
                    scheme_name LIKE ?
                    OR description LIKE ?
                    OR eligibility LIKE ?
                    OR benefits LIKE ?
                ORDER BY id DESC
                `,
                [
                    keyword,
                    keyword,
                    keyword,
                    keyword
                ]
            );

        return res.status(200).json({
            success: true,
            count: rows.length,
            schemes: rows
        });

    } catch (error) {

        console.error(
            "SEARCH GOVERNMENT SCHEMES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to search government schemes",
            error: error.message
        });

    }
};


module.exports = {
    getGovernmentSchemes,
    getGovernmentSchemeById,
    searchGovernmentSchemes
};