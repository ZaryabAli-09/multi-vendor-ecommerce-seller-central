import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
} from "@mui/material";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

const ChatInterface = ({ sellerId, buyer, onBack }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch messages when buyer changes
  useEffect(() => {
    if (!sellerId || !buyer?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/chat/messages?senderId=${sellerId}&receiverId=${buyer._id}`,
          { credentials: "include" }
        );

        const result = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch messages");

        setMessages(result.data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchMessages();
  }, [sellerId, buyer]);

  console.log(messages);
  // Socket event listeners
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (
        (newMessage.sender === sellerId && newMessage.receiver === buyer._id) ||
        (newMessage.sender === buyer._id && newMessage.receiver === sellerId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [sellerId, buyer]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      sender: sellerId,
      receiver: buyer._id,
      message,
      senderModel: "Seller",
      receiverModel: "Buyer",
    };

    socket.emit("sendMessage", messageData, (response) => {
      if (response.status === "error") {
        toast.error(response.error);
      } else {
        setMessages((prev) => [...prev, response.message]);
        setMessage("");
      }
    });
  };

  return (
    <Box className="flex flex-col h-full">
      {/* Chat header */}
      <Box className="flex items-center p-3 border-b border-gray-200 bg-white">
        <IconButton onClick={onBack} className="md:hidden mr-2">
          <FiArrowLeft size={20} />
        </IconButton>
        <Avatar
          src={buyer.avatar || "/default-avatar.png"}
          alt={buyer.name}
          className="mr-3"
        />
        <Typography variant="h6" className="font-medium">
          {buyer.name}
        </Typography>
      </Box>

      {/* Messages area */}
      <Box className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length > 0 ? (
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index} // Added key to prevent React warnings
                className={`flex ${
                  msg.sender === sellerId ? "justify-end" : "justify-start"
                } px-0`}
              >
                <Box
                  className={`max-w-xs md:max-w-md rounded-lg px-3 py-2 ${
                    msg.sender === sellerId
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <Typography>{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    className={`block text-right mt-1 ${
                      msg.sender === sellerId
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp && !isNaN(new Date(msg.timestamp))
                      ? format(new Date(msg.timestamp), "h:mm a")
                      : "Invalid Date"}
                  </Typography>
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        ) : (
          <Box className="flex items-center justify-center h-full">
            <Typography variant="body1" className="text-gray-500">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Message input */}
      <Box className="p-3  border-gray-200 bg-white">
        <Box className="flex items-center border rounded-lg px-3 py-2">
          <TextField
            fullWidth
            variant="standard"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="mr-2"
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            <FiSend size={24} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;
