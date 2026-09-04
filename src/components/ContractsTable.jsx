import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

const ContractTable = ({ contracts, isLoading }) => {
  if (isLoading) {
    return (
      <TableContainer className="contract-table-wrap">
        <Table className="contract-table">
          <TableHead>
            <TableRow>
              <TableCell>Contract name</TableCell>
              <TableCell>Date analyzed</TableCell>
              <TableCell>Overall risk</TableCell>
              <TableCell>Findings</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell colSpan={5}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    py: 4,
                  }}
                >
                  <CircularProgress size={20} />

                  <Typography variant="body2">Loading contracts...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (contracts.length === 0) {
    return (
      <TableContainer className="contract-table-wrap">
        <Table className="contract-table">
          <TableHead>
            <TableRow>
              <TableCell>Contract name</TableCell>
              <TableCell>Date analyzed</TableCell>
              <TableCell>Overall risk</TableCell>
              <TableCell>Findings</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell colSpan={5}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 4,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No contracts uploaded yet.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer className="contract-table-wrap">
      <Table className="contract-table">
        <TableHead>
          <TableRow>
            <TableCell>Contract name</TableCell>
            <TableCell>Date analyzed</TableCell>
            <TableCell>Overall risk</TableCell>
            <TableCell>Findings</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id} hover>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      backgroundColor: "action.hover",
                    }}
                  >
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
                <Chip
                  className="contract-status-chip"
                  label="Uploaded"
                  size="small"
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContractTable;
