import api from "./api";

// ============================================================
// ADD SALE
// ============================================================

export const addSale = async (saleData) => {

    console.log("=================================");
    console.log("ADD SALE SERVICE");
    console.log("INPUT DATA:", saleData);

    const payload = {
        crop_id: Number(saleData.crop_id),

        quantity: Number(saleData.quantity),

        price_per_unit: Number(
            saleData.price_per_unit
        ),

        total_amount: Number(
            saleData.total_amount
        ),

        transportation_cost: Number(
            saleData.transportation_cost || 0
        ),

        other_cost: Number(
            saleData.other_cost || 0
        ),

        net_profit: Number(
            saleData.net_profit || 0
        ),

        sale_date:
            saleData.sale_date,

        payment_status:
            saleData.payment_status || "pending",

        notes:
            saleData.notes || null,

        mandi_id:
            saleData.mandi_id
                ? Number(saleData.mandi_id)
                : null,

        buyer_name:
            saleData.buyer_name || null
    };

    console.log("FINAL PAYLOAD SENT TO BACKEND:");
    console.log(payload);
    console.log(
        "price_per_unit =",
        payload.price_per_unit
    );
    console.log(
        "total_amount =",
        payload.total_amount
    );
    console.log("=================================");

    // Safety validation
    if (
        !Number.isFinite(
            payload.price_per_unit
        ) ||
        payload.price_per_unit <= 0
    ) {
        throw new Error(
            "Price per unit must be greater than 0"
        );
    }

    if (
        !Number.isFinite(
            payload.quantity
        ) ||
        payload.quantity <= 0
    ) {
        throw new Error(
            "Quantity must be greater than 0"
        );
    }

    try {

        const response =
            await api.post(
                "/sales",
                payload
            );

        console.log(
            "ADD SALE RESPONSE:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "ADD SALE ERROR:",
            error
        );

        console.error(
            "SERVER RESPONSE:",
            error.response?.data
        );

        throw error;
    }
};


// ============================================================
// GET ALL SALES
// ============================================================

export const getMySales = async () => {

    try {

        const response =
            await api.get("/sales");

        console.log(
            "GET SALES:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "GET SALES ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// GET SALES SUMMARY
// ============================================================

export const getSalesSummary = async () => {

    try {

        const response =
            await api.get(
                "/sales/summary"
            );

        console.log(
            "GET SALES SUMMARY:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "GET SALES SUMMARY ERROR:",
            error
        );

        console.error(
            "SUMMARY SERVER RESPONSE:",
            error.response?.data
        );

        throw error;
    }
};


// ============================================================
// GET SALE BY ID
// ============================================================

export const getSaleById = async (id) => {

    if (!id) {
        throw new Error(
            "Invalid sale ID"
        );
    }

    try {

        const response =
            await api.get(
                `/sales/${id}`
            );

        return response.data;

    } catch (error) {

        console.error(
            "GET SALE ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// UPDATE SALE
// ============================================================

export const updateSale = async (
    id,
    saleData
) => {

    if (!id) {
        throw new Error(
            "Invalid sale ID"
        );
    }

    const payload = {
        crop_id:
            Number(saleData.crop_id),

        quantity:
            Number(saleData.quantity),

        price_per_unit:
            Number(
                saleData.price_per_unit
            ),

        total_amount:
            Number(
                saleData.total_amount
            ),

        transportation_cost:
            Number(
                saleData.transportation_cost || 0
            ),

        other_cost:
            Number(
                saleData.other_cost || 0
            ),

        net_profit:
            Number(
                saleData.net_profit || 0
            ),

        sale_date:
            saleData.sale_date,

        payment_status:
            saleData.payment_status ||
            "pending",

        notes:
            saleData.notes || null,

        mandi_id:
            saleData.mandi_id
                ? Number(saleData.mandi_id)
                : null,

        buyer_name:
            saleData.buyer_name || null
    };

    try {

        const response =
            await api.put(
                `/sales/${id}`,
                payload
            );

        return response.data;

    } catch (error) {

        console.error(
            "UPDATE SALE ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// DELETE SALE
// ============================================================

export const deleteSale = async (id) => {

    if (!id) {
        throw new Error(
            "Invalid sale ID"
        );
    }

    try {

        const response =
            await api.delete(
                `/sales/${id}`
            );

        return response.data;

    } catch (error) {

        console.error(
            "DELETE SALE ERROR:",
            error
        );

        throw error;
    }
};