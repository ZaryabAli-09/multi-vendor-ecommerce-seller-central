import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const ConversationList = ({ userId, onSelectUser }) => {
  const [conversations, setConversations] = useState([]);

  // Fetch conversations when the component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/chat/conversations`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        console.log(data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          console.error("Invalid data format:", data);
          setConversations([]); // Set to empty array if data is invalid
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]); // Set to empty array on error
      }
    };

    fetchConversations();
  }, [userId]);

  return (
    <div className="w-64">
      <Typography variant="h6" className="p-4">
        Conversations
      </Typography>
      <List>
        {conversations.map((conversation) => (
          <ListItem
            button
            key={conversation._id}
            onClick={() => onSelectUser(conversation._id)}
            className="hover:bg-gray-100"
          >
            <ListItemText
              primary={conversation.user?.name || "Unknown User"}
              secondary={conversation.lastMessage}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ConversationList;
