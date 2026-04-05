import React, { useEffect, useRef, useState } from 'react';
import { User, Save, UploadCloud, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../shared/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const avatarInputRef = useRef(null);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const backendBase = apiBase.replace(/\/api\/?$/, '');
  const avatarSrc = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${backendBase}${user.avatar}`)
    : 'https://via.placeholder.com/120';

  const [profileForm, setProfileForm] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodGroup: '',
    medicalConditions: '',
    medications: '',
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name || '',
      age: user.profile?.age ?? '',
      gender: user.profile?.gender || '',
      height: user.profile?.height ?? '',
      weight: user.profile?.weight ?? '',
      bloodGroup: user.profile?.bloodGroup || '',
      medicalConditions: (user.profile?.medicalConditions || []).join(', '),
      medications: (user.profile?.medications || []).join(', '),
    });
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileSuccess('');
    setProfileError('');
  };

  const toStringArray = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!profileForm.name.trim()) {
      setProfileError('Name is required.');
      return;
    }

    setIsSavingProfile(true);

    try {
      const payload = {
        name: profileForm.name.trim(),
        profile: {
          age: profileForm.age === '' ? undefined : Number(profileForm.age),
          gender: profileForm.gender || undefined,
          height: profileForm.height === '' ? undefined : Number(profileForm.height),
          weight: profileForm.weight === '' ? undefined : Number(profileForm.weight),
          bloodGroup: profileForm.bloodGroup.trim() || undefined,
          medicalConditions: toStringArray(profileForm.medicalConditions),
          medications: toStringArray(profileForm.medications),
        },
      };

      const data = await authService.updateProfile(payload);
      if (data?.user) {
        updateUser(data.user);
      }

      setProfileSuccess('Profile updated successfully.');
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file.');
      return;
    }

    setProfileSuccess('');
    setProfileError('');
    setIsUploadingAvatar(true);

    try {
      const data = await authService.uploadProfileAvatar(file);
      if (data?.user) {
        updateUser(data.user);
      }
      setProfileSuccess('Profile photo uploaded successfully.');
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to upload profile photo.');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0b1030]">Profile Settings</h2>
        <p className="text-sm sm:text-base text-[#5f697a]">Manage your account details and health profile.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="dash-card-static">
          <h3 className="dash-heading text-base sm:text-lg mb-5 flex items-center gap-2">
            <div className="dash-icon-badge bg-[#506cd7]">
              <User size={20} className="text-white" />
            </div>
            Personal Information
          </h3>

          <div className="mb-5 p-4 border border-[#e8eaf9] rounded-xl bg-[#f0f1fc]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={avatarSrc}
                alt="Profile avatar"
                className="w-20 h-20 rounded-full object-cover border border-[#e8eaf9]"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0b1030] mb-2">Profile Photo</p>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      Upload Photo <UploadCloud size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {profileSuccess && (
            <div className="mb-5 p-3 rounded-xl border border-green-200 bg-green-50 text-green-700 flex items-center gap-2 text-sm">
              <CheckCircle size={16} /> {profileSuccess}
            </div>
          )}

          {profileError && (
            <div className="mb-5 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="dash-input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="dash-input !bg-[#e8eaf9] text-[#5f697a] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Age</label>
                <input
                  type="number"
                  min="1"
                  name="age"
                  value={profileForm.age}
                  onChange={handleProfileChange}
                  className="dash-input"
                  placeholder="28"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Gender</label>
                <select
                  name="gender"
                  value={profileForm.gender}
                  onChange={handleProfileChange}
                  className="dash-input"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  min="1"
                  name="height"
                  value={profileForm.height}
                  onChange={handleProfileChange}
                  className="dash-input"
                  placeholder="170"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  min="1"
                  name="weight"
                  value={profileForm.weight}
                  onChange={handleProfileChange}
                  className="dash-input"
                  placeholder="65"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={profileForm.bloodGroup}
                onChange={handleProfileChange}
                className="dash-input"
                placeholder="B+"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Medical Conditions</label>
                <textarea
                  rows="3"
                  name="medicalConditions"
                  value={profileForm.medicalConditions}
                  onChange={handleProfileChange}
                  className="dash-input resize-none"
                  placeholder="Diabetes, Hypertension"
                />
                <p className="text-xs text-[#5f697a] mt-1">Use comma to separate multiple values.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b1030] mb-1.5">Medications</label>
                <textarea
                  rows="3"
                  name="medications"
                  value={profileForm.medications}
                  onChange={handleProfileChange}
                  className="dash-input resize-none"
                  placeholder="Metformin, Aspirin"
                />
                <p className="text-xs text-[#5f697a] mt-1">Use comma to separate multiple values.</p>
              </div>
            </div>

            <div className="pt-1">
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Save Profile <Save size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
