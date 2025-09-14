import React from 'react';
import MessageCenter from '../components/messaging/MessageCenter';

const MessagesPage = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MessageCenter user={user} />
    </div>
  );
};

export default MessagesPage;