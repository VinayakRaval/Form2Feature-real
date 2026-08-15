const axios = require("axios");

const DATA_GOV_RESOURCE_ID =
    "35985678-0d79-46b4-9ed6-6f13308a1d24";

const DATA_GOV_URL =
    `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}`;


// ============================================================
// GET DATA FROM GOVERNMENT API
// ============================================================

const getGovernmentMarketPrices = async ({
    cropName,
    state = "Karnataka",
    limit = 100
}) => {

    try {

        const apiKey =
            process.env.DATA_GOV_API_KEY;


        if (!apiKey) {

            throw new Error(
                "DATA_GOV_API_KEY is missing in .env"
            );

        }


        if (!cropName) {

            throw new Error(
                "cropName is required"
            );

        }


        console.log(
            "================================="
        );

        console.log(
            "Calling Data.gov.in"
        );

        console.log(
            "Crop:",
            cropName
        );

        console.log(
            "State:",
            state
        );


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
                            Number(limit),

                        offset:
                            0

                    },

                    timeout:
                        30000

                }
            );


        console.log(
            "DATA.GOV STATUS:",
            response.status
        );


        console.log(
            "DATA.GOV RECORDS:",
            response.data?.records?.length || 0
        );


        return response.data;


    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "DATA.GOV API ERROR"
        );


        console.error(
            "STATUS:",
            error.response?.status
        );


        console.error(
            "DATA:",
            error.response?.data ||
            error.message
        );


        throw error;

    }

};


module.exports = {
    getGovernmentMarketPrices
};