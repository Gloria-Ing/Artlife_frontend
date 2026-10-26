import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { guestCartService, type GuestCart } from '../services/guestCart';
import { useAuth } from './AuthContext';
import type { CartResponse } from '../types/api';

interface CartContextType {
    cartCount: number;
    guestCart: GuestCart;
    serverCart: CartResponse | null;
    refreshCartCount: () => Promise<void>;
    refreshGuestCart: () => void;
    setCartCount: (n: number) => void;
    mergeGuestCartOnLogin: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [guestCart, setGuestCart] = useState<GuestCart>(() => guestCartService.get());
    const [serverCart, setServerCart] = useState<CartResponse | null>(null);
    const prevAuthRef = useRef(isAuthenticated);

    const refreshGuestCart = useCallback(() => {
        const cart = guestCartService.get();
        setGuestCart(cart);
        if (!isAuthenticated) {
            setCartCount(cart.items.reduce((sum, i) => sum + i.quantity, 0));
        }
    }, [isAuthenticated]);

    const refreshCartCount = useCallback(async () => {
        if (!isAuthenticated) {
            setCartCount(guestCartService.totalItems());
            setServerCart(null);
            return;
        }
        try {
            const cart = await apiService.getCart();
            setServerCart(cart);
            setCartCount(cart.total_items);
        } catch {
            setCartCount(0);
            setServerCart(null);
        }
    }, [isAuthenticated]);

    const mergeGuestCartOnLogin = useCallback(async () => {
        const guest = guestCartService.get();
        try {
            const result = await apiService.mergeCart();
            guestCartService.clear();
            setGuestCart({ items: [] });
            setServerCart(result.cart);
            setCartCount(result.cart.total_items);
        } catch {
            if (guest.items.length > 0) {
                guestCartService.clear();
                setGuestCart({ items: [] });
            }
        }
    }, []);

    useEffect(() => {
        const wasGuest = !prevAuthRef.current;
        const nowAuth = isAuthenticated;
        prevAuthRef.current = isAuthenticated;

        if (wasGuest && nowAuth) {
            mergeGuestCartOnLogin().then(() => refreshCartCount());
        } else {
            refreshCartCount();
        }
    }, [isAuthenticated, mergeGuestCartOnLogin, refreshCartCount]);

    return (
        <CartContext.Provider
            value={{
                cartCount,
                guestCart,
                serverCart,
                refreshCartCount,
                refreshGuestCart,
                setCartCount,
                mergeGuestCartOnLogin,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
};
