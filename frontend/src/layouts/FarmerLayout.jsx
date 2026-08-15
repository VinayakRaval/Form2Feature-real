import React from "react";
import Navbar from "../components/Navbar";

function FarmerLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <Navbar />

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main
                id="main-content"
                tabIndex="-1"
                className="outline-none"
            >
                {children}
            </main>

        </div>
    );
}

export default FarmerLayout;