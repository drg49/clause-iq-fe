import { useCallback, useEffect, useState } from "react";
import { getContracts, uploadContract } from "../api/contracts";
import { notifyError, notifySuccess } from "../utils/toastMethods";

const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchContracts = useCallback(async () => {
    try {
      const response = await getContracts();

      setContracts(response.contracts || []);
    } catch (error) {
      notifyError(error.message || "Unable to load contracts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleUpload = async (file) => {
    setIsUploading(true);

    try {
      await uploadContract(file);
      await fetchContracts();

      notifySuccess(`${file.name} uploaded successfully.`);
    } catch (error) {
      notifyError(error.message || "Unable to upload the contract.");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    contracts,
    isLoading,
    isUploading,
    fetchContracts,
    handleUpload,
  };
};

export default useContracts;