import React from "react";
import { Link } from "react-router-dom";
import "../Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Workasan</h2>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;