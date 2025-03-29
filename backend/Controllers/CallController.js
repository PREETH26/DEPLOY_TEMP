import VideoCall from "../Models/VideocallSchema"

export const call = async(req,res)=>{
    try {
        const newCall = new VideoCall({
          caller: req.body.caller,
          receiver: req.body.receiver,
          callType: req.body.callType || "video",
        });
    
        const savedCall = await newCall.save();
        res.json({success:true,messgae:savedCall});
      } catch (error) {
        res.json({success:false,error: error.message });
      }
}