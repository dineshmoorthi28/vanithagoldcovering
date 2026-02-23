import { useBranding } from '../context/BrandingContext';

interface LogoProps {
    className?: string;
    textClassName?: string;
    subTextClassName?: string;
    imageClassName?: string;
}

export default function Logo({
    className = "",
    textClassName = "text-2xl font-serif font-bold tracking-wider text-gold-400",
    subTextClassName = "text-[10px] font-sans tracking-[0.2em] text-gold-200/80 uppercase -mt-1",
    imageClassName = "h-12 w-auto drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] transition-all"
}: LogoProps) {
    const { logo, shopName } = useBranding();

    if (logo) {
        return (
            <img
                src={logo}
                alt={shopName}
                className={imageClassName}
            />
        );
    }

    const nameParts = shopName.split(' ');
    const mainText = nameParts[0];
    const subText = nameParts.slice(1).join(' ') || 'Covering Jewellery';

    return (
        <div className={`flex flex-col ${className}`}>
            <span className={textClassName}>
                {mainText}
            </span>
            <span className={subTextClassName}>
                {subText}
            </span>
        </div>
    );
}
