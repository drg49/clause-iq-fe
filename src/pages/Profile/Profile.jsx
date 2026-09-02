import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/authentication';
import Form from '../../components/Form/Form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { notifyError, notifySuccess } from '../../utils/toastMethods';
import { parseError } from '../../utils/helperMethods';
import { TOAST_POSITIONS, countries } from '../../utils/constants';
import Logo from '../../components/Logo/Logo';

const { TOP_CENTER } = TOAST_POSITIONS;

const Profile = ({ embedded = false }) => {
  const { user, setUser, setIsLoggedIn } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    first_name: user?.firstName || '',
    last_name: user?.lastName || '',
    email: user?.email || '',
    phone_number: user?.phoneNumber || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (isSaving) return;

    if (
      !profileForm.first_name.trim() ||
      !profileForm.last_name.trim() ||
      !profileForm.email.trim()
    ) {
      notifyError('First Name, Last Name, and Email are required.', TOP_CENTER);
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ...profileForm,
        bio: profileForm.bio?.trim() || null,
      };

      await api.updateUser(payload);
      notifySuccess('Profile updated successfully!', TOP_CENTER);
    } catch (err) {
      notifyError(parseError(err), TOP_CENTER);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsLoggedIn(false);
      setUser(null);
    } catch (err) {
      notifyError(parseError(err), TOP_CENTER);
    }
  };

  return (
    <div className={`profile-container${embedded ? ' embedded' : ''}`}>
      {!embedded && <Logo />}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2>Your Profile</h2>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Form id="profile-form" onSubmit={handleSubmit}>
        <TextField
          type="text"
          name="first_name"
          label="First Name *"
          placeholder="First Name"
          onChange={handleChange}
          value={profileForm.first_name}
          inputProps={{ maxLength: 25 }}
          fullWidth
          margin="normal"
        />

        <TextField
          type="text"
          name="last_name"
          label="Last Name *"
          placeholder="Last Name"
          onChange={handleChange}
          value={profileForm.last_name}
          inputProps={{ maxLength: 25 }}
          fullWidth
          margin="normal"
        />

        <TextField
          type="email"
          name="email"
          label="Email Address *"
          placeholder="Email Address"
          onChange={handleChange}
          value={profileForm.email}
          inputProps={{ maxLength: 150 }}
          fullWidth
          margin="normal"
        />

        <TextField
          type="tel"
          name="phone_number"
          label="Phone Number"
          onChange={handleChange}
          value={profileForm.phone_number}
          inputProps={{ maxLength: 20 }}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="profile-location-label">Country</InputLabel>
          <Select
            labelId="profile-location-label"
            id={`select-location`}
            name="location"
            value={profileForm.location}
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
          placeholder="Tell us about yourself..."
          onChange={handleChange}
          value={profileForm.bio}
          inputProps={{ maxLength: 1000 }}
          fullWidth
          margin="normal"
        />

        <Button
          id="save-profile-button"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSaving}
          type="button"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {isSaving ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default Profile;
