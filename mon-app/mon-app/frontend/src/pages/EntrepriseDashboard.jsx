import React from "react";
import VerticalNavbar from "../components/VerticalNavbar";
import BottomBar from "../components/BottomBar";
import "../styles/UserDashboard.css";
import Carousel from '../components/Carousel';


const EntrepriseDashboard = () => {
    return (
        <div className="dashboard">
            <VerticalNavbar />
            <div className="content">
                <main>
                    <h2>Bienvenue sur votre tableau de bord !</h2>
                    <p>Ici, vous pouvez gérer vos données cher Entreprise partenaire.</p>
                </main>
                <Carousel />

                <BottomBar />
            </div>
        </div>
    );
};

export default EntrepriseDashboard;
