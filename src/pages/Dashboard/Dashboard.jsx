import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  faArrowUpRightFromSquare,
  faChartLine,
  faFileContract,
  faGear,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo/Logo";
import Profile from "../Profile/Profile";
import "./Dashboard.scss";

const contracts = [
  {
    name: "Northstar Partnership Agreement",
    date: "Aug 24, 2024",
    risk: "Low",
    findings: 2,
    status: "Reviewed",
  },
  {
    name: "Acme SaaS Master Services Agreement",
    date: "Aug 21, 2024",
    risk: "Medium",
    findings: 8,
    status: "Reviewed",
  },
  {
    name: "Brightline Employment Contract",
    date: "Aug 17, 2024",
    risk: "High",
    findings: 14,
    status: "Needs review",
  },
  {
    name: "Luma Ventures NDA",
    date: "Aug 12, 2024",
    risk: "Low",
    findings: 1,
    status: "Reviewed",
  },
];

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: faChartLine },
  { label: "Contracts", path: "/contracts", icon: faFileContract },
  { label: "Settings", path: "/settings", icon: faGear },
];

const Dashboard = ({ view = "dashboard" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.username?.split(" ")[0] || "Alex";
  const isContractsView = view === "contracts";
  const isSettingsView = view === "settings";

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Logo />
        </div>
        <div className="sidebar-section-label">Workspace</div>
        <List
          className="sidebar-nav"
          component="nav"
          aria-label="Main navigation"
          disablePadding
        >
          {navigation.map((item) => (
            <ListItemButton
              component={NavLink}
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={item.icon} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-kicker">CLAUSEIQ INSIGHT</span>
            <strong>Turn legal language into clear decisions.</strong>
            <Button
              type="button"
              onClick={() => navigate("/contracts")}
              endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            >
              Explore contracts
            </Button>
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.username || "Alex Morgan"}</strong>
              <span>Personal workspace</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">
              {isSettingsView
                ? "SETTINGS"
                : isContractsView
                  ? "CONTRACTS"
                  : "OVERVIEW"}
            </p>
            <h1>
              {isSettingsView
                ? "Account settings"
                : isContractsView
                  ? "All contracts"
                  : `Good morning, ${firstName}`}
            </h1>
          </div>
          <Button
            type="button"
            className="analyze-button"
            onClick={() => navigate("/contracts")}
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Analyze contract
          </Button>
        </header>

        {isSettingsView ? (
          <Profile embedded />
        ) : (
          !isContractsView && (
            <section className="welcome-panel">
              <div>
                <span className="panel-label">YOUR LEGAL WORKSPACE</span>
                <h2>Know what you&apos;re signing.</h2>
                <p>
                  Upload a contract and let ClauseIQ surface risk, missing
                  protections, and negotiation opportunities.
                </p>
                <Button
                  type="button"
                  className="panel-action"
                  onClick={() => navigate("/contracts")}
                  endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                >
                  Start an analysis
                </Button>
              </div>
              <div className="panel-mark">
                <FontAwesomeIcon icon={faFileContract} />
              </div>
            </section>
          )
        )}

        {!isSettingsView && (
          <section className="contracts-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR LIBRARY</p>
                <h2>
                  {isContractsView
                    ? "Contract library"
                    : "Recently analyzed contracts"}
                </h2>
              </div>
              <Button
                type="button"
                className="view-all"
                onClick={() => navigate("/contracts")}
                endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
              >
                View all
              </Button>
            </div>
            <div className="contract-table-wrap">
              <table className="contract-table">
                <thead>
                  <tr>
                    <th>Contract name</th>
                    <th>Date analyzed</th>
                    <th>Overall risk</th>
                    <th>Findings</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.name}>
                      <td>
                        <div className="contract-name">
                          <span className="document-icon">
                            <FontAwesomeIcon icon={faFileContract} />
                          </span>
                          <strong>{contract.name}</strong>
                        </div>
                      </td>
                      <td>{contract.date}</td>
                      <td>
                        <span
                          className={`risk risk-${contract.risk.toLowerCase()}`}
                        >
                          <i />
                          {contract.risk}
                        </span>
                      </td>
                      <td>
                        {contract.findings}{" "}
                        {contract.findings === 1 ? "finding" : "findings"}
                      </td>
                      <td>
                        <span
                          className={`status ${contract.status === "Needs review" ? "status-review" : ""}`}
                        >
                          {contract.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
