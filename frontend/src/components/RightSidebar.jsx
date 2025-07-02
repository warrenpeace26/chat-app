import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/authContext';
import toast from 'react-hot-toast';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUser } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // Extract images from messages
  useEffect(() => {
    const images = messages
      .filter(msg => msg.image)
      .map(msg => msg.image);
    setMsgImages(images);
  }, [messages]);

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full h-full relative overflow-y-auto 
      ${selectedUser ? 'block' : 'hidden'} 
      max-hd:hidden md:block md:min-w-[300px] lg:min-w-[350px]`}>

      {/* Profile */}
      <div className='pt-16 flex flex-col items-center gap-3 text-xs font-light px-4 sm:px-6'>
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="Profile"
          className='w-20 h-20 object-cover rounded-full'
        />
        <h1 className='text-lg sm:text-xl font-medium flex items-center gap-2 text-center'>
          {onlineUser.includes(selectedUser._id) &&
            <span className='w-2 h-2 rounded-full bg-green-500' />
          }
          {selectedUser.fullName}
        </h1>
        <p className='text-center text-xs sm:text-sm px-2 break-words'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#ffffff50] my-4 mx-5' />

      {/* Media Section */}
      <div className='px-5 text-sm'>
        <p className='font-semibold mb-2'>Media</p>
        <div className='max-h-[200px] overflow-y-auto grid grid-cols-2 gap-3 sm:gap-4 pr-1'>
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url, '_blank')}
              className='cursor-pointer rounded overflow-hidden'
            >
              <img src={url} alt="Media" className='w-full h-auto rounded-md object-cover' />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className='absolute bottom-5 left-0 w-full flex justify-center px-4 sm:px-6'>
        <button
          onClick={logout}
          className='w-full sm:w-auto bg-gradient-to-r from-purple-400 to-violet-600 text-white
          text-sm font-light py-2 px-6 rounded-full transition duration-200 hover:opacity-90'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
