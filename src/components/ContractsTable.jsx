import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ContractTable = ({
  contracts,
  isLoading,
  page,
  rowsPerPage,
  total,
  showPagination,
  onPageChange,
  onRowsPerPageChange,
  onDeleteContract,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  const openMenu = (event, contract) => {
    setMenuAnchor(event.currentTarget);
    setSelectedContract(contract);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedContract(null);
  };

  const handleAction = (action) => {
    if (action === "Delete Contract") {
      onDeleteContract(selectedContract);
    } else {
      console.log(action, selectedContract);
    }

    closeMenu();
  };

  return (
    <div className="contract-table-shell">
      <TableContainer className="contract-table-wrap">
        <Table className="contract-table">
          <TableHead>
            <TableRow>
              <TableCell>Contract name</TableCell>
              <TableCell>Date analyzed</TableCell>
              <TableCell>Overall risk</TableCell>
              <TableCell>Findings</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="contract-actions-cell">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box className="contract-table-message">
                    <CircularProgress size={20} />
                    <Typography variant="body2">
                      Loading contracts...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box className="contract-table-message">
                    <Typography variant="body2" color="text.secondary">
                      No contracts uploaded yet.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow key={contract.id} hover>
                  <TableCell>
                    <Box className="contract-name">
                      <Box className="document-icon">
                        <FontAwesomeIcon icon={faFileContract} />
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {contract.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      className="contract-risk-chip"
                      label="Pending analysis"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box className="contract-status-cell">
                      <Chip
                        className="contract-status-chip"
                        label={contract.status}
                        size="small"
                        variant="outlined"
                      />

                      {contract.status === "ANALYZING" && (
                        <CircularProgress
                          aria-label="Contract analysis in progress"
                          size={16}
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell className="contract-actions-cell">
                    <IconButton
                      aria-label={`Actions for ${contract.name}`}
                      onClick={(event) => openMenu(event, contract)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem onClick={() => handleAction("View Analysis")}>
          View Analysis
        </MenuItem>
        <MenuItem onClick={() => handleAction("Preview Contract")}>
          Preview Contract
        </MenuItem>
        <MenuItem onClick={() => handleAction("Delete Contract")}>
          Delete Contract
        </MenuItem>
      </Menu>

      {showPagination && (
        <TablePagination
          className="contract-table-pagination"
          component="div"
          count={total}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}
    </div>
  );
};

export default ContractTable;
