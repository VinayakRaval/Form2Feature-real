const axios = require("axios");
const { pool } = require("../config/db");

// ============================================================
// CONFIGURATION
// ============================================================

const OVERPASS_SERVERS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass-api.de/api/interpreter"
];

const NOMINATIM_URL =
    "https://nominatim.openstreetmap.org/search";

const CACHE_TIME = 5 * 60 * 1000;

const overpassCache = new Map();


// ============================================================
// DISTANCE - HAVERSINE
// ============================================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


// ============================================================
// GET OSM COORDINATES
// ============================================================

function getElementCoordinates(element) {

    // Node
    if (
        element.type === "node" &&
        element.lat !== undefined &&
        element.lon !== undefined
    ) {

        return {
            latitude:
                Number(element.lat),

            longitude:
                Number(element.lon)
        };
    }

    // Way / Relation
    if (
        element.center &&
        element.center.lat !== undefined &&
        element.center.lon !== undefined
    ) {

        return {
            latitude:
                Number(element.center.lat),

            longitude:
                Number(element.center.lon)
        };
    }

    return null;
}


// ============================================================
// GET ADDRESS
// ============================================================

function getAddress(tags = {}) {

    const parts = [];

    const fields = [
        "addr:housenumber",
        "addr:street",
        "addr:suburb",
        "addr:village",
        "addr:town",
        "addr:city",
        "addr:district",
        "addr:state"
    ];

    for (
        const field of fields
    ) {

        if (
            tags[field] &&
            !parts.includes(tags[field])
        ) {

            parts.push(
                tags[field]
            );
        }
    }

    if (
        parts.length === 0
    ) {

        return "Address unavailable";
    }

    return parts.join(", ");
}


// ============================================================
// GET MANDI NAME
// ============================================================

function getMandiName(tags = {}) {

    return (
        tags.name ||
        tags["name:en"] ||
        tags.official_name ||
        tags["official_name:en"] ||
        "Agricultural Market"
    );
}


// ============================================================
// CHECK REAL AGRICULTURAL MANDI
// ============================================================

function isRealMandi(tags = {}) {

    const name = String(
        tags.name ||
        tags["name:en"] ||
        tags.official_name ||
        tags["official_name:en"] ||
        ""
    ).toLowerCase();

    const amenity =
        String(
            tags.amenity || ""
        ).toLowerCase();

    const shop =
        String(
            tags.shop || ""
        ).toLowerCase();

    const landuse =
        String(
            tags.landuse || ""
        ).toLowerCase();

    // --------------------------------------------------------
    // Strong mandi/APMC keywords
    // --------------------------------------------------------

    const mandiKeywords = [
        "apmc",
        "agricultural produce market",
        "agricultural market",
        "agriculture market",
        "krishi mandi",
        "krishi market",
        "market yard",
        "farmers market",
        "farmer market",
        "wholesale market",
        "agri market",
        "agricultural yard",
        "produce market",
        "mandi"
    ];

    if (
        mandiKeywords.some(
            keyword =>
                name.includes(keyword)
        )
    ) {

        return true;
    }

    // --------------------------------------------------------
    // Marketplace only if it has agricultural/market context
    // --------------------------------------------------------

    if (
        amenity === "marketplace"
    ) {

        const agriculturalWords = [
            "vegetable",
            "fruit",
            "agriculture",
            "agricultural",
            "farm",
            "farmer",
            "produce",
            "wholesale",
            "grain",
            "vegetables",
            "fruits",
            "market"
        ];

        return (
            agriculturalWords.some(
                word =>
                    name.includes(word)
            )
        );
    }

    // --------------------------------------------------------
    // Shop/landuse agricultural market
    // --------------------------------------------------------

    if (
        shop === "agrarian" ||
        landuse === "retail"
    ) {

        return mandiKeywords.some(
            keyword =>
                name.includes(keyword)
        );
    }

    return false;
}


// ============================================================
// GEOCODE CITY / DISTRICT / STATE
// ============================================================

async function geocodeLocation(
    location
) {

    console.log(
        "Geocoding:",
        location
    );

    const response =
        await axios.get(
            NOMINATIM_URL,
            {
                params: {

                    q:
                        `${location}, Karnataka, India`,

                    format:
                        "json",

                    limit:
                        1,

                    addressdetails:
                        1,

                    countrycodes:
                        "in"

                },

                headers: {

                    "User-Agent":
                        "Form2Feature/1.0",

                    "Accept-Language":
                        "en"

                },

                timeout:
                    15000
            }
        );

    const result =
        response.data?.[0];

    if (!result) {

        return null;
    }

    let bbox = null;

    if (
        Array.isArray(
            result.boundingbox
        ) &&
        result.boundingbox.length === 4
    ) {

        bbox = {

            south:
                Number(
                    result.boundingbox[0]
                ),

            north:
                Number(
                    result.boundingbox[1]
                ),

            west:
                Number(
                    result.boundingbox[2]
                ),

            east:
                Number(
                    result.boundingbox[3]
                )
        };
    }

    return {

        latitude:
            Number(result.lat),

        longitude:
            Number(result.lon),

        display_name:
            result.display_name,

        type:
            result.type,

        bbox
    };
}


// ============================================================
// FETCH OSM BY BOUNDING BOX
// ============================================================

async function fetchOverpassByBbox(
    bbox
) {

    if (!bbox) {

        return [];
    }

    let {
        south,
        north,
        west,
        east
    } = bbox;

    // --------------------------------------------------------
    // Prevent huge queries
    // --------------------------------------------------------

    const latSize =
        Math.abs(
            north - south
        );

    const lonSize =
        Math.abs(
            east - west
        );

    if (
        latSize > 1 ||
        lonSize > 1
    ) {

        const centerLat =
            (south + north) / 2;

        const centerLon =
            (west + east) / 2;

        south =
            centerLat - 0.5;

        north =
            centerLat + 0.5;

        west =
            centerLon - 0.5;

        east =
            centerLon + 0.5;
    }

    const cacheKey =
        `bbox_${south.toFixed(4)}_${west.toFixed(4)}_${north.toFixed(4)}_${east.toFixed(4)}`;

    const cached =
        overpassCache.get(
            cacheKey
        );

    if (
        cached &&
        Date.now() - cached.time <
            CACHE_TIME
    ) {

        console.log(
            "Using cached OSM location results"
        );

        return cached.elements;
    }

    const query = `
[out:json][timeout:20];

(
    nwr(
        ${south},
        ${west},
        ${north},
        ${east}
    )["amenity"="marketplace"];

    nwr(
        ${south},
        ${west},
        ${north},
        ${east}
    )["name"~"APMC|Mandi|Krishi Mandi|Market Yard|Agricultural Market|Agricultural Produce Market|Agri Market|Wholesale Market",i];

    nwr(
        ${south},
        ${west},
        ${north},
        ${east}
    )["official_name"~"APMC|Mandi|Krishi Mandi|Market Yard|Agricultural Market|Agricultural Produce Market",i];
);

out center tags;
`;

    let lastError = null;

    for (
        const server of OVERPASS_SERVERS
    ) {

        try {

            console.log(
                "Calling Overpass:",
                server
            );

            const response =
                await axios.post(
                    server,
                    query,
                    {
                        headers: {

                            "Content-Type":
                                "text/plain",

                            "User-Agent":
                                "Form2Feature/1.0"

                        },

                        timeout:
                            25000
                    }
                );

            if (
                response.status === 200 &&
                Array.isArray(
                    response.data?.elements
                )
            ) {

                const elements =
                    response.data.elements;

                console.log(
                    "OSM results:",
                    elements.length
                );

                overpassCache.set(
                    cacheKey,
                    {
                        time:
                            Date.now(),

                        elements
                    }
                );

                return elements;
            }

        } catch (error) {

            lastError =
                error;

            console.error(
                "Overpass failed:",
                server
            );

            console.error(
                "Status:",
                error.response?.status ||
                error.code ||
                error.message
            );
        }
    }

    throw (
        lastError ||
        new Error(
            "All Overpass servers failed"
        )
    );
}


// ============================================================
// FETCH OSM BY RADIUS
// ============================================================

async function fetchFromOverpass(
    latitude,
    longitude,
    radius
) {

    const safeRadius =
        Math.min(
            Math.max(
                Number(radius),
                1
            ),
            100
        );

    const radiusMeters =
        Math.round(
            safeRadius * 1000
        );

    const cacheKey =
        `radius_${latitude.toFixed(4)}_${longitude.toFixed(4)}_${safeRadius}`;

    const cached =
        overpassCache.get(
            cacheKey
        );

    if (
        cached &&
        Date.now() - cached.time <
            CACHE_TIME
    ) {

        return cached.elements;
    }

    const query = `
[out:json][timeout:20];

(
    nwr(
        around:${radiusMeters},
        ${latitude},
        ${longitude}
    )["amenity"="marketplace"];

    nwr(
        around:${radiusMeters},
        ${latitude},
        ${longitude}
    )["name"~"APMC|Mandi|Krishi Mandi|Market Yard|Agricultural Market|Agricultural Produce Market|Agri Market|Wholesale Market",i];

    nwr(
        around:${radiusMeters},
        ${latitude},
        ${longitude}
    )["official_name"~"APMC|Mandi|Krishi Mandi|Market Yard|Agricultural Market|Agricultural Produce Market",i];
);

out center tags;
`;

    let lastError = null;

    for (
        const server of OVERPASS_SERVERS
    ) {

        try {

            console.log(
                "Calling Overpass:",
                server
            );

            const response =
                await axios.post(
                    server,
                    query,
                    {
                        headers: {

                            "Content-Type":
                                "text/plain",

                            "User-Agent":
                                "Form2Feature/1.0"

                        },

                        timeout:
                            25000
                    }
                );

            if (
                response.status === 200 &&
                Array.isArray(
                    response.data?.elements
                )
            ) {

                const elements =
                    response.data.elements;

                overpassCache.set(
                    cacheKey,
                    {
                        time:
                            Date.now(),

                        elements
                    }
                );

                return elements;
            }

        } catch (error) {

            lastError =
                error;

            console.error(
                "Overpass radius failed:",
                server
            );

            console.error(
                error.response?.status ||
                error.code ||
                error.message
            );
        }
    }

    throw (
        lastError ||
        new Error(
            "All Overpass servers failed"
        )
    );
}


// ============================================================
// MYSQL SEARCH BY LOCATION
// ============================================================

async function getMySQLMandisByLocation(
    location
) {

    const value =
        `%${location}%`;

    const [rows] =
        await pool.execute(
            `
            SELECT
                id,
                name,
                address,
                district,
                state,
                latitude,
                longitude,
                contact_number
            FROM mandis
            WHERE
                name LIKE ?
                OR address LIKE ?
                OR district LIKE ?
                OR state LIKE ?
            ORDER BY name ASC
            `,
            [
                value,
                value,
                value,
                value
            ]
        );

    return rows.map(
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
                    `mysql-${mandi.id}`,

                mandi_id:
                    `mysql-${mandi.id}`,

                mysql_id:
                    String(
                        mandi.id
                    ),

                name:
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

                contact_number:
                    mandi.contact_number ||
                    null,

                latitude,

                longitude,

                distance_km:
                    null,

                google_maps:
                    latitude !== null &&
                    longitude !== null
                        ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
                        : null,

                source:
                    "Form2Feature Database"
            };
        }
    );
}


// ============================================================
// MYSQL BY GPS RADIUS
// ============================================================

async function getLocalMandis(
    latitude,
    longitude,
    radius
) {

    const [rows] =
        await pool.execute(
            `
            SELECT
                id,
                name,
                address,
                district,
                state,
                latitude,
                longitude,
                contact_number
            FROM mandis
            WHERE
                latitude IS NOT NULL
                AND longitude IS NOT NULL
            `
        );

    const mandis = [];

    for (
        const mandi of rows
    ) {

        const mandiLatitude =
            Number(
                mandi.latitude
            );

        const mandiLongitude =
            Number(
                mandi.longitude
            );

        const distance =
            calculateDistance(
                latitude,
                longitude,
                mandiLatitude,
                mandiLongitude
            );

        if (
            distance <= radius
        ) {

            mandis.push({

                id:
                    `mysql-${mandi.id}`,

                mandi_id:
                    `mysql-${mandi.id}`,

                mysql_id:
                    String(
                        mandi.id
                    ),

                name:
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

                contact_number:
                    mandi.contact_number ||
                    null,

                latitude:
                    mandiLatitude,

                longitude:
                    mandiLongitude,

                distance_km:
                    Number(
                        distance.toFixed(2)
                    ),

                google_maps:
                    `https://www.google.com/maps/dir/?api=1&destination=${mandiLatitude},${mandiLongitude}&travelmode=driving`,

                source:
                    "Form2Feature Database"
            });
        }
    }

    mandis.sort(
        (a, b) =>
            a.distance_km -
            b.distance_km
    );

    return mandis;
}


// ============================================================
// CONVERT OSM RESULTS
// ============================================================

function convertOSMElements(
    elements,
    referenceLatitude = null,
    referenceLongitude = null
) {

    const results = [];

    const usedCoordinates =
        new Set();

    for (
        const element of elements
    ) {

        const coordinates =
            getElementCoordinates(
                element
            );

        if (!coordinates) {
            continue;
        }

        const latitude =
            coordinates.latitude;

        const longitude =
            coordinates.longitude;

        const tags =
            element.tags || {};

        // IMPORTANT
        // Remove temples, churches, ordinary places, etc.
        if (
            !isRealMandi(tags)
        ) {
            continue;
        }

        const coordinateKey =
            `${latitude.toFixed(5)}_${longitude.toFixed(5)}`;

        if (
            usedCoordinates.has(
                coordinateKey
            )
        ) {
            continue;
        }

        usedCoordinates.add(
            coordinateKey
        );

        let distance = null;

        if (
            referenceLatitude !== null &&
            referenceLongitude !== null
        ) {

            distance =
                calculateDistance(
                    referenceLatitude,
                    referenceLongitude,
                    latitude,
                    longitude
                );
        }

        results.push({

            id:
                `osm-${element.type}-${element.id}`,

            mandi_id:
                `osm-${element.type}-${element.id}`,

            name:
                getMandiName(
                    tags
                ),

            address:
                getAddress(
                    tags
                ),

            district:
                tags["addr:district"] ||
                "",

            state:
                tags["addr:state"] ||
                "Karnataka",

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

            latitude,

            longitude,

            distance_km:
                distance !== null
                    ? Number(
                        distance.toFixed(2)
                    )
                    : null,

            google_maps:
                `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`,

            source:
                "OpenStreetMap"
        });
    }

    return results;
}


// ============================================================
// COMBINE MYSQL + OSM
// ============================================================

function combineMandis(
    mysqlMandis,
    osmMandis
) {

    const combined = [
        ...mysqlMandis
    ];

    for (
        const osm of osmMandis
    ) {

        const duplicate =
            combined.some(
                existing => {

                    if (
                        existing.latitude === null ||
                        existing.longitude === null
                    ) {

                        return false;
                    }

                    const distance =
                        calculateDistance(
                            Number(
                                existing.latitude
                            ),
                            Number(
                                existing.longitude
                            ),
                            Number(
                                osm.latitude
                            ),
                            Number(
                                osm.longitude
                            )
                        );

                    return (
                        distance < 0.2
                    );
                }
            );

        if (!duplicate) {

            combined.push(
                osm
            );
        }
    }

    combined.sort(
        (a, b) => {

            if (
                a.distance_km === null
            ) {
                return 1;
            }

            if (
                b.distance_km === null
            ) {
                return -1;
            }

            return (
                a.distance_km -
                b.distance_km
            );
        }
    );

    return combined;
}


// ============================================================
// GET ALL MYSQL MANDIS
// GET /api/mandis
// ============================================================

const getMandis = async (
    req,
    res
) => {

    try {

        const [rows] =
            await pool.execute(
                `
                SELECT
                    id,
                    name,
                    address,
                    district,
                    state,
                    latitude,
                    longitude,
                    contact_number
                FROM mandis
                ORDER BY name ASC
                `
            );

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
                            `mysql-${mandi.id}`,

                        mandi_id:
                            `mysql-${mandi.id}`,

                        mysql_id:
                            String(
                                mandi.id
                            ),

                        name:
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

                        contact_number:
                            mandi.contact_number ||
                            null,

                        latitude,

                        longitude,

                        google_maps:
                            latitude !== null &&
                            longitude !== null
                                ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
                                : null,

                        source:
                            "Form2Feature Database"
                    };
                }
            );

        return res.json({

            success:
                true,

            source:
                "Form2Feature Database",

            count:
                mandis.length,

            mandis

        });

    } catch (error) {

        console.error(
            "GET MANDIS ERROR:",
            error
        );

        return res.status(500).json({

            success:
                false,

            message:
                "Unable to fetch mandis",

            error:
                error.message
        });
    }
};


// ============================================================
// NEARBY SEARCH
// GET /api/mandis/nearby
// ============================================================

const getNearbyMandis = async (
    req,
    res
) => {

    try {

        const latitude =
            Number(
                req.query.latitude
            );

        const longitude =
            Number(
                req.query.longitude
            );

        const radius =
            Number(
                req.query.radius
            );

        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Valid latitude and longitude are required"
            });
        }

        if (
            !Number.isFinite(radius) ||
            radius <= 0 ||
            radius > 100
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Radius must be between 1 and 100 km"
            });
        }

        // ------------------------------------------------------
        // MYSQL
        // ------------------------------------------------------

        let mysqlMandis = [];

        try {

            mysqlMandis =
                await getLocalMandis(
                    latitude,
                    longitude,
                    radius
                );

        } catch (error) {

            console.error(
                "MySQL radius error:",
                error.message
            );
        }

        // ------------------------------------------------------
        // OSM
        // ------------------------------------------------------

        let osmMandis = [];

        try {

            const elements =
                await fetchFromOverpass(
                    latitude,
                    longitude,
                    radius
                );

            osmMandis =
                convertOSMElements(
                    elements,
                    latitude,
                    longitude
                );

        } catch (error) {

            console.error(
                "OSM radius error:",
                error.message
            );
        }

        // ------------------------------------------------------
        // COMBINE
        // ------------------------------------------------------

        const mandis =
            combineMandis(
                mysqlMandis,
                osmMandis
            );

        return res.json({

            success:
                true,

            mode:
                "radius",

            user_location: {

                latitude,

                longitude

            },

            radius_km:
                radius,

            mysql_count:
                mysqlMandis.length,

            osm_count:
                osmMandis.length,

            count:
                mandis.length,

            mandis

        });

    } catch (error) {

        console.error(
            "NEARBY MANDI ERROR:",
            error
        );

        return res.status(500).json({

            success:
                false,

            message:
                "Unable to fetch nearby mandis",

            error:
                error.message
        });
    }
};


// ============================================================
// LOCATION SEARCH
// GET /api/mandis/search?location=Haveri
// ============================================================

const searchMandisByLocation =
    async (
        req,
        res
    ) => {

        try {

            const location =
                String(
                    req.query.location ||
                    ""
                ).trim();

            if (!location) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Location is required"
                });
            }

            console.log(
                ""
            );

            console.log(
                "======================================"
            );

            console.log(
                "LOCATION SEARCH:",
                location
            );

            console.log(
                "======================================"
            );

            // ==================================================
            // STEP 1 - GEOCODE FIRST
            // ==================================================

            let geo = null;

            try {

                geo =
                    await geocodeLocation(
                        location
                    );

                if (geo) {

                    console.log(
                        "Matched:",
                        geo.display_name
                    );

                    console.log(
                        "Coordinates:",
                        geo.latitude,
                        geo.longitude
                    );
                }

            } catch (error) {

                console.error(
                    "Geocoding failed:",
                    error.message
                );
            }

            // ==================================================
            // STEP 2 - MYSQL
            // ==================================================

            let mysqlMandis = [];

            try {

                mysqlMandis =
                    await getMySQLMandisByLocation(
                        location
                    );

            } catch (error) {

                console.error(
                    "MySQL location error:",
                    error.message
                );
            }

            // ==================================================
            // STEP 3 - OSM
            // ==================================================

            let osmMandis = [];

            if (geo) {

                try {

                    const elements =
                        await fetchOverpassByBbox(
                            geo.bbox
                        );

                    osmMandis =
                        convertOSMElements(
                            elements,
                            geo.latitude,
                            geo.longitude
                        );

                } catch (error) {

                    console.error(
                        "OSM location error:",
                        error.message
                    );
                }
            }

            // ==================================================
            // STEP 4 - COMBINE
            // ==================================================

            const mandis =
                combineMandis(
                    mysqlMandis,
                    osmMandis
                );

            console.log(
                "MYSQL:",
                mysqlMandis.length
            );

            console.log(
                "OSM:",
                osmMandis.length
            );

            console.log(
                "TOTAL:",
                mandis.length
            );

            console.log(
                "======================================"
            );

            // ==================================================
            // RESPONSE
            // ==================================================

            return res.json({

                success:
                    true,

                mode:
                    "location",

                search_location:
                    location,

                matched_location:
                    geo?.display_name ||
                    location,

                location_coordinates:
                    geo
                        ? {

                            latitude:
                                geo.latitude,

                            longitude:
                                geo.longitude

                        }
                        : null,

                mysql_count:
                    mysqlMandis.length,

                osm_count:
                    osmMandis.length,

                count:
                    mandis.length,

                sources: {

                    mysql:
                        "Form2Feature Database",

                    real:
                        "OpenStreetMap"

                },

                mandis

            });

        } catch (error) {

            console.error(
                "LOCATION SEARCH ERROR:",
                error
            );

            return res.status(500).json({

                success:
                    false,

                message:
                    "Unable to search mandis",

                error:
                    error.message
            });
        }
    };


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getMandis,

    getNearbyMandis,

    searchMandisByLocation

};