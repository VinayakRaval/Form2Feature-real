import api from "./api";

// ============================================================
// LOCATION SEARCH
// ============================================================

export const searchMandisByLocation = async (
    location
) => {

    const response =
        await api.get(
            "/mandis/search",
            {
                params: {
                    location
                },

                timeout: 0
            }
        );

    return response.data;
};

// ============================================================
// NEARBY MANDIS
// ============================================================

export const getNearbyMandis = async (
    latitude,
    longitude,
    radius
) => {

    const response =
        await api.get(
            "/mandis/nearby",
            {
                params: {
                    latitude,
                    longitude,
                    radius
                },

                timeout: 0
            }
        );

    return response.data;
};

// ============================================================
// ALL MYSQL MANDIS
// ============================================================

export const getMandis = async () => {

    const response =
        await api.get(
            "/mandis",
            {
                timeout: 0
            }
        );

    return response.data;
};

// ============================================================
// SAVE
// ============================================================

export const saveMandi = async (
    mandi
) => {

    const response =
        await api.post(
            "/saved-mandis",
            mandi
        );

    return response.data;
};

// ============================================================
// GET SAVED
// ============================================================

export const getSavedMandis = async () => {

    const response =
        await api.get(
            "/saved-mandis"
        );

    return response.data;
};

// ============================================================
// DELETE SAVED
// ============================================================

export const removeSavedMandi = async (
    mandiId
) => {

    const response =
        await api.delete(
            `/saved-mandis/${encodeURIComponent(
                mandiId
            )}`
        );

    return response.data;
};