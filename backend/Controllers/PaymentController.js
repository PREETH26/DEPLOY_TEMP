import Payment from "../Models/PaymentSchema"

export const payment = async(req,res)=>{
    try {
        const newPayment = new Payment({
          sender: req.body.sender,
          recipient: req.body.recipient,
          amount: req.body.amount,
          paymentStatus: "pending",
        });
    
        const savedPayment = await newPayment.save();
        res.json({success:true,message:savedPayment});
      } catch (error) {
        res.json({success:false,error: error.message });
      }
}