"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { createMerchantTransfer } from "../app/lib/actions/createMerchantTransfer";

export function PayMerchantCard() {
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");

    const handleTransfer = async () => {
        try {
            const res = await createMerchantTransfer(email, Number(amount) * 100);
            if (res?.message === "Success") {
                setStatus("Payment successful!!");
                setEmail("");
                setAmount("");
            } else {
                setStatus(res?.message || "Payment failed");
            }
        } catch (error) {
            console.log(error);
            setStatus("Payment failed");
        }
    }

    return <div>
        <Center>
            <Card title="Pay Merchant">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Merchant Email"} label="Merchant Email" onChange={(value) => {
                        setEmail(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={handleTransfer}>Pay</Button>
                    </div>
                    {status && (
                        <div className="pt-4 flex justify-center w-full">
                            {status.includes("success") ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 w-full text-center">
                                    <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500/20 mb-3">
                                        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-emerald-400">Payment Sent!</h3>
                                    <p className="text-sm text-slate-400 mt-1 mb-3">Transaction recorded successfully.</p>
                                    <button onClick={() => setStatus("")} className="text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1.5 px-4 rounded-full transition-colors">
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <div className="text-red-400 font-semibold text-sm p-3 rounded-xl bg-red-500/10 border border-red-500/20 w-full text-center">{status}</div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </Center>
    </div>
}
