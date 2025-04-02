
// import jwt from "jsonwebtoken";
// import cookie from "cookie";
// import Chat from "../Models/ChatSchema.js";
// import Message from "../Models/MessageSchema.js";
// import User from "../Models/UserSchema.js";

// // Map to track online users and their socket IDs
// const onlineUsers = new Map();

// export default function groupMessage(io) {
//     // Middleware to authenticate socket connections
//     io.use(async (socket, next) => {
//         try {
//             const cookies = cookie.parse(socket.handshake.headers.cookie || "");
//             const token = cookies.token;
//             if (!token) return next(new Error("Not Authorized, Login Again"));

//             const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//             const userId = decodedToken.id;
//             const user = await User.findById(userId).select("-password");
//             if (!user) return next(new Error("User not found"));

//             socket.userId = user._id.toString();
//             console.log("✅ User Authenticated for Group Chat:", socket.userId);
//             next();
//         } catch (error) {
//             console.log("❌ Socket Auth Error:", error.message);
//             next(new Error("Authentication failed"));
//         }
//     });

//     io.on("connection", (socket) => {
//         console.log("✅ A user connected to group chat:", socket.userId);
//         onlineUsers.set(socket.userId, socket.id);

//         // Send group chat history to the user upon connection
//         const sendGroupChatHistory = async () => {
//             try {
//                 const groupChats = await Chat.find({
//                     users: socket.userId,
//                     isGroupChat: true,
//                 })
//                     .populate("users", "name email")
//                     .populate({
//                         path: "messages",
//                         populate: { path: "sender", select: "name email" },
//                     });

//                 const groupChatHistory = groupChats.map((chat) => ({
//                     chatId: chat._id.toString(),
//                     groupName: chat.name || "Unnamed Group",
//                     users: chat.users.map((user) => ({
//                         userId: user._id.toString(),
//                         name: user.name,
//                         email: user.email,
//                     })),
//                     messages: chat.messages.map((msg) => ({
//                         senderId: msg.sender._id.toString(),
//                         sender: msg.sender.name,
//                         content: msg.content,
//                         timestamp: msg.createdAt,
//                     })),
//                 }));

//                 socket.emit("group-chat-history", groupChatHistory);
//                 console.log("📜 Sent group chat history to:", socket.userId, "Group Chats:", groupChatHistory.length);
//             } catch (error) {
//                 console.error("Error sending group chat history:", error.message);
//                 socket.emit("error-message", "Failed to load group chat history");
//             }
//         };

//         sendGroupChatHistory();

//         // Load messages for a specific group chat
//         socket.on("load-group-chat", async ({ chatId }) => {
//             try {
//                 console.log("Loading group chat - chatId:", chatId, "userId:", socket.userId);
//                 const chat = await Chat.findOne({
//                     _id: chatId,
//                     isGroupChat: true,
//                     users: socket.userId,
//                 })
//                     .populate("users", "name email")
//                     .populate({
//                         path: "messages",
//                         populate: { path: "sender", select: "name email" },
//                     });
//                 console.log("Found chat:", chat);
//                 if (!chat) {
//                     console.log("Chat not found or user not a participant - chatId:", chatId, "userId:", socket.userId);
//                     return socket.emit("error-message", "Group chat not found or you are not a participant");
//                 }

//                 const messages = chat.messages.map((msg) => ({
//                     senderId: msg.sender._id.toString(),
//                     sender: msg.sender.name,
//                     content: msg.content,
//                     timestamp: msg.createdAt,
//                 }));

//                 socket.emit("group-chat-messages", { chatId, messages });
//                 console.log("📜 Sent group chat messages for:", chatId, "Count:", messages.length);
//             } catch (error) {
//                 console.error("Error loading group chat:", error.message);
//                 socket.emit("error-message", "Failed to load group chat messages");
//             }
//         });

//         // Send a message to a group chat
//         socket.on("send-group-message", async ({ chatId, content }) => {
//             const sender = socket.userId;
//             console.log("📩 Send Group Message - Sender:", sender, "Chat ID:", chatId, "Content:", content);

//             if (!chatId || !content) {
//                 return socket.emit("error-message", "Chat ID and content are required");
//             }

//             try {
//                 const chat = await Chat.findOne({
//                     _id: chatId,
//                     isGroupChat: true,
//                     users: sender,
//                 });
//                 console.log(chat);
//                 if (!chat) {
//                     return socket.emit("error-message", "Group chat not found or you are not a participant");
//                 }

//                 const message = new Message({
//                     sender,
//                     receiver: null,
//                     chat: chat._id,
//                     content,
//                     messageType: "text",
//                     readBy: [sender],
//                 });
//                 await message.save();

//                 chat.messages.push(message._id);
//                 await chat.save();
//                 console.log("✅ Group Message saved:", message._id);

//                 const senderUser = await User.findById(sender).select("name email");
//                 const messageData = {
//                     senderId: sender,
//                     sender: senderUser.name,
//                     chatId: chat._id.toString(),
//                     content,
//                     timestamp: message.createdAt,
//                 };

//                 const users = chat.users.map((p) => p.toString());
//                 users.forEach((userId) => {
//                     const userSocketId = onlineUsers.get(userId);
//                     if (userSocketId) {
//                         io.to(userSocketId).emit("receive-group-message", messageData);
//                         console.log("📩 Sent group message to:", userId);
//                     }
//                 });
//             } catch (error) {
//                 console.error("Group Message Send Error:", error.message);
//                 socket.emit("error-message", "Failed to send group message");
//             }
//         });

//         socket.on("disconnect", (reason) => {
//             console.log("🔴 User disconnected from group chat:", socket.userId, "Reason:", reason);
//             onlineUsers.delete(socket.userId);
//         });
//     });
// }



import jwt from "jsonwebtoken";
import cookie from "cookie";
import Chat from "../Models/ChatSchema.js";
import Message from "../Models/MessageSchema.js";
import User from "../Models/UserSchema.js";

// Map to track online users and their socket IDs
const onlineUsers = new Map();

export default function groupMessage(io) {
    io.use(async (socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || "");
            const token = cookies.token;
            if (!token) return next(new Error("Not Authorized, Login Again"));

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken.id;
            const user = await User.findById(userId).select("-password");
            if (!user) return next(new Error("User not found"));

            socket.userId = user._id.toString();
            console.log("✅ User Authenticated for Group Chat:", socket.userId);
            next();
        } catch (error) {
            console.log("❌ Socket Auth Error:", error.message);
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", (socket) => {
        console.log("✅ A user connected to group chat:", socket.userId);
        onlineUsers.set(socket.userId, socket.id);

        const sendGroupChatHistory = async () => {
            try {
                const groupChats = await Chat.find({
                    users: socket.userId,
                    isGroupChat: true,
                })
                    .populate("users", "name email")
                    .populate({
                        path: "messages",
                        populate: { path: "sender", select: "name email" },
                    });

                const groupChatHistory = groupChats.map((chat) => ({
                    chatId: chat._id.toString(),
                    groupName: chat.name || "Unnamed Group",
                    users: chat.users.map((user) => ({
                        userId: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    })),
                    messages: chat.messages.map((msg) => ({
                        senderId: msg.sender._id.toString(),
                        sender: msg.sender.name,
                        content: msg.content,
                        timestamp: msg.createdAt,
                    })),
                }));

                socket.emit("group-chat-history", groupChatHistory);
                console.log("📜 Sent group chat history to:", socket.userId, "Group Chats:", groupChatHistory.length);
            } catch (error) {
                console.error("Error sending group chat history:", error.message);
                socket.emit("error-message", "Failed to load group chat history");
            }
        };

        sendGroupChatHistory();

        socket.on("load-group-chat", async ({ chatId }) => {
            try {
                console.log("Loading group chat - chatId:", chatId, "userId:", socket.userId);
                const chat = await Chat.findOne({
                    _id: chatId,
                    isGroupChat: true,
                    users: socket.userId,
                })
                    .populate("users", "name email")
                    .populate({
                        path: "messages",
                        populate: { path: "sender", select: "name email" },
                    });

                if (!chat) {
                    console.log("Chat not found or user not a participant - chatId:", chatId, "userId:", socket.userId);
                    return socket.emit("error-message", "Group chat not found or you are not a participant");
                }

                const messages = chat.messages.map((msg) => ({
                    senderId: msg.sender._id.toString(),
                    sender: msg.sender.name,
                    content: msg.content,
                    timestamp: msg.createdAt,
                }));

                socket.emit("group-chat-messages", { chatId, messages });
                console.log("📜 Sent group chat messages for:", chatId, "Count:", messages.length);
            } catch (error) {
                console.error("Error loading group chat:", error.message);
                socket.emit("error-message", "Failed to load group chat messages");
            }
        });

        socket.on("send-group-message", async ({ chatId, content }) => {
            const sender = socket.userId;
            console.log("📩 Send Group Message - Sender:", sender, "Chat ID:", chatId, "Content:", content);

            if (!chatId || !content) {
                return socket.emit("error-message", "Chat ID and content are required");
            }

            try {
                const chat = await Chat.findOne({
                    _id: chatId,
                    isGroupChat: true,
                    users: sender,
                });
                if (!chat) {
                    return socket.emit("error-message", "Group chat not found or you are not a participant");
                }

                const message = new Message({
                    sender,
                    receiver: null,
                    chat: chat._id,
                    content,
                    messageType: "text",
                    readBy: [sender],
                });
                await message.save();

                chat.messages.push(message._id);
                await chat.save();
                console.log("✅ Group Message saved:", message._id);

                const senderUser = await User.findById(sender).select("name email");
                const messageData = {
                    senderId: sender,
                    sender: senderUser.name,
                    chatId: chat._id.toString(),
                    content,
                    timestamp: message.createdAt,
                };

                const users = chat.users.map((user) => user.toString());
                users.forEach((userId) => {
                    const userSocketId = onlineUsers.get(userId);
                    if (userSocketId) {
                        io.to(userSocketId).emit("receive-group-message", messageData);
                        console.log("📩 Sent group message to:", userId, "via socket:", userSocketId);
                    } else {
                        console.log("User offline:", userId);
                    }
                });

                // Ensure the sender also receives the message
                socket.emit("receive-group-message", messageData);
            } catch (error) {
                console.error("Group Message Send Error:", error.message);
                socket.emit("error-message", "Failed to send group message");
            }
        });

        socket.on("update-group-chat", async ({ chatId, updates }) => {
            try {
                console.log("Updating group chat - chatId:", chatId, "Updates:", updates, "User:", socket.userId);

                const chat = await Chat.findOne({ _id: chatId, isGroupChat: true });
                if (!chat || !chat.users.includes(socket.userId)) {
                    return socket.emit("error-message", "You are not authorized to update this chat");
                }

                const updatedChat = await Chat.findByIdAndUpdate(chatId, updates, { new: true })
                    .populate("users", "name email")
                    .populate({
                        path: "messages",
                        populate: { path: "sender", select: "name email" },
                    });

                const users = updatedChat.users.map((user) => user._id.toString());
                users.forEach((userId) => {
                    const userSocketId = onlineUsers.get(userId);
                    if (userSocketId) {
                        io.to(userSocketId).emit("group-chat-updated", {
                            chatId: updatedChat._id.toString(),
                            groupName: updatedChat.name,
                            users: updatedChat.users.map((u) => ({
                                userId: u._id.toString(),
                                name: u.name,
                                email: u.email,
                            })),
                        });
                        console.log("📢 Notified user of group chat update:", userId);
                    }
                });

                socket.emit("chat-updated-success", { chat: updatedChat });
            } catch (error) {
                console.error("Error updating group chat:", error.message);
                socket.emit("error-message", "Failed to update group chat");
            }
        });

        socket.on("disconnect", (reason) => {
            console.log("🔴 User disconnected from group chat:", socket.userId, "Reason:", reason);
            onlineUsers.delete(socket.userId);
        });
    });
}
