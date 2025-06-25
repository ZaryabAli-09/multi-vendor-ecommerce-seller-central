import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import ConversationList from "./ConversationList";
import ChatInterface from "./ChatInterface";
import { Box, Typography } from "@mui/material";

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const sellerId = user?._id;
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations for the seller
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://ecom-backend-5l3d.onrender.com/api/chat/conversations?userId=${sellerId}`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch conversations");
      console.log(data);
      setConversations(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setConversations([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) fetchConversations();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Loading conversation...
        </p>
      </div>
    );
  }

  return (
    <Box className="flex h-screen bg-gray-50">
      <Box
        className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 ${
          selectedBuyer ? "hidden md:block" : "block"
        }`}
      >
        <Box className="p-4 border-b border-gray-200">
          <Typography variant="h6" className="font-semibold">
            Messages
          </Typography>
        </Box>
        <ConversationList
          conversations={conversations}
          onSelectBuyer={(buyer) => {
            setSelectedBuyer(buyer);
          }}
        />
      </Box>

      {/* Chat Interface - Conditionally rendered */}
      <Box
        className={`flex-1 flex flex-col ${
          selectedBuyer ? "block" : "hidden md:flex"
        }`}
      >
        {selectedBuyer ? (
          <ChatInterface
            sellerId={sellerId}
            buyer={selectedBuyer}
            onBack={() => setSelectedBuyer(null)}
          />
        ) : (
          <Box className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <Typography variant="h6" className="text-gray-500">
              Select a conversation to start chatting
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
