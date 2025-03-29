// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams,useLocation } from "react-router-dom";
// import arrow from "./assets/arrow_back.png";
// import DarkMode from "./DarkMode";

// function ClassSettings() {
//     const isDarkMode = DarkMode();
//     const navigate = useNavigate();
//     const { classId: classIdFromParams } = useParams(); // Get class ID from URL params
//     const [classData, setClassData] = useState(null);
//     const [allMembers, setAllMembers] = useState([]); // All available members
//     const [profile, setProfile] = useState(null); // Current user's profile
//     const [message, setMessage] = useState("");
//     const location = useLocation();
//     const classId = location.state?.classId || classIdFromParams;
//     const [editClassName, setEditClassName] = useState(false);
//     const [newClassName, setNewClassName] = useState("");
//     const [showAddMembers, setShowAddMembers] = useState(false);
//     const [selectedMembersToAdd, setSelectedMembersToAdd] = useState([]);
//     const [showRemoveMembers, setShowRemoveMembers] = useState(false);
//     const [selectedMembersToRemove, setSelectedMembersToRemove] = useState([]);
//     const [createSubjectGroup, setCreateSubjectGroup] = useState(false);
//     const [subjectGroupName, setSubjectGroupName] = useState("");
//     const [selectedSubjectGroupMembers, setSelectedSubjectGroupMembers] = useState([]);
//     const [deleteConfirm, setDeleteConfirm] = useState(false);

//     // Fetch class data, user profile, and all members on mount
//     useEffect(() => {
//         const getProfile = async () => {
//             try {
//                 const res = await axios.get("http://localhost:5000/api/user/profile", {
//                     withCredentials: true,
//                 });
//                 setProfile(res.data.userData || res.data);
//             } catch (error) {
//                 console.error("Error fetching profile:", error);
//                 setMessage("Failed to load profile");
//                 navigate("/login");
//             }
//         };

//         const getClassData = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:5000/api/class/${classId}`, {
//                     withCredentials: true,
//                 });
//                 // console.log(res.data)
//                 setClassData(res.data);
//                 setNewClassName(res.data.className);
//             } catch (error) {
//                 console.error("Error fetching class data:", error);
//                 setMessage("Failed to load class data");
//                 navigate("/chat");
//             }
//         };

//         const getAllMembers = async () => {
//             try {
//                 const res = await axios.get("http://localhost:5000/api/user/members", {
//                     withCredentials: true,
//                 });
//                 // console.log(res.data.members)
//                 setAllMembers(res.data.members || []);
//             } catch (error) {
//                 console.error("Error fetching members:", error);
//                 setMessage("Failed to load members");
//             }
//         };

//         getProfile();
//         getClassData();
//         getAllMembers();
//     }, [navigate, classId]);

//     // Handle class name update
//     const handleClassNameUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.put(
//                 `http://localhost:5000/api/class/${classId}`,
//                 { className: newClassName },
//                 { withCredentials: true }
//             );
//             if (response.data.success) {
//                 setClassData((prev) => ({ ...prev, className: newClassName }));
//                 setMessage("Class name updated successfully!");
//                 setEditClassName(false);
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error updating class name:", error);
//             setMessage("Failed to update class name");
//         }
//     };

//     // Toggle member selection for adding
//     const toggleAddMember = (memberId) => {
//         setSelectedMembersToAdd((prev) =>
//             prev.includes(memberId)
//                 ? prev.filter((id) => id !== memberId)
//                 : [...prev, memberId]
//         );
//     };

//     // Add selected members to the class
//     const addMembersToClass = async () => {
//         try {
//             const response = await axios.put(
//                 `http://localhost:5000/api/class/${classId}`,
//                 { members: selectedMembersToAdd },
//                 { withCredentials: true }
//             );
//             if (response.data.success) {
//                 // console.log(classData)
//                 setClassData((prev) => ({
//                     ...prev,
//                     students: [...prev.students, ...response.data.newStudents],
//                     faculty: [...prev.faculty, ...response.data.newFaculty],
//                 }));
//                 setMessage("Members added successfully!");
//                 setSelectedMembersToAdd([]);
//                 setShowAddMembers(false);
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error adding members:", error);
//             setMessage("Failed to add members");
//         }
//     };

//     // Toggle member selection for removing
//     const toggleRemoveMember = (memberId) => {
//         setSelectedMembersToRemove((prev) =>
//             prev.includes(memberId)
//                 ? prev.filter((id) => id !== memberId)
//                 : [...prev, memberId]
//         );
//     };

//     // Remove selected members from the class
//     // const removeMembersFromClass = async () => {
//     //     try {
//     //         const response = await axios.put(
//     //             `http://localhost:5000/api/class/${classId}`,
//     //             { members: selectedMembersToRemove },
//     //             { withCredentials: true }
//     //         );
//     //         if (response.data.success) {
//     //             setClassData((prev) => ({
//     //                 ...prev,
//     //                 students: prev.students.filter(
//     //                     (s) => !selectedMembersToRemove.includes(s._id)
//     //                 ),
//     //                 faculty: prev.faculty.filter(
//     //                     (f) => !selectedMembersToRemove.includes(f._id)
//     //                 ),
//     //             }));
//     //             setMessage("Members removed successfully!");
//     //             setSelectedMembersToRemove([]);
//     //             setShowRemoveMembers(false);
//     //         } else {
//     //             setMessage(response.data.message);
//     //         }
//     //     } catch (error) {
//     //         console.error("Error removing members:", error);
//     //         setMessage("Failed to remove members");
//     //     }
//     // };

//     const removeMembersFromClass = async () => {
//         try {
//             // Split selectedMembersToRemove into students and faculty
//             const studentsToRemove = selectedMembersToRemove.filter((memberId) =>
//                 classData.students.some((student) => student._id === memberId)
//             );
//             const facultyToRemove = selectedMembersToRemove.filter((memberId) =>
//                 classData.faculty.some((faculty) => faculty._id === memberId)
//             );
    
//             const response = await axios.put(
//                 `http://localhost:5000/api/class/${classId}`,
//                 { studentsToRemove, facultyToRemove },
//                 { withCredentials: true }
//             );
    
//             if (response.data.success) {
//                 setClassData((prev) => ({
//                     ...prev,
//                     students: prev.students.filter(
//                         (s) => !studentsToRemove.includes(s._id)
//                     ),
//                     faculty: prev.faculty.filter(
//                         (f) => !facultyToRemove.includes(f._id)
//                     ),
//                 }));
//                 setMessage("Members removed successfully!");
//                 setSelectedMembersToRemove([]);
//                 setShowRemoveMembers(false);
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error removing members:", error.response?.data || error.message);
//             if (error.response?.status === 401) {
//                 setMessage("Authentication failed. Please log in again.");
//                 navigate("/login");
//             } else if (error.response?.status === 403) {
//                 setMessage("Access denied. Only Admins or HODs can remove members.");
//             } else {
//                 setMessage(error.response?.data?.message || "Failed to remove members");
//             }
//         }
//     };

//     // Toggle member selection for subject group
//     const toggleSubjectGroupMember = (memberId) => {
//         setSelectedSubjectGroupMembers((prev) =>
//             prev.includes(memberId)
//                 ? prev.filter((id) => id !== memberId)
//                 : [...prev, memberId]
//         );
//     };

//     // Create a new subject group
//     const createNewSubjectGroup = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post(
//                 `http://localhost:5000/api/class/${classId}/subject-group`,
//                 {
//                     name: subjectGroupName,
//                     members: selectedSubjectGroupMembers,
//                 },
//                 { withCredentials: true }
//             );
//             if (response.data.success) {
//                 setMessage("Subject group created successfully!");
//                 setSubjectGroupName("");
//                 setSelectedSubjectGroupMembers([]);
//                 setCreateSubjectGroup(false);
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error creating subject group:", error);
//             setMessage("Failed to create subject group");
//         }
//     };

//     // Delete the class group
//     const deleteClassGroup = async () => {
//         try {
//             const response = await axios.delete(
//                 `http://localhost:5000/api/class/${classId}`,
//                 { withCredentials: true }
//             );
//             if (response.data.success) {
//                 setMessage("Class group deleted successfully!");
//                 navigate("/chat");
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error deleting class group:", error);
//             setMessage("Failed to delete class group");
//         }
//     };

//     if (!classData || !profile) {
//         return <div>Loading...</div>;
//     }
//     const groupAdmin = allMembers.find(
//         (member) => member._id === classData.chat.groupAdmin
//     );
//     // console.log(allMembers)
//     const HOD = allMembers.find(
//         (member)=> member.role === "HOD"
//     )
    

//     // Filter available members to add (exclude current class members)
//     const availableMembersToAdd = allMembers.filter(
//         (member) =>
//             !classData.students.some((s) => s._id === member._id) &&
//             !classData.faculty.some((f) => f._id === member._id)&&
//             !groupAdmin
//     );
//     console.log("availableMembersToAdd:", availableMembersToAdd);console.log("availableMembersToAdd:", availableMembersToAdd);

//     // Combine students and faculty for member management
//     const classMembers = [...(groupAdmin ? [groupAdmin] : []),...classData.students, ...classData.faculty];
//     const mainMembers = [...classData.students, ...classData.faculty];

//     return (
//         <div
//             className={`min-h-screen p-6 ${
//                 isDarkMode ? "bg-[#423E3E] text-white" : "bg-#EDEDED text-black"
//             } overflow-hidden`}
//         >
//             {/* Back Button */}
//             <button
//                 className="rounded-full w-12 h-12 bg-[#20AFC5] flex justify-center items-center mb-6 shadow-lg hover:bg-[#1a8fa3] transition-all duration-300"
//                 onClick={() => navigate(-1)}
//             >
//                 <img src={arrow} className="w-7 h-7" alt="Back" />
//             </button>

//             {/* Page Title */}
//             <h1 className="text-4xl font-bold text-center mb-8 text-[#20AFC5] drop-shadow-lg">
//                 {classData.className}
//             </h1>

//             {/* Main Content */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Left Section: Class Information */}
//                 <div className={` ${isDarkMode ? 'bg-[#423E3E]' : 'bg-white' } rounded-lg shadow-xl p-6 border-2 border-black`}>
//                     <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-[#20AFC5]' : 'text-white' } `}>Class Information</h2>

//                     {/* Class Name */}
//                     <div className="mb-4">
//                         {editClassName ? (
//                             <form onSubmit={handleClassNameUpdate} className="flex flex-col gap-3">
//                                 <input
//                                     type="text"
//                                     value={newClassName}
//                                     onChange={(e) => setNewClassName(e.target.value)}
//                                     className="border-2 border-gray-400 p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#20AFC5]"
//                                     placeholder="Enter new class name"
//                                     required
//                                 />
//                                 <div className="flex gap-3">
//                                     <button
//                                         type="submit"
//                                         className="bg-[#20AFC5] text-white p-2 rounded-md hover:bg-[#1a8fa3] transition-all duration-300"
//                                     >
//                                         Save
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => setEditClassName(false)}
//                                         className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-all duration-300"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </form>
//                         ) : (
//                             <div className="flex justify-between items-center">
//                                 <h3 className="text-lg font-medium">
//                                     Name: <span className="text-cyan-500">{classData.className}</span>
//                                 </h3>
//                                 {(profile.role === "Admin" || profile.role === "HOD")  && 
//                                     <button
//                                     onClick={() => setEditClassName(true)}
//                                     className="bg-[#20AFC5] text-white px-4 py-1 rounded-md hover:bg-[#1a8fa3] transition-all duration-300"
//                                 >
//                                     Edit Name
//                                 </button>
//                                 }
//                             </div>
//                         )}
//                     </div>

//                     {/* Current Members */}
//                     <div>
//                         <h3 className="text-lg font-medium mb-2">Current Members</h3>
//                         <ul className="max-h-60 overflow-y-auto border rounded-md p-2">
//                             {classMembers.map((member) => (
//                                 <li
//                                     key={member._id}
//                                     className={`p-2 border-b last:border-b-0 ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"  } transition-all duration-200`}
//                                 >
//                                     {member.name} ({member.role})
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>

//                 {/* Right Section: Management Options */}
//                 <div className={`space-y-6`}>
//                     {/* Member Management (Admins Only) */}
//                     {profile.role === "Admin" && (
//                         <div className={` ${isDarkMode ? 'bg-[#423E3E]' : 'bg-white' } rounded-lg shadow-xl p-6 border-2 border-black`}>
//                             <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-[#20AFC5]' : 'text-white' }`}>
//                                 Member Management
//                             </h2>

//                             {/* Add Members */}
//                             <div className="mb-4">
//                                 <button
//                                     onClick={() => setShowAddMembers((prev) => !prev)}
//                                     className="bg-[#20AFC5] text-white px-4 py-2 rounded-md hover:bg-[#1a8fa3] transition-all duration-300"
//                                 >
//                                     {showAddMembers ? "Hide Add Members" : "Add Members"}
//                                 </button>
//                                 {showAddMembers && (
//                                     <div className="mt-4">
//                                         <ul className="max-h-40 overflow-y-auto border rounded-md p-2 mb-4">
                                            
//                                             {availableMembersToAdd.length>0 ? ( availableMembersToAdd.map((member) => (
//                                                 <li
//                                                     key={member._id}
//                                                     className={`flex justify-between items-center p-2 border-b last:border-b-0 ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"  } transition-all duration-200`}
//                                                 >
//                                                     <span>
//                                                         {member.name} ({member.role})
//                                                     </span>
//                                                     <button
//                                                         onClick={() => toggleAddMember(member._id)}
//                                                         className={`px-3 py-1 rounded-md text-white ${
//                                                             selectedMembersToAdd.includes(member._id)
//                                                                 ? "bg-green-500 hover:bg-green-600"
//                                                                 : "bg-gray-500 hover:bg-gray-600"
//                                                         } transition-all duration-200`}
//                                                     >
//                                                         {selectedMembersToAdd.includes(member._id)
//                                                             ? "Selected"
//                                                             : "Add"}
//                                                     </button>
//                                                 </li>
//                                             ))) : "No member left to Add"}
//                                         </ul>
//                                         {selectedMembersToAdd.length > 0 && (
//                                             <button
//                                                 onClick={addMembersToClass}
//                                                 className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
//                                             >
//                                                 Confirm Add ({selectedMembersToAdd.length})
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Remove Members */}
//                             <div>
//                                 <button
//                                     onClick={() => setShowRemoveMembers((prev) => !prev)}
//                                     className="bg-[#ff4c4c] text-white px-4 py-2 rounded-md hover:bg-[#e04343] transition-all duration-300"
//                                 >
//                                     {showRemoveMembers ? "Hide Remove Members" : "Remove Members"}
//                                 </button>
//                                 {showRemoveMembers && (
//                                     <div className="mt-4">
//                                         <ul className="max-h-40 overflow-y-auto border rounded-md p-2 mb-4">
//                                             {mainMembers.map((member) => (
//                                                 <li
//                                                     key={member._id}
//                                                     className={`flex justify-between items-center p-2 border-b last:border-b-0 ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"  } transition-all duration-200`}
//                                                 >
//                                                     <span>
//                                                         {member.name} ({member.role})
//                                                     </span>
//                                                     <button
//                                                         onClick={() => toggleRemoveMember(member._id)}
//                                                         className={`px-3 py-1 rounded-md text-white ${
//                                                             selectedMembersToRemove.includes(member._id)
//                                                                 ? "bg-red-500 hover:bg-red-600"
//                                                                 : "bg-gray-500 hover:bg-gray-600"
//                                                         } transition-all duration-200`}
//                                                     >
//                                                         {selectedMembersToRemove.includes(member._id)
//                                                             ? "Selected"
//                                                             : "Remove"}
//                                                     </button>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                         {selectedMembersToRemove.length > 0 && (
//                                             <button
//                                                 onClick={removeMembersFromClass}
//                                                 className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
//                                             >
//                                                 Confirm Remove ({selectedMembersToRemove.length})
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {/* Subject Groups */}
//                     <div className={`${isDarkMode ? 'bg-[#423E3E]' : 'bg-white' } rounded-lg shadow-xl p-6 border-2 border-black`}>
//                         <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-[#20AFC5]' : 'text-white' }`}>
//                             Subject Groups
//                         </h2>
//                         <button
//                             onClick={() => setCreateSubjectGroup((prev) => !prev)}
//                             className="bg-[#20AFC5] text-white px-4 py-2 rounded-md hover:bg-[#1a8fa3] transition-all duration-300"
//                         >
//                             {createSubjectGroup ? "Cancel" : "Create Subject Group"}
//                         </button>
//                         {createSubjectGroup && (
//                             <form onSubmit={createNewSubjectGroup} className="mt-4 space-y-4">
//                                 <input
//                                     type="text"
//                                     value={subjectGroupName}
//                                     onChange={(e) => setSubjectGroupName(e.target.value)}
//                                     className="border-2 border-gray-400 p-2 rounded-md w-full text-black focus:outline-none focus:ring-2 focus:ring-[#20AFC5]"
//                                     placeholder="Enter subject group name"
//                                     required
//                                 />
//                                 <ul className="max-h-40 overflow-y-auto border rounded-md p-2">
//                                     {classMembers.map((member) => (
//                                         <li
//                                             key={member._id}
//                                             className={`flex justify-between items-center p-2 border-b last:border-b-0 ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"  } transition-all duration-200`}
//                                         >
//                                             <span>
//                                                 {member.name} ({member.role})
//                                             </span>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => toggleSubjectGroupMember(member._id)}
//                                                 className={`px-3 py-1 rounded-md text-white ${
//                                                     selectedSubjectGroupMembers.includes(member._id)
//                                                         ? "bg-green-500 hover:bg-green-600"
//                                                         : "bg-gray-500 hover:bg-gray-600"
//                                                 } transition-all duration-200`}
//                                             >
//                                                 {selectedSubjectGroupMembers.includes(member._id)
//                                                     ? "Selected"
//                                                     : "Add"}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                                 <button
//                                     type="submit"
//                                     className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
//                                     disabled={selectedSubjectGroupMembers.length === 0}
//                                 >
//                                     Create Subject Group
//                                 </button>
//                             </form>
//                         )}
//                     </div>

//                     {/* Delete Class Group (Admins Only) */}
//                     {profile.role === "Admin" && (
//                         <div className={`${isDarkMode ? 'bg-[#423E3E]' : 'bg-white' } rounded-lg shadow-xl p-6 border-2 border-black`}>
//                             <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-[#20AFC5]' : 'text-white' }`}>
//                                 Delete Class Group
//                             </h2>
//                             <button
//                                 onClick={() => setDeleteConfirm(true)}
//                                 className="bg-[#ff4c4c] text-white px-4 py-2 rounded-md hover:bg-[#e04343] transition-all duration-300"
//                             >
//                                 Delete Class Group
//                             </button>
//                             {deleteConfirm && (
//                                 <div className="mt-4 border-2 border-red-500 p-4 rounded-md">
//                                     <p className="mb-4 text-red-500">
//                                         Are you sure you want to delete this class group? This action cannot be undone.
//                                     </p>
//                                     <div className="flex gap-4">
//                                         <button
//                                             onClick={deleteClassGroup}
//                                             className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
//                                         >
//                                             Yes, Delete
//                                         </button>
//                                         <button
//                                             onClick={() => setDeleteConfirm(false)}
//                                             className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-300"
//                                         >
//                                             Cancel
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Message Display */}
//             {/* {message && (
//                 <div className="mt-6 p-4 w-[50%] bg-cyan-100 text-cyan-700 rounded-md border-2 border-cyan-500">
//                     {message}
//                 </div>
//             )} */}
//         </div>
//     );
// }

// export default ClassSettings;



import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import arrow from "./assets/arrow_back.png";
import DarkMode from "./DarkMode";

function ClassSettings() {
    const isDarkMode = DarkMode();
    const navigate = useNavigate();
    const { classId: classIdFromParams } = useParams();
    const [classData, setClassData] = useState(null);
    const [allMembers, setAllMembers] = useState([]);
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState("");
    const location = useLocation();
    const classId = location.state?.classId || classIdFromParams;
    const [editClassName, setEditClassName] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [selectedMembersToAdd, setSelectedMembersToAdd] = useState([]);
    const [showRemoveMembers, setShowRemoveMembers] = useState(false);
    const [selectedMembersToRemove, setSelectedMembersToRemove] = useState([]);
    const [createSubjectGroup, setCreateSubjectGroup] = useState(false);
    const [subjectGroupName, setSubjectGroupName] = useState("");
    const [selectedSubjectGroupMembers, setSelectedSubjectGroupMembers] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Fetch class data, user profile, and all members on mount
    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
                    withCredentials: true,
                });
                // console.log("Profile data:", res.data);
                setProfile(res.data.userData || res.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setMessage("Failed to load profile");
                navigate("/login");
            }
        };

        const getClassData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/class/${classId}`, {
                    withCredentials: true,
                });
                // console.log("Class data:", res.data);
                setClassData(res.data);
                setNewClassName(res.data.className);
            } catch (error) {
                console.error("Error fetching class data:", error);
                setMessage("Failed to load class data");
                navigate("/chat");
            }
        };

        const getAllMembers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/members`, {
                    withCredentials: true,
                });
                // console.log("All members:", res.data.members);
                setAllMembers(res.data.members || []);
            } catch (error) {
                console.error("Error fetching members:", error);
                setMessage("Failed to load members");
            }
        };

        getProfile();
        getClassData();
        getAllMembers();
    }, [navigate, classId]);

    // Compute groupAdmin and availableMembersToAdd
    const groupAdmin = allMembers.find(
        (member) => member._id === classData?.chat?.groupAdmin
    );

    useEffect(() => {
        if (createSubjectGroup && groupAdmin) {
            // Automatically add groupAdmin to selectedSubjectGroupMembers when the form opens
            setSelectedSubjectGroupMembers((prev) => {
                if (!prev.includes(groupAdmin._id)) {
                    return [groupAdmin._id, ...prev];
                }
                return prev;
            });
        } else if (!createSubjectGroup) {
            // Reset selectedSubjectGroupMembers when the form closes
            setSelectedSubjectGroupMembers([]);
        }
    }, [createSubjectGroup, groupAdmin]);

    const availableMembersToAdd = useMemo(() => {
        if (!allMembers || !classData) return [];
        return allMembers.filter(
            (member) =>
                !classData.students.some((s) => s._id === member._id) &&
                !classData.faculty.some((f) => f._id === member._id) &&
                (!groupAdmin || member._id !== groupAdmin._id)
        );
    }, [allMembers, classData, groupAdmin]);

    // Handle class name update
    const handleClassNameUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/class/${classId}`,
                { className: newClassName },
                { withCredentials: true }
            );
            if (response.data.success) {
                setClassData((prev) => ({ ...prev, className: newClassName }));
                setMessage("Class name updated successfully!");
                setEditClassName(false);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error updating class name:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                setMessage("Authentication failed. Please log in again.");
                navigate("/login");
            } else if (error.response?.status === 403) {
                setMessage("Access denied. Only Admins or HODs can update the class name.");
            } else {
                setMessage(error.response?.data?.message || "Failed to update class name");
            }
        }
    };

    // Toggle member selection for adding
    const toggleAddMember = (memberId) => {
        if (!memberId) {
            console.error("Invalid memberId:", memberId);
            return;
        }
        setSelectedMembersToAdd((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    // Add selected members to the class
    const addMembersToClass = async () => {
        try {
            const studentsToAdd = selectedMembersToAdd.filter((memberId) =>
                allMembers.find((member) => member._id === memberId && member.role === "Student")
            );
            const facultyToAdd = selectedMembersToAdd.filter((memberId) =>
                allMembers.find((member) => member._id === memberId && (member.role === "Faculty" || member.role === "HOD"))
            );

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/class/${classId}`,
                { studentsToAdd, facultyToAdd },
                { withCredentials: true }
            );

            if (response.data.success) {
                const newStudents = allMembers.filter((member) =>
                    studentsToAdd.includes(member._id)
                );
                const newFaculty = allMembers.filter((member) =>
                    facultyToAdd.includes(member._id)
                );

                setClassData((prev) => ({
                    ...prev,
                    students: [...prev.students, ...newStudents],
                    faculty: [...prev.faculty, ...newFaculty],
                }));
                setMessage("Members added successfully!");
                setSelectedMembersToAdd([]);
                setShowAddMembers(false);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error adding members:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                setMessage("Authentication failed. Please log in again.");
                navigate("/login");
            } else if (error.response?.status === 403) {
                setMessage("Access denied. Only Admins or HODs can add members.");
            } else {
                setMessage(error.response?.data?.message || "Failed to add members");
            }
        }
    };

    // Toggle member selection for removing
    const toggleRemoveMember = (memberId) => {
        if (!memberId) {
            console.error("Invalid memberId:", memberId);
            return;
        }
        setSelectedMembersToRemove((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    // Remove selected members from the class
    const removeMembersFromClass = async () => {
        try {
            const studentsToRemove = selectedMembersToRemove.filter((memberId) =>
                classData.students.some((student) => student._id === memberId)
            );
            const facultyToRemove = selectedMembersToRemove.filter((memberId) =>
                classData.faculty.some((faculty) => faculty._id === memberId)
            );

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/class/${classId}`,
                { studentsToRemove, facultyToRemove },
                { withCredentials: true }
            );

            if (response.data.success) {
                setClassData((prev) => ({
                    ...prev,
                    students: prev.students.filter(
                        (s) => !studentsToRemove.includes(s._id)
                    ),
                    faculty: prev.faculty.filter(
                        (f) => !facultyToRemove.includes(f._id)
                    ),
                }));
                setMessage("Members removed successfully!");
                setSelectedMembersToRemove([]);
                setShowRemoveMembers(false);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error removing members:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                setMessage("Authentication failed. Please log in again.");
                navigate("/login");
            } else if (error.response?.status === 403) {
                setMessage("Access denied. Only Admins or HODs can remove members.");
            } else {
                setMessage(error.response?.data?.message || "Failed to remove members");
            }
        }
    };

    // Toggle member selection for subject group
    // const toggleSubjectGroupMember = (memberId) => {
    //     if (!memberId) {
    //         console.error("Invalid memberId:", memberId);
    //         return;
    //     }
    //     if (memberId === groupAdmin?._id) {
    //         return; // Do nothing if trying to deselect the groupAdmin
    //     }
    //     setSelectedSubjectGroupMembers((prev) =>
    //         prev.includes(memberId)
    //             ? prev.filter((id) => id !== memberId)
    //             : [...prev, memberId]
    //     );
    // };

    // // Create a new subject group
    // const createNewSubjectGroup = async (e) => {
    //     console.log(classId)
    //     console.log(selectedSubjectGroupMembers)

    //     e.preventDefault();
    //     try {
    //         const response = await axios.post(
    //             `http://localhost:5000/api/subject/${classId}`,
    //             {
    //                 subjectName: subjectGroupName,
    //                 members: selectedSubjectGroupMembers,
    //             },
    //             { withCredentials: true }
    //         );
    //         if (response.data.success) {
    //             setMessage("Subject group created successfully!");
    //             setSubjectGroupName("");
    //             setSelectedSubjectGroupMembers([]);
    //             setCreateSubjectGroup(false);
    //         } else {
    //             setMessage(response.data.message);
    //         }
    //     } catch (error) {
    //         console.error("Error creating subject group:", error.response?.data || error.message);
    //         if (error.response?.status === 401) {
    //             setMessage("Authentication failed. Please log in again.");
    //             navigate("/login");
    //         } else if (error.response?.status === 403) {
    //             setMessage("Access denied. Only authorized users can create subject groups.");
    //         } else {
    //             setMessage(error.response?.data?.message || "Failed to create subject group");
    //         }
    //     }
    // };


    const toggleSubjectGroupMember = (memberId) => {
        if (!memberId) {
            console.error("Invalid memberId:", memberId);
            return;
        }
        if (memberId === groupAdmin?._id) {
            return; // Do nothing if trying to deselect the groupAdmin
        }
        setSelectedSubjectGroupMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };
    
    // Create a new subject group
    const createNewSubjectGroup = async (e) => {
        console.log(classId);
        e.preventDefault();
        try {
            // Split selectedSubjectGroupMembers into faculty and students
            const students = selectedSubjectGroupMembers.filter((memberId) =>
                allMembers.find((member) => member._id === memberId && member.role === "Student")
            );
            const faculty = selectedSubjectGroupMembers.filter((memberId) =>
                allMembers.find((member) => 
                    member._id === memberId && 
                    (member.role === "Faculty" || member.role === "Admin" || member.role === "HOD")
                )
            );
    
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/subject/${classId}`,
                {
                    subjectName: subjectGroupName,
                    faculty: faculty,
                    students: students,
                },
                { withCredentials: true }
            );
    
            if (response.data.success) {
                setMessage("Subject group created successfully!");
                setSubjectGroupName("");
                setSelectedSubjectGroupMembers([]);
                setCreateSubjectGroup(false);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error creating subject group:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                setMessage("Authentication failed. Please log in again.");
                navigate("/login");
            } else if (error.response?.status === 403) {
                setMessage("Access denied. Only authorized users can create subject groups.");
            } else {
                setMessage(error.response?.data?.message || "Failed to create subject group");
            }
        }
    };

    // Delete the class group
    const deleteClassGroup = async () => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/class/${classId}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setMessage("Class group deleted successfully!");
                navigate("/chat");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting class group:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                setMessage("Authentication failed. Please log in again.");
                navigate("/login");
            } else if (error.response?.status === 403) {
                setMessage("Access denied. Only Admins can delete class groups.");
            } else {
                setMessage(error.response?.data?.message || "Failed to delete class group");
            }
        }
    };

    if (!classData || !profile) {
        return <div>Loading...</div>;
    }

    const HOD = allMembers.find((member) => member.role === "HOD");

    // Combine students and faculty for member management
    const classMembers = [...(groupAdmin ? [groupAdmin] : []), ...classData.students, ...classData.faculty];
    const mainMembers = [...classData.students, ...classData.faculty];

    return (
        <div
            className={`min-h-screen p-6 ${
                isDarkMode ? "bg-[#423E3E] text-white" : "bg-#EDEDED text-black"
            } overflow-hidden`}
        >
            {/* Back Button */}
            <button
                className="rounded-full w-12 h-12 bg-[#20AFC5] flex justify-center items-center mb-6 shadow-lg hover:bg-[#1a8fa3] transition-all duration-300"
                onClick={() => navigate(-1)}
            >
                <img src={arrow} className="w-7 h-7" alt="Back" />
            </button>

            {/* Page Title */}
            <h1 className="text-4xl font-bold text-center mb-8 text-[#20AFC5] drop-shadow-lg">
                {classData.className}
            </h1>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Section: Class Information */}
                <div className={`${isDarkMode ? "bg-[#423E3E]" : "bg-white"} rounded-lg shadow-xl p-6 border-2 border-black`}>
                    <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-[#20AFC5]" : "text-black"}`}>
                        Class Information
                    </h2>

                    {/* Class Name */}
                    <div className="mb-4">
                        {editClassName ? (
                            <form onSubmit={handleClassNameUpdate} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    className={`border-2 border-gray-400 p-2 rounded-md ${isDarkMode ? "text-white" : "text-black"} focus:outline-none focus:ring-2 focus:ring-[#20AFC5]`}
                                    placeholder="Enter new class name"
                                    required
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="bg-[#20AFC5] text-white p-2 rounded-md hover:bg-[#1a8fa3] transition-all duration-300"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditClassName(false)}
                                        className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">
                                    Name: <span className="text-cyan-500">{classData.className}</span>
                                </h3>
                                {(profile.role === "Admin" || profile.role === "HOD") && (
                                    <button
                                        onClick={() => setEditClassName(true)}
                                        className="bg-[#20AFC5] text-white px-4 py-1 rounded-md hover:bg-[#1a8fa3] transition-all duration-300"
                                    >
                                        Edit Name
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Current Members */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Current Members</h3>
                        <ul className="max-h-60 overflow-y-auto border rounded-md p-2">
                            {classMembers.map((member) => (
                                <li
                                    key={member._id}
                                    className={`p-2 border-b last:border-b-0 ${
                                        isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
                                    } transition-all duration-200`}
                                >
                                    {member.name || "Unknown"} ({member.role || "Unknown"})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Section: Management Options */}
                <div className="space-y-6">
                    {/* Member Management (Admins Only) */}
                    {profile.role === "Admin" && (
                        <div className={`${isDarkMode ? "bg-[#423E3E]" : "bg-white"} rounded-lg shadow-xl p-6 border-2 border-black`}>
                            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-[#20AFC5]" : "text-black"}`}>
                                Member Management
                            </h2>

                            {/* Add Members */}
                            <div className="mb-4">
                                <button
                                    onClick={() => setShowAddMembers((prev) => !prev)}
                                    className="bg-[#20AFC5] text-white px-4 py-2 rounded-md hover:bg-[#1a8fa3] transition-all duration-300"
                                >
                                    {showAddMembers ? "Hide Add Members" : "Add Members"}
                                </button>
                                {showAddMembers && (
                                    <div className="mt-4">
                                        <ul className="max-h-40 overflow-y-auto border rounded-md p-2 mb-4">
                                            {Array.isArray(availableMembersToAdd) && availableMembersToAdd.length > 0 ? (
                                                availableMembersToAdd.map((member) => (
                                                    <li
                                                        key={member._id}
                                                        className={`flex justify-between items-center p-2 border-b last:border-b-0 ${
                                                            isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
                                                        } transition-all duration-200`}
                                                    >
                                                        <span>
                                                            {member.name || "Unknown"} ({member.role || "Unknown"})
                                                        </span>
                                                        <button
                                                            onClick={() => toggleAddMember(member._id)}
                                                            className={`px-3 py-1 rounded-md text-white ${
                                                                selectedMembersToAdd.includes(member._id)
                                                                    ? "bg-green-500 hover:bg-green-600"
                                                                    : "bg-gray-500 hover:bg-gray-600"
                                                            } transition-all duration-200`}
                                                            disabled={!member._id}
                                                        >
                                                            {selectedMembersToAdd.includes(member._id) ? "Selected" : "Add"}
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <p>No members available to add</p>
                                            )}
                                        </ul>
                                        {selectedMembersToAdd.length > 0 && (
                                            <button
                                                onClick={addMembersToClass}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
                                            >
                                                Confirm Add ({selectedMembersToAdd.length})
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Remove Members */}
                            <div>
                                <button
                                    onClick={() => setShowRemoveMembers((prev) => !prev)}
                                    className="bg-[#ff4c4c] text-white px-4 py-2 rounded-md hover:bg-[#e04343] transition-all duration-300"
                                >
                                    {showRemoveMembers ? "Hide Remove Members" : "Remove Members"}
                                </button>
                                {showRemoveMembers && (
                                    <div className="mt-4">
                                        <ul className="max-h-40 overflow-y-auto border rounded-md p-2 mb-4">
                                            {mainMembers.map((member) => (
                                                <li
                                                    key={member._id}
                                                    className={`flex justify-between items-center p-2 border-b last:border-b-0 ${
                                                        isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
                                                    } transition-all duration-200`}
                                                >
                                                    <span>
                                                        {member.name || "Unknown"} ({member.role || "Unknown"})
                                                    </span>
                                                    <button
                                                        onClick={() => toggleRemoveMember(member._id)}
                                                        className={`px-3 py-1 rounded-md text-white ${
                                                            selectedMembersToRemove.includes(member._id)
                                                                ? "bg-red-500 hover:bg-red-600"
                                                                : "bg-gray-500 hover:bg-gray-600"
                                                        } transition-all duration-200`}
                                                        disabled={!member._id}
                                                    >
                                                        {selectedMembersToRemove.includes(member._id) ? "Selected" : "Remove"}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        {selectedMembersToRemove.length > 0 && (
                                            <button
                                                onClick={removeMembersFromClass}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                                            >
                                                Confirm Remove ({selectedMembersToRemove.length})
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Subject Groups */}
                    <div className={`${isDarkMode ? "bg-[#423E3E]" : "bg-white"} rounded-lg shadow-xl p-6 border-2 border-black`}>
                        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-[#20AFC5]" : "text-black"}`}>
                            Subject Groups
                        </h2>
                        <button
                            onClick={() => setCreateSubjectGroup((prev) => !prev)}
                            className="bg-[#20AFC5] text-white px-4 py-2 rounded-md hover:bg-[#1a8fa3] transition-all duration-300"
                        >
                            {createSubjectGroup ? "Cancel" : "Create Subject Group"}
                        </button>
                        {createSubjectGroup && (
                            <form onSubmit={createNewSubjectGroup} className="mt-4 space-y-4">
                                <input
                                    type="text"
                                    value={subjectGroupName}
                                    onChange={(e) => setSubjectGroupName(e.target.value)}
                                    className={`border-2 border-gray-400 p-2 rounded-md w-full text-black focus:outline-none focus:ring-2 focus:ring-[#20AFC5] ${isDarkMode ? "text-white" : "text-black"}`}
                                    placeholder="Enter subject group name"
                                    required
                                />
                                <ul className="max-h-40 overflow-y-auto border rounded-md p-2">
                                    {classMembers.map((member) => (
                                        <li
                                            key={member._id}
                                            className={`flex justify-between items-center p-2 border-b last:border-b-0 ${
                                                isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-100"
                                            } transition-all duration-200`}
                                        >
                                            <span>
                                                {member.name || "Unknown"} ({member.role || "Unknown"})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => toggleSubjectGroupMember(member._id)}
                                                className={`px-3 py-1 rounded-md text-white ${
                                                    selectedSubjectGroupMembers.includes(member._id)
                                                    ? member._id === groupAdmin?._id
                                                    ? "bg-green-700 cursor-not-allowed" // Different style for groupAdmin
                                                    : "bg-green-500 hover:bg-green-600"
                                                : "bg-gray-500 hover:bg-gray-600"
                                                } transition-all duration-200`}
                                                disabled={!member._id || member._id === groupAdmin?._id}
                                            >
                                                {selectedSubjectGroupMembers.includes(member._id) ? "Selected" : "Add"}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
                                    disabled={selectedSubjectGroupMembers.length === 0}
                                >
                                    Create Subject Group
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Delete Class Group (Admins Only) */}
                    {profile.role === "Admin" && (
                        <div className={`${isDarkMode ? "bg-[#423E3E]" : "bg-white"} rounded-lg shadow-xl p-6 border-2 border-black`}>
                            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-[#20AFC5]" : "text-black"}`}>
                                Delete Class Group
                            </h2>
                            <button
                                onClick={() => setDeleteConfirm(true)}
                                className="bg-[#ff4c4c] text-white px-4 py-2 rounded-md hover:bg-[#e04343] transition-all duration-300"
                            >
                                Delete Class Group
                            </button>
                            {deleteConfirm && (
                                <div className="mt-4 border-2 border-red-500 p-4 rounded-md">
                                    <p className="mb-4 text-red-500">
                                        Are you sure you want to delete this class group? This action cannot be undone.
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={deleteClassGroup}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                                        >
                                            Yes, Delete
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(false)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Message Display */}
            {/* {message && (
                <div className="mt-6 p-4 w-[50%] bg-cyan-100 text-cyan-700 rounded-md border-2 border-cyan-500">
                    {message}
                </div>
            )} */}
        </div>
    );
}

export default ClassSettings;