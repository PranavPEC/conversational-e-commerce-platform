import { ShoppingBag } from "lucide-react";

export default function BrandLogo() {
    return (
        <div className="flex justify-center mb-10">
            <div className="w-24 h-24 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <ShoppingBag
                    size={50}
                    className="text-zinc-950"
                    strokeWidth={2.2}
                />
            </div>
        </div>
    );
}