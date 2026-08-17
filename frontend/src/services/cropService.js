import api from "./api";

// ============================================================
// GET MY CROPS
// GET /api/crops
// ============================================================

export const getMyCrops = async () => {
    try {

        const response = await api.get("/crops");

        return response.data;

    } catch (error) {

        console.error(
            "GET MY CROPS ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// GET SINGLE CROP
//
// IMPORTANT:
// We use the existing GET /api/crops endpoint.
// No new backend route is required.
// ============================================================

export const getCropById = async (id) => {

    try {

        if (!id) {
            throw new Error(
                "Crop ID is required"
            );
        }

        const response =
            await api.get("/crops");

        const data =
            response.data;

        const crops =
            data?.crops || [];

        const crop =
            crops.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (!crop) {

            throw new Error(
                "Crop not found"
            );
        }

        return {
            success: true,
            crop: crop
        };

    } catch (error) {

        console.error(
            "GET CROP BY ID ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// ADD CROP
// POST /api/crops
// ============================================================

export const addCrop = async (formData) => {

    try {

        const response =
            await api.post(
                "/crops",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

        return response.data;

    } catch (error) {

        console.error(
            "ADD CROP ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// UPDATE CROP
// PUT /api/crops/:id
// ============================================================

export const updateCrop = async (
    id,
    formData
) => {

    try {

        if (!id) {

            throw new Error(
                "Crop ID is required"
            );

        }

        const response =
            await api.put(
                `/crops/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

        return response.data;

    } catch (error) {

        console.error(
            "UPDATE CROP ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// DELETE CROP
// DELETE /api/crops/:id
// ============================================================

export const deleteCrop = async (id) => {

    try {

        if (!id) {

            throw new Error(
                "Crop ID is required"
            );

        }

        const response =
            await api.delete(
                `/crops/${id}`
            );

        return response.data;

    } catch (error) {

        console.error(
            "DELETE CROP ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    getMyCrops,
    getCropById,
    addCrop,
    updateCrop,
    deleteCrop
};