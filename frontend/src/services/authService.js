import api from "./api";

// ============================================================
// REGISTER FARMER / BUYER
// ============================================================

export const registerUser = async (data) => {
    const response = await api.post(
        "/auth/register",
        {
            full_name: data.full_name,
            email: data.email,
            mobile: data.mobile,
            password: data.password,
            role: data.role || "farmer",
        }
    );

    return response.data;
};


// ============================================================
// BACKWARD COMPATIBILITY
// Existing Farmer registration can continue using this
// ============================================================

export const registerFarmer = async (data) => {

    return registerUser({
        ...data,
        role: "farmer",
    });

};


// ============================================================
// REGISTER BUYER
// ============================================================

export const registerBuyer = async (data) => {

    return registerUser({
        ...data,
        role: "buyer",
    });

};


// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (data) => {

    const response = await api.post(
        "/auth/login",
        {
            email: data.email,
            password: data.password,
        }
    );

    console.log(
        "LOGIN RESPONSE:",
        response.data
    );

    // ========================================================
    // LOGIN SUCCESS
    // ========================================================

    if (response.data.success) {

        const token =
            response.data.token;

        const user =
            response.data.user;

        // ----------------------------------------------------
        // Store token
        // ----------------------------------------------------

        localStorage.setItem(
            "form2feature_token",
            token
        );

        // ----------------------------------------------------
        // Store user
        // ----------------------------------------------------

        localStorage.setItem(
            "form2feature_user",
            JSON.stringify(user)
        );

        // ----------------------------------------------------
        // Also store token as "token"
        //
        // IMPORTANT:
        // Your api.js from the earlier code was using:
        // localStorage.getItem("token")
        //
        // So storing both prevents JWT problems.
        // ----------------------------------------------------

        localStorage.setItem(
            "token",
            token
        );

        // ----------------------------------------------------
        // Also store user as "user"
        // ----------------------------------------------------

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        console.log(
            "LOGIN SUCCESS"
        );

        console.log(
            "USER:",
            user
        );

        console.log(
            "ROLE:",
            user?.role
        );
    }

    return response.data;
};


// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = () => {

    localStorage.removeItem(
        "form2feature_token"
    );

    localStorage.removeItem(
        "form2feature_user"
    );

    // Remove keys used by api.js
    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );
};


// ============================================================
// GET CURRENT USER
// ============================================================

export const getCurrentUser = () => {

    const user =
        localStorage.getItem(
            "form2feature_user"
        );

    if (!user) {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch (error) {

        console.error(
            "Invalid stored user:",
            error
        );

        logoutUser();

        return null;
    }
};


// ============================================================
// GET CURRENT ROLE
// ============================================================

export const getCurrentRole = () => {

    const user =
        getCurrentUser();

    return user?.role || null;
};


// ============================================================
// CHECK FARMER
// ============================================================

export const isFarmer = () => {

    return (
        getCurrentRole() === "farmer"
    );
};


// ============================================================
// CHECK BUYER
// ============================================================

export const isBuyer = () => {

    return (
        getCurrentRole() === "buyer"
    );
};