"use client"
export const Select = ({ options, onSelect }: {
    onSelect: (value: string) => void;
    options: {
        key: string;
        value: string;
    }[];
}) => {
    return <select onChange={(e) => {
     onSelect(e.target.value)
    }} className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none transition-colors duration-200">
        {options.map(option => <option key={option.key} value={option.key}>{option.value}</option>)}
  </select>

}