import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/');
    };
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-[#0f0f1c]">
      <div
        className="w-full max-w-3xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600
        flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-10
        rounded-lg p-6 sm:p-10"
      >
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full sm:w-3/5"
        >
          <h3 className="text-xl font-semibold">Profile Details</h3>

          {/* Image Upload */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 text-sm cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser.profilePic || assets.avatar_icon
              }
              alt="Avatar"
              className={`w-12 h-12 object-cover ${
                selectedImg || authUser.profilePic ? 'rounded-full' : ''
              }`}
            />
            Upload profile image
          </label>

          {/* Name Input */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md bg-transparent text-white text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Bio Textarea */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            required
            placeholder="Write Profile bio..."
            className="p-2 border border-gray-500 rounded-md bg-transparent text-white text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white py-2 rounded-full
              text-sm sm:text-base font-medium hover:opacity-90 transition"
          >
            Save
          </button>
        </form>

        {/* Profile Picture Preview */}
        <img
          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full"
          src={authUser.profilePic || assets.logo_icon}
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
