import React, { useState } from "react";
import ConversationList from "./ConversationList";
import ChatInterface from "./ChatInterface";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen">
      <ConversationList userId={user._id} onSelectUser={setSelectedUser} />
      <div className="flex-1 p-4">
        {selectedUser ? (
          <ChatInterface userId={user._id} receiverId={selectedUser} />
        ) : (
          <Typography variant="h6" className="text-center mt-8">
            Select a user to start chatting
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Chat;
