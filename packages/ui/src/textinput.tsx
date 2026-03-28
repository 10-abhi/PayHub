"use client"

export const TextInput = ({
    placeholder,
    onChange,
    label
}: {
    placeholder: string;
    onChange: (value: string) => void;
    label: string;
}) => {
    return <div className="pt-2">
        <label className="block mb-2 text-sm font-medium text-slate-400">{label}</label>
        <input onChange={(e) => onChange(e.target.value)} type="text" className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 placeholder-slate-500 outline-none transition-colors duration-200" placeholder={placeholder} />
    </div>
}