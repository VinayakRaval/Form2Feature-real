const { pool } = require("../config/db");

// ==========================================
// GET MARKET PRICES
// ==========================================

const getMarketPrices = async (req, res) => {

    try {

        const {
            crop_name,
            district,
            state
        } = req.query;

        let query = `
            SELECT
                mp.id,
                mp.mandi_id,
                mp.crop_name,

                m.name AS mandi_name,
                m.address,
                m.district,
                m.state,
                m.latitude,
                m.longitude,
                m.contact_number,

                mp.min_price,
                mp.max_price,
                mp.modal_price,
                mp.price_unit,
                mp.price_date,
                mp.created_at

            FROM market_prices mp

            INNER JOIN mandis m
                ON mp.mandi_id = m.id

            WHERE 1 = 1
        `;

        const values = [];

        // ==========================================
        // CROP FILTER
        // ==========================================

        if (crop_name) {

            query += `
                AND LOWER(mp.crop_name)
                LIKE LOWER(?)
            `;

            values.push(`%${crop_name}%`);
        }

        // ==========================================
        // DISTRICT FILTER
        // ==========================================

        if (district) {

            query += `
                AND m.district = ?
            `;

            values.push(district);
        }

        // ==========================================
        // STATE FILTER
        // ==========================================

        if (state) {

            query += `
                AND m.state = ?
            `;

            values.push(state);
        }

        // ==========================================
        // SORT
        // ==========================================

        query += `
            ORDER BY
                mp.price_date DESC,
                mp.modal_price DESC
        `;

        const [rows] =
            await pool.execute(
                query,
                values
            );

        res.json({

            success: true,

            count: rows.length,

            prices: rows

        });

    } catch (error) {

        console.error(
            "Get Market Prices Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch market prices"

        });
    }
};


// ==========================================
// GET BEST MARKET PRICE
// ==========================================

const getBestMarketPrice = async (
    req,
    res
) => {

    try {

        const {
            crop_name
        } = req.query;


        if (!crop_name) {

            return res.status(400).json({

                success: false,

                message:
                    "Crop name is required"

            });
        }


        const [rows] =
            await pool.execute(
                `
                SELECT
                    mp.id,
                    mp.mandi_id,
                    mp.crop_name,

                    m.name AS mandi_name,
                    m.address,
                    m.district,
                    m.state,
                    m.latitude,
                    m.longitude,

                    mp.min_price,
                    mp.max_price,
                    mp.modal_price,
                    mp.price_unit,
                    mp.price_date

                FROM market_prices mp

                INNER JOIN mandis m
                    ON mp.mandi_id = m.id

                WHERE LOWER(mp.crop_name)
                    LIKE LOWER(?)

                ORDER BY
                    mp.modal_price DESC

                LIMIT 1
                `,
                [`%${crop_name}%`]
            );


        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "No market price found"

            });
        }


        res.json({

            success: true,

            best_price:
                rows[0]

        });

    } catch (error) {

        console.error(
            "Best Market Price Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to find best market price"

        });
    }
};


module.exports = {
    getMarketPrices,
    getBestMarketPrice
};