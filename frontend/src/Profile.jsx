// import React, { useEffect, useState } from "react";
// import arrow from "./assets/arrow_back.png";
// import user from "./assets/user.png";
// import axios from "axios";
// import "./Profile.css";
// import { Link, useNavigate } from "react-router-dom";
// import DarkMode from "./DarkMode";



// function Profile() {
//     const isDarkMode = DarkMode();
//     const navigate = useNavigate();
//     const [profile, setProfile] = useState(null);
//     const [isProfileVisible, setIsProfileVisible] = useState(
//       localStorage.getItem("showProfile") === "true" 
//   );    const [showInstitutionInput, setShowInstitutionInput] = useState(false);
//     const [institution, setInstitution] = useState("");
//     const [all, setAll] = useState([]);
//     const [chatall, setChatAll] = useState([]);
//     const [selectedMembers, setSelectedMembers] = useState([]);
//     const [showAll, setShowAll] = useState(
//       localStorage.getItem("showChats") === "true" 
//   );
//     const [addition,setAddition] = useState(false);
//     const [createClass,setCreateClass] = useState(false);
//     const [group,setGroup] = useState("");
//     const [faculty,setFaculty] = useState([]);
//     const [students,setStudents] = useState([]);
//     const [toEditName,setToEditName] = useState(false);
//     const [name,setName] = useState("");
//     const [message,setMessage] = useState("");
//     const [showAccount,setShowAccount] = useState(
//         localStorage.getItem("showAccounts") === "true"
//     );
//     const [Todelete,setToDelete] = useState(false);
//     const [editProfile,setEditProfile] = useState(true);
//     const [editConfirm,setEditConfirm] = useState(false);
//     const [profilePicFile, setProfilePicFile] = useState(null); // State for the selected file
//     const [preview, setPreview] = useState(null); // State for image preview
//     const [uploading, setUploading] = useState(false); // State for upload loading

    

//     useEffect(() => {
//         const getProfile = async () => {
//             try {
//                 const res = await axios.get("http://localhost:5000/api/user/profile", {
//                     withCredentials: true,
//                 });
//                 // console.log("Fetched profile data:", res.data);
//                 // console.log("Fetched user data:", res.data.userData);
//                 const userData = res.data.userData || res.data;
//                 setProfile(userData);
//                 if (userData.role === "Admin" && (!userData.institution || userData.institution === "")) {
//                     // console.log(userData.institute);
//                     setShowInstitutionInput(true);
//                 }
//             } catch (error) {
//                 console.error("Error fetching profile:", error);
//                 setMessage("Failed to load profile");
//                 if (error.response?.status === 401 || error.response?.status === 400) {
//                     navigate("/login");
//                 }
//             }
//         };

//         const getAll = async () => {
//             try {
//                 const res = await axios.get("http://localhost:5000/api/user/members", {
//                     withCredentials: true,
//                 });
//                 // console.log("Fetched members data:", res.data);
//                 setAll(res.data.members || []);
//             } catch (error) {
//                 console.error("Error fetching members:", error);
//                 if (error.response?.status === 401 || error.response?.status === 400) {
//                     navigate("/login");
//                 }
//             }
//         };

        

//         getProfile();
//         getAll();
//         if(!showAll && !isProfileVisible && !showAccount){
//             setIsProfileVisible(true);
//         }
       
       
//     }, [profile]);

//     useEffect(() => {
//       localStorage.setItem("showProfile", isProfileVisible);
//   }, [isProfileVisible]);

//   useEffect(() => {
//     localStorage.setItem("showChats", showAll);
// }, [showAll]);

// useEffect(() => {
//     localStorage.setItem("showAccounts", showAccount);
// }, [showAccount]);

 
//     const onSubmit = async(e)=>{
//         console.log(selectedMembers)
//         console.log(students,faculty)
//         const x = profile._id;
//         e.preventDefault()
//         try {
//             const res = await axios.post("http://localhost:5000/api/class/create",{className:group,students:students,faculty:faculty,createdBy:x},{ withCredentials: true });
//             if(res.data.success){
//                 console.log("Success")
//             }
//             else {
//                 console.error("Error creating group:", res.data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching members:", error.message);
//         }
//     }
    

//     const handleInstitutionSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.put(
//                 "http://localhost:5000/api/user/update-institution",
//                 { institute: institution },
//                 { withCredentials: true }
//             );
//             if (response.data.success) {
//                 setProfile((prev) => ({ ...prev, institution: institution }));
//                 setShowInstitutionInput(false);
//                 setMessage("Institution updated successfully!");
//                 setInstitution("");
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error updating institution:", error.response?.data || error);
//             setMessage(error.response?.data?.message || "Failed to update institution");
//         }
//     };

//     // Handle profile picture selection and preview
// const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//         setProfilePicFile(file);
//         setPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
//     }
// };

// // Handle profile picture upload to Cloudinary
// // Handle profile picture upload to Cloudinary
// const handleProfilePicSubmit = async () => {
//     if (!profilePicFile) {
//         setMessage("Please select an image to upload");
//         return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("profilePic", profilePicFile); // 'profilePic' must match the field name in Multer
//     formData.append("userId", profile._id); // Send userId in the form data

//     try {
//         const response = await axios.put(
//             "http://localhost:5000/api/visual/update-profile-pic",
//             formData,
//             {
//                 withCredentials: true,
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             }
//         );

//         console.log("Backend response:", response.data); // Debug log

//         if (response.data.success) {
//             setProfile((prev) => ({ ...prev, profilePic: response.data.user.profilePic }));
//             setMessage("Profile picture updated successfully!");
//             setProfilePicFile(null);
//             setPreview(null); // Clear the preview
//         } else {
//             setMessage(response.data.message);
//         }
//     } catch (error) {
//         console.error("Error uploading profile picture:", error.response?.data || error);
//         setMessage(error.response?.data?.message || "Failed to upload profile picture");
//     } finally {
//         setUploading(false);
//     }
// };

    
//     if (!profile) {
//         return <div>Loading profile...</div>;
//     }

//     // console.log("Profile ID:", profile?._id);
//     // console.log("Selected Receiver ID:", selectedReceiver?._id);
//     // console.log("All chatMessages before filtering:", chatMessages);

//     const doProfile = ()=>{
//       setIsProfileVisible(prev=>!prev);
//       setShowAll(false);
//       setShowAccount(false);
//       setAddition(false);
//       const x = document.getElementById("edit");
//       if(x) {
//         x.style.display = "block";
//       }
//       const y = document.getElementById("newGroup");
//       if(y){
//         y.style.display = "none";
//       }
//       const z = document.getElementById("Delete");
//       if(z){
//         z.style.display = "none";
//       }
//       setSelectedMembers([])
      


//     }

//     const doAll = ()=>{
//       setShowAll(prev=>!prev);
//       setIsProfileVisible(false)
//       setAddition(false);
//       setShowAccount(false);
//       const x = document.getElementById("edit");
//        if(x) {
//         x.style.display = "none";
//       }
//       const y = document.getElementById("newGroup");
//       if(y){
//         y.style.display = "block";
//       }
//       const z = document.getElementById("Delete");
//       if(z){
//         z.style.display = "none";
//       }
//       setSelectedMembers([])
      
//     }

//     const doAccount = ()=>{
//         setShowAccount(prev=>!prev);
//         setShowAll(false);
//         setAddition(false);
//         setIsProfileVisible(false);
//         setToEditName(false);
//         const x = document.getElementById("edit");
//         if(x) {
//             x.style.display = "none";
//           }
//           const y = document.getElementById("newGroup");
//           if(y){
//             y.style.display = "none";
//           }
//           const z = document.getElementById("Delete");
//           if(z){
//             z.style.display = "block";
//           }
        
//     }

//     const newGroup = ()=>{
//       // setShowAll(true);
//       setChatAll(all.filter(k=>k.role!=="Admin"))
//       console.log(all)
//       setIsProfileVisible(false);
//       setShowAll(false);
//       setAddition(true);
//       const x = document.getElementById("edit");
//         if(x) {
//             x.style.display = "none";
//           }
//           const y = document.getElementById("newGroup");
//           if(y){
//             y.style.display = "none";
//           }
//           const z = document.getElementById("Delete");
//           if(z){
//             z.style.display = "none";
//           }
//   }

//   const toggleSelection = (memberId,role) => {   
    
//     setSelectedMembers((prevSelected) =>
//       prevSelected.includes(memberId)
//         ? prevSelected.filter((id) => id !== memberId) 
//         : [...prevSelected, memberId] 
//     );
//     if(role!=="Student"){
//     setFaculty((prevFaculty)=>
//         prevFaculty.includes(memberId)
//         ? prevSelected.filter((id) => id !== memberId)
//         : [...prevFaculty,memberId]
//     )}else{
//         setStudents((prevStudents) =>
//             prevStudents.includes(memberId)
//                 ? prevStudents.filter((id) => id !== memberId)
//                 : [...prevStudents, memberId]
//         );
//     }
//   }

//   const editName = ()=>{
//     setShowAll(false)
//     setAddition(false);
//     setIsProfileVisible(true)
//     setToEditName(true);
//     document.getElementById("newGroup").style.display = "none";
//     document.getElementById("edit").style.display = "none";


//   }

//   const deleteAccount = async()=>{
//     try {
//         const response = await axios.delete(
//             "http://localhost:5000/api/user/delete",
//             { withCredentials: true }
//         );
       
//         console.log(response)
//         localStorage.clear();
//         navigate("/signup");
//         setProfile(null);
//         setMessage("Account deleted successfully!");
//         console.log("Account deleted successfully!");
//         setToEditName(false);
//         setName("");
//         setToDelete(false);
     
//     } catch (error) {
//         console.error("Error updating name:", error.response?.data || error);
//         setMessage(error.response?.data?.message || "Failed to update name");
//     }
//   }
  

//   const handleEditName = async (e) => {
//     e.preventDefault();
//     try {
//         const response = await axios.put(
//             "http://localhost:5000/api/user/update-name",
//             { name: name },
//             { withCredentials: true }
//         );
//         if (response.data.success) {
//             setProfile((prev) => ({ ...prev, name: name }));
            
//             setMessage("Name updated successfully!");
//             setToEditName(false);
//             setName("");
//         } else {
//             setMessage(response.data.message);
//         }
//     } catch (error) {
//         console.error("Error updating name:", error.response?.data || error);
//         setMessage(error.response?.data?.message || "Failed to update name");
//     }
// };

//     const changeProfile = ()=>{
//         setEditProfile(false);
//         setEditConfirm(true);
//         handleProfilePicChange();
//     }

//     const confirmChangeProfile = ()=>{
//         setEditConfirm(false);
//         setEditProfile(true);
//         handleProfilePicSubmit();
//     }

//     const cancelChangeProfile = () => {
//         setEditConfirm(false);
//         setEditProfile(true);
//         setProfilePicFile(null);
//         setPreview(null);
//     };



//     return (
//         <div className="">
//             <button
//                 className="rounded-full w-[40px] h-[40px] ml-5 my-5 bg-[#20AFC5] flex justify-center items-center"
//                 onClick={() => navigate(-1)}
//             >
//                 <img src={arrow} className="w-7 h-7" alt="Back" />
//             </button>
//             <div className="grid grid-cols-2 gap-3 ml-10">
//                 <div className="flex flex-col gap-10 ml-[150px] my-18 justify-center place-content-center">
//                     <div className="border-2 rounded-full w-[247px] h-[247px] flex items-center justify-center bg-white overflow-hidden">
//                         <img src={preview || (profile.profilePic ? profile.profilePic : user)} alt="User" className="w-full h-full rounded-full object-cover"/>
//                     </div>
//                     <div className="flex justify-center w-[257px] -my-8 mb-5">
//                         {editProfile && (
//                                 <button className="border-2 bg-red-500 p-2 text-white font-semibold rounded-md" onClick={changeProfile}>
//                                     Edit
//                                 </button>
//                             )}
//                             {editConfirm && (
//                                 <div className="flex gap-2">
//                                     <button
//                                         className="border-2 bg-green-500 p-2 text-white font-semibold rounded-md"
//                                         onClick={confirmChangeProfile}
//                                         disabled={uploading}
//                                     >
//                                         {uploading ? "Uploading..." : "Confirm"}
//                                     </button>
//                                     <button
//                                         className="border-2 bg-gray-500 p-2 text-white font-semibold rounded-md"
//                                         onClick={cancelChangeProfile}
//                                         disabled={uploading}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             )} 
//                     </div>
//                     {editConfirm && (
//                         <div className="flex flex-col items-center w-[50%] gap-5 cursor-pointer">
//                             <input
//                                 type="file"
//                                 accept="image/jpeg,image/jpg,image/png"
//                                 onChange={handleProfilePicChange}
//                                 className="mb-2 cursor-pointer"
//                             />
//                         </div>
//                     )}
//                     <div className="flex justify-center w-[257px]">
//                         <h1 className="font-semibold text-2xl">{profile.name || "Name"}</h1>
//                     </div>
//                     <div className="box bg-amber-500 w-[300px] my-10 -ml-5">
//                         <div className="flex flex-col gap-2">
//                             <a
//                                 className="font-semibold"
//                                 onClick={doProfile}
//                             >
//                                 <img src={user} className="w-5 inline ml-5 mr-7" alt="Profile" />
//                                 Profile
//                             </a>
//                             <a
//                                 className="font-semibold"
//                                 onClick={doAll}
//                             >
//                                 <img src={user} className="w-5 inline ml-5 mr-7" alt="Chats" />
//                                 Chats
//                             </a>
//                             <a className="font-semibold"
//                                 onClick={doAccount}
//                             >
//                                 <img src={user} className="w-5 inline ml-5 mr-7" alt="Account" />
//                                 Account
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="box w-[780px]  -mx-48">
//                     <div className="flex flex-col">
//                         <h2 className="ml-5 font-bold text-xl">Profile</h2>
//                         {isProfileVisible && <pre>{JSON.stringify(profile, null, 2)}</pre>}
//                         {profile.role === "Admin" && (!profile.institution || profile.institution === "") && showInstitutionInput ? (
//                             <form onSubmit={handleInstitutionSubmit}>
//                                 <input
//                                     placeholder="Enter your Institution"
//                                     value={institution}
//                                     onChange={(e) => setInstitution(e.target.value)}
//                                 />
//                                 <button className="bg-green-400 p-2 mt-2 rounded-md">Submit</button>
//                             </form>
//                         ) : ""}
//                         {showAll && (
//                             <ul className="ml-5 mt-2 max-h-40 overflow-y-auto border rounded">
//                                 {all.map((member, index) => (
//                                     <li
//                                         key={index}
//                                         className="cursor-pointer hover:bg-gray-200 p-1"
                                       
//                                     >
//                                         {profile.name === member.name ? "You" : member.name} ({member.role})
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
                       
//                     </div>
//                    <div>{profile.role === "Admin" ? ( 
//                     <div className="h-[98%] max-h-full">
//                        {isProfileVisible &&
//                         <button className="flex justify-center p-2 my-3 rounded-[3px] text-white border-3 border-black font-semibold bg-[#9655b1]" onClick={editName}
//                         id={"edit"}>
//                         Edit Name
//                         </button>
//                        }  

//                     {toEditName &&
//                         <form className="my-5" onSubmit={handleEditName}>
//                             <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required/>
//                             <button className="p-2 border-2 mt-3 rounded-md bg-cyan-500 text-white font-semibold">Submit</button>
//                         </form>
//                     }


//                    {showAll &&
//                          <button className="flex justify-center p-2 my-3 rounded-[3px] text-white border-3 border-black font-semibold bg-[#20AFC5]"
//                          onClick={newGroup}  id={"newGroup"} >
//                            Create New Group
//                            </button>
//                    }
//                       {addition &&(
//                             <ul className="ml-5 mt-2  max-h-[80%] overflow-y-auto border rounded">
//                                 {chatall.map((member, index) => (
                                  
//                                   <div key={member._id} className="flex justify-between border-b-2 ">
//                                      <li
//                                         key={index}
//                                         className="cursor-pointer  p-3"
                                       
//                                     >
//                                         {member.name} ({member.role})
//                                     </li>
                                    
//                                     <button key={member._id} className={selectedMembers.includes(member._id) ? "mr-3 border-2 p-1 m-2 bg-green-500" : "mr-3 border-2 p-1 m-2 "} onClick={()=>toggleSelection(member._id,member.role)}>{selectedMembers.includes(member._id) ? "Selected" : "Add"}</button>
//                                   </div>
                                   
                                    
//                                 ))}
//                             </ul>
//                         )} 
//                         </div>
                        
//                        ) : null } </div>

//                        {selectedMembers.length>0 ? (
//                             <div>
//                                 <p className="mt-7 mr-5">{selectedMembers.length>0 ? `Total Selected: ${selectedMembers.length}` : ""}</p>

//                                 <form className="flex justify-between" onSubmit={onSubmit}>
//                                 <input placeholder="Enter Class group name" value={group} className="mt-5" required onChange={(e)=>setGroup(e.target.value)}/>
//                                     <button className="ml-5 mt-5 border-2 border-black bg-cyan-500 p-2 rounded-[3px] text-white font-semibold" onClick={()=>setCreateClass(true)}>Create</button>
//                                 </form>
//                             </div> 
//                        ) : null}

//                        {showAccount &&
//                             <div>
//                                 <button className="flex justify-center p-2 my-3 rounded-[3px] text-white border-3 border-black font-semibold bg-[#ff4c4c]"
//                                id={"delete"} onClick={()=>setToDelete(true)}>
//                               Delete Account
//                                </button>
//                             </div> 
//                        }

//                        {
//                         Todelete && 
//                         <form className="border-2 w-[30%] flex flex-col items-center rounded-md">
//                             <p>Do you want to delete</p>
//                             <div className="flex gap-5 ">
//                                 <button className="ml-5 bg-red-500 p-2 mb-5 mt-5 w-20" onClick={deleteAccount}>Yes</button>
//                                 <button className="ml-5 p-2 mb-5 mt-5 w-20 bg-cyan-500 mr-5" onClick={()=>setToDelete(false)}>No</button>
//                             </div>
//                         </form>
//                        }
                       
                       
                   
                      
//                 </div>
//             </div>
//             <div className="-my-[15px]">
//                 <Link to="/">
//                     <button className="bg-[#20AFC5] rounded-[3px] p-2 ml-5 pl-5 pr-5 border-3 border-[#000000] font-semibold text-white">
//                         Log Out
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// }

// export default Profile;


// import React, { useEffect, useState } from "react";
// import arrow from "./assets/arrow_back.png";
// import user from "./assets/user.png";
// import axios from "axios";
// import "./Profile.css";
// import { Link, useNavigate } from "react-router-dom";
// import DarkMode from "./DarkMode";
// import { toast } from "react-toastify";
// import { MdVerified } from "react-icons/md";


// function Profile() {
//     const isDarkMode = DarkMode();
//     const navigate = useNavigate();
//     const [profile, setProfile] = useState(null);
//     const [isProfileVisible, setIsProfileVisible] = useState(
//         localStorage.getItem("showProfile") === "true"
//     );
//     const [showInstitutionInput, setShowInstitutionInput] = useState(false);
//     const [institution, setInstitution] = useState("");
//     const [all, setAll] = useState([]);
//     const [chatall, setChatAll] = useState([]);
//     const [selectedMembers, setSelectedMembers] = useState([]);
//     const [showAll, setShowAll] = useState(
//         localStorage.getItem("showChats") === "true"
//     );
//     const [addition, setAddition] = useState(false);
//     const [createClass, setCreateClass] = useState(false);
//     const [group, setGroup] = useState("");
//     const [faculty, setFaculty] = useState([]);
//     const [students, setStudents] = useState([]);
//     const [toEditName, setToEditName] = useState(false);
//     const [name, setName] = useState("");
//     const [message, setMessage] = useState("");
//     const [showAccount, setShowAccount] = useState(
//         localStorage.getItem("showAccounts") === "true"
//     );
//     const [Todelete, setToDelete] = useState(false);
//     const [editProfile, setEditProfile] = useState(true);
//     const [editConfirm, setEditConfirm] = useState(false);
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const [uploading, setUploading] = useState(false);

//     useEffect(() => {
//         const getProfile = async () => {
//             try {
//                 const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
//                     withCredentials: true,
//                 });
//                 const userData = res.data.userData || res.data;
//                 setProfile(userData);
//                 if (userData.role === "Admin" && (!userData.institution || userData.institution === "")) {
//                     setShowInstitutionInput(true);
//                 }
//             } catch (error) {
//                 console.error("Error fetching profile:", error);
//                 setMessage("Failed to load profile");
//                 if (error.response?.status === 401 || error.response?.status === 400) {
//                     navigate("/login");
//                 }
//             }
//         };

//         const getAll = async () => {
//             try {
//                 const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/members`, {
//                     withCredentials: true,
//                 });
//                 setAll(res.data.members || []);
//             } catch (error) {
//                 console.error("Error fetching members:", error);
//                 if (error.response?.status === 401 || error.response?.status === 400) {
//                     navigate("/login");
//                 }
//             }
//         };

//         getProfile();
//         getAll();
//         if (!showAll && !showAccount) {
//             setIsProfileVisible(true);
//         }
//     }, [navigate]); 

//     useEffect(() => {
//         localStorage.setItem("showProfile", isProfileVisible);
//     }, [isProfileVisible]);

//     useEffect(() => {
//         localStorage.setItem("showChats", showAll);
//     }, [showAll]);

//     useEffect(() => {
//         localStorage.setItem("showAccounts", showAccount);
//     }, [showAccount]);

//     const onSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/class/create`,
//                 { className: group, students: students, faculty: faculty, createdBy: profile._id },
//                 { withCredentials: true }
//             );
//             if (res.data.success) {
//                 console.log("Success");
//                 setAddition(false);

//                 toast.success("Class created")
//                 let it = document.getElementById("checker");
//                 if(it){
//                     it.style.display = "none";
//                 }
//                 isProfileVisible(true);
//             } else {
//                 console.error("Error creating group:", res.data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching members:", error.message);
//         }
//     };

//     const handleInstitutionSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.put(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/user/update-institution`,
//                 { institute: institution },
//                 { withCredentials: true }
//             );
//             if (response.data.success) {
//                 setProfile((prev) => ({ ...prev, institution: institution }));
//                 setShowInstitutionInput(false);
//                 setMessage("Institution updated successfully!");
//                 setInstitution("");
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error updating institution:", error.response?.data || error);
//             setMessage(error.response?.data?.message || "Failed to update institution");
//         }
//     };

//     const handleProfilePicChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

//             if (!allowedTypes.includes(file.type)) {
//                 toast.error("Invalid file type! Please upload a JPG or PNG image.");
//                 return;
//             }
//             setProfilePicFile(file);
//             setPreview(URL.createObjectURL(file));
//         }
//     };

//     const handleProfilePicSubmit = async () => {
//         if (!profilePicFile) {
//             setMessage("Please select an image to upload");
//             return;
//         }

//         setUploading(true);
//         const formData = new FormData();
//         formData.append("profilePic", profilePicFile);
//         formData.append("userId", profile._id);
//         console.log(profile)

//         try {
//             const response = await axios.put(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/visual/update-profile-pic`,
//                 formData,
//                 {
//                     withCredentials: true,
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );

//             if (response.data.success) {
//                 setProfile((prev) => ({ ...prev, profilePic: response.data.user.profilePic }));
//                 setMessage("Profile picture updated successfully!");
//                 setProfilePicFile(null);
//                 setPreview(null);
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error uploading profile picture:", error.response?.data || error);
//             setMessage(error.response?.data?.message || "Failed to upload profile picture");
//         } finally {
//             setUploading(false);
//         }
//     };

//     if (!profile) {
//         return <div>Loading profile...</div>;
//     }

//     const doProfile = () => {
//         setIsProfileVisible((prev) => !prev);
//         setShowAll(false);
//         setShowAccount(false);
//         setAddition(false);
//         setToDelete(false);
//         const x = document.getElementById("edit");
//         if (x) {
//             x.style.display = "block";
//         }
//         const y = document.getElementById("newGroup");
//         if (y) {
//             y.style.display = "none";
//         }
//         const z = document.getElementById("delete");
//         if (z) {
//             z.style.display = "none";
//         }
//         setSelectedMembers([]);
//     };

//     const doAll = () => {
//         setShowAll((prev) => !prev);
//         setIsProfileVisible(false);
//         setAddition(false);
//         setShowAccount(false);
//         setToEditName(false);
//         setToDelete(false);
//         const x = document.getElementById("edit");
//         if (x) {
//             x.style.display = "none";
//         }
//         const y = document.getElementById("newGroup");
//         if (y) {
//             y.style.display = "block";
//         }
//         const z = document.getElementById("delete");
//         if (z) {
//             z.style.display = "none";
//         }
//         setSelectedMembers([]);
//     };

//     const doAccount = () => {
//         setShowAccount((prev) => !prev);
//         setShowAll(false);
//         setAddition(false);
//         setIsProfileVisible(false);
//         setToEditName(false);
//         const x = document.getElementById("edit");
//         if (x) {
//             x.style.display = "none";
//         }
//         const y = document.getElementById("newGroup");
//         if (y) {
//             y.style.display = "none";
//         }
//         const z = document.getElementById("delete");
//         if (z) {
//             z.style.display = "block";
//         }
//     };

//     const newGroup = () => {
//         setChatAll(all.filter((k) => k.role !== "Admin"));
//         setIsProfileVisible(false);
//         setShowAll(false);
//         setAddition(true);
//         setToDelete(false);
//         const x = document.getElementById("edit");
//         if (x) {
//             x.style.display = "none";
//         }
//         const y = document.getElementById("newGroup");
//         if (y) {
//             y.style.display = "none";
//         }
//         const z = document.getElementById("delete");
//         if (z) {
//             z.style.display = "none";
//         }
//     };

//     const toggleSelection = (memberId, role) => {
//         setSelectedMembers((prevSelected) =>
//             prevSelected.includes(memberId)
//                 ? prevSelected.filter((id) => id !== memberId)
//                 : [...prevSelected, memberId]
//         );
//         if (role !== "Student") {
//             setFaculty((prevFaculty) =>
//                 prevFaculty.includes(memberId)
//                     ? prevFaculty.filter((id) => id !== memberId)
//                     : [...prevFaculty, memberId]
//             );
//         } else {
//             setStudents((prevStudents) =>
//                 prevStudents.includes(memberId)
//                     ? prevStudents.filter((id) => id !== memberId)
//                     : [...prevStudents, memberId]
//             );
//         }
//     };

//     const editName = () => {
//         setShowAll(false);
//         setAddition(false);
//         setIsProfileVisible(true);
//         setToEditName(true);
//         document.getElementById("newGroup").style.display = "none";
//         document.getElementById("edit").style.display = "none";
//     };

//     const deleteAccount = async () => {
//         try {
//             const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete`, {
//                 withCredentials: true,
//             });
//             localStorage.clear();
//             navigate("/signup");
//             setProfile(null);
//             setMessage("Account deleted successfully!");
//             setToEditName(false);
//             setName("");
//             setToDelete(false);
//         } catch (error) {
//             console.error("Error deleting account:", error.response?.data || error);
//             setMessage(error.response?.data?.message || "Failed to delete account");
//         }
//     };

//     const handleEditName = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.put(
//                 `${import.meta.env.VITE_BACKEND_URL}api/user/update-name`,
//                 { name: name },
//                 { withCredentials: true }
//             );
//             if (response.data.success) {
//                 setProfile((prev) => ({ ...prev, name: name }));
//                 setMessage("Name updated successfully!");
//                 setToEditName(false);
//                 setName("");
//             } else {
//                 setMessage(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error updating name:", error.response?.data || error);
//             setMessage(error.response?.data?.message || "Failed to update name");
//         }
//     };

//     const changeProfile = () => {
//         setEditProfile(false);
//         setEditConfirm(true);
//     };

//     const confirmChangeProfile = () => {
//         setEditConfirm(false);
//         setEditProfile(true);
//         handleProfilePicSubmit();
//     };

//     const cancelChangeProfile = () => {
//         setEditConfirm(false);
//         setEditProfile(true);
//         setProfilePicFile(null);
//         setPreview(null);
//     };

//     return (
//         <div className="min-h-screen p-4 lg:p-6 overflow-hidden">
//             <button
//                 className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-[#20AFC5] flex justify-center items-center mb-4 lg:mb-6"
//                 onClick={() => navigate(-1)}
//             >
//                 <img src={arrow} className="w-6 h-6 lg:w-7 lg:h-7" alt="Back" />
//             </button>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">
//                 <div className="flex flex-col items-center lg:items-center gap-8 lg:gap-10">
//                     <div className="border-2 rounded-full w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] xl:w-[247px] xl:h-[247px] flex items-center justify-center bg-white overflow-hidden">
//                         <img
//                             src={preview || (profile.profilePic ? profile.profilePic : user)}
//                             alt="User"
//                             className="w-full h-full rounded-full object-cover"
//                         />
//                     </div>
//                     <div className="flex justify-center w-full lg:w-[257px] -mt-6 lg:-mt-8 mb-4 lg:mb-5">
//                         {editProfile && (
//                             <button
//                                 className="border-2 bg-red-500 p-2 text-white font-semibold rounded-md text-sm sm:text-base"
//                                 onClick={changeProfile}
//                             >
//                                 Edit
//                             </button>
//                         )}
//                         {editConfirm && (
//                             <div className="flex gap-2">
//                                 <button
//                                     className="border-2 bg-green-500 p-2 text-white font-semibold rounded-md text-sm sm:text-base"
//                                     onClick={confirmChangeProfile}
//                                     disabled={uploading}
//                                 >
//                                     {uploading ? "Uploading..." : "Confirm"}
//                                 </button>
//                                 <button
//                                     className="border-2 bg-gray-500 p-2 text-white font-semibold rounded-md text-sm sm:text-base"
//                                     onClick={cancelChangeProfile}
//                                     disabled={uploading}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                     {editConfirm && (
//                         <div className="flex flex-col items-center w-full sm:w-[50%] gap-4 sm:gap-5 cursor-pointer">
//                             <input
//                                 type="file"
//                                 accept="image/jpeg,image/jpg,image/png"
//                                 onChange={handleProfilePicChange}
//                                 className="mb-2 cursor-pointer text-sm sm:text-base"
//                             />
//                         </div>
//                     )}
//                     <div className="flex justify-center w-full lg:w-[257px]">
//                         <h1 className="font-semibold text-xl sm:text-2xl">{profile.name || "Name"}</h1>
//                     </div>
//                     <div className="box bg-amber-500 w-full lg:w-[300px] my-6 lg:my-8">
//                         <div className="flex flex-col gap-2 p-4">
//                             <a className="font-semibold text-sm sm:text-base" onClick={doProfile}>
//                                 <img src={user} className="w-4 sm:w-5 inline mr-4 sm:mr-7" alt="Profile" />
//                                 Profile
//                             </a>
//                             <a className="font-semibold text-sm sm:text-base" onClick={doAll}>
//                                 <img src={user} className="w-4 sm:w-5 inline mr-4 sm:mr-7" alt="Chats" />
//                                 Chats
//                             </a>
//                             <a className="font-semibold text-sm sm:text-base" onClick={doAccount}>
//                                 <img src={user} className="w-4 sm:w-5 inline mr-4 sm:mr-7" alt="Account" />
//                                 Account
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="box w-full shadow-md ">
//                 <div className="flex flex-col   ">
//       {isProfileVisible && (
//         <div className="w-full max-w-2xl p-6 sm:p-8 rounded-lg shadow-md">
//           {/* Modified: Added max-w-2xl to constrain the width on larger screens, added padding, background, rounded corners, and shadow for a card-like appearance */}
//           <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl underline mb-6 hover:text-cyan-500">
//             Profile
//           </h2>
//           <div className="space-y-4">
//             <div className="flex items-center">
//               <span className="font-bold text-lg sm:text-xl w-32 hover:text-cyan-500">
//                 Name:
//               </span>
//               {/* Modified: Adjusted font size, added w-32 to align labels consistently */}
//               <p className="text-cyan-500 text-lg sm:text-xl flex-1 font-semibold">
//                 {profile.name}
//               </p>
//               {/* Modified: Adjusted font size, used flex-1 to take remaining space */}
//             </div>
//             <div className="flex items-center">
//               <span className="font-bold text-lg sm:text-xl w-32 hover:text-cyan-500">
//                 Email:
//               </span>
//               <p className="text-cyan-500 text-lg sm:text-xl flex-1 font-semibold">
//                 {profile.email}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <span className="font-bold text-lg sm:text-xl w-32 hover:text-cyan-500">
//                 Institution:
//               </span>
//               <p className="text-cyan-500 text-lg sm:text-xl flex-1 font-semibold">
//                 {profile.institution}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <span className="font-bold text-lg sm:text-xl w-32 hover:text-cyan-500">
//                 Role:
//               </span>
//               <p className="text-cyan-500 text-lg sm:text-xl flex-1 font-semibold">
//                 {profile.role}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <span className="font-bold text-lg sm:text-xl w-32 hover:text-cyan-500">
//                 Email Verified:
//               </span>
//               <p className="text-cyan-500 text-lg sm:text-xl flex items-center font-semibold">
//                 {profile.isVerified ? (
//                   <MdVerified className="ml-2 text-cyan-500" />
//                 ) : (
//                   "Not Verified"
//                 )}
//               </p>
//               {/* Modified: Added conditional styling for the verification icon based on isVerified */}
//             </div>
//           </div>
//         </div>
//       )}

//                         {profile.role === "Admin" &&
//                         (!profile.institution || profile.institution === "") &&
//                         showInstitutionInput ? (
//                             <form onSubmit={handleInstitutionSubmit} className="flex flex-col gap-2">
//                                 <input
//                                     placeholder="Enter your Institution"
//                                     value={institution}
//                                     onChange={(e) => setInstitution(e.target.value)}
//                                     className="border p-2 rounded text-sm sm:text-base"
//                                 />
//                                 <button className="bg-green-400 p-2 rounded-md text-sm sm:text-base">Submit</button>
//                             </form>
//                         ) : null}
//                         {showAll && (
//                             <div>
//                                 <h2 className="font-bold text-lg lg:text-3xl underline mb-4">Chat</h2>

//                                 <ul className="mt-2  overflow-y-auto border rounded text-sm sm:text-base">
//                                     {all.map((member, index) => (
//                                         <li key={index} className="cursor-pointer hover:bg-gray-200 p-2">
//                                             {profile.name === member.name ? "You" : member.name} ({member.role})
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                     </div>
//                     <div>
//                         {profile.role === "Admin" ? (
//                             <div className="h-[98%] max-h-full">
//                                 {isProfileVisible && (
//                                     <button
//                                         className="flex justify-center p-2 my-3 rounded text-white border-2 border-black font-semibold bg-[#9655b1] text-sm sm:text-base w-full sm:w-auto"
//                                         onClick={editName}
//                                         id="edit"
//                                     >
//                                         Edit Name
//                                     </button>
//                                 )}
//                                 {toEditName && (
//                                     <form className="my-4 flex flex-col gap-2" onSubmit={handleEditName}>
//                                         <input
//                                             placeholder="Name"
//                                             value={name}
//                                             onChange={(e) => setName(e.target.value)}
//                                             required
//                                             className="border p-2 rounded text-sm sm:text-base"
//                                         />
//                                         <button className="p-2 border-2 rounded-md bg-cyan-500 text-white font-semibold text-sm sm:text-base">
//                                             Submit
//                                         </button>
//                                     </form>
//                                 )}
//                                 {showAll && (
//                                     <button
//                                         className="flex justify-center p-2 my-3 rounded text-white border-2 border-black font-semibold bg-[#20AFC5] text-sm sm:text-base w-full sm:w-auto"
//                                         onClick={newGroup}
//                                         id="newGroup"
//                                     >
//                                         Create New Group
//                                     </button>
//                                 )}
//                                 {addition && (
//                                     <ul className="mt-2 max-h-[80%] overflow-y-auto border rounded text-sm sm:text-base">
//                                         {chatall.map((member, index) => (
//                                             <div key={member._id} className="flex justify-between border-b-2 p-2">
//                                                 <li className="cursor-pointer p-1">
//                                                     {member.name} ({member.role})
//                                                 </li>
//                                                 <button
//                                                     className={`border-2 p-1 ${
//                                                         selectedMembers.includes(member._id)
//                                                             ? "bg-green-500 text-white"
//                                                             : "bg-gray-200"
//                                                     } text-sm sm:text-base`}
//                                                     onClick={() => toggleSelection(member._id, member.role)}
//                                                 >
//                                                     {selectedMembers.includes(member._id) ? "Selected" : "Add"}
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         ) : null}
//                     </div>
//                     {selectedMembers.length > 0 ? (
//                         <div className="mt-4" id="checker">
//                             <p className="mb-2 text-sm sm:text-base">
//                                 {selectedMembers.length > 0 ? `Total Selected: ${selectedMembers.length}` : ""}
//                             </p>
//                             <form className="flex flex-col sm:flex-row gap-2" onSubmit={onSubmit}>
//                                 <input
//                                     placeholder="Enter Class group name"
//                                     value={group}
//                                     className="border p-2 rounded text-sm sm:text-base"
//                                     required
//                                     onChange={(e) => setGroup(e.target.value)}
//                                 />
//                                 <button
//                                     className="border-2 border-black bg-cyan-500 p-2 rounded text-white font-semibold text-sm sm:text-base"
//                                     onClick={() => setCreateClass(true)}
//                                 >
//                                     Create
//                                 </button>
//                             </form>
//                         </div>
//                     ) : null}
//                     {showAccount && (
//                         <div className="mt-4">
//                             <h2 className="font-bold text-lg lg:text-3xl underline mb-4">Account</h2>

//                             <button
//                                 className="flex justify-center p-2 my-3 rounded text-white border-2 border-black font-semibold bg-[#ff4c4c] text-sm sm:text-base w-full sm:w-auto"
//                                 id="delete"
//                                 onClick={() => setToDelete(true)}
//                             >
//                                 Delete Account
//                             </button>
//                         </div>
//                     )}
//                     {Todelete && (
//                         <form className="border-2 w-full sm:w-[30%] flex flex-col items-center rounded-md mt-4 p-4">
//                             <p className="mb-4 text-sm sm:text-base">Do you want to delete</p>
//                             <div className="flex gap-2 sm:gap-5">
//                                 <button
//                                     className="bg-red-500 p-2 w-20 text-sm sm:text-base"
//                                     onClick={deleteAccount}
//                                 >
//                                     Yes
//                                 </button>
//                                 <button
//                                     className="bg-cyan-500 p-2 w-20 text-sm sm:text-base"
//                                     onClick={() => setToDelete(false)}
//                                 >
//                                     No
//                                 </button>
//                             </div>
//                         </form>
//                     )}
//                 </div>
//             </div>
//             <div className="mt-4">
//                 <Link to="/">
//                     <button className="bg-[#20AFC5] rounded p-2 border-2 border-[#000000] font-semibold text-white text-sm sm:text-base">
//                         Log Out
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// }

// export default Profile;





import React, { useEffect, useState } from "react";
import arrow from "./assets/arrow_back.png";
import user from "./assets/user.png";
import axios from "axios";
import "./Profile.css";
import { Link, useNavigate } from "react-router-dom";
import DarkMode from "./DarkMode";
import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";

function Profile() {
    const isDarkMode = DarkMode();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isProfileVisible, setIsProfileVisible] = useState(
        localStorage.getItem("showProfile") === "true"
    );
    const [showInstitutionInput, setShowInstitutionInput] = useState(false);
    const [institution, setInstitution] = useState("");
    const [all, setAll] = useState([]);
    const [chatall, setChatAll] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showAll, setShowAll] = useState(
        localStorage.getItem("showChats") === "true"
    );
    const [addition, setAddition] = useState(false);
    const [createClass, setCreateClass] = useState(false);
    const [group, setGroup] = useState("");
    const [faculty, setFaculty] = useState([]);
    const [students, setStudents] = useState([]);
    const [toEditName, setToEditName] = useState(false);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [showAccount, setShowAccount] = useState(
        localStorage.getItem("showAccounts") === "true"
    );
    const [Todelete, setToDelete] = useState(false);
    const [editProfile, setEditProfile] = useState(true);
    const [editConfirm, setEditConfirm] = useState(false);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
                    withCredentials: true,
                });
                const userData = res.data.userData || res.data;
                setProfile(userData);
                if (userData.role === "Admin" && (!userData.institution || userData.institution === "")) {
                    setShowInstitutionInput(true);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setMessage("Failed to load profile");
                if (error.response?.status === 401 || error.response?.status === 400) {
                    navigate("/login");
                }
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
                if (error.response?.status === 401 || error.response?.status === 400) {
                    navigate("/login");
                }
            }
        };

        getProfile();
        getAll();
        if (!showAll && !showAccount) {
            setIsProfileVisible(true);
        }
    }, [navigate]); 

    useEffect(() => {
        localStorage.setItem("showProfile", isProfileVisible);
    }, [isProfileVisible]);

    useEffect(() => {
        localStorage.setItem("showChats", showAll);
    }, [showAll]);

    useEffect(() => {
        localStorage.setItem("showAccounts", showAccount);
    }, [showAccount]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/class/create`,
                { className: group, students: students, faculty: faculty, createdBy: profile._id },
                { withCredentials: true }
            );
            if (res.data.success) {
                console.log("Success");
                setAddition(false);

                toast.success("Class created")
                let it = document.getElementById("checker");
                if(it){
                    it.style.display = "none";
                }
                isProfileVisible(true);
            } else {
                console.error("Error creating group:", res.data.message);
            }
        } catch (error) {
            console.error("Error fetching members:", error.message);
        }
    };

    const handleInstitutionSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/update-institution`,
                { institute: institution },
                { withCredentials: true }
            );
            if (response.data.success) {
                setProfile((prev) => ({ ...prev, institution: institution }));
                setShowInstitutionInput(false);
                setMessage("Institution updated successfully!");
                setInstitution("");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error updating institution:", error.response?.data || error);
            setMessage(error.response?.data?.message || "Failed to update institution");
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

            if (!allowedTypes.includes(file.type)) {
                toast.error("Invalid file type! Please upload a JPG or PNG image.");
                return;
            }
            setProfilePicFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleProfilePicSubmit = async () => {
        if (!profilePicFile) {
            setMessage("Please select an image to upload");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("profilePic", profilePicFile);
        formData.append("userId", profile._id);

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/visual/update-profile-pic`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                setProfile((prev) => ({ ...prev, profilePic: response.data.user.profilePic }));
                setMessage("Profile picture updated successfully!");
                setProfilePicFile(null);
                setPreview(null);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error.response?.data || error);
            setMessage(error.response?.data?.message || "Failed to upload profile picture");
        } finally {
            setUploading(false);
        }
    };

    if (!profile) {
        return <div>Loading profile...</div>;
    }

    const doProfile = () => {
        setIsProfileVisible(true);
        setShowAll(false);
        setShowAccount(false);
        setAddition(false);
        setToDelete(false);
        const x = document.getElementById("edit");
        if (x) {
            x.style.display = "block";
        }
        const y = document.getElementById("newGroup");
        if (y) {
            y.style.display = "none";
        }
        const z = document.getElementById("delete");
        if (z) {
            z.style.display = "none";
        }
        setSelectedMembers([]);
    };

    const doAll = () => {
        setShowAll(true);
        setIsProfileVisible(false);
        setAddition(false);
        setShowAccount(false);
        setToEditName(false);
        setToDelete(false);
        const x = document.getElementById("edit");
        if (x) {
            x.style.display = "none";
        }
        const y = document.getElementById("newGroup");
        if (y) {
            y.style.display = "block";
        }
        const z = document.getElementById("delete");
        if (z) {
            z.style.display = "none";
        }
        setSelectedMembers([]);
    };

    const doAccount = () => {
        setShowAccount(true);
        setAddition(false);
        setShowAll(false);
        setIsProfileVisible(false);
        setToEditName(false);
        const x = document.getElementById("edit");
        if (x) {
            x.style.display = "none";
        }
        const y = document.getElementById("newGroup");
        if (y) {
            y.style.display = "none";
        }
        const k = document.getElementById("checker");
        if (k) {
            k.style.display = "none";
        }
        const z = document.getElementById("delete");
        if (z) {
            z.style.display = "block";
        }
    };

    const newGroup = () => {
        setChatAll(all.filter((k) => k.role !== "Admin"));
        setIsProfileVisible(false);
        setShowAll(false);
        setAddition(true);
        setToDelete(false);
        const x = document.getElementById("edit");
        if (x) {
            x.style.display = "none";
        }
        const y = document.getElementById("newGroup");
        if (y) {
            y.style.display = "none";
        }
        const z = document.getElementById("delete");
        if (z) {
            z.style.display = "none";
        }
    };

    const toggleSelection = (memberId, role) => {
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(memberId)
                ? prevSelected.filter((id) => id !== memberId)
                : [...prevSelected, memberId]
        );
        if (role !== "Student") {
            setFaculty((prevFaculty) =>
                prevFaculty.includes(memberId)
                    ? prevFaculty.filter((id) => id !== memberId)
                    : [...prevFaculty, memberId]
            );
        } else {
            setStudents((prevStudents) =>
                prevStudents.includes(memberId)
                    ? prevStudents.filter((id) => id !== memberId)
                    : [...prevStudents, memberId]
            );
        }
    };

    const editName = () => {
        setShowAll(false);
        setAddition(false);
        setIsProfileVisible(true);
        setToEditName(true);
        document.getElementById("newGroup").style.display = "none";
        document.getElementById("edit").style.display = "none";
    };

    const deleteAccount = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete`, {
                withCredentials: true,
            });
            localStorage.clear();
            navigate("/signup");
            setProfile(null);
            setMessage("Account deleted successfully!");
            setToEditName(false);
            setName("");
            setToDelete(false);
        } catch (error) {
            console.error("Error deleting account:", error.response?.data || error);
            setMessage(error.response?.data?.message || "Failed to delete account");
        }
    };

    const handleEditName = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/update-name`,
                { name: name },
                { withCredentials: true }
            );
            if (response.data.success) {
                setProfile((prev) => ({ ...prev, name: name }));
                setMessage("Name updated successfully!");
                setToEditName(false);
                setName("");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error updating name:", error.response?.data || error);
            setMessage(error.response?.data?.message || "Failed to update name");
        }
    };

    const changeProfile = () => {
        setEditProfile(false);
        setEditConfirm(true);
    };

    const confirmChangeProfile = () => {
        setEditConfirm(false);
        setEditProfile(true);
        handleProfilePicSubmit();
    };

    const cancelChangeProfile = () => {
        setEditConfirm(false);
        setEditProfile(true);
        setProfilePicFile(null);
        setPreview(null);
    };

    return (
        <div className="min-h-screen p-4 lg:p-6 overflow-hidden">
            <button
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-teal-500 to-cyan-600 hover:shadow-lg flex justify-center items-center mb-4 lg:mb-2"
                onClick={() => navigate("/chat")}
            >
                <img src={arrow} className="w-6 h-6 lg:w-7 lg:h-7" alt="Back" />
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">
                <div className="flex flex-col items-center lg:items-center gap-8 lg:gap-10">
                    <div className="group relative">
                    <div className="border-2 border-gray-200 rounded-full w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] xl:w-[247px] xl:h-[247px] flex items-center justify-center bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img
                            src={preview || (profile.profilePic ? profile.profilePic : user)}
                            alt="User"
                            className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => { e.target.src = user; }}
                        />
                    </div>
                    </div>
                    <div className="flex justify-center w-full lg:w-[257px] -mt-6 lg:-mt-8 mb-4 lg:mb-0">
                        {editProfile && (
                            <button
                                className="border-2 bg-red-500 p-2 text-white font-semibold rounded-md text-sm sm:text-base"
                                onClick={changeProfile}
                            >
                                Edit
                            </button>
                        )}
                        {editConfirm && (
                            <div className="flex gap-2">
                                <button
                                    className="border-2 bg-green-500 p-2 text-white font-semibold rounded-md text-sm sm:text-base"
                                    onClick={confirmChangeProfile}
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "Confirm"}
                                </button>
                                <button
                                    className="border-2 bg-gray-500 p-2 text-white font-semibold rounded-md text-sm sm:text-base"
                                    onClick={cancelChangeProfile}
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                    {editConfirm && (
                        <div className="flex flex-col items-center w-full sm:w-[50%] gap-4 sm:gap-5 cursor-pointer">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleProfilePicChange}
                                className="mb-2 cursor-pointer text-sm sm:text-base"
                            />
                        </div>
                    )}
                    
                    <div className="flex justify-center w-full lg:w-[257px]">
                        <h1 className="ftext-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">{profile.name || "Name"}</h1>
                    </div>
                    <div className="box bg-amber-500 w-full lg:w-[300px] my-6 lg:my-0 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl">
                        <div className="flex flex-col gap-2 p-4">
                            <a className="p-3 font-semibold text-sm sm:text-base rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-3 cursor-pointer" onClick={doProfile}>
                                <img src={user} className="w-4 sm:w-5 inline mr-4 sm:mr-7" alt="Profile" />
                                Profile
                            </a>
                            <a className="font-semibold text-sm sm:text-base p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-3 cursor-pointer" onClick={doAll}>
                                <img src={user} className="w-4 sm:w-5 inline mr-4 sm:mr-7" alt="Chats" />
                                Chats
                            </a>
                            <a className="font-semibold text-sm sm:text-base p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-3 cursor-pointer" onClick={doAccount}>
                                <img src={user} className="w-4 sm:w-5 inline mr-4 sm:mr-7" alt="Account" />
                                Account
                            </a>
                        </div>
                    </div>
                </div>
                <div className="box w-full ">
                <div className="flex flex-col   ">
      {isProfileVisible && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white  pb-4">Profile</h2>
          <div className="space-y-6">
          <div className="grid gap-4">
                                {[
                                    { label: "Name", value: profile.name },
                                    { label: "Email", value: profile.email },
                                    { label: "Institution", value: profile.institution || "Not set" },
                                    { label: "Role", value: profile.role },
                                    {
                                        label: "Email Verified",
                                        value: profile.isVerified ? (
                                            <span className="flex items-center text-green-500">
                                                Verified <MdVerified className="ml-2" />
                                            </span>
                                        ) : "Not Verified",
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{item.label}:</span>
                                        <span className="text-lg font-semibold text-gray-800 dark:text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>

          </div>
        </div>
      )}

                        {profile.role === "Admin" &&
                        (!profile.institution || profile.institution === "") &&
                        showInstitutionInput ? (
                            <form onSubmit={handleInstitutionSubmit} className="flex flex-col gap-2">
                                <input
                                    placeholder="Enter your Institution"
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="border p-2 rounded text-sm sm:text-base"
                                />
                                <button className="bg-green-400 p-2 rounded-md text-sm sm:text-base">Submit</button>
                            </form>
                        ) : null}
                        {showAll && (
                            <div className="p-2 shadow-md bg-white rounded-sm">
                                <h2 className="font-bold text-lg lg:text-3xl underline mb-4">Chat</h2>

                                <ul className="mt-2  overflow-y-auto rounded text-sm sm:text-base">
                                    {all.map((member, index) => (
                                        <li key={index} className="cursor-pointer hover:bg-gray-200 p-2">
                                            {profile.name === member.name ? "You" : member.name} ({member.role})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div>
                        {profile.role === "Admin" ? (
                            <div className="h-[98%] max-h-full ">
                                {isProfileVisible && (
                                    <button
                                    onClick={() => setToEditName(true)}
                                    className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                                >
                                    Edit Name
                                </button>

                                )}
                                {toEditName && (
                                    <form className="my-4 flex flex-col gap-2 " onSubmit={handleEditName}>
                                        <input
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="border p-2 rounded text-sm sm:text-base"
                                        />
                                        <button className="p-3  rounded-md bg-gradient-to-r from-teal-500 to-cyan-600  text-white font-semibold text-sm sm:text-base">
                                            Submit
                                        </button>
                                    </form>
                                )}
                                {showAll && (
                                    <button
                                        className="flex justify-center p-3 my-3 rounded text-white  font-semibold bg-gradient-to-r from-teal-500 to-cyan-600 text-sm sm:text-base w-full md:w-full"
                                        onClick={newGroup}
                                        id="newGroup"
                                    >
                                        Create New Group
                                    </button>
                                )}
                                {addition && (
                                    <ul className="mt-2 max-h-[80%] overflow-y-auto rounded text-sm sm:text-base shadow-md  bg-white">
                                        {chatall.map((member, index) => (
                                            <div key={member._id} className="flex justify-between  p-2">
                                                <li className="cursor-pointer p-1">
                                                    {member.name} ({member.role})
                                                </li>
                                                <button
                                                    className={`p-2 rounded-sm  ${
                                                        selectedMembers.includes(member._id)
                                                            ? "bg-green-500 text-white font-semibold"
                                                            : "bg-gray-200"
                                                    } text-sm sm:text-base`}
                                                    onClick={() => toggleSelection(member._id, member.role)}
                                                >
                                                    {selectedMembers.includes(member._id) ? "Selected" : "Add"}
                                                </button>
                                            </div>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : null}
                    </div>
                    {selectedMembers.length > 0 ? (
                        <div className="mt-4" id="checker">
                            <p className="mb-2 text-sm sm:text-base">
                                {selectedMembers.length > 0 ? `Total Selected: ${selectedMembers.length}` : ""}
                            </p>
                            <form className="flex flex-col sm:flex-row gap-2" onSubmit={onSubmit}>
                                <input
                                    placeholder="Enter Class group name"
                                    value={group}
                                    className="border p-2 rounded text-sm sm:text-base"
                                    required
                                    onChange={(e) => setGroup(e.target.value)}
                                />
                                <button
                                    className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 hover:shadow-xl rounded text-white font-semibold text-sm sm:text-base"
                                    onClick={() => setCreateClass(true)}
                                >
                                    Create
                                </button>
                            </form>
                        </div>
                    ) : null}
                    {showAccount && (
                        <div className="mt-4 bg-white p-3 rounded-md shadow-md">
                            <h2 className="font-bold text-lg lg:text-3xl underline mb-4">Account</h2>

                            <button
                                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                                id="delete"
                                onClick={() => setToDelete(true)}
                            >
                                Delete Account
                            </button>
                        </div>
                    )}
                    {Todelete && (
                        <form className="mt-6 p-6 bg-red-50 dark:bg-red-900 rounded-lg shadow-md">
                            <p className="text-lg font-medium text-gray-800 dark:text-white mb-4">Are you sure you want to delete your account?</p>
                            <div className="flex gap-2 sm:gap-5">
                                <button
                                    className="py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                                    onClick={deleteAccount}
                                >
                                    Yes
                                </button>
                                <button
                                    className="py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                                    onClick={() => setToDelete(false)}
                                >
                                    No
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <Link to="/">
                <button className="w-full lg:w-auto py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-colors font-semibold shadow-md hover:shadow-lg">
                        Log Out
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Profile;