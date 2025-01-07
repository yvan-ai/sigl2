import React from "react";
import "../styles/Dashboard.css";

const Sidebar = () => (
  <div className="sidebar">
    <h2 className="logo">Pitch.io</h2>
    <ul>
      <li className="active">Dashboard</li>
      <li>Editor</li>
      <li>Leads</li>
      <li>Settings</li>
      <li>Preview</li>
    </ul>
    <div className="upgrade">
      <p>Upgrade to Pro</p>
    </div>
  </div>
);

const Header = () => (
  <div className="header">
    <div className="welcome">
      <h1>Hi, Alyssa</h1>
      <p>Ready to start your day with some pitch decks?</p>
    </div>
    <div className="user-info">
      <span className="user-avatar">AJ</span>
      <span className="user-name">Alyssa Jones</span>
    </div>
  </div>
);

const Stats = () => (
  <div className="stats">
    <div className="stat-card yellow">
      <h3>83%</h3>
      <p>Open Rate</p>
    </div>
    <div className="stat-card purple">
      <h3>77%</h3>
      <p>Complete</p>
    </div>
    <div className="stat-card pink">
      <h3>91</h3>
      <p>Unique Views</p>
    </div>
    <div className="stat-card gray">
      <h3>126</h3>
      <p>Total Views</p>
    </div>
  </div>
);

const ItemList = () => (
  <div className="item-list">
    <div className="item">
      <div className="item-info">
        <h3>Next in Fashion</h3>
        <p>10 Slides</p>
      </div>
      <div className="item-actions">
        <button className="public">Public</button>
      </div>
    </div>
    <div className="item">
      <div className="item-info">
        <h3>Digital Marketing Today</h3>
        <p>10 Slides</p>
      </div>
      <div className="item-actions">
        <button className="private">Private</button>
      </div>
    </div>
  </div>
);

const TutorDashboard = () => (
  <div className="dashboard">
    <Sidebar />
    <main>
      <Header />
      <Stats />
      <ItemList />
    </main>
  </div>
);

export default TutorDashboard;
