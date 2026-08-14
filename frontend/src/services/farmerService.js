import api from "./api";


// ========================================
// GET PROFILE
// ========================================

export const getFarmerProfile = async () => {

    const response =
        await api.get("/farmer/profile");

    return response.data;
};


// ========================================
// UPDATE PROFILE
// ========================================

export const updateFarmerProfile = async (
    formData
) => {

    const response =
        await api.put(
            "/farmer/profile",
            formData
        );

    return response.data;
};