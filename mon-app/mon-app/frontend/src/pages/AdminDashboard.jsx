import React from "react";
import VerticalNavbar from "../components/VerticalNavbar";
import BottomBar from "../components/BottomBar";
import "../styles/UserDashboard.css";
import Carousel from '../components/Carousel';
import JournalDeFormationForm from "../components/CreateJournauxForm";
import EventForm from "../components/EventForm";
import InviteUserForm from "../components/AddUser";

const AdminDashboard = () => {
    
    return (
        <div className="dashboard">
            <VerticalNavbar />
            <InviteUserForm/>
            <div className="content">
                <main>
                    <h2>Bienvenue sur votre tableau de bord !</h2>
                    <p>Ici, vous pouvez gérer vos données cher Adminnnnnnnnnnnnnnnnnnnnnnnnnnnn.</p>
                </main>
                

                <BottomBar />
            </div>
        </div>
    );
};

export default AdminDashboard;
