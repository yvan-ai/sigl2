import React from "react";

import BottomBar from "../components/BottomBar";
import "../styles/UserDashboard.css";
import Carousel from '../components/Carousel';
import InviteUserForm from "../components/AddUser";
import HorizontalNavbar from "../components/HorizontalNavbar";
import VerticalNavbar from "../components/VerticalNavbar";


const CoordinatorDashboard = () => {
    
    return (
        <div className="dashboard">
            <HorizontalNavbar />
            <VerticalNavbar />
            <div className="content">
                <main>
                    <h2>Bienvenue sur votre tableau de bord !</h2>
                    <p>Ici, vous pouvez gérer vos données cher coordo.</p>
                </main>
                <InviteUserForm />

                <BottomBar />
            </div>
        </div>
    );
};

export default CoordinatorDashboard;
