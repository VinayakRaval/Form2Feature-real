import api from "./api";

// ==========================================
// GET MY CROPS
// ==========================================

export const getMyCrops = async () => {

    const response = await api.get("/crops");

    return response.data;
};


// ==========================================
// ADD CROP
// ==========================================

export const addCrop = async (formData) => {

    const response = await api.post(
        "/crops",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


// ==========================================
// UPDATE CROP
// ==========================================

export const updateCrop = async (
    id,
    formData
) => {

    const response = await api.put(
        `/crops/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


// ==========================================
// DELETE CROP
// ==========================================

export const deleteCrop = async (id) => {

    const response = await api.delete(
        `/crops/${id}`
    );

    return response.data;
};