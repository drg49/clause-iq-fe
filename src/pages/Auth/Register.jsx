import { useState } from 'react';

import Form from '../../components/Form/Form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import * as api from '../../api/authentication';
import { useAuth } from '../../context/AuthContext';
import { formContainsEmptyValues } from '../../utils/validation';
import { parseError } from '../../utils/helperMethods';
import { notifyError } from '../../utils/toastMethods';
import { TOAST_POSITIONS, countries } from '../../utils/constants';

const { TOP_CENTER } = TOAST_POSITIONS;

const Register = ({ isLoading, setIsLoading }) => {
  // Track the registration step (1: Required Credentials, 2: Remaining Optional Details)
  const [step, setStep] = useState(1);

  const [registerForm, setRegisterForm] = useState({
    // Step 1 Fields
    first_name: '',
    last_name: '',
    email: '',
    password: '',

    // Step 2 Fields
    phone_number: '',
    bio: '',
    location: 'United States',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 1 Data Normalization
  const normalizeAuthData = (form) => ({
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
  });

  // Step 2 Data Normalization
  const normalizeProfileData = (form) => ({
    phone_number: form.phone_number.trim() || null,
    bio: form.bio?.trim() || null,
    location: form.location.trim() || null,
  });

  const { setIsLoggedIn, setUser } = useAuth();

  // Handles Step 1 Submission
  const handleAuthSubmit = async (e) => {
    e?.preventDefault?.();

    if (isLoading) return;

    if (
      formContainsEmptyValues({
        first_name: registerForm.first_name,
        last_name: registerForm.last_name,
        email: registerForm.email,
        password: registerForm.password,
      })
    ) {
      notifyError('Please fill required fields', TOP_CENTER);
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.register(normalizeAuthData(registerForm));

      setUser(response.user);
      setStep(2);
    } catch (err) {
      notifyError(parseError(err), TOP_CENTER);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles Step 2 Submission
  const handleProfileSubmit = async (e) => {
    e?.preventDefault?.();

    if (isLoading) return;

    try {
      setIsLoading(true);

      const response = await api.updateUser(normalizeProfileData(registerForm));

      if (response?.user) {
        setUser(response.user);
      }

      setIsLoggedIn(true);
    } catch (err) {
      notifyError(parseError(err), TOP_CENTER);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      id="register-form"
      onSubmit={step === 1 ? handleAuthSubmit : handleProfileSubmit}
    >
      {step === 1 ? (
        <>
          <Typography variant="h6">Create Your Account</Typography>
          <TextField
            type="text"
            name="first_name"
            label="First Name"
            placeholder="First Name *"
            onChange={handleChange}
            value={registerForm.first_name}
            inputProps={{ maxLength: 25 }}
            fullWidth
            margin="normal"
          />

          <TextField
            type="text"
            name="last_name"
            label="Last Name"
            placeholder="Last Name *"
            onChange={handleChange}
            value={registerForm.last_name}
            inputProps={{ maxLength: 25 }}
            fullWidth
            margin="normal"
          />

          <TextField
            type="email"
            name="email"
            label="Email Address"
            placeholder="Email *"
            onChange={handleChange}
            value={registerForm.email}
            inputProps={{ maxLength: 150 }}
            fullWidth
            margin="normal"
          />

          <TextField
            type="password"
            name="password"
            label="Password"
            placeholder="Password *"
            onChange={handleChange}
            value={registerForm.password}
            inputProps={{ maxLength: 255 }}
            fullWidth
            margin="normal"
          />

          <Button
            id="register-button"
            variant="contained"
            color="primary"
            onClick={handleAuthSubmit}
            disabled={isLoading}
            type="button"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              'Continue'
            )}
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6">
            Nice to meet you {registerForm.first_name}! Tell us a bit more about
            yourself.
          </Typography>

          <TextField
            type="tel"
            name="phone_number"
            label="Phone Number"
            placeholder="Optional"
            onChange={handleChange}
            value={registerForm.phone_number}
            inputProps={{ maxLength: 20 }}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="location-label">Country</InputLabel>
            <Select
              labelId="location-label"
              id={`select-location`}
              name="location"
              value={registerForm.location}
              label="Country"
              onChange={handleChange}
            >
              {countries.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="text"
            name="bio"
            label="Bio"
            placeholder="Optional"
            onChange={handleChange}
            value={registerForm.bio}
            inputProps={{ maxLength: 1000 }}
            fullWidth
            margin="normal"
          />

          <Button
            id="profile-button"
            variant="contained"
            color="primary"
            onClick={handleProfileSubmit}
            disabled={isLoading}
            type="button"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              'Complete Profile'
            )}
          </Button>
        </>
      )}
    </Form>
  );
};

export default Register;
