import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/authContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUser } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const scrollEnd = useRef();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-gray-500 bg-white/10 h-full px-4 py-6">
        <img src={assets.logo_icon} alt="logo" className="w-16 h-16" />
        <p className="text-lg md:text-xl font-medium text-white text-center">
          Chat anytime, anywhere
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-black/20 backdrop-blur-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-stone-400">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <p className="flex-1 text-sm sm:text-base md:text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUser.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="block md:hidden w-6 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt="help"
          className="hidden md:block w-5"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-4">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-end gap-2 ${isSender ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt=""
                    className="max-w-[70%] sm:max-w-[50%] md:max-w-[230px] border border-gray-700 rounded-lg"
                  />
                ) : (
                  <p
                    className={`p-2 text-sm sm:text-base max-w-[75%] sm:max-w-[60%] break-words rounded-lg text-white
                    ${isSender ? 'bg-blue-500 rounded-br-none' : 'bg-gray-600 rounded-bl-none'}`}
                  >
                    {msg.text}
                  </p>
                )}
                <div className="text-center text-[10px] sm:text-xs">
                  <img
                    src={
                      isSender
                        ? authUser?.profilePic || assets.avatar_icon
                        : selectedUser?.profilePic || assets.avatar_icon
                    }
                    alt=""
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
                  />
                  <p className="text-gray-500">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/30 flex items-center gap-2 sm:gap-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 py-2 rounded-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            placeholder="Send a message"
            className="flex-1 text-sm sm:text-base px-2 py-1 outline-none bg-transparent text-white placeholder-gray-400"
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleSendImage}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="gallery"
              className="w-5 sm:w-6 h-5 sm:h-6 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="send"
          className="w-6 sm:w-7 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
