import { ShoppingBag, ArrowRight } from "lucide-react";
import PrimaryButton from "../../components/common_components/PrimaryButton";
import "./HeroSection.css";

function HeroSection({ firstName, onBrowse, onCart }) {
    return (
        <section className="hero-section relative w-full overflow-hidden flex flex-col justify-center px-6 md:px-16 py-20 md:py-28">

            {/* Floating Blobs */}
            <div className="hero-blob hero-blob-one" />

            <div className="hero-blob hero-blob-two" />

            {/* Hero Content */}
            <div className="hero-content relative z-10 max-w-2xl">

                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                    <span className="text-emerald-400 text-xs font-medium tracking-widest uppercase">
                        Welcome back
                    </span>
                </div>

                {/* Greeting */}
                <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-3">
                    Hey, {firstName} 👋
                </h1>

                <h2 className="text-emerald-400 text-3xl md:text-5xl font-bold leading-tight mb-6">
                    Ready to shop?
                </h2>

                {/* Animated Divider */}
                <div className="hero-divider" />

                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mb-10">
                    Explore thousands of products handpicked just for you.
                    From deals to doorstep — ShopAI has it all.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">

                    <PrimaryButton
                    text="Browse Products"
                    icon={<ArrowRight size={16}/>}
                    onClick={onBrowse}
                    />

                    <button
                        onClick={onCart}
                        className="flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border border-zinc-700 hover:border-emerald-500 hover:-translate-y-1 active:scale-95 text-white rounded-xl text-sm transition-all duration-300 cursor-pointer"
                    >
                        <ShoppingBag size={15} />
                        View Cart
                    </button>

                </div>

            </div>

        </section>
    );
}

export default HeroSection;