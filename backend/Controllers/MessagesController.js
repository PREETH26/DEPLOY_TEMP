import SubjectGroup from "../Models/Subjectgroup.js";
import Chat from "../Models/ChatSchema.js";
import Message from "../Models/MessageSchema.js";

export const sendMessage = async (req, res) => {
    const { subjectId } = req.params;
    const { sender, content } = req.body;

    if (!sender || !content) {
        return res.status(400).json({ success: false, message: "Sender and content are required" });
    }

    try {
        const subject = await SubjectGroup.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject group not found" });
        }

        let chat;
        if (!subject.chat) {
            chat = new Chat({ subjectGroup: subjectId, messages: [] });
            await chat.save();
            subject.chat = chat._id;
            await subject.save();
        } else {
            chat = await Chat.findById(subject.chat);
        }

        const message = new Message({ sender, content: content, chat: chat._id });
        await message.save();

        chat.messages.push(message._id);
        await chat.save();

        return res.status(201).json({ success: true, message: "Message sent successfully", chat });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};












// // import Notification from "../Models/NotificationSchema.js";
// // import Message from "../Models/MessageSchema.js";
// // import Chat from "../Models/ChatSchema.js";
// // import ClassGroup from "../Models/ClassgroupSchema.js";

// // export const sendMessage = async (req, res) => {
// //     const { chatId, content } = req.body;
// //     const senderId = req.body.userId;

// //     try {
// //         const chat = await Chat.findById(chatId);
// //         if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

// //         const message = new Message({
// //             sender: senderId,
// //             chat: chatId,
// //             content,
// //             messageType: "text",
// //         });
// //         await message.save();

// //         chat.latestMessage = message._id;
// //         await chat.save();

// //         // Create notification for one-on-one chat
// //         if (!chat.isGroupChat) {
// //             const recipient = chat.users.find(id => id.toString() !== senderId.toString());
// //             const notification = new Notification({
// //                 title: `New Message from ${req.user.name}`,
// //                 content: content.slice(0, 50) + "...",
// //                 recipients: [recipient],
// //                 sentBy: senderId,
// //                 context: "chat",
// //                 contextId: chatId,
// //                 contextRef: "Chat",
// //             });
// //             await notification.save();
// //         }

// //         res.status(201).json({ success: true, message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: "Internal Server Error" });
// //     }
// // };

// // export const sendGroupNotification = async (req, res) => {
// //     const { title, content, classGroupId } = req.body;
// //     const sentBy = req.body.userId;

// //     try {
// //         const classGroup = await ClassGroup.findById(classGroupId).populate("students");
// //         if (!classGroup) return res.status(404).json({ success: false, message: "Class not found" });

// //         const notification = new Notification({
// //             title,
// //             content,
// //             recipients: classGroup.students.map(student => student._id),
// //             sentBy,
// //             context: "classGroup",
// //             contextId: classGroupId,
// //             contextRef: "ClassGroup",
// //         });
// //         await notification.save();

// //         res.status(201).json({ success: true, message: "Notification sent" });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: "Internal Server Error" });
// //     }
// // };


// // import Chat from "../models/Chat.js";
// // import Message from "../models/Message.js";

// // export const sendMessages = async (req, res) => {
// //     const { subjectId } = req.params;
// //     const { sender, text } = req.body;
    
// //     try {
// //         const subject = await SubjectGroup.findById(subjectId);
// //         if (!subject) {
// //             return res.status(404).json({ success: false, message: "Subject group not found" });
// //         }

// //         let chat;
// //         if (!subject.chat) {
// //             // If chat doesn't exist, create it
// //             chat = new Chat({ subjectGroup: subjectId, messages: [] });
// //             await chat.save();
// //             subject.chat = chat._id;
// //             await subject.save();
// //         } else {
// //             // Fetch existing chat
// //             chat = await Chat.findById(subject.chat);
// //         }

// //         // Create a new message
// //         const message = new Message({ sender, text, chat: chat._id });
// //         await message.save();

// //         // Add message to chat
// //         chat.messages.push(message._id);
// //         await chat.save();

// //         return res.status(201).json({ success: true, message: "Message sent successfully", chat });
// //     } catch (error) {
// //         console.log(error.message);
// //         return res.status(500).json({ success: false, message: "Server Error" });
// //     }
// // };


// // /////



// // import Chat from "../models/Chat.js";
// // import Message from "../models/Message.js";

// // export const sendPrivateMessage = async (req, res) => {
// //     const { sender, receiver, text } = req.body;  // receiver = faculty/student

// //     try {
// //         let chat = await Chat.findOne({ 
// //             isGroupChat: false, 
// //             participants: { $all: [sender, receiver] } 
// //         });

// //         if (!chat) {
// //             // Create new chat if it doesn't exist
// //             chat = new Chat({ 
// //                 isGroupChat: false, 
// //                 participants: [sender, receiver], 
// //                 messages: [] 
// //             });
// //             await chat.save();
// //         }

// //         // Create a new message
// //         const message = new Message({ sender, text, chat: chat._id });
// //         await message.save();

// //         // Add message to chat
// //         chat.messages.push(message._id);
// //         await chat.save();

// //         return res.status(201).json({ success: true, message: "Message sent successfully", chat });
// //     } catch (error) {
// //         console.log(error.message);
// //         return res.status(500).json({ success: false, message: "Server Error" });
// //     }
// // };


// // export const getPrivateMessages = async (req, res) => {
// //     const { user1, user2 } = req.params;  // user1 = student, user2 = faculty

// //     try {
// //         const chat = await Chat.findOne({ 
// //             isGroupChat: false, 
// //             participants: { $all: [user1, user2] } 
// //         }).populate({
// //             path: "messages",
// //             populate: { path: "sender", select: "name email" }
// //         });

// //         if (!chat) {
// //             return res.status(404).json({ success: false, message: "No chat found" });
// //         }

// //         return res.status(200).json({ success: true, messages: chat.messages });
// //     } catch (error) {
// //         console.log(error.message);
// //         return res.status(500).json({ success: false, message: "Server Error" });
// //     }
// // };
