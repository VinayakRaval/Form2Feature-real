import api from "./api";

// ============================================================
// GET ALL GOVERNMENT SCHEMES
// ============================================================

export const getGovernmentSchemes = async () => {

    const response =
        await api.get(
            "/government-schemes"
        );

    return response.data;
};


// ============================================================
// GET SINGLE GOVERNMENT SCHEME
// ============================================================

export const getGovernmentSchemeById = async (
    id
) => {

    const response =
        await api.get(
            `/government-schemes/${id}`
        );

    return response.data;
};


// ============================================================
// SEARCH GOVERNMENT SCHEMES
// ============================================================

export const searchGovernmentSchemes = async (
    query
) => {

    const response =
        await api.get(
            "/government-schemes/search",
            {
                params: {
                    q: query
                }
            }
        );

    return response.data;
};