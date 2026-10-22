import React, { useEffect, useState, useCallback } from 'react';
import {
    ShoppingCart,
    Trash2,
    Minus,
    Plus,
    PackageOpen,
    AlertCircle,
    Loader2,
    CheckCircle2,
    X,
} from 'lucide-react';
import { apiService, getStoredBaseUrl, parseApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { CartResponse, CartItemResponse } from '../types/api';
import type { NavTab } from './Navbar';

interface CartProps {
    onNavigate: (tab: NavTab) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
    const { isAuthenticated } = useAuth();

    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
    const [removingItemId, setRemovingItemId] = useState<number | null>(null);
    const [clearingCart, setClearingCart] = useState(false);

    const resolveImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (/^(https?:|data:|blob:)/i.test(url)) return url;
        const base = getStoredBaseUrl().replace(/\/$/, '');
        return `${base}${url.startsWith('/') ? url : `/${url}`}`;
    };

    const formatPrice = (price: string | number | null | undefined) => {
        const amount = Number(price);
        if (!price || isNaN(amount)) return price ? String(price) : '—';
        return `RWF ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`;
    };

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getCart();
            setCart(data);
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleUpdateQuantity = async (item: CartItemResponse, delta: number) => {
        const newQty = item.quantity + delta;
        if (newQty < 1) return;
        try {
            setUpdatingItemId(item.id);
            setError(null);
            const updated = await apiService.updateCartItem(item.id, { quantity: newQty });
            setCart(updated);
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (item: CartItemResponse) => {
        try {
            setRemovingItemId(item.id);
            setError(null);
            const updated = await apiService.removeCartItem(item.id);
            setCart(updated);
            showSuccess(`"${item.product_title}" removed from cart.`);
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setRemovingItemId(null);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Remove all items from your cart?')) return;
        try {
            setClearingCart(true);
            setError(null);
            await apiService.clearCart();
            setCart(null);
            showSuccess('Cart cleared.');
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setClearingCart(false);
        }
    };

    // ── Not logged in ──────────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-bone-100 border border-sand-300 flex items-center justify-center shadow-sm">
                    <ShoppingCart className="w-7 h-7 text-brown-400" />
                </div>
                <h2 className="text-lg font-serif font-bold text-midnight-900">Sign in to view your cart</h2>
                <p className="text-xs text-brown-500 max-w-xs">
                    Create an account or log in to save artworks and manage your cart.
                </p>
                <button
                    onClick={() => onNavigate('account')}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition"
                >
                    Go to Account
                </button>
            </div>
        );
    }

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 animate-fadeIn">
                <Loader2 className="w-7 h-7 text-olive animate-spin" />
                <p className="text-xs text-brown-500">Loading your cart…</p>
            </div>
        );
    }

    // ── Empty cart ─────────────────────────────────────────────────────────────
    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="space-y-6 pb-10 animate-fadeIn">
            {/* Header */}
            <section className="rounded-2xl border border-sand-200/90 bg-gradient-to-b from-bone-50 via-white to-bone-100/60 p-5 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-olive-100 border border-olive-200 flex items-center justify-center shrink-0">
                            <ShoppingCart className="w-5 h-5 text-olive" />
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-midnight-900">My Cart</h1>
                            <p className="text-[11px] text-brown-500">
                                {isEmpty ? 'No items yet' : `${cart.total_items} item${cart.total_items !== 1 ? 's' : ''}`}
                            </p>
                        </div>
                    </div>

                    {!isEmpty && (
                        <button
                            onClick={handleClearCart}
                            disabled={clearingCart}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-terracotta-200 bg-terracotta-50 text-terracotta text-xs font-semibold hover:bg-terracotta-100 disabled:opacity-60 transition"
                        >
                            {clearingCart ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            <span>Clear Cart</span>
                        </button>
                    )}
                </div>
            </section>

            {/* Alerts */}
            {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-800 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto shrink-0">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {successMsg && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-olive-50 border border-olive-200 text-olive-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                </div>
            )}

            {/* Empty state */}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-bone-100 border border-sand-300 flex items-center justify-center shadow-sm">
                        <PackageOpen className="w-7 h-7 text-brown-400" />
                    </div>
                    <h2 className="text-base font-serif font-bold text-midnight-900">Your cart is empty</h2>
                    <p className="text-xs text-brown-500 max-w-xs">
                        Browse the gallery and add artworks you love.
                    </p>
                    <button
                        onClick={() => onNavigate('gallery')}
                        className="mt-2 px-5 py-2.5 rounded-xl bg-olive hover:bg-olive-600 text-white text-xs font-semibold shadow-sm transition"
                    >
                        Browse Gallery
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Items list */}
                    <div className="lg:col-span-2 space-y-3">
                        {cart!.items.map((item) => {
                            const imageUrl = resolveImageUrl(item.product_image_url);
                            const isBusy = updatingItemId === item.id || removingItemId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className={`flex gap-3 bg-white rounded-xl border border-sand-200/90 p-3 shadow-sm transition ${isBusy ? 'opacity-70' : ''}`}
                                >
                                    {/* Artwork thumbnail */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-bone-100 border border-sand-300 flex items-center justify-center">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={item.product_title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <ShoppingCart className="w-6 h-6 text-brown-300" />
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xs font-serif font-bold text-midnight-900 truncate">
                                                {item.product_title}
                                            </h3>
                                            <span
                                                className={`inline-block mt-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.product_status === 'Available'
                                                        ? 'bg-olive-100 text-olive-800 border border-olive-300'
                                                        : 'bg-sand-200 text-brown-700 border border-sand-300'
                                                    }`}
                                            >
                                                {item.product_status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                                            {/* Quantity controls */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item, -1)}
                                                    disabled={isBusy || item.quantity <= 1}
                                                    className="w-6 h-6 rounded-md border border-sand-300 flex items-center justify-center hover:bg-bone-100 disabled:opacity-40 transition"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="min-w-[24px] text-center text-xs font-bold text-midnight-900">
                                                    {updatingItemId === item.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin inline" />
                                                    ) : (
                                                        item.quantity
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item, +1)}
                                                    disabled={isBusy}
                                                    className="w-6 h-6 rounded-md border border-sand-300 flex items-center justify-center hover:bg-bone-100 disabled:opacity-40 transition"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <span className="text-xs font-bold text-midnight-900">
                                                {formatPrice(item.product_price)}
                                            </span>

                                            {/* Remove */}
                                            <button
                                                onClick={() => handleRemoveItem(item)}
                                                disabled={isBusy}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-terracotta-200 bg-terracotta-50 text-terracotta text-[11px] font-semibold hover:bg-terracotta-100 disabled:opacity-50 transition"
                                                aria-label={`Remove ${item.product_title} from cart`}
                                            >
                                                {removingItemId === item.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-3 h-3" />
                                                )}
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 bg-white rounded-xl border border-sand-200/90 p-4 shadow-sm space-y-4">
                            <h2 className="text-sm font-serif font-bold text-midnight-900">Order Summary</h2>

                            <div className="space-y-2 text-xs text-brown-700">
                                <div className="flex justify-between">
                                    <span>Items</span>
                                    <span className="font-semibold text-midnight-900">{cart!.total_items}</span>
                                </div>
                                <div className="flex justify-between border-t border-sand-200 pt-2 mt-2">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-sm text-midnight-900">{formatPrice(cart!.total_price)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onNavigate('contact')}
                                className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition"
                            >
                                Inquire to Purchase
                            </button>

                            <button
                                onClick={() => onNavigate('gallery')}
                                className="w-full py-2 rounded-xl border border-sand-300 bg-bone-50 hover:bg-bone-100 text-brown-700 text-xs font-medium transition"
                            >
                                Continue Browsing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
