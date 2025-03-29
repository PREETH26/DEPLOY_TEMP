import Notification from "../Models/NotificationSchema"

export const createNotification = async(req,res)=>{
    try {
        const newNotification = new Notification({
          user: req.body.user,
          message: req.body.message,
        });
    
        const savedNotification = await newNotification.save();
        res.json({success:true,message:savedNotification});
      } catch (error) {
        res.json({success:false,error: error.message });
      }
}