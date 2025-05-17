// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { formatDistanceToNow, format } from "date-fns";
// import { io } from "socket.io-client";

// const BuyerChat = () => {
//   const { sellerId } = useParams();
//   const navigate = useNavigate();
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showConversations, setShowConversations] = useState(false);
//   const [sellerInfo, setSellerInfo] = useState(null);
//   const messagesEndRef = useRef(null);
//   const socket = useRef();

//   const buyerId = "6769bf283ce5c7b6ff4b72c9";

//   useEffect(() => {
//     socket.current = io("http://localhost:5000", {
//       withCredentials: true,

//       transports: ["websocket"],
//     });

//     socket.current.emit("join", buyerId);

//     const messageHandler = (message) => {
//       const normalizedMessage = {
//         ...message,
//         sender: message.sender.toString(),
//         receiver: message.receiver.toString(),
//       };

//       // Prevent duplicate messages
//       const messageExists = messages.some(
//         (msg) =>
//           msg._id === normalizedMessage._id ||
//           (msg.timestamp === normalizedMessage.timestamp &&
//             msg.sender === normalizedMessage.sender)
//       );

//       if (
//         !messageExists &&
//         ((normalizedMessage.sender === buyerId &&
//           normalizedMessage.receiver === selectedConversation) ||
//           (normalizedMessage.sender === selectedConversation &&
//             normalizedMessage.receiver === buyerId))
//       ) {
//         setMessages((prev) => [...prev, normalizedMessage]);

//         // Update conversations
//         setConversations((prev) => {
//           const existing = prev.find(
//             (c) => c._id === normalizedMessage.receiver
//           );
//           if (existing) {
//             return prev.map((c) =>
//               c._id === normalizedMessage.receiver
//                 ? {
//                     ...c,
//                     lastMessage: normalizedMessage.message,
//                     timestamp: new Date(),
//                   }
//                 : c
//             );
//           }
//           return prev;
//         });
//       }
//     };

//     socket.current.on("receiveMessage", messageHandler);
//     return () => {
//       socket.current.off("receiveMessage", messageHandler);
//       socket.current.disconnect();
//     };
//   }, [buyerId, selectedConversation, messages]); // Added messages to dependencies

//   const handleSelectConversation = (convId) => {
//     // Only proceed if selecting a different conversation
//     if (selectedConversation !== convId) {
//       setMessages([]); // Clear current messages
//       setSelectedConversation(convId);
//       navigate(`/dummy-chat/${convId}`);
//       setShowConversations(false);
//     }
//   };

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/chat/conversations?userId=${buyerId}`
//         );
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Fetch error");
//         setConversations(data);

//         if (sellerId) {
//           setSelectedConversation(sellerId);
//           if (!data.some((c) => c._id === sellerId)) {
//             fetchSellerInfo(sellerId);
//           }
//         }
//       } catch (error) {
//         toast.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchSellerInfo = async (sellerId) => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/seller/single/${sellerId}`
//         );
//         const data = await response.json();
//         console.log(data);
//         if (response.ok) setSellerInfo(data.data);
//       } catch (error) {
//         toast.error("Failed to fetch seller info");
//       }
//     };

//     fetchSellerInfo(sellerId);
//     fetchConversations();
//   }, [buyerId, sellerId]);

//   // Add this useEffect to sync route params with state
//   useEffect(() => {
//     if (sellerId && sellerId !== selectedConversation) {
//       setSelectedConversation(sellerId);
//     }
//   }, [sellerId]);

//   // Update the message fetching useEffect
//   useEffect(() => {
//     if (!selectedConversation) return;

//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/chat/messages?senderId=${buyerId}&receiverId=${selectedConversation}`
//         );
//         const data = await response.json();

//         if (!response.ok)
//           throw new Error(data.message || "Message fetch error");

//         const normalizedMessages = data.data
//           .map((msg) => ({
//             ...msg,
//             sender: msg.sender._id || msg.sender,
//             receiver: msg.receiver._id || msg.receiver,
//             timestamp: new Date(msg.timestamp), // Ensure timestamp is Date object
//           }))
//           .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp

//         setMessages(normalizedMessages || []);
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };

//     fetchMessages();
//   }, [selectedConversation, buyerId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     const messageData = {
//       sender: buyerId,
//       receiver: selectedConversation,
//       message: newMessage,
//       senderModel: "Buyer",
//       receiverModel: "Seller",
//     };

//     socket.current.emit("sendMessage", messageData, (response) => {
//       if (response.status === "error") {
//         toast.error(response.error);
//       } else {
//         setNewMessage("");
//       }
//     });
//   };

//   const currentConversation = conversations.find(
//     (c) => c._id === selectedConversation
//   ) || {
//     _id: sellerId,
//     name: sellerInfo?.brandName || "New Seller",
//   };
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setShowConversations(!showConversations)}
//         className="md:hidden fixed top-2 left-2 z-50 p-2 bg-white rounded-lg shadow-lg"
//       >
//         ☰
//       </button>

//       {/* Conversation List */}
//       <div
//         className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r transform transition-transform duration-300 ${
//           showConversations ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 fixed md:relative inset-0 z-40`}
//       >
//         <div className="p-4 border-b flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Your Sellers</h2>
//           <button
//             onClick={() => setShowConversations(false)}
//             className="md:hidden p-1 hover:bg-gray-100 rounded-full"
//           >
//             ✕
//           </button>
//         </div>
//         <div className="overflow-y-auto h-[calc(100vh-64px)]">
//           {conversations.map((conv) => (
//             <div
//               key={conv._id}
//               onClick={() => handleSelectConversation(conv._id)}
//               className="p-3 border-b hover:bg-gray-50 cursor-pointer flex items-center"
//             >
//               {/* chnages........................................... */}
//               {conv.logo.url ? (
//                 <img
//                   src={conv.logo.url}
//                   alt={conv.name}
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
//                   {conv.name.charAt(0)}
//                 </div>
//               )}
//               {/* .........................................................  */}
//               <div className="flex-1">
//                 <h3 className="font-medium">{conv.name}</h3>
//                 <p className="text-sm text-gray-500 truncate">
//                   {conv.lastMessage || "No messages yet"}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   {conv.timestamp &&
//                     formatDistanceToNow(new Date(conv.timestamp))}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Interface */}
//       <div className="flex-1 flex flex-col">
//         {selectedConversation ? (
//           <>
//             <div className="p-3 border-b bg-white flex items-center">
//               <button
//                 onClick={() => {
//                   navigate("/dummy-chat");
//                   setSelectedConversation(null);
//                 }}
//                 className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
//               >
//                 ←
//               </button>
//               {/* chnages...............................  */}
//               {currentConversation.logo.url ? (
//                 <img
//                   src={currentConversation.logo.url}
//                   alt={currentConversation.name}
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
//                   {currentConversation.name.charAt(0)}
//                 </div>
//               )}
//               <h3 className="font-medium">{currentConversation.name}</h3>
//             </div>
//             {/* ..................................................  */}
//             <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
//               {messages
//                 .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
//                 .map((message) => (
//                   <div
//                     key={message._id}
//                     className={`flex ${
//                       message.sender === buyerId
//                         ? "justify-end"
//                         : "justify-start"
//                     } mb-3`}
//                   >
//                     <div
//                       className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
//                         message.sender === buyerId
//                           ? "bg-blue-500 text-white"
//                           : "bg-white border"
//                       }`}
//                     >
//                       <p>{message.message}</p>
//                       <p
//                         className={`text-xs mt-1 ${
//                           message.sender === buyerId
//                             ? "text-blue-100"
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {format(new Date(message.timestamp), "h:mm a")}
//                       </p>
//                       <p
//                         className={`text-xs mt-1 ${
//                           message.sender === buyerId
//                             ? "text-blue-100"
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {format(new Date(message.timestamp), "MM:dd yy")}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="p-3 border-t bg-white">
//               <div className="flex items-center border rounded-lg px-3 py-2">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                   placeholder="Type a message..."
//                   className="flex-1 outline-none"
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={!newMessage.trim()}
//                   className="ml-2 p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="hidden md:flex items-center justify-center h-full text-gray-500">
//             Select a seller to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BuyerChat;

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatDistanceToNow, format } from "date-fns";
import { io } from "socket.io-client";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { CiChat1 } from "react-icons/ci";
import { useSelector } from "react-redux";

const MyMessages = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConversations, setShowConversations] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const socket = useRef();

  const buyerId = useSelector((state) => state.user.id);
  // const buyerId = "6769bf283ce5c7b6ff4b72c9";

  // Handle conversation selection
  const handleSelectConversation = (convId) => {
    if (selectedConversation !== convId) {
      setMessages([]);
      setSelectedConversation(convId);
      navigate(`/my-messages/${convId}`);
      setShowConversations(false);
    }
  };

  useEffect(() => {
    socket.current = io("https://ecom-backend-5l3d.onrender.com", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.current.emit("join", buyerId);

    const messageHandler = (message) => {
      const normalizedMessage = {
        ...message,
        sender: message.sender.toString(),
        receiver: message.receiver.toString(),
      };

      const messageExists = messages.some(
        (msg) =>
          msg._id === normalizedMessage._id ||
          (msg.timestamp === normalizedMessage.timestamp &&
            msg.sender === normalizedMessage.sender)
      );

      if (
        !messageExists &&
        ((normalizedMessage.sender === buyerId &&
          normalizedMessage.receiver === selectedConversation) ||
          (normalizedMessage.sender === selectedConversation &&
            normalizedMessage.receiver === buyerId))
      ) {
        setMessages((prev) => [...prev, normalizedMessage]);

        setConversations((prev) => {
          const existing = prev.find(
            (c) => c._id === normalizedMessage.receiver
          );
          if (existing) {
            return prev.map((c) =>
              c._id === normalizedMessage.receiver
                ? {
                    ...c,
                    lastMessage: normalizedMessage.message,
                    timestamp: new Date(),
                  }
                : c
            );
          }
          return prev;
        });
      }
    };

    socket.current.on("receiveMessage", messageHandler);
    return () => {
      socket.current.off("receiveMessage", messageHandler);
      socket.current.disconnect();
    };
  }, [buyerId, selectedConversation, messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `https://ecom-backend-5l3d.onrender.com/api/chat/conversations?userId=${buyerId}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Fetch error");
        setConversations(data);

        if (sellerId) {
          setSelectedConversation(sellerId);
          if (!data.some((c) => c._id === sellerId)) {
            fetchSellerInfo(sellerId);
          }
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSellerInfo = async (sellerId) => {
      try {
        const response = await fetch(
          `https://ecom-backend-5l3d.onrender.com/api/seller/single/${sellerId}`
        );
        const data = await response.json();
        if (response.ok) setSellerInfo(data.data);
      } catch (error) {
        toast.error("Failed to fetch seller info");
      }
    };

    fetchSellerInfo(sellerId);
    fetchConversations();
  }, [buyerId, sellerId]);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://ecom-backend-5l3d.onrender.com/api/chat/messages?senderId=${buyerId}&receiverId=${selectedConversation}`
        );
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Message fetch error");

        const normalizedMessages = data.data
          .map((msg) => ({
            ...msg,
            sender: msg.sender._id || msg.sender,
            receiver: msg.receiver._id || msg.receiver,
            timestamp: new Date(msg.timestamp),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setMessages(normalizedMessages || []);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchMessages();
  }, [selectedConversation, buyerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: buyerId,
      receiver: selectedConversation,
      message: newMessage,
      senderModel: "Buyer",
      receiverModel: "Seller",
    };

    socket.current.emit("sendMessage", messageData, (response) => {
      if (response.status === "error") {
        toast.error(response.error);
      } else {
        setNewMessage("");
      }
    });
  };

  const currentConversation = conversations.find(
    (c) => c._id === selectedConversation
  ) || {
    _id: sellerId,
    name: sellerInfo?.brandName || "New Seller",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowConversations(!showConversations)}
        className="md:hidden fixed top-2 left-2 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Conversation List */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 h-full bg-white border-r transform transition-transform duration-300 ${
          showConversations ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative inset-0 z-40`}
      >
        <div className="border-b flex justify-between items-center py-[18px]">
          <button
            onClick={() => setShowConversations(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
          <h2 className="text-xl ml-5 font-semibold">Stores</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => handleSelectConversation(conv._id)}
              className={`p-3 border-b hover:bg-gray-50 cursor-pointer flex items-center ${
                selectedConversation === conv._id ? "bg-blue-50" : ""
              }`}
            >
              {conv?.logo?.url ? (
                <img
                  src={conv.logo.url}
                  alt={conv.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#252422] text-white flex items-center justify-center mr-3">
                  {conv.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium">{conv.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {conv.lastMessage || "No messages yet"}
                </p>
                <p className="text-xs text-gray-400">
                  {conv.timestamp &&
                    formatDistanceToNow(new Date(conv.timestamp))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col h-[100vh]">
        {selectedConversation ? (
          <>
            <div className="p-3 border-b bg-white flex items-center">
              <button
                onClick={() => {
                  navigate("/my-messages");
                  setSelectedConversation(null);
                }}
                className="mr-2 p-1 rounded-full hover:bg-gray-100"
              >
                <IoArrowBackOutline className="text-2xl text-gray-500" />
              </button>
              {currentConversation?.logo?.url ? (
                <img
                  src={currentConversation.logo.url}
                  alt={currentConversation.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#252422] text-white flex items-center justify-center mr-3">
                  {currentConversation.name.charAt(0)}
                </div>
              )}
              <h3 className="font-medium">{currentConversation.name}</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
              {messages
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender === buyerId
                        ? "justify-end"
                        : "justify-start"
                    } mb-3`}
                  >
                    <div
                      className={`max-w-xs text-lg md:max-w-md rounded-lg px-4 py-1 ${
                        message.sender === buyerId
                          ? "bg-green-500 text-white"
                          : "bg-sky-400 text-white border"
                      }`}
                    >
                      <p>{message.message}</p>
                      <p
                        className={`text-[9px] mt-[-5px] ${
                          message.sender === buyerId
                            ? "text-white"
                            : "text-white"
                        }`}
                      >
                        {format(new Date(message.timestamp), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t bg-white shadow-lg">
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <IoMdSend className="text-3xl cursor-pointer" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-7 items-center justify-center h-[100vh] relative">
            <CiChat1 className="text-6xl text-gray-500 relative top-[-40px]" />
            <div className="text-gray-500 text-3xl relative top-[-40px]">
              Select a seller to start chatting
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMessages;
