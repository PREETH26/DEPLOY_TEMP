// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const ChatComponent = ({ userId, receiverId }) => {
//     const [message, setMessage] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [socket, setSocket] = useState(null);

//     useEffect(() => {
//         // Check if user is logged in (cookie exists)
//         const initializeSocket = () => {
//             const newSocket = io("http://localhost:5000", {
//                 withCredentials: true,
//             });

//             setSocket(newSocket);

//             newSocket.on("connect", () => {
//                 console.log("✅ Frontend connected to Socket.io, ID:", newSocket.id);
//                 newSocket.emit("user-online", userId);
//             });

            

//             newSocket.on("connect_error", (err) => {
//                 console.error("❌ Socket connection error:", err.message);
//             });

//             newSocket.on("receive-message", (data) => {
//                 setMessages((prev) => [...prev, data]);
//             });

//             newSocket.on("error-message", (msg) => {
//                 console.error("Server error:", msg);
//             });

//             return () => {
//                 newSocket.disconnect();
//                 newSocket.off("receive-message");
//                 newSocket.off("connect_error");
//                 newSocket.off("error-message");
//             };
//         };

//         // Only connect after login (e.g., via a state or cookie check)
//         initializeSocket();
//     }, [userId]);

//     const sendMessage = () => {
        
//         if (!socket || !message.trim()) {
//             console.error("🚨 Missing message content");
//             return;
//         }
    
//         if (!receiverId) {
//             console.error("🚨 Missing receiverId");
//             return;
//         }
    
//         const payload = {
//             receiver: receiverId,
//             content: message,
//         };
    
//         console.log("📤 Sending message:", payload);
    
//         socket.emit("send-message", payload);
//         setMessages((prev) => [...prev, { sender: userId, content: message }]);
//         setMessage("");
//     };
    
    

//     return (
//         <div>
//             <div>
//                 {messages.map((msg, index) => (
//                     <p key={index} style={{ color: msg.sender === userId ? "blue" : "black" }}>
//                         {msg.content}
//                     </p>
//                 ))}
//             </div>
//             <input
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message"
//             />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     );
// };

// export default ChatComponent;