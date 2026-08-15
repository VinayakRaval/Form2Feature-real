const axios = require("axios");

// ============================================================
// DATA.GOV.IN RESOURCE
// ============================================================

const DATA_GOV_RESOURCE_ID =
    "35985678-0d79-46b4-9ed6-6f13308a1d24";

const DATA_GOV_URL =
    `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}`;


// ============================================================
// HELPERS
// ============================================================

function cleanText(value) {

    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");

}


function normalizeText(value) {

    return cleanText(value)
        .toLowerCase();

}


function parsePrice(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const cleaned =
        String(value)
            .replace(/,/g, "")
            .replace(/[^\d.-]/g, "");

    const number =
        Number(cleaned);

    return Number.isFinite(number)
        ? number
        : 0;

}


// ============================================================
// GET FIELD VALUE
// Handles different Data.gov field names
// ============================================================

function getRecordField(
    record,
    fields
) {

    for (const field of fields) {

        if (
            record[field] !== undefined &&
            record[field] !== null &&
            String(record[field]).trim() !== ""
        ) {

            return record[field];

        }

    }

    return "";

}


// ============================================================
// GET GOVERNMENT MARKET PRICES
// ============================================================

const getGovernmentMarketPrices = async ({
    cropName,
    state = "Karnataka",
    limit = 1000
}) => {

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!cropName) {

        throw new Error(
            "cropName is required"
        );

    }


    const apiKey =
        process.env.DATA_GOV_API_KEY;


    if (!apiKey) {

        throw new Error(
            "DATA_GOV_API_KEY is missing in .env"
        );

    }


    const wantedCrop =
        normalizeText(cropName);


    const wantedState =
        normalizeText(state);


    console.log("");
    console.log(
        "=========================================="
    );

    console.log(
        "DATA.GOV MARKET PRICE SEARCH"
    );

    console.log(
        "Crop:",
        cropName
    );

    console.log(
        "State:",
        state
    );

    console.log(
        "=========================================="
    );


    try {

        // ====================================================
        // CALL DATA.GOV.IN
        // ====================================================

        const response =
            await axios.get(
                DATA_GOV_URL,
                {
                    params: {

                        "api-key":
                            apiKey,

                        format:
                            "json",

                        limit:
                            Math.min(
                                Number(limit) || 1000,
                                5000
                            ),

                        offset:
                            0

                    },

                    timeout:
                        30000
                }
            );


        const records =
            Array.isArray(
                response.data?.records
            )
                ? response.data.records
                : [];


        console.log(
            "Data.gov.in records received:",
            records.length
        );


        // ====================================================
        // FILTER CROP + STATE
        // ====================================================

        const filtered =
            records.filter(
                record => {

                    const recordCrop =
                        normalizeText(
                            getRecordField(
                                record,
                                [
                                    "commodity",
                                    "Commodity",
                                    "crop",
                                    "Crop",
                                    "crop_name",
                                    "Crop_Name",
                                    "commodity_name",
                                    "Commodity_Name"
                                ]
                            )
                        );


                    const recordState =
                        normalizeText(
                            getRecordField(
                                record,
                                [
                                    "state",
                                    "State"
                                ]
                            )
                        );


                    // ----------------------------------------
                    // CROP MATCH
                    // ----------------------------------------

                    const cropMatches =
                        recordCrop === wantedCrop ||
                        recordCrop.includes(
                            wantedCrop
                        ) ||
                        wantedCrop.includes(
                            recordCrop
                        );


                    // ----------------------------------------
                    // STATE MATCH
                    // ----------------------------------------

                    const stateMatches =
                        !wantedState ||
                        recordState === wantedState;


                    return (
                        cropMatches &&
                        stateMatches
                    );

                }
            );


        console.log(
            "Matching government records:",
            filtered.length
        );


        // ====================================================
        // CONVERT GOVERNMENT DATA
        // ====================================================

        const prices =
            filtered.map(
                (record, index) => {

                    const mandiName =
                        getRecordField(
                            record,
                            [
                                "market",
                                "Market",
                                "mandi",
                                "Mandi",
                                "market_name",
                                "Market_Name",
                                "mandi_name",
                                "Mandi_Name"
                            ]
                        );


                    const district =
                        getRecordField(
                            record,
                            [
                                "district",
                                "District"
                            ]
                        );


                    const recordState =
                        getRecordField(
                            record,
                            [
                                "state",
                                "State"
                            ]
                        );


                    const commodity =
                        getRecordField(
                            record,
                            [
                                "commodity",
                                "Commodity",
                                "crop",
                                "Crop",
                                "crop_name",
                                "Crop_Name"
                            ]
                        );


                    const minPrice =
                        parsePrice(
                            getRecordField(
                                record,
                                [
                                    "min_price",
                                    "Min_Price",
                                    "min_price_rs_quintal",
                                    "Min_Price_Rs_Quintal",
                                    "min"
                                ]
                            )
                        );


                    const maxPrice =
                        parsePrice(
                            getRecordField(
                                record,
                                [
                                    "max_price",
                                    "Max_Price",
                                    "max_price_rs_quintal",
                                    "Max_Price_Rs_Quintal",
                                    "max"
                                ]
                            )
                        );


                    const modalPrice =
                        parsePrice(
                            getRecordField(
                                record,
                                [
                                    "modal_price",
                                    "Modal_Price",
                                    "modal_price_rs_quintal",
                                    "Modal_Price_Rs_Quintal",
                                    "modal"
                                ]
                            )
                        );


                    const priceDate =
                        getRecordField(
                            record,
                            [
                                "arrival_date",
                                "Arrival_Date",
                                "price_date",
                                "Price_Date",
                                "date",
                                "Date"
                            ]
                        );


                    const latitudeValue =
                        getRecordField(
                            record,
                            [
                                "latitude",
                                "Latitude"
                            ]
                        );


                    const longitudeValue =
                        getRecordField(
                            record,
                            [
                                "longitude",
                                "Longitude"
                            ]
                        );


                    const latitude =
                        latitudeValue !== ""
                            ? Number(
                                latitudeValue
                            )
                            : null;


                    const longitude =
                        longitudeValue !== ""
                            ? Number(
                                longitudeValue
                            )
                            : null;


                    const googleMaps =
                        Number.isFinite(
                            latitude
                        ) &&
                        Number.isFinite(
                            longitude
                        )
                            ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
                            : null;


                    return {

                        id:
                            `gov-${index + 1}`,

                        mandi_id:
                            null,

                        mandi_name:
                            mandiName ||
                            "Government Market",

                        district:
                            district ||
                            "",

                        state:
                            recordState ||
                            state,

                        address:
                            "",

                        latitude,

                        longitude,

                        crop_name:
                            commodity ||
                            cropName,

                        min_price:
                            minPrice,

                        max_price:
                            maxPrice,

                        modal_price:
                            modalPrice,

                        price_unit:
                            "quintal",

                        price_date:
                            priceDate ||
                            null,

                        google_maps:
                            googleMaps,

                        source:
                            "Data.gov.in"

                    };

                }
            );


        // ====================================================
        // SORT BY MODAL PRICE
        // ====================================================

        prices.sort(
            (a, b) =>
                b.modal_price -
                a.modal_price
        );


        // ====================================================
        // LOG RESULTS
        // ====================================================

        console.log(
            "Government prices returned:",
            prices.length
        );


        prices.forEach(
            (price, index) => {

                console.log(
                    `${index + 1}. ${price.mandi_name} - ₹${price.modal_price}`
                );

            }
        );


        console.log(
            "=========================================="
        );


        // ====================================================
        // RETURN
        // ====================================================

        return prices;


    } catch (error) {

        console.error(
            "=========================================="
        );

        console.error(
            "DATA.GOV.IN API ERROR"
        );

        console.error(
            error.response?.status ||
            "NO STATUS"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        console.error(
            "=========================================="
        );


        throw error;

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getGovernmentMarketPrices

};