import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../context/chatContext.jsx';
import { AuthContext } from '../context/authContext.jsx';

const RightSidebar = ({ mobile = false, onClose }) => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUser } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    const images = messages.filter((msg) => msg.image).map((msg) => msg.image);
    setMsgImages(images);
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div
      className={`${
        mobile
          ? 'fixed inset-0 z-50 bg-[#0f0f1c] p-4 overflow-y-auto min-h-screen'
          : 'hidden md:block'
      } bg-[#8185B2]/10 text-white w-full relative`}
    >
      {/* Close Button for Mobile
      {mobile && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sm bg-gray-700 px-3 py-1 rounded"
        >
          Close
        </button>
      )} */}

      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-20 aspect-[1/1] rounded-full"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUser.includes(selectedUser._id) && (
            <p className="w-2 h-2 rounded-full bg-green-500"></p>
          )}
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded"
            >
              <img src={url} alt="" className="w-full object-cover rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => logout()}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2
        bg-gradient-to-r from-purple-400 to-voilet-600 text-white border-none
        text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
