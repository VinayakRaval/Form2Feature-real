import api from "./api";

// ==========================================
// GET MARKET PRICES
// ==========================================

export const getMarketPrices = async (
    cropName
) => {

    const response =
        await api.get(
            "/market-prices",
            {
                params: {
                    crop_name: cropName
                }
            }
        );

    return response.data;
};


// ==========================================
// GET BEST MARKET PRICE
// ==========================================

export const getBestMarketPrice = async (
    cropName
) => {

    const response =
        await api.get(
            "/market-prices/best",
            {
                params: {
                    crop_name: cropName
                }
            }
        );

    return response.data;
};