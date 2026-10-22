import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
    cartCount: number;
    refreshCartCount: () => Promise<void>;
    setCartCount: (n: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    const refreshCartCount = useCallback(async () => {
        if (!isAuthenticated) {
            setCartCount(0);
            return;
        }
        try {
            const cart = await apiService.getCart();
            setCartCount(cart.total_items);
        } catch {
            setCartCount(0);
        }
    }, [isAuthenticated]);

    // Fetch count on login/logout
    useEffect(() => {
        refreshCartCount();
    }, [refreshCartCount]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
};
