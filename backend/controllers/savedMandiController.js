const { pool } = require("../config/db");

// ============================================================
// GET FARMER ID FROM JWT
// ============================================================

function getFarmerId(req) {
    return (
        req.user?.id ||
        req.user?.user_id ||
        req.user?.userId ||
        req.user?.farmer_id
    );
}


// ============================================================
// SAVE MANDI
// POST /api/saved-mandis
// ============================================================

const saveMandi = async (req, res) => {

    try {

        const farmerId = getFarmerId(req);

        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        if (!farmerId) {

            return res.status(401).json({
                success: false,
                message: "Farmer authentication required"
            });
        }


        // ------------------------------------------------------
        // GET DATA FROM FRONTEND
        // ------------------------------------------------------

        const {
            id,
            mandi_id,
            name,
            mandi_name,
            address,
            district,
            state,
            pincode,
            contact_number,
            website,
            opening_hours,
            latitude,
            longitude,
            distance_km,
            source
        } = req.body;


        // ------------------------------------------------------
        // MANDI ID
        // Supports:
        //
        // mysql-1
        // mysql-25
        // osm-node-123456
        // osm-way-123456
        // ------------------------------------------------------

        const finalMandiId = String(
            mandi_id ||
            id ||
            ""
        ).trim();


        if (!finalMandiId) {

            return res.status(400).json({
                success: false,
                message: "Mandi ID is required"
            });
        }


        // ------------------------------------------------------
        // MANDI NAME
        // ------------------------------------------------------

        const finalMandiName = String(
            mandi_name ||
            name ||
            "Agricultural Market"
        ).trim();


        // ------------------------------------------------------
        // CHECK WHETHER ALREADY SAVED
        //
        // IMPORTANT:
        // Your table uses farmer_id, NOT user_id.
        // ------------------------------------------------------

        const [existing] = await pool.execute(
            `
            SELECT
                id,
                farmer_id,
                mandi_id,
                name,
                source
            FROM saved_mandis
            WHERE farmer_id = ?
            AND mandi_id = ?
            LIMIT 1
            `,
            [
                farmerId,
                finalMandiId
            ]
        );


        if (existing.length > 0) {

            return res.status(409).json({

                success: false,

                already_saved: true,

                message:
                    "Mandi is already saved",

                saved:
                    existing[0]

            });
        }


        // ------------------------------------------------------
        // NORMALIZE COORDINATES
        // ------------------------------------------------------

        let finalLatitude = null;
        let finalLongitude = null;
        let finalDistance = null;


        if (
            latitude !== undefined &&
            latitude !== null &&
            latitude !== ""
        ) {

            const value =
                Number(latitude);

            if (Number.isFinite(value)) {
                finalLatitude = value;
            }
        }


        if (
            longitude !== undefined &&
            longitude !== null &&
            longitude !== ""
        ) {

            const value =
                Number(longitude);

            if (Number.isFinite(value)) {
                finalLongitude = value;
            }
        }


        if (
            distance_km !== undefined &&
            distance_km !== null &&
            distance_km !== ""
        ) {

            const value =
                Number(distance_km);

            if (Number.isFinite(value)) {
                finalDistance = value;
            }
        }


        // ------------------------------------------------------
        // INSERT
        //
        // THESE ARE THE REAL COLUMNS FROM YOUR TABLE
        // ------------------------------------------------------

        const [result] = await pool.execute(
            `
            INSERT INTO saved_mandis
            (
                farmer_id,
                mandi_id,
                name,
                address,
                district,
                state,
                pincode,
                contact_number,
                website,
                opening_hours,
                latitude,
                longitude,
                distance_km,
                source
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [

                farmerId,

                finalMandiId,

                finalMandiName,

                address ||
                    null,

                district ||
                    null,

                state ||
                    null,

                pincode ||
                    null,

                contact_number ||
                    null,

                website ||
                    null,

                opening_hours ||
                    null,

                finalLatitude,

                finalLongitude,

                finalDistance,

                source ||
                    "Form2Feature Database"
            ]
        );


        // ------------------------------------------------------
        // GET INSERTED RECORD
        // ------------------------------------------------------

        const [rows] = await pool.execute(
            `
            SELECT
                id,
                farmer_id,
                mandi_id,
                name,
                address,
                district,
                state,
                pincode,
                contact_number,
                website,
                opening_hours,
                latitude,
                longitude,
                distance_km,
                source,
                created_at
            FROM saved_mandis
            WHERE id = ?
            LIMIT 1
            `,
            [
                result.insertId
            ]
        );


        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Mandi saved successfully",

            saved:
                rows[0]

        });

    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "SAVE MANDI ERROR"
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
                "Unable to save mandi",

            error:
                error.message

        });
    }
};


// ============================================================
// GET SAVED MANDIS
// GET /api/saved-mandis
// ============================================================

const getSavedMandis = async (
    req,
    res
) => {

    try {

        const farmerId =
            getFarmerId(req);


        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        if (!farmerId) {

            return res.status(401).json({

                success: false,

                message:
                    "Farmer authentication required"

            });
        }


        // ------------------------------------------------------
        // GET SAVED MANDIS
        // ------------------------------------------------------

        const [rows] =
            await pool.execute(
                `
                SELECT
                    id,
                    farmer_id,
                    mandi_id,
                    name,
                    address,
                    district,
                    state,
                    pincode,
                    contact_number,
                    website,
                    opening_hours,
                    latitude,
                    longitude,
                    distance_km,
                    source,
                    created_at
                FROM saved_mandis
                WHERE farmer_id = ?
                ORDER BY created_at DESC
                `,
                [
                    farmerId
                ]
            );


        // ------------------------------------------------------
        // FORMAT RESPONSE
        // ------------------------------------------------------

        const mandis =
            rows.map(
                mandi => {

                    const latitude =
                        mandi.latitude !== null
                            ? Number(
                                mandi.latitude
                            )
                            : null;


                    const longitude =
                        mandi.longitude !== null
                            ? Number(
                                mandi.longitude
                            )
                            : null;


                    return {

                        id:
                            String(
                                mandi.id
                            ),

                        mandi_id:
                            String(
                                mandi.mandi_id
                            ),

                        name:
                            mandi.name,

                        mandi_name:
                            mandi.name,

                        address:
                            mandi.address ||
                            "Address unavailable",

                        district:
                            mandi.district ||
                            "",

                        state:
                            mandi.state ||
                            "",

                        pincode:
                            mandi.pincode ||
                            "",

                        contact_number:
                            mandi.contact_number ||
                            null,

                        website:
                            mandi.website ||
                            null,

                        opening_hours:
                            mandi.opening_hours ||
                            null,

                        latitude,

                        longitude,

                        distance_km:
                            mandi.distance_km !== null
                                ? Number(
                                    mandi.distance_km
                                )
                                : null,

                        google_maps:
                            latitude !== null &&
                            longitude !== null
                                ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
                                : null,

                        source:
                            mandi.source ||
                            "Form2Feature Database",

                        created_at:
                            mandi.created_at

                    };

                }
            );


        // ------------------------------------------------------
        // RESPONSE
        // ------------------------------------------------------

        return res.json({

            success: true,

            count:
                mandis.length,

            mandis

        });

    } catch (error) {

        console.error(
            "GET SAVED MANDIS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch saved mandis",

            error:
                error.message

        });
    }
};


// ============================================================
// DELETE SAVED MANDI
// DELETE /api/saved-mandis/:mandiId
// ============================================================

const removeSavedMandi = async (
    req,
    res
) => {

    try {

        const farmerId =
            getFarmerId(req);


        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        if (!farmerId) {

            return res.status(401).json({

                success: false,

                message:
                    "Farmer authentication required"

            });
        }


        // ------------------------------------------------------
        // MANDI ID
        // ------------------------------------------------------

        const mandiId =
            decodeURIComponent(
                String(
                    req.params.mandiId ||
                    ""
                ).trim()
            );


        if (!mandiId) {

            return res.status(400).json({

                success: false,

                message:
                    "Mandi ID is required"

            });
        }


        // ------------------------------------------------------
        // DELETE
        //
        // IMPORTANT:
        // farmer_id, NOT user_id
        // ------------------------------------------------------

        const [result] =
            await pool.execute(
                `
                DELETE FROM saved_mandis
                WHERE farmer_id = ?
                AND mandi_id = ?
                `,
                [
                    farmerId,
                    mandiId
                ]
            );


        // ------------------------------------------------------
        // NOT FOUND
        // ------------------------------------------------------

        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Saved mandi not found"

            });
        }


        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        return res.json({

            success: true,

            message:
                "Mandi removed successfully"

        });

    } catch (error) {

        console.error(
            "REMOVE SAVED MANDI ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to remove saved mandi",

            error:
                error.message

        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    saveMandi,

    getSavedMandis,

    removeSavedMandi

};