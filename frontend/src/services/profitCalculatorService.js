import api from "./api";

// ============================================================
// SAVE
// ============================================================

export const saveProfitCalculation = async (data) => {

    const response = await api.post(
        "/profit-calculator",
        data
    );

    return response.data;
};

// ============================================================
// GET SAVED PROFITS
// ============================================================

export const getProfitCalculations = async () => {

    const response = await api.get(
        "/profit-calculator"
    );

    return response.data;
};

// ============================================================
// DELETE
// ============================================================

export const deleteProfitCalculation = async (id) => {

    const response = await api.delete(
        `/profit-calculator/${id}`
    );

    return response.data;
};