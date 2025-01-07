import React from "react";
import VerticalNavbar from "../components/VerticalNavbar";
import BottomBar from "../components/BottomBar";
import "../styles/UserDashboard.css";
import Carousel from '../components/Carousel';


const UserDashboard = () => {
    return (
        <div className="dashboard">
            <VerticalNavbar />
            <div className="content">
                <main>
                    <h2>Bienvenue sur votre tableau de bord !</h2>
                    <p>Ici, vous pouvez gérer vos données cher Apprenti.</p>
                </main>
                <Carousel />

                <BottomBar />
            </div>
        </div>
    );
};

export default UserDashboard;
