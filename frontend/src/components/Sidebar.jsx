import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';

const Sidebar = () => {
  const {
    getUsers,
    users,
    setSelectedUser,
    selectedUser,
    unseenMessages,
    setUnSeenMessages
  } = useContext(ChatContext);

  const { logout, onlineUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUser]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-4 sm:p-5 rounded-r-xl overflow-y-auto text-white
        ${selectedUser ? 'max-md:hidden' : 'block'}`}
    >
      {/* Header */}
      <div className="pb-4 sm:pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="w-28 sm:w-36" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="w-4 sm:w-5 cursor-pointer"
            />
            <div
              className="absolute top-full right-0 z-20 w-28 sm:w-32 p-3 sm:p-5 rounded-md
              bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block"
            >
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                onClick={logout}
                className="cursor-pointer text-sm"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-2 px-3 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search user..."
            className="bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex flex-col gap-2">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
              setUnSeenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            className={`relative flex items-center gap-2 p-2 rounded cursor-pointer
              transition-all duration-150 hover:bg-[#282142]/40
              ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}
              text-sm sm:text-base`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="User"
              className="w-9 h-9 sm:w-[35px] sm:h-[35px] object-cover rounded-full"
            />
            <div className="flex flex-col leading-5 overflow-hidden">
              <p className="truncate">{user.fullName}</p>
              {onlineUser.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {/* Unseen messages */}
            {unseenMessages?.[user._id] > 0 && (
              <p
                className="absolute top-2 right-4 text-xs h-5 w-5
              flex justify-center items-center rounded-full bg-violet-500/50"
              >
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
