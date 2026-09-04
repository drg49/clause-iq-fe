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
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

const ContractTable = ({
  contracts,
  isLoading,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}) => {
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Box className="contract-table-message">
                  <CircularProgress size={20} />
                  <Typography variant="body2">Loading contracts...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
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
                  <Chip
                    className="contract-status-chip"
                    label="Uploaded"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
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
    </TableContainer>
  );
};

export default ContractTable;
