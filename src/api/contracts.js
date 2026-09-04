import { handleResponse } from "../utils/helperMethods";

const root = process.env.REACT_APP_API_ROOT_URL + "/contracts";
const token = localStorage.getItem("token");

export const uploadContract = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return handleResponse(
    await fetch(`${root}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }),
  );
};

export const getContracts = async () =>
  handleResponse(
    await fetch(root, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
