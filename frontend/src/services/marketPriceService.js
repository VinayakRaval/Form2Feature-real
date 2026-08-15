import api from "./api";

// ============================================================
// GET COMBINED MARKET PRICES
// MySQL + Government Data.gov.in
// ============================================================

export const getMarketPrices = async ({
    crop = "",
    state = "Karnataka",
    district = "",
    limit = 100
} = {}) => {

    const response = await api.get(
        "/market-prices",
        {
            params: {
                crop,
                state,
                district,
                limit
            },
            timeout: 60000
        }
    );

    return response.data;
};


// ============================================================
// GET MYSQL MARKET PRICES ONLY
// ============================================================

export const getLocalMarketPrices = async ({
    crop = "",
    state = "Karnataka",
    district = ""
} = {}) => {

    const response = await api.get(
        "/market-prices/local",
        {
            params: {
                crop,
                state,
                district
            },
            timeout: 30000
        }
    );

    return response.data;
};


// ============================================================
// GET GOVERNMENT MARKET PRICES ONLY
// ============================================================

export const getGovernmentMarketPrices = async ({
    crop = "",
    state = "Karnataka",
    district = "",
    limit = 100
} = {}) => {

    const response = await api.get(
        "/market-prices/government",
        {
            params: {
                crop,
                state,
                district,
                limit
            },
            timeout: 60000
        }
    );

    return response.data;
};