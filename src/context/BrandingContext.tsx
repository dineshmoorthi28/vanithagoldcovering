import React, { createContext, useContext, useState, useEffect } from 'react';

interface BrandingContextType {
    logo: string | null;
    shopName: string;
    updateBranding: (logo: string | null, shopName: string) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
    const [logo, setLogo] = useState<string | null>(localStorage.getItem('siteLogo'));
    const [shopName, setShopName] = useState<string>(localStorage.getItem('shopName') || 'Vanitha Gold Covering');

    const updateBranding = (newLogo: string | null, newShopName: string) => {
        setLogo(newLogo);
        setShopName(newShopName);

        if (newLogo) {
            localStorage.setItem('siteLogo', newLogo);
        } else {
            localStorage.removeItem('siteLogo');
        }

        localStorage.setItem('shopName', newShopName);
    };

    return (
        <BrandingContext.Provider value={{ logo, shopName, updateBranding }}>
            {children}
        </BrandingContext.Provider>
    );
}

export function useBranding() {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
}
