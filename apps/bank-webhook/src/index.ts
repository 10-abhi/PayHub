import express from "express";
const app = express();
import db from "@repo/db/client"
import {z} from 'zod'

const paymentSchema = z.object({
    token : z.string(),
    userId : z.number(),
    amount : z.number(),
});

app.use(express.json());
app.post("/hdfcWebhook" , async (req,res)=>{

    //Todo : Add zod validation // completed

    const data = req.body;
    const success = data.parse(paymentSchema);
    if(!success){
        res.json({
            mesaage : "Schema is not valid"
        })
    }

    const paymentInformation = {
        token : req.body.token,
        userId : req.body.user_identifier,
        amount : req.body.amount
    }

    console.log(paymentInformation);

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch (error) {
        console.error(error);
        res.status(411).json({
            message:"Error while processing webhook"
        })
    }
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});