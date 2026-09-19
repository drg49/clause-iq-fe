import { handleResponse } from '../utils/helperMethods';

const root = process.env.REACT_APP_API_ROOT_URL + '/authentication';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const login = async (formData) => {
  const response = await handleResponse(
    await fetch(`${root}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }),
  );

  localStorage.setItem('token', response.access_token);

  return response;
};

export const register = async (formData) => {
  const response = await handleResponse(
    await fetch(`${root}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }),
  );

  localStorage.setItem('token', response.access_token);

  return response;
};

export const updateUser = async (formData) =>
  handleResponse(
    await fetch(`${root}/update-user`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    }),
  );

export const logout = async () =>
  handleResponse(
    await fetch(`${root}/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }),
  ).then(() => {
    localStorage.removeItem('token');
  });

export const validateUser = async () =>
  handleResponse(
    await fetch(`${root}/validate-user`, {
      method: 'GET',
      headers: getAuthHeaders(),
    }),
  );
