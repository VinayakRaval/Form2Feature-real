import api from "./api";

// ==========================================
// GET NEARBY REAL MANDIS
// ==========================================

export const getNearbyMandis = async (
    latitude,
    longitude,
    radius = 50
) => {

    const response = await api.get(
        "/mandis/nearby",
        {
            params: {
                latitude,
                longitude,
                radius
            },

            // 0 = no Axios timeout
            timeout: 0
        }
    );

    return response.data;
};


// ==========================================
// GET ALL MYSQL MANDIS
// ==========================================

export const getMandis = async () => {

    const response = await api.get(
        "/mandis",
        {
            timeout: 0
        }
    );

    return response.data;
};