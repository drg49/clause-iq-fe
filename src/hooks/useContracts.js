import { useCallback, useEffect, useState } from "react";
import { deleteContract, getContracts, uploadContract } from "../api/contracts";
import { TOAST_POSITIONS } from "../utils/constants";
import { notifyError, notifySuccess } from "../utils/toastMethods";

const { BOTTOM_RIGHT } = TOAST_POSITIONS;
const POLLING_INTERVAL_MS = 10000;

const useContracts = ({ paginated = false } = {}) => {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchContracts = useCallback(
    async (currentPage, currentRowsPerPage) => {
      setIsLoading(true);

      try {
        const response = await getContracts({
          limit: currentRowsPerPage,
          offset: currentPage * currentRowsPerPage,
        });

        setContracts(response.contracts || []);
        setTotal(response.pagination?.total || 0);
      } catch (error) {
        notifyError(error.message || "Unable to load contracts.", BOTTOM_RIGHT);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchContracts(paginated ? page : 0, paginated ? rowsPerPage : 5);
  }, [fetchContracts, page, paginated, rowsPerPage]);

  useEffect(() => {
    const hasActiveAnalysis = contracts.some(
      (contract) =>
        contract.status === "ANALYZING" || contract.status === "PENDING",
    );

    if (!hasActiveAnalysis) {
      return undefined;
    }

    const pollingId = setInterval(() => {
      fetchContracts(paginated ? page : 0, paginated ? rowsPerPage : 5);
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(pollingId);
  }, [contracts, fetchContracts, paginated, page, rowsPerPage]);

  const handlePageChange = (_, nextPage) => {
    setPage(nextPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleUpload = async (file) => {
    setIsUploading(true);

    try {
      await uploadContract(file);
      await fetchContracts(paginated ? page : 0, paginated ? rowsPerPage : 5);

      notifySuccess(`${file.name} uploaded successfully.`, BOTTOM_RIGHT);
    } catch (error) {
      notifyError(
        error.message || "Unable to upload the contract.",
        BOTTOM_RIGHT,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (contract) => {
    try {
      await deleteContract(contract.id);

      if (paginated && page > 0 && contracts.length === 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await fetchContracts(paginated ? page : 0, paginated ? rowsPerPage : 5);
      }

      notifySuccess(`${contract.name} deleted successfully.`, BOTTOM_RIGHT);
    } catch (error) {
      notifyError(
        error.message || "Unable to delete the contract.",
        BOTTOM_RIGHT,
      );
    }
  };

  return {
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
  };
};

export default useContracts;
