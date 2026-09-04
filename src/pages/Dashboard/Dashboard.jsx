import React, { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faChartLine,
  faFileContract,
  faGear,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo/Logo";
import Profile from "../Profile/Profile";
import ContractsTable from "../../components/ContractsTable";
import useContracts from "../../hooks/useContracts";

import "./Dashboard.scss";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: faChartLine,
  },
  {
    label: "Contracts",
    path: "/contracts",
    icon: faFileContract,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: faGear,
  },
];

const Dashboard = ({ view = "dashboard" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const isContractsView = view === "contracts";
  const isSettingsView = view === "settings";

  const {
    contracts,
    isLoading,
    isUploading,
    page,
    rowsPerPage,
    total,
    handlePageChange,
    handleRowsPerPageChange,
    handleUpload,
    handleDelete,
  } = useContracts({ paginated: isContractsView });

  const firstName = user?.firstName || "Alex";

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    await handleUpload(file);
  };

  const openUploadPicker = () => {
    fileInputRef.current?.click();
  };

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
              <strong>
                {`${user?.firstName || "Alex"} ${user?.lastName || "Morgan"}`}
              </strong>

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

          {isContractsView && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                ref={fileInputRef}
                accept=".pdf"
                className="contract-file-input"
                onChange={handleFileSelected}
                type="file"
              />

              <Button
                type="button"
                variant="contained"
                disabled={isUploading}
                onClick={openUploadPicker}
                startIcon={<FontAwesomeIcon icon={faPlus} />}
              >
                {isUploading ? "Uploading..." : "Upload contract"}
              </Button>
            </Box>
          )}
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

                <Button type="button" onClick={() => navigate("/contracts")}>
                  Begin analysis
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

              {!isContractsView && (
                <Button
                  type="button"
                  className="view-all"
                  onClick={() => navigate("/contracts")}
                  endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                >
                  View all
                </Button>
              )}
            </div>

            <ContractsTable
              contracts={contracts}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onDeleteContract={handleDelete}
              page={page}
              rowsPerPage={rowsPerPage}
              showPagination={isContractsView}
              total={total}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
