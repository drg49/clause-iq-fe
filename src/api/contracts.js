import { handleResponse } from '../utils/helperMethods';

const root = process.env.REACT_APP_API_ROOT_URL + '/contracts';

export const uploadContract = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');

  return handleResponse(
    await fetch(`${root}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }),
  );
};
