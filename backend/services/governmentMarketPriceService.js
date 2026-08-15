const axios = require("axios");

// ============================================================
// DATA.GOV.IN
// ============================================================

const DATA_GOV_RESOURCE_ID =
    "35985678-0d79-46b4-9ed6-6f13308a1d24";

const DATA_GOV_URL =
    `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}`;


// ============================================================
// TEXT NORMALIZATION
// ============================================================

function normalize(value) {

    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[.,]/g, "");
}


// ============================================================
// DISTRICT ALIASES
// ============================================================

const DISTRICT_ALIASES = {

    mysore: [
        "mysore",
        "mysuru"
    ],

    mysuru: [
        "mysore",
        "mysuru"
    ],

    haveri: [
        "haveri"
    ],

    dharwad: [
        "dharwad"
    ],

    hubli: [
        "hubli",
        "hubballi"
    ],

    hubballi: [
        "hubli",
        "hubballi"
    ],

    belgaum: [
        "belgaum",
        "belagavi"
    ],

    belagavi: [
        "belgaum",
        "belagavi"
    ],

    bangalore: [
        "bangalore",
        "bengaluru"
    ],

    bengaluru: [
        "bangalore",
        "bengaluru"
    ],

    chikmagalur: [
        "chikmagalur",
        "chikkamagaluru",
        "chikkamagalore",
        "chikkamagalur"
    ],

    chikkamagalore: [
        "chikmagalur",
        "chikkamagaluru",
        "chikkamagalore",
        "chikkamagalur"
    ],

    chikkamagaluru: [
        "chikmagalur",
        "chikkamagaluru",
        "chikkamagalore",
        "chikkamagalur"
    ],

    chikkamagalur: [
        "chikmagalur",
        "chikkamagaluru",
        "chikkamagalore",
        "chikkamagalur"
    ]

};


// ============================================================
// GET ALIASES
// ============================================================

function getDistrictAliases(
    district
) {

    const normalized =
        normalize(district);

    return (
        DISTRICT_ALIASES[normalized] ||
        [normalized]
    );
}


// ============================================================
// DISTRICT MATCH
// ============================================================

function districtMatches(
    requestedDistrict,
    actualDistrict
) {

    if (!requestedDistrict) {
        return true;
    }

    const wanted =
        normalize(requestedDistrict);

    const actual =
        normalize(actualDistrict);

    if (!wanted || !actual) {
        return false;
    }

    const aliases =
        getDistrictAliases(
            wanted
        );

    return aliases.some(
        alias => {

            const normalizedAlias =
                normalize(alias);

            return (
                actual === normalizedAlias ||
                actual.includes(
                    normalizedAlias
                ) ||
                normalizedAlias.includes(
                    actual
                )
            );

        }
    );
}


// ============================================================
// GET FIELD
// ============================================================

function getField(
    record,
    fields = []
) {

    // Exact field
    for (const field of fields) {

        if (
            record[field] !== undefined &&
            record[field] !== null &&
            String(
                record[field]
            ).trim() !== ""
        ) {

            return record[field];

        }

    }


    // Normalized field
    const recordKeys =
        Object.keys(record);


    for (
        const recordKey of recordKeys
    ) {

        const normalizedRecordKey =
            normalize(recordKey)
                .replace(
                    /[^a-z0-9]/g,
                    ""
                );


        for (
            const field of fields
        ) {

            const normalizedWanted =
                normalize(field)
                    .replace(
                        /[^a-z0-9]/g,
                        ""
                    );


            if (
                normalizedRecordKey ===
                normalizedWanted
            ) {

                const value =
                    record[recordKey];

                if (
                    value !== null &&
                    value !== undefined &&
                    String(
                        value
                    ).trim() !== ""
                ) {

                    return value;

                }

            }

        }

    }

    return "";
}


// ============================================================
// PARSE PRICE
// ============================================================

function parsePrice(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    if (
        typeof value === "number"
    ) {

        return Number.isFinite(value)
            ? value
            : 0;

    }


    const cleaned =
        String(value)
            .replace(/₹/g, "")
            .replace(/Rs\.?/gi, "")
            .replace(/INR/gi, "")
            .replace(/,/g, "")
            .replace(
                /[^0-9.-]/g,
                ""
            )
            .trim();


    const number =
        Number.parseFloat(
            cleaned
        );


    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// CONVERT RECORD
// ============================================================

function convertGovernmentRecord(
    record,
    index,
    fallbackCrop,
    fallbackState
) {

    const market =
        getField(
            record,
            [
                "market",
                "Market",
                "mandi",
                "Mandi",
                "market_name",
                "Market_Name"
            ]
        ) ||
        "Government Market";


    const district =
        getField(
            record,
            [
                "district",
                "District"
            ]
        );


    const state =
        getField(
            record,
            [
                "state",
                "State"
            ]
        ) ||
        fallbackState;


    const commodity =
        getField(
            record,
            [
                "commodity",
                "Commodity",
                "crop",
                "crop_name",
                "commodity_name"
            ]
        ) ||
        fallbackCrop;


    const minPrice =
        parsePrice(
            getField(
                record,
                [
                    "min_price",
                    "Min Price",
                    "min price",
                    "Min_Price",
                    "minimum_price",
                    "Minimum Price",
                    "min_price_rs_quintal"
                ]
            )
        );


    const maxPrice =
        parsePrice(
            getField(
                record,
                [
                    "max_price",
                    "Max Price",
                    "max price",
                    "Max_Price",
                    "maximum_price",
                    "Maximum Price",
                    "max_price_rs_quintal"
                ]
            )
        );


    const modalPrice =
        parsePrice(
            getField(
                record,
                [
                    "modal_price",
                    "Modal Price",
                    "modal price",
                    "Modal_Price",
                    "modal",
                    "Modal",
                    "modal_price_rs_quintal"
                ]
            )
        );


    const priceDate =
        getField(
            record,
            [
                "arrival_date",
                "Arrival_Date",
                "arrival date",
                "price_date",
                "Price_Date",
                "date",
                "Date"
            ]
        ) || null;


    return {

        id:
            `gov-${index}-${Date.now()}`,

        mandi_id:
            null,

        mandi_name:
            market,

        crop_name:
            commodity,

        district,

        state,

        address:
            "",

        latitude:
            null,

        longitude:
            null,

        min_price:
            minPrice,

        max_price:
            maxPrice,

        modal_price:
            modalPrice,

        price_unit:
            "quintal",

        price_date:
            priceDate,

        source:
            "Data.gov.in"

    };
}


// ============================================================
// FETCH GOVERNMENT DATA
// ============================================================

async function fetchGovernmentRecords(
    apiKey,
    crop,
    state,
    useFilters = true
) {

    const params = {

        "api-key":
            apiKey,

        format:
            "json",

        limit:
            1000,

        offset:
            0

    };


    // IMPORTANT:
    // We DO NOT send district to the API.
    //
    // District names differ:
    // Chikkamagalore
    // Chikkamagaluru
    // Chikmagalur
    //
    // We filter district locally.
    //

    if (
        useFilters &&
        crop
    ) {

        params[
            "filters[commodity]"
        ] = crop;

    }


    if (
        useFilters &&
        state
    ) {

        params[
            "filters[state]"
        ] = state;

    }


    console.log(
        "Government API request:",
        {
            ...params,
            "api-key":
                "***HIDDEN***"
        }
    );


    const response =
        await axios.get(
            DATA_GOV_URL,
            {

                params,

                timeout:
                    30000,

                headers: {

                    "User-Agent":
                        "Form2Feature/1.0"

                }

            }
        );


    return Array.isArray(
        response.data?.records
    )
        ? response.data.records
        : [];
}


// ============================================================
// MAIN FUNCTION
// ============================================================

const getGovernmentMarketPrices =
    async ({
        crop = "",
        state = "Karnataka",
        district = "",
        limit = 1000
    } = {}) => {

        const apiKey =
            process.env.DATA_GOV_API_KEY;


        if (!apiKey) {

            throw new Error(
                "DATA_GOV_API_KEY is missing in backend .env"
            );

        }


        const wantedCrop =
            normalize(crop);

        const wantedState =
            normalize(state);

        const wantedDistrict =
            normalize(district);


        console.log("");
        console.log(
            "======================================"
        );

        console.log(
            "GOVERNMENT MARKET PRICE SEARCH"
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

        console.log(
            "======================================"
        );


        let records = [];


        // ====================================================
        // FIRST REQUEST
        // CROP + STATE
        // ====================================================

        try {

            records =
                await fetchGovernmentRecords(
                    apiKey,
                    crop,
                    state,
                    true
                );

        } catch (error) {

            console.error(
                "Government API filtered request failed:",
                error.message
            );

        }


        // ====================================================
        // FALLBACK REQUEST
        // ====================================================
        //
        // If API filtering returned nothing,
        // fetch broader records.
        //
        // ====================================================

        if (
            records.length === 0
        ) {

            console.log(
                "No filtered government records."
            );

            console.log(
                "Trying fallback government request..."
            );


            try {

                records =
                    await fetchGovernmentRecords(
                        apiKey,
                        "",
                        state,
                        false
                    );

            } catch (error) {

                console.error(
                    "Government fallback failed:",
                    error.message
                );

                records = [];

            }

        }


        console.log(
            "Government records received:",
            records.length
        );


        // ====================================================
        // LOCAL FILTER
        // ====================================================

        const filtered =
            records.filter(
                record => {

                    const recordCrop =
                        normalize(
                            getField(
                                record,
                                [
                                    "commodity",
                                    "Commodity",
                                    "crop",
                                    "crop_name",
                                    "commodity_name"
                                ]
                            )
                        );


                    const recordState =
                        normalize(
                            getField(
                                record,
                                [
                                    "state",
                                    "State"
                                ]
                            )
                        );


                    const recordDistrict =
                        getField(
                            record,
                            [
                                "district",
                                "District"
                            ]
                        );


                    // ----------------------------------------
                    // CROP
                    // ----------------------------------------

                    const cropMatch =
                        !wantedCrop ||
                        recordCrop ===
                            wantedCrop ||
                        recordCrop.includes(
                            wantedCrop
                        ) ||
                        wantedCrop.includes(
                            recordCrop
                        );


                    // ----------------------------------------
                    // STATE
                    // ----------------------------------------

                    const stateMatch =
                        !wantedState ||
                        recordState ===
                            wantedState;


                    // ----------------------------------------
                    // DISTRICT
                    // ----------------------------------------

                    const districtMatch =
                        !wantedDistrict ||
                        districtMatches(
                            wantedDistrict,
                            recordDistrict
                        );


                    return (
                        cropMatch &&
                        stateMatch &&
                        districtMatch
                    );

                }
            );


        console.log(
            "Government matching records:",
            filtered.length
        );


        // ====================================================
        // CONVERT
        // ====================================================

        const prices =
            filtered
                .map(
                    (
                        record,
                        index
                    ) =>
                        convertGovernmentRecord(
                            record,
                            index,
                            crop,
                            state
                        )
                )
                .filter(
                    price =>
                        price.min_price > 0 ||
                        price.modal_price > 0 ||
                        price.max_price > 0
                );


        // ====================================================
        // LIMIT
        // ====================================================

        return prices.slice(
            0,
            Math.min(
                Number(limit) || 1000,
                1000
            )
        );

    };


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getGovernmentMarketPrices
};