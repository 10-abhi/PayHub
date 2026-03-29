"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransaction";
import { createStripeSession } from "../app/lib/actions/createStripeSession";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}, {
    name: "Stripe (Credit/Debit)",
    redirectUrl: "STRIPE"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl || "");
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0);
    return <Card title="Add Money">
        <div className="w-full">
            <TextInput label={"Amount"} placeholder={"Amount"} onChange={(value) => {
                setValue(Number(value))
            }} />
            <div className="py-4 text-left text-sm text-slate-400 font-medium">
                Bank
            </div>
            <Select onSelect={(value) => {
                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
                setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
            }} options={SUPPORTED_BANKS.map(x => ({
                key: x.name,
                value: x.name
            }))} />
            <div className="flex justify-center pt-4">
                <Button onClick={async () => {
                    if (provider === "Stripe (Credit/Debit)") {
                        const res = await createStripeSession(value);
                        if (res?.success && res.url) {
                            window.location.href = res.url;
                        } else {
                            alert(res?.message || "Failed to start Stripe session");
                        }
                    } else {
                        const token = (Math.random() * 1000).toString();
                        await createOnRampTransaction(provider, value, token);
                        window.location.href = redirectUrl || ""
                    }
                }}>
                    Add Money
                </Button>
            </div>
        </div>
    </Card>
}