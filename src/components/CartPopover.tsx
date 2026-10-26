import React, { useEffect, useRef } from 'react';
import {
    ShoppingCart,
    X,
    PackageOpen,
    ArrowRight,
    Trash2,
    LogIn,
    Minus,
    Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { guestCartService } from '../services/guestCart';
import { apiService, getStoredBaseUrl, parseApiError } from '../services/api';
import type { NavTab } from './Navbar';

interface CartPopoverProps {
    open: boolean;
    onClose: () => void;
    onNavigate: (tab: NavTab) => void;
}

export const CartPopover: React.FC<CartPopoverProps> = ({ open, onClose, onNavigate }) => {
    const { isAuthenticated } = useAuth();
    const { guestCart, serverCart, refreshCartCount, refreshGuestCart } = useCart();
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, onClose]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    const go = (tab: NavTab) => { onClose(); onNavigate(tab); };

    const resolveUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (/^(https?:|data:|blob:)/i.test(url)) return url;
        return `${getStoredBaseUrl().replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
    };

    const fmt = (price: string | number | null | undefined) => {
        const n = Number(price);
        if (!price || isNaN(n)) return price ? String(price) : '—';
        return `RWF ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`;
    };

    // ── build unified item list ─────────────────────────────────────────────────
    type PopoverItem = {
        key: string | number;
        id: number | null;          // server item id (null for guest)
        productId: number;
        title: string;
        price: string;
        imageUrl: string | null;
        status: string;
        quantity: number;
    };

    const items: PopoverItem[] = isAuthenticated && serverCart
        ? serverCart.items.map(i => ({
            key: i.id,
            id: i.id,
            productId: i.gallery_product_id,
            title: i.product_title,
            price: i.product_price,
            imageUrl: resolveUrl(i.product_image_url),
            status: i.product_status,
            quantity: i.quantity,
        }))
        : guestCart.items.map(i => ({
            key: i.gallery_product_id,
            id: null,
            productId: i.gallery_product_id,
            title: i.product_title,
            price: i.product_price,
            imageUrl: resolveUrl(i.product_image_url),
            status: i.product_status,
            quantity: i.quantity,
        }));

    const totalPrice = isAuthenticated && serverCart
        ? fmt(serverCart.total_price)
        : fmt(guestCart.items.reduce((s, i) => s + Number(i.product_price) * i.quantity, 0));

    const totalItems = isAuthenticated && serverCart
        ? serverCart.total_items
        : guestCart.items.reduce((s, i) => s + i.quantity, 0);

    // ── actions ────────────────────────────────────────────────────────────────
    const handleRemove = async (item: PopoverItem) => {
        try {
            if (item.id !== null) {
                await apiService.removeCartItem(item.id);
                await refreshCartCount();
            } else {
                guestCartService.removeItem(item.productId);
                refreshGuestCart();
            }
        } catch (err) {
            console.error(parseApiError(err));
        }
    };

    const handleQty = async (item: PopoverItem, delta: number) => {
        const newQty = item.quantity + delta;
        if (newQty < 1) return;
        try {
            if (item.id !== null) {
                await apiService.updateCartItem(item.id, { quantity: newQty });
                await refreshCartCount();
            } else {
                guestCartService.updateQuantity(item.productId, newQty);
                refreshGuestCart();
            }
        } catch (err) {
            console.error(parseApiError(err));
        }
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-midnight-900/20 backdrop-blur-[2px]" aria-hidden />

            {/* Panel */}
            <div
                ref={ref}
                className="fixed top-[56px] right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[400px] max-h-[calc(100vh-80px)] flex flex-col rounded-2xl bg-white border border-sand-200/90 shadow-2xl overflow-hidden animate-fadeIn"
                role="dialog"
                aria-label="Cart preview"
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200 bg-bone-50/80">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-olive" />
                        <span className="text-sm font-serif font-bold text-midnight-900">My Cart</span>
                        {totalItems > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-terracotta text-white text-[9px] font-bold leading-none">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-bone-200 text-brown-500 transition"
                        aria-label="Close cart"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Guest sign-in nudge ── */}
                {!isAuthenticated && (
                    <div className="flex items-center gap-2.5 px-4 py-2.5 bg-olive-50 border-b border-olive-200/80 text-[11px] text-olive-800">
                        <LogIn className="w-3.5 h-3.5 shrink-0" />
                        <span className="flex-1">Sign in to save your cart & complete purchase.</span>
                        <button
                            onClick={() => go('account')}
                            className="shrink-0 px-2.5 py-1 rounded-lg bg-olive hover:bg-olive-600 text-white text-[10px] font-bold transition"
                        >
                            Sign In
                        </button>
                    </div>
                )}

                {/* ── Items list ── */}
                <div className="flex-1 overflow-y-auto divide-y divide-sand-100">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 space-y-3 text-center px-6">
                            <div className="w-12 h-12 rounded-2xl bg-bone-100 border border-sand-300 flex items-center justify-center">
                                <PackageOpen className="w-6 h-6 text-brown-400" />
                            </div>
                            <p className="text-sm font-serif font-bold text-midnight-900">Your cart is empty</p>
                            <p className="text-[11px] text-brown-500">Add artworks from the gallery to get started.</p>
                            <button
                                onClick={() => go('gallery')}
                                className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-olive hover:bg-olive-600 text-white text-xs font-semibold shadow-sm transition"
                            >
                                <span>Browse Gallery</span>
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        items.map((item) => {
                            const img = item.imageUrl;
                            return (
                                <div key={item.key} className="flex gap-3 px-4 py-3 hover:bg-bone-50/60 transition group">
                                    {/* Thumbnail */}
                                    <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-bone-100 border border-sand-200 flex items-center justify-center">
                                        {img
                                            ? <img src={img} alt={item.title} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                            : <ShoppingCart className="w-5 h-5 text-brown-300" />
                                        }
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-xs font-serif font-bold text-midnight-900 truncate leading-tight">{item.title}</p>
                                                <span
                                                    className={`inline-block mt-0.5 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${item.status === 'Available'
                                                        ? 'bg-olive-100 text-olive-800 border border-olive-200'
                                                        : 'bg-sand-200 text-brown-700 border border-sand-200'
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                            {/* Remove */}
                                            <button
                                                onClick={() => handleRemove(item)}
                                                className="shrink-0 p-1 rounded-lg text-brown-400 hover:text-terracotta hover:bg-terracotta-50 transition opacity-0 group-hover:opacity-100"
                                                aria-label={`Remove ${item.title}`}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-1.5">
                                            {/* Qty */}
                                            <div className="flex items-center gap-1 bg-bone-100 rounded-lg px-1 py-0.5 border border-sand-200">
                                                <button
                                                    onClick={() => handleQty(item, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-5 h-5 flex items-center justify-center rounded text-brown-600 hover:bg-bone-200 disabled:opacity-30 transition"
                                                >
                                                    <Minus className="w-2.5 h-2.5" />
                                                </button>
                                                <span className="min-w-[18px] text-center text-[11px] font-bold text-midnight-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQty(item, +1)}
                                                    className="w-5 h-5 flex items-center justify-center rounded text-brown-600 hover:bg-bone-200 transition"
                                                >
                                                    <Plus className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                            {/* Price */}
                                            <span className="text-xs font-bold text-midnight-900">{fmt(item.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ── Footer ── */}
                {items.length > 0 && (
                    <div className="border-t border-sand-200 bg-bone-50/80 px-4 py-3 space-y-3">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-brown-600 font-medium">
                                Subtotal <span className="text-brown-400">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                            </span>
                            <span className="font-bold text-sm text-midnight-900">{totalPrice}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => go('contact')}
                                className="w-full py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-sm transition"
                            >
                                Inquire to Purchase
                            </button>
                        </div>

                        {/* Trash all */}
                        <button
                            onClick={async () => {
                                if (!window.confirm('Clear all items from your cart?')) return;
                                if (isAuthenticated) {
                                    await apiService.clearCart();
                                    await refreshCartCount();
                                } else {
                                    guestCartService.clear();
                                    refreshGuestCart();
                                }
                            }}
                            className="w-full flex items-center justify-center gap-1.5 text-[11px] text-brown-400 hover:text-terracotta transition py-1"
                        >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear cart</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
