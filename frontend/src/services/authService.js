import api from "./api";

export const registerFarmer = async (data) => {
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};

export const loginUser = async (data) => {

    const response = await api.post(
        "/auth/login",
        data
    );

    if (response.data.success) {

        localStorage.setItem(
            "form2feature_token",
            response.data.token
        );

        localStorage.setItem(
            "form2feature_user",
            JSON.stringify(response.data.user)
        );
    }

    return response.data;
};

export const logoutUser = () => {

    localStorage.removeItem(
        "form2feature_token"
    );

    localStorage.removeItem(
        "form2feature_user"
    );
};

export const getCurrentUser = () => {

    const user = localStorage.getItem(
        "form2feature_user"
    );

    return user
        ? JSON.parse(user)
        : null;
};