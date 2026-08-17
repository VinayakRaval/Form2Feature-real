import React from "react";
import BuyerNavbar from "../components/BuyerNavbar";

function BuyerLayout({ children }) {

    return (

        <div className="min-h-screen bg-gray-100">

            <BuyerNavbar />

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

export default BuyerLayout;