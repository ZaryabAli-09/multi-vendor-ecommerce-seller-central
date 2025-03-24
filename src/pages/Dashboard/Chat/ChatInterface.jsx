import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

const ChatInterface = ({ userId, receiverId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch existing messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/chat/messages/${receiverId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [receiverId]);

  // Listen for new messages
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (
        (newMessage.sender === userId && newMessage.receiver === receiverId) ||
        (newMessage.sender === receiverId && newMessage.receiver === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, receiverId]);

  // Send a message
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        sender: userId,
        receiver: receiverId,
        message: message,
        senderModel: "Buyer", // or "Seller" based on who is sending
        receiverModel: "Seller", // or "Buyer"
      };
      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  return (
    <Paper className="p-4 max-w-md mx-auto">
      <Typography variant="h6" className="mb-4">
        Chat with User
      </Typography>
      <List className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <ListItem
            key={index}
            className={msg.sender === userId ? "text-right" : "text-left"}
          >
            <ListItemText
              primary={msg.message}
              secondary={new Date(msg.timestamp).toLocaleTimeString()}
              className={
                msg.sender === userId
                  ? "bg-blue-100 p-2 rounded-lg"
                  : "bg-gray-100 p-2 rounded-lg"
              }
            />
          </ListItem>
        ))}
      </List>
      <div className="flex gap-2">
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          variant="outlined"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default ChatInterface;
