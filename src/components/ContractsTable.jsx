import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
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
import { formatContractDate } from "../utils/helperMethods";

const statusLabels = {
  PENDING: "Pending...",
  ANALYZING: "Analyzing...",
  ANALYZED: "Analyzed",
  FAILED: "Failed",
};

const getStatusLabel = (status) => statusLabels[status] || status || "Unknown";

const getContractRiskValue = (contract) => {
  const value =
    contract?.overall_risk ??
    contract?.overallRisk ??
    contract?.risk_score ??
    contract?.riskScore ??
    contract?.risk_level ??
    contract?.riskLevel ??
    contract?.risk ??
    null;

  if (value === null || value === undefined || value === "") {
    return contract?.status === "ANALYZED" ? "LOW" : "Pending analysis";
  }

  if (typeof value === "object") {
    if (typeof value.score === "number") {
      return `${value.score}`;
    }

    if (value.label) {
      return value.label;
    }

    if (value.name) {
      return value.name;
    }

    return "Risk detected";
  }

  return String(value);
};

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
  onViewAnalysis,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const openMenu = (event, contract) => {
    setMenuAnchor(event.currentTarget);
    setSelectedContract(contract);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedContract(null);
  };

  const closeAnalysisModal = () => {
    setAnalysisModalOpen(false);
    setAnalysisLoading(false);
    setAnalysisData(null);
  };

  const handleAction = async (action) => {
    if (action === "Delete Contract") {
      onDeleteContract(selectedContract);
    } else if (action === "View Analysis") {
      if (!selectedContract || selectedContract.status !== "ANALYZED") {
        closeMenu();
        return;
      }

      setAnalysisLoading(true);
      setAnalysisModalOpen(true);
      closeMenu();

      const result = await onViewAnalysis?.(selectedContract.id);
      setAnalysisData(result || null);
      setAnalysisLoading(false);
    } else {
      console.log(action, selectedContract);
    }
  };

  return (
    <div className="contract-table-shell">
      <TableContainer className="contract-table-wrap">
        <Table className="contract-table">
          <TableHead>
            <TableRow>
              <TableCell>Contract</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Overall Risk</TableCell>
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
                      {formatContractDate(contract.created_at)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      className="contract-risk-chip"
                      label={getContractRiskValue(contract)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {contract.findings_count ?? "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box className="contract-status-cell">
                      <Chip
                        className={`contract-status-chip ${contract.status.toLowerCase()}`}
                        label={getStatusLabel(contract.status)}
                        size="small"
                        variant="outlined"
                      />
                      {contract.status === "ANALYZING" && (
                        <CircularProgress
                          aria-label={`${getStatusLabel(contract.status)} contract analysis`}
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
        <MenuItem
          disabled={selectedContract?.status !== "ANALYZED"}
          onClick={() => handleAction("View Analysis")}
        >
          View Analysis
        </MenuItem>
        <MenuItem onClick={() => handleAction("Preview Contract")}>
          Preview Contract
        </MenuItem>
        <MenuItem onClick={() => handleAction("Delete Contract")}>
          Delete Contract
        </MenuItem>
      </Menu>

      <Dialog
        fullWidth
        maxWidth="md"
        onClose={closeAnalysisModal}
        open={analysisModalOpen}
      >
        <DialogTitle>
          {selectedContract?.name || "Contract analysis"}
        </DialogTitle>

        <DialogContent dividers>
          {analysisLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={18} />
              <Typography variant="body2">Loading findings...</Typography>
            </Box>
          ) : analysisData ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={`Overall risk: ${getContractRiskValue(analysisData.contract)}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`${analysisData.findings?.length ?? 0} findings`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {analysisData.findings?.length ? (
                analysisData.findings.map((finding) => (
                  <Box
                    key={finding.id}
                    sx={{
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}
                    >
                      <Chip label={finding.type} size="small" />
                      <Chip label={finding.severity} size="small" />
                    </Box>

                    <Typography fontWeight={700} gutterBottom>
                      {finding.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {finding.explanation}
                    </Typography>

                    <Typography variant="body2" paragraph>
                      <strong>Recommendation:</strong> {finding.recommendation}
                    </Typography>

                    {finding.evidence?.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Evidence
                        </Typography>
                        {finding.evidence.map((item, index) => (
                          <Box
                            key={`${finding.id}-evidence-${index}`}
                            sx={{
                              backgroundColor: "rgba(0,0,0,0.02)",
                              borderRadius: 1,
                              p: 1.5,
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Chunk {item.chunk_index}
                            </Typography>
                            <Typography variant="body2">
                              {item.content}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No findings were generated for this contract.
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Analysis is not available for this contract.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeAnalysisModal}>Close</Button>
        </DialogActions>
      </Dialog>

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
