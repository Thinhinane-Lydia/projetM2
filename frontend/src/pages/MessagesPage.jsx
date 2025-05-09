import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ConversationList from '../components/messaging/ConversationList';
import MessageChat from '../components/messaging/MessageChat';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const MessagesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="flex flex-col min-h-screen mt-10 bg-gradient-to-br from-amber-50 to-white">
      <Header showCategories={false} setSearchTerm={setSearchTerm} showAdCarousel={false}/>
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-amber-800">Messages</h1>
            <div className="hidden md:block">
          
             
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden">
            <Routes>
              <Route 
                path="/" 
                element={
                  <div className="border rounded-lg">
                    <ConversationList searchTerm={searchTerm} />
                  </div>
                } 
              />
              <Route 
                path="/:conversationId" 
                element={
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="hidden md:block md:w-1/3 lg:w-1/4 border-r">
                      <ConversationList searchTerm={searchTerm} />
                    </div>
                    <div className="flex-grow">
                      <MessageChat />
                    </div>
                  </div>
                } 
              />
            </Routes>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MessagesPage;