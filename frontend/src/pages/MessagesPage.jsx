import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConversationList from '../components/messaging/ConversationList';
import MessageChat from '../components/messaging/MessageChat';

const MessagesPage = () => {
  return (
    <div className="messages-page">
      <Routes>
        <Route path="/" element={<ConversationList />} />
        <Route path="/:conversationId" element={<MessageChat />} />
      </Routes>
    </div>
  );
};

export default MessagesPage;