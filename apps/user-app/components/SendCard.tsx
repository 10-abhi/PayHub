"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTranfer";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");

    const handleTransfer = async () => {
        try {
            await p2pTransfer(number, Number(amount) * 100);
            setStatus("Transfer successful!!")
            setNumber("");
            setAmount("");
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={handleTransfer}>Send</Button>
                    </div>
                    {status && (
                        <div className="pt-4 text-center">
                            <div className={`text-sm font-medium px-4 py-2 rounded-xl ${status.includes("success") ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-red-400 bg-red-500/10 border border-red-500/20"}`}>
                                {status}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </Center>
    </div>
}