import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { GiSafetyPin } from "react-icons/gi";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFile, FaFilePowerpoint, FaFileAlt } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { IoSettings } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import Logo from "./assets/Logo.png";
// import "./Chat.css";

const socket = io(`${import.meta.env.VITE_WEBSOCKETS_URL}`, {
  withCredentials: true,
});

function MobileChat() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [all, setAll] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "group";
  });
  const [hasRestored, setHasRestored] = useState(false); // New state to track initial restoration
  const newMessage = useRef(null);
  const fileInputRef = useRef(null);
  const isDarkMode = DarkMode();

  // Utility functions (unchanged)
  const getUserColor = (userId) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 6) - hash) + char;
      hash = hash & hash;
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 50%, 60%)`;
  };

  const getFileType = (file) => {
    if (!file) return null;
    const ext = file.name.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png"].includes(ext)) return "image";
    if (["mp4", "mov"].includes(ext)) return "video";
    if (ext === "pdf") return "pdf";
    if (["doc", "docx"].includes(ext)) return "doc";
    if (ext === "pptx") return "pptx";
    if (ext === "txt") return "txt";
    return "other";
  };

  const getFileTypeDescription = (file) => {
    const ext = file.fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return "PDF Document";
      case "doc":
      case "docx": return "Microsoft Word Document";
      case "xlsx": return "Microsoft Excel Worksheet";
      case "jpg":
      case "jpeg": return "JPEG Image";
      case "png": return "PNG Image";
      case "mp4": return "MP4 Video";
      case "mov": return "MOV Video";
      case "pptx": return "PowerPoint Presentation";
      case "txt": return "Text File";
      default: return "File";
    }
  };

  const getFileIcon = (fileType, fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return <FaFilePdf className="text-red-500 text-xl mr-1" />;
      case "doc":
      case "docx": return <FaFileWord className="text-black text-xl mr-1" />;
      case "xlsx": return <FaFileExcel className="text-green-500 text-xl mr-1" />;
      case "pptx": return <FaFilePowerpoint className="text-orange-500 text-xl mr-1" />;
      case "txt": return <FaFileAlt className="text-gray-500 text-xl mr-1" />;
      default: return <FaFile className="text-gray-500 text-xl mr-1" />;
    }
  };

  const downloadFile = (url, fileName) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        setMessage("Failed to download file");
      });
  };

  // Data fetching (unchanged)
  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          withCredentials: true,
        });
        const userData = res.data.userData || res.data;
        setProfile(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Failed to load profile");
        navigate("/login");
      }
    };

    const getAll = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/members`, {
          withCredentials: true,
        });
        setAll(res.data.members || []);
      } catch (error) {
        console.error("Error fetching members:", error);
        setMessage("Failed to load members");
      }
    };

    const getGroupChats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/class`, {
          withCredentials: true,
        });
        const classes = res.data.classes || res.data || [];
        setGroupChats(classes);

        const subjectGroupsData = {};
        for (const group of classes) {
          try {
            const subjectRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/subject/${group._id}`,
              { withCredentials: true }
            );
            subjectGroupsData[group._id] = subjectRes.data.subjects || [];
          } catch (error) {
            subjectGroupsData[group._id] = [];
          }
        }
        setSubjectGroups(subjectGroupsData);
      } catch (error) {
        console.error("Error fetching group chats:", error);
        setMessage("Failed to load group chats");
      }
    };

    getProfile();
    getAll();
    getGroupChats();
  }, [navigate]);

  // Fetch files for selected chat (unchanged)
  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedChat) return;
      try {
        let url = `${import.meta.env.VITE_BACKEND_URL}api/files?`;
        const params = new URLSearchParams();
        params.append("chatType", selectedChat.type);
        if (selectedChat.type === "group") {
          params.append("classGroup", selectedChat.data._id);
        } else if (selectedChat.type === "subject") {
          params.append("subjectGroup", selectedChat.data._id);
        } else if (selectedChat.type === "single") {
          params.append("receiverId", selectedChat.data._id);
        }
        url += params.toString();
        const res = await axios.get(url, { withCredentials: true });
        const files = res.data.files || [];
        const validFiles = files.filter(
          (file) =>
            file &&
            file.fileName &&
            typeof file.fileName === "string" &&
            file.fileUrl &&
            file.fileType
        );
        setUploadedFiles(validFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
        setMessage("Failed to load files");
      }
    };

    fetchFiles();
  }, [selectedChat]);

  // Socket events (unchanged)
  useEffect(() => {
    
    socket.on("chat-history", (history) => {
      const messages = history.flatMap((chat) => chat.messages);
      setChatMessages(messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    });

    socket.on("chat-messages", ({ receiverId, messages }) => {
      if (selectedChat?.type === "single" && selectedChat.data._id === receiverId) {
        setChatMessages(messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      }
    });

    socket.on("receive-message", (message) => {
      if (
        selectedChat?.type === "single" &&
        (message.senderId === selectedChat.data._id || message.receiver === selectedChat.data._id)
      ) {
        setChatMessages((prev) => {
          const updated = prev.some(
            (m) => m.timestamp === message.timestamp && m.content === message.content
          )
            ? prev
            : [...prev, message];
          return updated.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
      }
    });

    socket.on("group-chat-history", (groupChatHistory) => {
      setGroupChats((prev) =>
        prev.map((group) => {
          const history = groupChatHistory.find((h) => h.chatId === group._id);
          return history ? { ...group, messages: history.messages } : group;
        })
      );
    });

    socket.on("group-chat-messages", ({ chatId, messages }) => {
      if (
        (selectedChat?.type === "group" && selectedChat.data.chat._id === chatId) ||
        (selectedChat?.type === "subject" && selectedChat.data.chat[0]?._id === chatId)
      ) {
        setChatMessages(messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      }
    });

    socket.on("receive-group-message", (messageData) => {
      if (
        (selectedChat?.type === "group" && selectedChat.data.chat._id === messageData.chatId) ||
        (selectedChat?.type === "subject" && selectedChat.data.chat[0]?._id === messageData.chatId)
      ) {
        setChatMessages((prev) => {
          const updated = prev.some(
            (m) => m.timestamp === messageData.timestamp && m.content === messageData.content
          )
            ? prev
            : [...prev, messageData];
          return updated.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
      }
    });

    socket.on("error-message", (err) => {
      console.error("Socket error:", err);
      setMessage(err);
    });

    return () => {
      socket.off("chat-history");
      socket.off("chat-messages");
      socket.off("receive-message");
      socket.off("group-chat-history");
      socket.off("group-chat-messages");
      socket.off("receive-group-message");
      socket.off("error-message");
    };
  }, [selectedChat]);

  // Restore selected chat on initial load only
  useEffect(() => {
    const restoreChat = () => {
      const storedChatId = localStorage.getItem("selectedChatId");
      const storedChatType = localStorage.getItem("selectedChatType");
      if (storedChatId && !hasRestored) {
        if (storedChatType === "single") {
          const member = all.find((m) => m._id === storedChatId);
          if (member) {
            setSelectedChat({ type: "single", data: member });
            socket.emit("load-chat", { receiverId: member._id });
          }
        } else if (storedChatType === "group") {
          const group = groupChats.find((g) => g.chat && g.chat._id === storedChatId);
          if (group) {
            setSelectedChat({ type: "group", data: group });
            socket.emit("load-group-chat", { chatId: group.chat._id });
          }
        } else if (storedChatType === "subject") {
          let selectedSubject = null;
          for (const classId in subjectGroups) {
            const subject = subjectGroups[classId].find(
              (s) => s.chat && s.chat[0]?._id === storedChatId
            );
            if (subject) {
              selectedSubject = subject;
              break;
            }
          }
          if (selectedSubject) {
            setSelectedChat({ type: "subject", data: selectedSubject });
            socket.emit("load-group-chat", { chatId: selectedSubject.chat[0]._id });
          }
        }
        setHasRestored(true); // Mark restoration as complete
      }
    };

    if (all.length > 0 && groupChats.length > 0 && Object.keys(subjectGroups).length > 0 && !hasRestored) {
      restoreChat();
    }
  }, [all, groupChats, subjectGroups]);

  useEffect(() => {
    if (newMessage.current) {
      newMessage.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chatMessages, uploadedFiles]);

  useEffect(() => {
    setMessage("");
  }, [selectedChat]);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  const handleChatSelect = (chat, type, classGroup = null) => {
    const newChat = { type, data: chat };

    if (type === "group") {
      let userIsParticipant = false;
      const isStudent = chat.students?.find((s) => s._id === profile._id);
      const isFaculty = chat.faculty?.find((s) => s._id === profile._id);
      const isAdmin = chat.createdBy._id === profile._id;
      if (isStudent !== undefined || isFaculty !== undefined || isAdmin !== undefined) {
        userIsParticipant = true;
      }

      if (!userIsParticipant) {
        console.error("User is not a participant in this group chat");
        setMessage("You are not a participant in this group chat");
        return;
      }
    } else if (type === "subject") {
      if (!chat.chat || !chat.chat[0]?._id) {
        console.error("Subject group chat is missing:", chat);
        setMessage("This subject group chat is not available");
        return;
      }

      let userIsParticipant = false;
      const isStudent = chat.students?.some((s) => s._id === profile._id);
      const isFaculty = chat.faculty?.some((f) => f._id === profile._id);
      const isAdmin = classGroup?.createdBy._id === profile._id;
      if (isStudent || isFaculty || isAdmin) {
        userIsParticipant = true;
      }

      if (!userIsParticipant) {
        console.error("User is not a participant in this subject group chat");
        setMessage("You are not a participant in this subject group chat");
        return;
      }
    }

    setSelectedChat(newChat);
    setChatMessages([]);
    setUploadedFiles([]);
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (type === "single") {
      socket.emit("load-chat", { receiverId: chat._id });
      localStorage.setItem("selectedChatId", chat._id);
      localStorage.setItem("selectedChatType", "single");
    } else if (type === "group") {
      socket.emit("load-group-chat", { chatId: chat.chat._id });
      localStorage.setItem("selectedChatId", chat.chat._id);
      localStorage.setItem("selectedChatType", "group");
    } else if (type === "subject") {
      socket.emit("load-group-chat", { chatId: chat.chat[0]._id });
      localStorage.setItem("selectedChatId", chat.chat[0]._id);
      localStorage.setItem("selectedChatType", "subject");
    }
  };

  const handleBack = () => {
    setSelectedChat(null);
    localStorage.removeItem("selectedChatId");
    localStorage.removeItem("selectedChatType");
  };

  const sendMessage = async () => {
    if (!selectedChat) {
      setMessage("Select a chat to send a message or file");
      return;
    }

    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chatType", selectedChat.type);
      formData.append("userId", profile._id);

      if (selectedChat.type === "group") {
        formData.append("classGroup", selectedChat.data._id);
      } else if (selectedChat.type === "subject") {
        formData.append("subjectGroup", selectedChat.data._id);
      } else if (selectedChat.type === "single") {
        formData.append("receiverId", selectedChat.data._id);
      }

      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/files/upload`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          const updatedFile = {
            ...res.data.file,
            uploadedBy: { _id: profile._id, name: profile.name },
          };
          setUploadedFiles((prev) => [...prev, updatedFile]);
          setMessage("File uploaded successfully!");
          setTimeout(() => setMessage(""), 3000);
          setFile(null);
          setFilePreview(null);
          setIsPreviewOpen(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          setMessage(res.data.message);
          return;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setMessage(error.response?.data?.message || "Failed to upload file");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    if (input.trim()) {
      if (selectedChat.type === "single") {
        socket.emit("send-message", {
          receiver: selectedChat.data._id,
          content: input,
        });
      } else if (selectedChat.type === "group") {
        socket.emit("send-group-message", {
          chatId: selectedChat.data.chat._id,
          content: input,
        });
      } else if (selectedChat.type === "subject") {
        socket.emit("send-group-message", {
          chatId: selectedChat.data.chat[0]._id,
          content: input,
        });
      }
      setInput("");
    }

    if (!file && !input.trim()) {
      setMessage("Type a message or select a file to send");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      newMessage.current.scrollIntoView({ behavior: "auto" });
    } else if (e.shiftKey && e.key === "Enter") {
      setInput((prev) => prev + "\n");
      newMessage.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const combinedMessages = [
    ...chatMessages.map((msg) => ({ type: "message", data: msg })),
    ...uploadedFiles.map((file) => ({ type: "file", data: file })),
  ].sort((a, b) => new Date(a.data.timestamp || a.data.createdAt) - new Date(b.data.timestamp || b.data.createdAt));

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {!selectedChat ? (
        // Contacts Page
        <div className="flex flex-col h-full w-screen">
          <div className="grid grid-cols-3 items-center p-2 bg-cyan-500 text-white ">
            <img
              src={Logo}
              className="size-10 cursor-pointer justify-self-start ml-0"
              alt="Logo"
              onClick={() => navigate("/")}
            />
            <p className="justify-self-center text-2xl font-semibold ">Ecanent</p>
            <button onClick={() => navigate("/profile")} className="justify-self-end mr-0">
              <IoSettings className="text-2xl" />
            </button>
          </div>
          <div className="flex bg-gray-200 p-2">
            <button
              onClick={() => setActiveSection("group")}
              className={`flex-1 py-2 text-sm font-semibold ${
                activeSection === "group" ? "bg-white text-black rounded-sm" : "text-gray-700"
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveSection("single")}
              className={`flex-1 py-2 text-sm font-semibold ${
                activeSection === "single" ? "bg-white text-black rounded-sm" : "text-gray-700"
              }`}
            >
              Single
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {activeSection === "single" && (
              <>
                {all.map((member) => (
                  <li
                    key={member._id}
                    className="cursor-pointer p-4 border-b hover:bg-gray-100 flex items-center"
                    onClick={() => handleChatSelect(member, "single")}
                  >
                    <img
                      src={member.profilePic}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      alt="Profile"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {member._id === profile._id ? "You" : member.name}
                      </p>
                      <p className="text-xs text-gray-500">({member.role})</p>
                    </div>
                  </li>
                ))}
              </>
            )}
            {activeSection === "group" && (
              <>
                {groupChats.map((group) =>
                  group.chat ? (
                    <details key={group._id} className=" flex flex-col border-b">
                      <summary className="cursor-pointer p-4 bg-gray-100 hover:bg-gray-200  grid grid-cols-[5fr_1fr] w-full items-center">
                        <span className="text-sm font-semibold">{group.className}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/settings", { state: { classId: group._id } });
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          <IoSettings className="text-lg justify-self-center" />
                        </button>
                      </summary>
                      <ul className="flex flex-col">
                        <li
                          className="p-4 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleChatSelect(group, "group")}
                        >
                          General
                        </li>
                        {(subjectGroups[group._id] || []).map((subject) => (
                          <li
                            key={subject._id}
                            className="p-4 cursor-pointer hover:bg-gray-100 grid grid-cols-[5fr_1fr] items-center"
                          >
                            <span
                              className="text-sm italic"
                              onClick={() => handleChatSelect(subject, "subject", group)}
                            >
                              {subject.subjectName}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/subjectSettings", {
                                  state: { subjectId: subject._id, classId: group._id },
                                });
                              }}
                              className="text-blue-500 hover:underline"
                            >
                              <IoSettings className="text-lg justify-self-center" />
                            </button>
                          </li>
                        ))}
                        {(!subjectGroups[group._id] || subjectGroups[group._id].length === 0) && (
                          <li className="p-4 text-gray-500 italic text-sm">No subject groups</li>
                        )}
                      </ul>
                    </details>
                  ) : null
                )}
              </>
            )}
          </ul>
        </div>
      ) : (
        // Chat Page
        <div className="flex flex-col h-full w-full">
          <div className="fixed w-full top-0 bg-cyan-500 text-white p-4 grid grid-cols-2 justify-between items-center z-10">
            <div className="flex items-center justify-self-start">
              <button onClick={handleBack} className="mr-4">
                <IoMdArrowBack className="text-2xl" />
              </button>
              <h2 className="text-lg font-semibold">
                {selectedChat.type === "single"
                  ? selectedChat.data.name
                  : selectedChat.type === "group"
                  ? selectedChat.data.className
                  : selectedChat.data.subjectName}
              </h2>
            </div>
            {selectedChat.type !== "single" && (
              <button
                onClick={() =>
                  navigate(
                    selectedChat.type === "group" ? "/settings" : "/subjectSettings",
                    {
                      state:
                        selectedChat.type === "group"
                          ? { classId: selectedChat.data._id }
                          : { subjectId: selectedChat.data._id, classId: selectedChat.data.classId },
                    }
                  )
                }
                className="justify-self-end"
              >
                <IoSettings className="text-2xl" />
              </button>
            )}
          </div>
          <div className="flex flex-col overflow-y-auto h-[90vh] bg-gray-100 p-4 mt-16 pt-2 justify-end  ">
            {combinedMessages.map((item, index) => {
              if (item.type === "message") {
                const msg = item.data;
                if (selectedChat.type === "single") {
                  const isSender =
                    msg.senderId === profile._id && msg.receiver === selectedChat.data._id;
                  const isReceiver =
                    msg.senderId === selectedChat.data._id && msg.receiver === profile._id;
                  if (!isSender && !isReceiver) return null;
                  return (
                    <div
                      key={index}
                      className={`p-2 my-2 rounded-md w-fit max-w-[80%]  break-words ${
                        msg.senderId === profile._id
                          ? "bg-cyan-500 text-white self-end ml-auto"
                          : "bg-white text-black"
                      }`}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className="text-sm">{line}</p>
                      ))}
                      <p className="text-[10px] font-light mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className={`p-2 my-2 rounded-md w-fit max-w-[80%] break-words ${
                        msg.senderId === profile._id
                          ? "bg-cyan-500 text-white self-end ml-auto"
                          : "bg-white text-black"
                      }`}
                      style={
                        msg.senderId !== profile._id
                          ? { backgroundColor: getUserColor(msg.senderId) }
                          : {}
                      }
                    >
                      <p className="font-bold mb-1 text-sm">
                        {msg.senderId === profile._id ? "You" : msg.sender}
                      </p>
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className="text-sm">{line}</p>
                      ))}
                      <p className="text-[10px] font-light mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  );
                }
              } else if (item.type === "file") {
                const file = item.data;
                if (!file.fileName) return null;
                const isImage = ["image"].includes(file.fileType.toLowerCase());
                const isVideo = ["video"].includes(file.fileType.toLowerCase());
                const isDownloadable = ["pdf", "doc", "pptx", "txt"].includes(
                  file.fileType.toLowerCase()
                );
                return (
                  <div
                    key={index}
                    className={`p-2 my-2 rounded-md w-fit max-w-[80%] break-words ${
                      file.uploadedBy._id === profile._id
                        ? "bg-cyan-500 text-white self-end ml-auto"
                        : "bg-white text-black"
                    }`}
                    style={
                      file.uploadedBy._id !== profile._id
                        ? { backgroundColor: getUserColor(file.uploadedBy._id) }
                        : {}
                    }
                  >
                    <p className="font-bold mb-1 text-sm">
                      {file.uploadedBy._id === profile._id
                        ? "You"
                        : file.uploadedBy.name} shared a file
                    </p>
                    {isImage && (
                      <img
                        src={file.fileUrl}
                        alt={file.fileName}
                        className="max-w-[150px] max-h-[150px] rounded-md my-2"
                        onError={(e) => {
                          console.error("Error loading image:", e);
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    {isVideo && (
                      <video
                        src={file.fileUrl}
                        controls
                        className="max-w-[150px] max-h-[150px] rounded-md my-2"
                        onError={(e) => {
                          console.error("Error loading video:", e);
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    {(isDownloadable || (!isImage && !isVideo)) && (
                      <>
                        <div className="flex items-center my-2">
                          {getFileIcon(file.fileType, file.fileName)}
                          <div className="flex-1">
                            <p className="text-xs">{file.fileName}</p>
                            <p className="text-[10px] text-gray-200">
                              {file.fileSize} KB, {getFileTypeDescription(file)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              const previewUrl = `/preview?fileUrl=${encodeURIComponent(
                                file.fileUrl
                              )}&fileType=${encodeURIComponent(
                                file.fileType
                              )}&fileName=${encodeURIComponent(file.fileName)}`;
                              window.open(previewUrl, "_blank");
                            }}
                            className="bg-white text-black p-1 rounded text-xs w-full"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => downloadFile(file.fileUrl, file.fileName)}
                            className="bg-white text-black px-2 py-1 rounded text-xs w-full"
                          >
                            Save as...
                          </button>
                        </div>
                      </>
                    )}
                    <p className="text-[10px] font-light mt-1">
                      {new Date(file.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                );
              }
              return null;
            })}
            <div ref={newMessage} />
            {combinedMessages.length === 0 && (
              <p className="text-sm text-center">No messages yet</p>
            )}
          </div>
          {isPreviewOpen && file && (
            <div className="bg-white p-2 rounded-md border border-gray-300 mb-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">File Preview</h3>
                <button
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setFilePreview(null);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Close
                </button>
              </div>
              {getFileType(file) === "image" && filePreview && (
                <img
                  src={filePreview}
                  alt="File preview"
                  className="max-w-[200px] max-h-[200px] rounded-md"
                  onError={(e) => {
                    console.error("Error loading image preview:", e);
                    setFilePreview(null);
                    setIsPreviewOpen(false);
                  }}
                />
              )}
              {getFileType(file) === "video" && filePreview && (
                <video
                  src={filePreview}
                  controls
                  className="max-w-[200px] max-h-[200px] rounded-md"
                  onError={(e) => {
                    console.error("Error loading video preview:", e);
                    setFilePreview(null);
                    setIsPreviewOpen(false);
                  }}
                />
              )}
            </div>
          )}
          <div className="flex p-2 bg-white border-t">
            <div className="flex-1 flex flex-col">
              {file && getFileType(file) !== "image" && getFileType(file) !== "video" && (
                <div className="bg-gray-200 p-2 rounded-md mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(getFileType(file), file.name)}
                    <span className="text-xs text-gray-800">{file.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                      setIsPreviewOpen(false);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
              <textarea
                className="border border-gray-400 p-2 rounded-l-md resize-none overflow-y-auto text-sm"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows="2"
                style={{ minHeight: "40px", maxHeight: "40px", lineHeight: "12px", paddingTop: "12px" }}
              />
            </div>
            <div className="flex items-center ml-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  if (selectedFile) {
                    const fileType = getFileType(selectedFile);
                    if (fileType === "image" || fileType === "video") {
                      const previewUrl = URL.createObjectURL(selectedFile);
                      setFilePreview(previewUrl);
                      setIsPreviewOpen(true);
                    } else {
                      setFilePreview(null);
                      setIsPreviewOpen(false);
                    }
                  } else {
                    setFilePreview(null);
                    setIsPreviewOpen(false);
                  }
                }}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.txt,.pptx"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`${isDarkMode ? "bg-black" : "bg-white"} border border-black text-black p-2 rounded`}
              >
                <GiSafetyPin className="text-cyan-500 text-xl" />
              </button>
            </div>
            <button
              className="bg-cyan-500 text-white p-2 rounded-r-md ml-2 text-sm"
              onClick={sendMessage}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Send"}
            </button>
          </div>
          {message && <p className="p-2 text-red-500 text-sm">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default MobileChat;
