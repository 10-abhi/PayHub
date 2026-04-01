import { PayMerchantCard } from "../../../components/PayMerchantCard";

export default function PayMerchantPage() {
  return (
    <div className="w-screen">
      <div className="text-3xl pt-8 mb-8 font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
        Pay Merchant
      </div>
      <div className="flex justify-center">
        <PayMerchantCard />
      </div>
    </div>
  );
}
