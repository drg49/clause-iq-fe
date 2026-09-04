import { handleResponse } from "../utils/helperMethods";

const root = process.env.REACT_APP_API_ROOT_URL + "/contracts";
export const uploadContract = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return handleResponse(
    await fetch(`${root}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }),
  );
};

export const getContracts = async ({ limit = 10, offset = 0 } = {}) => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  return handleResponse(
    await fetch(`${root}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
  );
};

export const deleteContract = async (contractId) =>
  handleResponse(
    await fetch(`${root}/${contractId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
  );
