const { pool } = require("../config/db");

// ==========================================
// DISTANCE CALCULATION
// ==========================================

const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {

    const R = 6371; // Earth radius in KM

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +

        Math.cos(
            lat1 * Math.PI / 180
        ) *

        Math.cos(
            lat2 * Math.PI / 180
        ) *

        Math.sin(dLon / 2) ** 2;

    const c =
        2 *

        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
};


// ==========================================
// GET ALL MYSQL MANDIS
// ==========================================

const getMandis = async (req, res) => {

    try {

        const [rows] =
            await pool.execute(`
                SELECT
                    id,
                    name,
                    address,
                    district,
                    state,
                    latitude,
                    longitude,
                    contact_number,
                    created_at

                FROM mandis

                ORDER BY name ASC
            `);


        return res.json({

            success: true,

            mandis: rows

        });


    } catch (error) {

        console.error(
            "MYSQL MANDI ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch mandis"

        });

    }

};


// ==========================================
// GET REAL NEARBY MANDIS
// OPENSTREETMAP / OVERPASS
// ==========================================

const getNearbyMandis = async (req, res) => {

    try {

        // ==================================
        // GET PARAMETERS
        // ==================================

        const {
            latitude,
            longitude,
            radius = 50
        } = req.query;


        // ==================================
        // CONVERT VALUES
        // ==================================

        const lat =
            Number(latitude);

        const lon =
            Number(longitude);

        const radiusKm =
            Number(radius);


        // ==================================
        // VALIDATE
        // ==================================

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            !Number.isFinite(radiusKm)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid GPS coordinates or radius"

            });

        }


        if (
            lat < -90 ||
            lat > 90
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid latitude"

            });

        }


        if (
            lon < -180 ||
            lon > 180
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid longitude"

            });

        }


        if (
            radiusKm <= 0 ||
            radiusKm > 200
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Radius must be between 1 and 200 km"

            });

        }


        // ==================================
        // LOG SEARCH
        // ==================================

        console.log("");

        console.log(
            "================================="
        );

        console.log(
            "REAL MANDI SEARCH"
        );

        console.log(
            "Latitude :",
            lat
        );

        console.log(
            "Longitude:",
            lon
        );

        console.log(
            "Radius   :",
            radiusKm,
            "km"
        );

        console.log(
            "================================="
        );


        // ==================================
        // CONVERT KM TO METERS
        // ==================================

        const radiusMeters =
            radiusKm * 1000;


        // ==================================
        // OVERPASS QUERY
        // ==================================

        const query = `
[out:json][timeout:180];

(
    nwr[
        "amenity"="marketplace"
    ](
        around:${radiusMeters},
        ${lat},
        ${lon}
    );

    nwr[
        "name"~"mandi|apmc|market yard|agricultural market|agriculture market|agri market",
        i
    ](
        around:${radiusMeters},
        ${lat},
        ${lon}
    );
);

out center tags;
`;


        // ==================================
        // OVERPASS API
        // ==================================

        const apiUrl =
            "https://overpass-api.de/api/interpreter";


        console.log(
            "Calling Overpass..."
        );


        const response =
            await fetch(
                apiUrl,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded",

                        "User-Agent":
                            "Form2Feature/1.0"

                    },

                    body:
                        "data=" +
                        encodeURIComponent(
                            query
                        )

                }
            );


        // ==================================
        // HTTP STATUS
        // ==================================

        console.log(
            "Overpass HTTP Status:",
            response.status
        );


        // ==================================
        // READ RESPONSE
        // ==================================

        const text =
            await response.text();


        // ==================================
        // CHECK OVERPASS ERROR
        // ==================================

        if (
            !response.ok
        ) {

            console.error(
                "OVERPASS ERROR:",
                text.substring(
                    0,
                    2000
                )
            );


            return res.status(502).json({

                success: false,

                message:
                    "OpenStreetMap service unavailable",

                details:
                    text.substring(
                        0,
                        500
                    )

            });

        }


        // ==================================
        // PARSE JSON
        // ==================================

        let data;


        try {

            data =
                JSON.parse(text);

        } catch (error) {

            console.error(
                "INVALID OVERPASS JSON:",
                text.substring(
                    0,
                    1000
                )
            );


            return res.status(502).json({

                success: false,

                message:
                    "Invalid response from OpenStreetMap"

            });

        }


        console.log(
            "OSM elements:",
            data.elements?.length || 0
        );


        // ==================================
        // CREATE MANDI ARRAY
        // ==================================

        const mandis = [];


        // ==================================
        // PROCESS OSM ELEMENTS
        // ==================================

        for (
            const element
            of data.elements || []
        ) {

            // ==================================
            // TAGS
            // ==================================

            const tags =
                element.tags || {};


            // ==================================
            // GET LATITUDE
            //
            // NODE:
            // element.lat
            //
            // WAY / RELATION:
            // element.center.lat
            // ==================================

            const mandiLat =
                element.lat ??
                element.center?.lat ??
                null;


            // ==================================
            // GET LONGITUDE
            // ==================================

            const mandiLon =
                element.lon ??
                element.center?.lon ??
                null;


            // ==================================
            // SKIP WITHOUT LOCATION
            // ==================================

            if (
                mandiLat === null ||
                mandiLon === null
            ) {

                console.log(
                    "Skipping OSM element without coordinates:",
                    element.id
                );

                continue;

            }


            // ==================================
            // CONVERT COORDINATES TO NUMBER
            // ==================================

            const numericMandiLat =
                Number(mandiLat);

            const numericMandiLon =
                Number(mandiLon);


            // ==================================
            // VALIDATE COORDINATES
            // ==================================

            if (
                !Number.isFinite(
                    numericMandiLat
                ) ||
                !Number.isFinite(
                    numericMandiLon
                )
            ) {

                continue;

            }


            // ==================================
            // CALCULATE DISTANCE
            // ==================================

            const distance =
                calculateDistance(

                    lat,
                    lon,

                    numericMandiLat,
                    numericMandiLon

                );


            // ==================================
            // SAFETY DISTANCE CHECK
            // ==================================

            if (
                distance > radiusKm
            ) {

                continue;

            }


            // ==================================
            // GOOGLE MAPS ROUTE
            // ==================================

            const googleMapsUrl =
                `https://www.google.com/maps/dir/?api=1` +

                `&origin=${lat},${lon}` +

                `&destination=${numericMandiLat},${numericMandiLon}` +

                `&travelmode=driving`;


            // ==================================
            // CREATE MANDI OBJECT
            // ==================================

            mandis.push({

                id:
                    `osm-${element.type}-${element.id}`,

                name:
                    tags.name ||
                    tags["name:en"] ||
                    "Agricultural Market",

                address:
                    tags["addr:full"] ||
                    tags["addr:street"] ||
                    tags["addr:place"] ||
                    tags.address ||
                    "Address unavailable",

                district:
                    tags["addr:district"] ||
                    tags["addr:city"] ||
                    tags["addr:town"] ||
                    tags["addr:village"] ||
                    "",

                state:
                    tags["addr:state"] ||
                    "",

                pincode:
                    tags["addr:postcode"] ||
                    "",

                contact_number:
                    tags.phone ||
                    tags["contact:phone"] ||
                    null,

                website:
                    tags.website ||
                    tags["contact:website"] ||
                    null,

                opening_hours:
                    tags.opening_hours ||
                    null,

                latitude:
                    numericMandiLat,

                longitude:
                    numericMandiLon,

                distance_km:
                    Number(
                        distance.toFixed(2)
                    ),

                google_maps:
                    googleMapsUrl,

                source:
                    "OpenStreetMap"

            });

        }


        // ==================================
        // REMOVE DUPLICATES
        // ==================================

        const unique = [];

        const seen =
            new Set();


        for (
            const mandi
            of mandis
        ) {

            const key =
                `${mandi.name
                    .toLowerCase()
                    .trim()}-${mandi.latitude
                    .toFixed(5)}-${mandi.longitude
                    .toFixed(5)}`;


            if (
                !seen.has(key)
            ) {

                seen.add(key);

                unique.push(
                    mandi
                );

            }

        }


        // ==================================
        // SORT NEAREST FIRST
        // ==================================

        unique.sort(
            (a, b) =>
                a.distance_km -
                b.distance_km
        );


        // ==================================
        // LIMIT RESULTS
        // ==================================

        const finalMandis =
            unique.slice(
                0,
                50
            );


        // ==================================
        // LOG RESULTS
        // ==================================

        console.log("");

        console.log(
            "REAL MANDIS FOUND:",
            finalMandis.length
        );


        finalMandis.forEach(
            (mandi, index) => {

                console.log(
                    `${index + 1}.`,
                    mandi.name,
                    "-",
                    mandi.distance_km,
                    "km"
                );

            }
        );


        console.log(
            "================================="
        );


        // ==================================
        // RESPONSE
        // ==================================

        return res.json({

            success: true,

            source:
                "OpenStreetMap",

            user_location: {

                latitude:
                    lat,

                longitude:
                    lon

            },

            radius_km:
                radiusKm,

            count:
                finalMandis.length,

            mandis:
                finalMandis

        });


    } catch (error) {

        console.error("");

        console.error(
            "================================="
        );

        console.error(
            "REAL MANDI ERROR:",
            error.message
        );

        console.error(
            "================================="
        );


        // ==================================
        // TIMEOUT
        // ==================================

        if (
            error.name ===
            "AbortError"
        ) {

            return res.status(504).json({

                success: false,

                message:
                    "Mandi search timed out. Please try again."

            });

        }


        // ==================================
        // GENERAL ERROR
        // ==================================

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch real mandi locations",

            details:
                error.message

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getMandis,

    getNearbyMandis

};