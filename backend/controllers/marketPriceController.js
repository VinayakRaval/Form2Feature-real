const { pool } =
    require("../config/db");

const {
    getGovernmentMarketPrices
} =
    require("../services/governmentMarketPriceService");


// ============================================================
// NORMALIZE
// ============================================================

function normalize(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


// ============================================================
// GET MYSQL PRICES
// ============================================================

async function getLocalPrices({
    crop = "",
    state = "",
    district = ""
}) {

    let sql = `
        SELECT
            id,
            mandi_id,
            crop_name,
            variety,
            grade,
            market,
            district,
            state,
            min_price,
            max_price,
            modal_price,
            price_unit,
            price_date
        FROM market_prices
        WHERE 1 = 1
    `;


    const params = [];


    // ========================================================
    // CROP
    // ========================================================

    if (crop) {

        sql += `
            AND LOWER(crop_name) LIKE ?
        `;

        params.push(
            `%${normalize(crop)}%`
        );

    }


    // ========================================================
    // STATE
    // ========================================================

    if (state) {

        sql += `
            AND LOWER(state) LIKE ?
        `;

        params.push(
            `%${normalize(state)}%`
        );

    }


    // ========================================================
    // DISTRICT
    // ========================================================

    if (district) {

        sql += `
            AND LOWER(district) LIKE ?
        `;

        params.push(
            `%${normalize(district)}%`
        );

    }


    sql += `
        ORDER BY price_date DESC, modal_price DESC
    `;


    const [rows] =
        await pool.execute(
            sql,
            params
        );


    return rows.map(row => ({

        id:
            `mysql-${row.id}`,

        mandi_id:
            row.mandi_id !== null
                ? String(row.mandi_id)
                : null,

        mandi_name:
            row.market ||
            "Local Market",

        market:
            row.market ||
            "Local Market",

        crop_name:
            row.crop_name,

        variety:
            row.variety ||
            "",

        grade:
            row.grade ||
            "",

        district:
            row.district ||
            "",

        state:
            row.state ||
            "",

        min_price:
            Number(
                row.min_price || 0
            ),

        max_price:
            Number(
                row.max_price || 0
            ),

        modal_price:
            Number(
                row.modal_price || 0
            ),

        price_unit:
            row.price_unit ||
            "quintal",

        price_date:
            row.price_date ||
            null,

        source:
            "Form2Feature Database"

    }));

}


// ============================================================
// GET COMBINED MARKET PRICES
// ============================================================

const getMarketPrices = async (
    req,
    res
) => {

    try {

        const crop =
            String(
                req.query.crop || ""
            ).trim();


        const state =
            String(
                req.query.state ||
                "Karnataka"
            ).trim();


        const district =
            String(
                req.query.district || ""
            ).trim();


        const limit =
            Number(
                req.query.limit || 100
            );


        console.log("");
        console.log(
            "========================================"
        );

        console.log(
            "COMBINED MARKET PRICE SEARCH"
        );

        console.log(
            "Crop:",
            crop || "ALL"
        );

        console.log(
            "State:",
            state || "ALL"
        );

        console.log(
            "District:",
            district || "ALL"
        );


        // ====================================================
        // MYSQL
        // ====================================================

        let mysqlPrices = [];


        try {

            mysqlPrices =
                await getLocalPrices({
                    crop,
                    state,
                    district
                });

        } catch (error) {

            console.error(
                "MYSQL MARKET PRICE ERROR:",
                error.message
            );

        }


        // ====================================================
        // GOVERNMENT
        // ====================================================

        let governmentPrices = [];


        try {

            governmentPrices =
                await getGovernmentMarketPrices({
                    crop,
                    state,
                    district,
                    limit
                });

        } catch (error) {

            console.error(
                "GOVERNMENT PRICE ERROR:",
                error.message
            );

        }


        // ====================================================
        // COMBINE
        // ====================================================

        const combined = [

            ...mysqlPrices,

            ...governmentPrices

        ];


        // ====================================================
        // REMOVE DUPLICATES
        // ====================================================

        const unique = [];

        const seen =
            new Set();


        for (const price of combined) {

            const key = [

                normalize(
                    price.crop_name
                ),

                normalize(
                    price.mandi_name
                ),

                normalize(
                    price.district
                ),

                normalize(
                    price.state
                ),

                price.price_date,

                Number(
                    price.modal_price || 0
                )

            ].join("|");


            if (
                !seen.has(key)
            ) {

                seen.add(key);

                unique.push(price);

            }

        }


        // ====================================================
        // SORT
        // Highest modal price first
        // ====================================================

        unique.sort(
            (a, b) => {

                return (
                    Number(
                        b.modal_price || 0
                    ) -
                    Number(
                        a.modal_price || 0
                    )
                );

            }
        );


        // ====================================================
        // BEST PRICE
        // ====================================================

        const bestPrice =
            unique.length > 0
                ? unique[0]
                : null;


        console.log(
            "MySQL:",
            mysqlPrices.length
        );

        console.log(
            "Government:",
            governmentPrices.length
        );

        console.log(
            "Combined:",
            unique.length
        );


        console.log(
            "========================================"
        );


        return res.json({

            success:
                true,

            search: {

                crop,

                state,

                district

            },

            mysql_count:
                mysqlPrices.length,

            government_count:
                governmentPrices.length,

            count:
                unique.length,

            best_price:
                bestPrice,

            prices:
                unique

        });


    } catch (error) {

        console.error(
            "MARKET PRICE ERROR:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to fetch market prices",

            error:
                error.message

        });

    }

};


// ============================================================
// MYSQL ONLY
// ============================================================

const getLocalMarketPrices = async (
    req,
    res
) => {

    try {

        const prices =
            await getLocalPrices({

                crop:
                    req.query.crop || "",

                state:
                    req.query.state || "",

                district:
                    req.query.district || ""

            });


        return res.json({

            success:
                true,

            source:
                "Form2Feature Database",

            count:
                prices.length,

            prices

        });


    } catch (error) {

        console.error(
            "LOCAL PRICE ERROR:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to fetch local market prices",

            error:
                error.message

        });

    }

};


// ============================================================
// GOVERNMENT ONLY
// ============================================================

const getGovernmentPrices = async (
    req,
    res
) => {

    try {

        const prices =
            await getGovernmentMarketPrices({

                crop:
                    req.query.crop || "",

                state:
                    req.query.state || "Karnataka",

                district:
                    req.query.district || "",

                limit:
                    req.query.limit || 100

            });


        return res.json({

            success:
                true,

            source:
                "Data.gov.in",

            count:
                prices.length,

            prices

        });


    } catch (error) {

        console.error(
            "GOVERNMENT PRICE ERROR:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to fetch government market prices",

            error:
                error.message

        });

    }

};


module.exports = {

    getMarketPrices,

    getLocalMarketPrices,

    getGovernmentPrices

};