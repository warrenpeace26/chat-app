// ✅ HomePage.jsx
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../context/chatContext';

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-screen sm:px-[5%] sm:py-[2.5%] bg-[#0f0f1c]">
      {isMobile ? (
        <div className="w-full h-full">
          {!selectedUser ? <Sidebar /> : <ChatContainer />}
        </div>
      ) : (
        <div
          className={`border border-gray-700 rounded-2xl overflow-hidden h-full w-full 
          grid relative backdrop-blur-xl
          ${selectedUser
            ? 'grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
            : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          <Sidebar />
          <ChatContainer />
          <RightSidebar />
        </div>
      )}
    </div>
  );
};

export default HomePage;