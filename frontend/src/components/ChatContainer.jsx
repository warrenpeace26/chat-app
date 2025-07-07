import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils.js';
import { ChatContext } from '../context/chatContext.jsx';
import { AuthContext } from '../context/authContext.jsx';
import toast from 'react-hot-toast';
import RightSidebar from './RightSidebar'; // ✅ Import RightSidebar

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

  const [showRightSidebar, setShowRightSidebar] = useState(false);

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
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 h-full">
        <img src={assets.logo_icon} alt="logo" className="max-w-16" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-400">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUser.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </p>

        {/* Back button on mobile */}
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden max-w-7 cursor-pointer"
        />

        {/* Info button for RightSidebar (Mobile only) */}
        <button
          className="md:hidden text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
          onClick={() => setShowRightSidebar(true)}
        >
          Info
        </button>

        {/* Help icon (Desktop only) */}
        <img
          src={assets.help_icon}
          alt="help"
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex gap-2 mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-end gap-2 ${isSender ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt=""
                    className="max-w-[230px] border border-gray-700 rounded-lg"
                  />
                ) : (
                  <p
                    className={`p-2 max-w-[200px] md:text-sm font-light break-words rounded-lg text-white
                      ${isSender
                        ? 'bg-blue-500 rounded-br-none'
                        : 'bg-gray-600 rounded-bl-none'}`}
                  >
                    {msg.text}
                  </p>
                )}
                <div className="text-center text-xs">
                  <img
                    src={
                      isSender
                        ? authUser?.profilePic || assets.avatar_icon
                        : selectedUser?.profilePic || assets.avatar_icon
                    }
                    alt=""
                    className="w-7 rounded-full"
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

        {/* Message Input Area */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-black/20">
          <div className="flex-1 flex items-center bg-gray-100/12 px-2 rounded-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
              placeholder="Send a message"
              className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
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
                className="w-5 mr-2 cursor-pointer"
              />
            </label>
          </div>
          <img
            onClick={handleSendMessage}
            src={assets.send_button}
            alt="send"
            className="w-7 cursor-pointer"
          />
        </div>
      </div>

      {/* RightSidebar Fullscreen (Mobile Only) */}
      {showRightSidebar && (
        <div className="fixed inset-0 z-50 bg-[#0f0f1ce6] backdrop-blur-md md:hidden flex flex-col">
          <div className="flex justify-end p-4">
            <button
              className="text-sm bg-gray-700 px-3 py-1 rounded"
              onClick={() => setShowRightSidebar(false)}
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <RightSidebar mobile={true} onClose={() => setShowRightSidebar(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
