import React, { useEffect, useState, useRef } from "react";
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
import { io } from "socket.io-client";

const ChatInterface = ({ sellerId, buyer, onBack }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const messagesRef = useRef([]);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.current.emit("join", sellerId);

    return () => {
      socket.current.disconnect();
    };
  }, [sellerId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/chat/messages?senderId=${sellerId}&receiverId=${buyer._id}`,
          { credentials: "include" }
        );
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        const normalized = result.data.map((msg) => ({
          ...msg,
          sender: msg.sender._id || msg.sender,
          receiver: msg.receiver._id || msg.receiver,
        }));

        setMessages(normalized);
        messagesRef.current = normalized;
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (sellerId && buyer?._id) fetchMessages();
  }, [sellerId, buyer]);

  useEffect(() => {
    const handler = (msg) => {
      const normalized = {
        ...msg,
        sender: msg.sender.toString(),
        receiver: msg.receiver.toString(),
      };

      const exists = messagesRef.current.some(
        (m) =>
          m._id === normalized._id ||
          (m.isTemp && m.timestamp === normalized.timestamp)
      );

      if (
        !exists &&
        ((normalized.sender === sellerId &&
          normalized.receiver === buyer._id) ||
          (normalized.sender === buyer._id && normalized.receiver === sellerId))
      ) {
        const newMessages = [...messagesRef.current, normalized];
        setMessages(newMessages);
        messagesRef.current = newMessages;
      }
    };

    socket.current.on("receiveMessage", handler);
    return () => socket.current.off("receiveMessage", handler);
  }, [sellerId, buyer]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
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

    socket.current.emit("sendMessage", messageData, (response) => {
      if (response.status === "error") {
        toast.error(response.error);
      } else {
        setMessage("");
      }
    });
  };

  const renderMessage = (msg) => {
    const isSender = msg.sender === sellerId;

    return (
      <ListItem
        key={msg._id}
        className={`flex ${
          isSender ? "justify-start" : "justify-end"
        } px-0 mb-2`}
      >
        <Box
          className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
            isSender
              ? "bg-blue-100 text-gray-900 mr-8"
              : "bg-green-500 text-white ml-8"
          }`}
          sx={{
            position: "relative",
            wordBreak: "break-word",
            "&:before": {
              content: '""',
              position: "absolute",
              width: 0,
              height: 0,
              [isSender ? "left" : "right"]: "-8px",
              top: "12px",
              borderStyle: "solid",
              borderWidth: "8px 12px 8px 0",
              borderColor: isSender
                ? "transparent #dbeafe transparent transparent"
                : "transparent #22c55e transparent transparent",
              transform: isSender ? "none" : "scaleX(-1)",
            },
          }}
        >
          <Typography variant="body1">{msg.message}</Typography>
          <Typography
            variant="caption"
            className={`block text-right mt-1 text-sm ${
              isSender ? "text-blue-600" : "text-green-100"
            }`}
          >
            {format(new Date(msg.timestamp), "h:mm a")}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  return (
    <>
      {/* Header */}
      <Box className="flex items-center p-3 border-b border-gray-200 bg-white">
        <IconButton onClick={onBack} className="md:hidden mr-2">
          <FiArrowLeft size={20} />
        </IconButton>
        <Avatar
          src={buyer.avatar || "/default-avatar.png"}
          alt={buyer.name}
          className="mr-3"
        />
        <Typography variant="h6">{buyer.name}</Typography>
      </Box>

      {/* Chat Messages */}
      <Box
        className="flex-1 p-4 overflow-y-auto bg-gray-50"
        style={{ height: "calc(100vh - 160px)" }}
      >
        {messages.length ? (
          <List>
            {messages.map(renderMessage)}
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

      {/* Input */}
      <Box className="p-3 border-t border-gray-200 bg-white">
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
    </>
  );
};

export default ChatInterface;
