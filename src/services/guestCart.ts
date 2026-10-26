// ── Guest cart stored in localStorage ────────────────────────────────────────
// Mirrors what the server holds for the guest (keyed by artlife_session_id cookie).
// Used purely for UI display. The server is the source of truth.

const GUEST_CART_KEY = 'artlife_guest_cart';

export interface GuestCartItem {
    gallery_product_id: number;
    quantity: number;
    product_title: string;
    product_price: string;
    product_image_url: string | null;
    product_status: string;
}

export interface GuestCart {
    items: GuestCartItem[];
}

export const guestCartService = {
    get(): GuestCart {
        try {
            const raw = localStorage.getItem(GUEST_CART_KEY);
            return raw ? (JSON.parse(raw) as GuestCart) : { items: [] };
        } catch {
            return { items: [] };
        }
    },

    save(cart: GuestCart): void {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    },

    clear(): void {
        localStorage.removeItem(GUEST_CART_KEY);
    },

    addItem(product: Omit<GuestCartItem, 'quantity'>, quantity = 1): GuestCart {
        const cart = guestCartService.get();
        const existing = cart.items.find(
            (i) => i.gallery_product_id === product.gallery_product_id
        );
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ ...product, quantity });
        }
        guestCartService.save(cart);
        return cart;
    },

    updateQuantity(gallery_product_id: number, quantity: number): GuestCart {
        const cart = guestCartService.get();
        const item = cart.items.find((i) => i.gallery_product_id === gallery_product_id);
        if (item) {
            item.quantity = Math.max(1, quantity);
        }
        guestCartService.save(cart);
        return cart;
    },

    removeItem(gallery_product_id: number): GuestCart {
        const cart = guestCartService.get();
        cart.items = cart.items.filter((i) => i.gallery_product_id !== gallery_product_id);
        guestCartService.save(cart);
        return cart;
    },

    totalItems(): number {
        return guestCartService.get().items.reduce((sum, i) => sum + i.quantity, 0);
    },
};
