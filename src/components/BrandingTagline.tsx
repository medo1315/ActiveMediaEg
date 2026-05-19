

interface BrandingTaglineProps {
    className?: string;
}

export function BrandingTagline({ className = '' }: BrandingTaglineProps) {

    return (
        <div className={`relative ${className}`}>
            <div className="flex flex-col items-start text-left leading-[0.85] relative z-20">
                {/* Tagline text removed */}
            </div>
        </div>
    );
}
