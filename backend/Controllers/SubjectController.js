import SubjectGroup from "../Models/Subjectgroup.js"
import ClassGroup from "../Models/ClassgroupSchema.js"
import Chat from "../Models/ChatSchema.js";



export const createSubject = async (req, res) => {
    const { classId } = req.params;
    const { subjectName, faculty, students, managedBy } = req.body;

    if (!subjectName || !classId) {
        return res.status(400).json({ success: false, message: "Subject name and classId are required" });
    }

    try {
        // Find the ClassGroup and populate createdBy
        const classGroup = await ClassGroup.findById(classId).populate("createdBy");
        if (!classGroup) {
            return res.status(404).json({ success: false, message: "Class group not found" });
        }

        // Check for duplicate subject name within the same class group
        const existingSubject = await SubjectGroup.findOne({ subjectName, classGroup: classId });
        if (existingSubject) {
            return res.status(400).json({ success: false, message: "Subject name already exists. Please use another name." });
        }

        // Use the class group creator as managedBy if not provided
        const manager = managedBy || classGroup.createdBy._id;

        // Create a list of users for the chat (students, faculty, and manager)
        const chatUsers = [
            ...new Set([
                ...(students || []),
                ...(faculty || []),
                manager,
            ].filter(id => id && id.toString().trim() !== "")) // Remove null, undefined, or empty strings
        ];

        // Create a new chat for the subject group
        const newChat = new Chat({
            users: chatUsers,
            isGroupChat: true,
            name: `${subjectName} Chat`,
        });
        await newChat.save();

        // Create the new SubjectGroup
        const newSubjectGroup = new SubjectGroup({
            subjectName,
            classGroup: classId,
            faculty: faculty || [],
            students: students || [],
            managedBy: manager,
            chat: newChat._id,
        });
        await newSubjectGroup.save();

        // Update the ClassGroup to add the new SubjectGroup to its subjects array
        await ClassGroup.findByIdAndUpdate(
            classId,
            { $push: { subjects: newSubjectGroup._id } },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Subject group created successfully",
            subjectGroup: newSubjectGroup,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAllSubjects = async(req,res)=>{
    const { classId } = req.params; 
    if(!classId){
        return res.status(400).json({ success: false, message: "classGroupId is required" });
    }
    try {
        const subjects = await SubjectGroup.find({ classGroup: classId })
        .populate("students","name email")
        .populate("faculty","name email")
        .populate("chat")
        .exec();

        if (!subjects) {
            return res.status(404).json({ success: false, message: "No subjects found for this class group." });
        }

        return res.status(200).json({ success: true, subjects });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success:false,message: "Server Error" });
    }
}

export const getSubjectsById = async(req,res)=>{
    const {subjectId} = req.params;
    if(!subjectId){
        return res.status(400).json({ success: false, message: "SubjectGroup Id is required" });
    }
    try {
        const subject = await SubjectGroup.findById(subjectId)
        .populate("students","name email role")
        .populate("faculty","name email role")
        .populate({
            path: "chat",
            populate: {
                path: "messages", 
                populate: { path: "sender", select: "name email role" }
            }
        })
        .exec();

        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject group not found" });
        }
        return res.status(200).json({ success: true, subject });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success:false,message: "Server Error" });
    }
}

export const updateSubject = async(req,res)=>{
    const {subjectId} = req.params;
    const {subjectName, addStudents, removeStudents, addFaculty, removeFaculty} = req.body;
    if(!subjectId){
        return res.status(400).json({ success: false, message: "SubjectGroup Id is required" });
    }
    try {
        const updateFields = {};
       
       
        if(subjectName){
            updateFields.subjectName = subjectName;
        }
        if (addStudents && addStudents.length > 0) {
            updateFields.$addToSet = { students: { $each: addStudents } };
        }
        if (removeStudents && removeStudents.length > 0) {
            updateFields.$pull = { students: { $in: removeStudents } };
        }

        if (addFaculty && addFaculty.length > 0) {
            updateFields.$addToSet = updateFields.$addToSet || {};
            updateFields.$addToSet.faculty = { $each: addFaculty };
        }
        if (removeFaculty && removeFaculty.length > 0) {
            updateFields.$pull = updateFields.$pull || {};
            updateFields.$pull.faculty = { $in: removeFaculty };
        }

        const subject = await SubjectGroup.findByIdAndUpdate(
            subjectId,
            updateFields,
            { new: true, runValidators: true }
        ).populate("students", "name email")
         .populate("faculty", "name email");

        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject group not found" });
        }

        await subject.save();



        return res.status(200).json({ success:true,message: "Subject group updated successfully", subject });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success:false,message: "Server Error" });  
    }
}


export const deleteSubject = async(req,res)=>{
    const { subjectId } = req.params;
    if(!subjectId){
        return res.status(400).json({ success: false, message: "SubjectGroup Id is required" });
    }
    try {
        const subject = await SubjectGroup.findByIdAndDelete(subjectId);
        console.log(subject)
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject group not found" });
        }
        return res.json({ success:true,message: "Subject group deleted successfully" });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success:false,message: "Server Error" });   
    }
}