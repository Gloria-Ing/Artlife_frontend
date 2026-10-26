import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { guestCartService, type GuestCart } from '../services/guestCart';
import { useAuth } from './AuthContext';

interface CartContextType {
    cartCount: number;
    guestCart: GuestCart;
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
            return;
        }
        try {
            const cart = await apiService.getCart();
            setCartCount(cart.total_items);
        } catch {
            setCartCount(0);
        }
    }, [isAuthenticated]);

    // After login: call POST /cart/merge so server folds the cookie-keyed
    // guest session cart into the user's account cart, then clear local mirror.
    const mergeGuestCartOnLogin = useCallback(async () => {
        const guest = guestCartService.get();
        try {
            const result = await apiService.mergeCart();
            // Server merged successfully — clear local mirror and update count
            guestCartService.clear();
            setGuestCart({ items: [] });
            setCartCount(result.cart.total_items);
        } catch {
            // Merge failed (no guest session or server error) — still clear local
            // mirror so stale UI data doesn't persist, then refresh from server.
            if (guest.items.length > 0) {
                guestCartService.clear();
                setGuestCart({ items: [] });
            }
        }
    }, []);

    // When auth flips from guest → logged-in: merge, then refresh count
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
