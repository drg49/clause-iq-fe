import { useCallback, useEffect, useState } from "react";
import { deleteContract, getContracts, uploadContract } from "../api/contracts";
import { notifyError, notifySuccess } from "../utils/toastMethods";

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
        notifyError(error.message || "Unable to load contracts.");
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
    const hasInProgressContracts = contracts.some(
      (contract) =>
        contract.status === "PENDING" || contract.status === "ANALYZING",
    );

    if (!hasInProgressContracts) {
      return undefined;
    }

    const refreshInterval = setInterval(() => {
      fetchContracts(paginated ? page : 0, paginated ? rowsPerPage : 5);
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, [contracts, fetchContracts, page, paginated, rowsPerPage]);

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

      notifySuccess(`${file.name} uploaded successfully.`);
    } catch (error) {
      notifyError(error.message || "Unable to upload the contract.");
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

      notifySuccess(`${contract.name} deleted successfully.`);
    } catch (error) {
      notifyError(error.message || "Unable to delete the contract.");
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
