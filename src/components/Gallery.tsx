import React, { useEffect, useState } from 'react';
import type { NavTab } from './Navbar';
import type { GalleryCategory, GalleryProductCreate, GalleryStatus } from '../types/api';
import { apiService, getStoredBaseUrl, parseApiError } from '../services/api';
import { guestCartService } from '../services/guestCart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  Palette,
  ArrowRight,
  Maximize2,
  X,
  Info,
  Plus,
  Save,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  ShoppingCart,
  Loader2,
} from 'lucide-react';

interface Artwork {
  id: string | number;
  title: string;
  series: string;
  price?: string | number | null;
  image_url?: string | null;
  category: GalleryCategory;
  year: string;
  dimensions: string;
  status: GalleryStatus;
  story: string;
}

const EMPTY_PRODUCT: GalleryProductCreate = {
  title: '',
  series: '',
  price: '',
  image_file: null,
  category: 'children',
  year: new Date().getFullYear().toString(),
  dimensions: 'Any size',
  status: 'Available',
  story: '',
};

interface GalleryProps {
  onNavigate: (tab: NavTab) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuth();
  const { refreshCartCount, refreshGuestCart } = useCart();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalArtwork, setActiveModalArtwork] = useState<Artwork | null>(null);
  const [managedArtworks, setManagedArtworks] = useState<Artwork[]>([]);
  const [newProduct, setNewProduct] = useState<GalleryProductCreate>(EMPTY_PRODUCT);
  const [editProduct, setEditProduct] = useState<GalleryProductCreate>(EMPTY_PRODUCT);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [editingProductTitle, setEditingProductTitle] = useState('');
  const [deletingProductId, setDeletingProductId] = useState<string | number | null>(null);
  const [confirmDeleteArtwork, setConfirmDeleteArtwork] = useState<Artwork | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string | number, boolean>>({});
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | number | null>(null);

  const markImageBroken = (id: string | number) => {
    setBrokenImageIds((current) => ({ ...current, [id]: true }));
  };

  const markImageWorking = (id: string | number) => {
    setBrokenImageIds((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const artworks = managedArtworks;

  const mapGalleryProduct = (product: {
    id: string | number;
    title: string;
    series: string;
    price?: string | number | null;
    image_url?: string | null;
    category: GalleryCategory;
    year: string;
    dimensions: string;
    status: GalleryStatus;
    story: string;
  }): Artwork => ({
    id: product.id,
    title: product.title,
    series: product.series,
    price: product.price,
    image_url: resolveImageUrl(product.image_url),
    category: product.category,
    year: product.year,
    dimensions: product.dimensions,
    status: product.status,
    story: product.story,
  });

  const resolveImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return imageUrl;
    if (/^(https?:|data:|blob:)/i.test(imageUrl)) return imageUrl;

    const baseUrl = getStoredBaseUrl().replace(/\/$/, '');
    return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  useEffect(() => {
    let mounted = true;

    apiService
      .getGalleryProducts()
      .then((products) => {
        if (!mounted) return;
        setManagedArtworks(
          products.map(mapGalleryProduct)
        );
      })
      .catch(() => {
        if (!mounted) return;
        setManagedArtworks([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredArtworks =
    selectedCategory === 'all'
      ? artworks
      : artworks.filter((art) => art.category === selectedCategory);

  const handleProductFieldChange = <K extends keyof GalleryProductCreate>(
    field: K,
    value: GalleryProductCreate[K]
  ) => {
    setNewProduct((current) => ({ ...current, [field]: value }));
  };

  const handleEditProductFieldChange = <K extends keyof GalleryProductCreate>(
    field: K,
    value: GalleryProductCreate[K]
  ) => {
    setEditProduct((current) => ({ ...current, [field]: value }));
  };

  const resetProductForm = () => {
    setNewProduct(EMPTY_PRODUCT);
    setNewImagePreview(null);
  };

  const closeEditModal = () => {
    setEditProduct(EMPTY_PRODUCT);
    setEditingProductId(null);
    setEditingProductTitle('');
    setEditImagePreview(null);
  };

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newProduct.image_file) {
      toast('Please choose an image from your computer.', 'error');
      return;
    }

    try {
      setCreateLoading(true);
      const saved = await apiService.createGalleryProduct({ ...newProduct });
      const savedArtwork = mapGalleryProduct(saved);
      setManagedArtworks((current) => [savedArtwork, ...current]);
      toast(`"${saved.title}" was added to the gallery.`, 'success');
      resetProductForm();
      setIsProductFormOpen(false);
    } catch (err) {
      toast(parseApiError(err), 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditProduct = (art: Artwork) => {
    setEditingProductId(art.id);
    setEditingProductTitle(art.title);
    setEditProduct({
      title: art.title,
      series: art.series,
      price: art.price === null || art.price === undefined ? '' : String(art.price),
      image_file: null,
      category: art.category,
      year: art.year,
      dimensions: art.dimensions || 'Any size',
      status: art.status,
      story: art.story,
    });
  };

  const handleUpdateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingProductId) return;

    try {
      setCreateLoading(true);
      const saved = await apiService.updateGalleryProduct(editingProductId, editProduct);
      const savedArtwork = mapGalleryProduct(saved);
      markImageWorking(savedArtwork.id);
      setManagedArtworks((current) =>
        current.map((art) => (art.id === savedArtwork.id ? savedArtwork : art))
      );
      toast(`"${saved.title}" was updated.`, 'success');
      closeEditModal();
    } catch (err) {
      toast(parseApiError(err), 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProduct = async (art: Artwork) => {
    setConfirmDeleteArtwork(art);
  };

  const confirmAndDelete = async () => {
    if (!confirmDeleteArtwork) return;
    const art = confirmDeleteArtwork;
    setConfirmDeleteArtwork(null);

    try {
      setDeletingProductId(art.id);
      await apiService.deleteGalleryProduct(art.id);
      setManagedArtworks((current) => current.filter((item) => item.id !== art.id));
      toast(`"${art.title}" was deleted.`, 'success');
      if (editingProductId === art.id) closeEditModal();
    } catch (err) {
      toast(parseApiError(err), 'error');
    } finally {
      setDeletingProductId(null);
    }
  };

  const formatPrice = (price?: string | number | null) => {
    if (price === null || price === undefined || price === '') {
      return null;
    }

    const amount = Number(price);
    if (Number.isNaN(amount)) {
      return String(price);
    }

    return `RWF ${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  const handleAddToCart = async (art: Artwork) => {
    try {
      setAddingToCartId(art.id);
      if (isAuthenticated) {
        await apiService.addToCart({ gallery_product_id: Number(art.id), quantity: 1 });
        refreshCartCount();
      } else {
        await apiService.guestAddToCart({ gallery_product_id: Number(art.id), quantity: 1 });
        guestCartService.addItem({
          gallery_product_id: Number(art.id),
          product_title: art.title,
          product_price: art.price !== null && art.price !== undefined ? String(art.price) : '',
          product_image_url: art.image_url ?? null,
          product_status: art.status,
        });
        refreshGuestCart();
      }
      toast(`"${art.title}" added to cart.`, 'success');
    } catch (err) {
      toast(parseApiError(err), 'error');
    } finally {
      setAddingToCartId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 animate-fadeIn">
      {/* ================= GALLERY HEADER ================= */}
      <section className="rounded-2xl border border-sand-200/90 bg-gradient-to-b from-bone-50 via-white to-bone-100/60 p-5 sm:p-7 text-center shadow-sm">
        <div className="max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive-100/80 text-olive-800 text-[10px] font-semibold">
            <Palette className="w-3 h-3 text-terracotta" />
            <span>Kigali Studio Collections</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900 tracking-tight">
            Original Artworks & Studies
          </h1>

          <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
            Explorations in figurative painting, tactile impasto textures, luminous light symbolism, and authentic
            emotions of childhood. Created with acrylic paint and palette knives in Kigali, Rwanda.
          </p>
        </div>
      </section>

      {/* ================= CATEGORY FILTER TABS ================= */}

      {isAdmin && (
        <section className="bg-white rounded-2xl border border-sand-200/90 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 border border-olive-200 text-[10px] font-semibold">
                <Plus className="w-3 h-3 text-terracotta" />
                Admin Gallery Manager
              </span>
              <h2 className="text-lg font-serif font-bold text-midnight-900 mt-1">
                Gallery Products
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isProductFormOpen) {
                  resetProductForm();
                  setIsProductFormOpen(false);
                } else {
                  resetProductForm();
                  setIsProductFormOpen(true);
                }
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3 h-3" />
              <span>{isProductFormOpen ? 'Close Form' : 'Add New Product'}</span>
            </button>
          </div>

          {isProductFormOpen && (
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(event) => handleProductFieldChange('title', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="Artwork title"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Series</label>
                <input
                  type="text"
                  required
                  value={newProduct.series}
                  onChange={(event) => handleProductFieldChange('series', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="Collection or series"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Price (RWF)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={newProduct.price}
                  onChange={(event) => handleProductFieldChange('price', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="250000"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Year</label>
                <input
                  type="text"
                  required
                  value={newProduct.year}
                  onChange={(event) => handleProductFieldChange('year', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="2026"
                />
              </div>

              <div className="lg:col-span-7">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      handleProductFieldChange('image_file', file);
                      setNewImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                    className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 file:mr-3 file:border-0 file:rounded-lg file:bg-olive file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  />
                  {newImagePreview && (
                    <img
                      src={newImagePreview}
                      alt="Preview"
                      className="h-10 w-10 shrink-0 rounded-lg object-cover border border-sand-300 shadow-sm"
                    />
                  )}
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(event) =>
                    handleProductFieldChange('category', event.target.value as GalleryCategory)
                  }
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                >
                  <option value="children">Children</option>
                  <option value="abstract">Abstract</option>
                  <option value="figurative">Figurative</option>
                  <option value="heritage">Heritage</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Status</label>
                <select
                  value={newProduct.status}
                  onChange={(event) =>
                    handleProductFieldChange('status', event.target.value as GalleryStatus)
                  }
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                >
                  <option value="Available">Available</option>
                  <option value="Private Collection">Private Collection</option>
                  <option value="Exhibition Feature">Exhibition Feature</option>
                </select>
              </div>

              <div className="lg:col-span-12">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Story</label>
                <textarea
                  required
                  rows={3}
                  value={newProduct.story}
                  onChange={(event) => handleProductFieldChange('story', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10 resize-y"
                  placeholder="Short artwork story or product description"
                />
              </div>

              <div className="lg:col-span-12 flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-60 text-white text-xs font-semibold shadow-md shadow-terracotta/20 transition"
                >
                  {createLoading ? <Save className="w-3.5 h-3.5 animate-pulse" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{createLoading ? 'Adding Product...' : 'Add Gallery Product'}</span>
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === 'all'
            ? 'bg-olive text-white shadow-sm font-semibold'
            : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
            }`}
        >
          All ({artworks.length})
        </button>

        <button
          onClick={() => setSelectedCategory('children')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === 'children'
            ? 'bg-olive text-white shadow-sm font-semibold'
            : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
            }`}
        >
          Children of Rwanda
        </button>

        <button
          onClick={() => setSelectedCategory('abstract')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === 'abstract'
            ? 'bg-olive text-white shadow-sm font-semibold'
            : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
            }`}
        >
          Luminous Abstracts
        </button>

        <button
          onClick={() => setSelectedCategory('figurative')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === 'figurative'
            ? 'bg-olive text-white shadow-sm font-semibold'
            : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
            }`}
        >
          TBRI & Safe Spaces
        </button>

        <button
          onClick={() => setSelectedCategory('heritage')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === 'heritage'
            ? 'bg-olive text-white shadow-sm font-semibold'
            : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
            }`}
        >
          Heritage & Origins
        </button>
      </div>

      {/* ================= ARTWORKS DISPLAY ================= */}
      {filteredArtworks.length > 0 ? (
        isAdmin ? (
          <div className="overflow-hidden rounded-xl border border-sand-200/90 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sand-200 text-left text-xs">
                <thead className="bg-bone-50 text-[10px] uppercase tracking-wider text-brown-600">
                  <tr>
                    <th className="px-3 py-2 font-bold">Photo</th>
                    <th className="px-3 py-2 font-bold">Product</th>
                    <th className="px-3 py-2 font-bold">Category</th>
                    <th className="px-3 py-2 font-bold">Year</th>
                    <th className="px-3 py-2 font-bold">Price</th>
                    <th className="px-3 py-2 font-bold">Status</th>
                    <th className="px-3 py-2 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {filteredArtworks.map((art) => (
                    <tr key={art.id} className="hover:bg-bone-50/70 transition">
                      <td className="px-3 py-2">
                        <div className="h-11 w-11 overflow-hidden rounded-md border border-sand-300 bg-bone-100 flex items-center justify-center">
                          {art.image_url && !brokenImageIds[art.id] ? (
                            <img
                              src={art.image_url}
                              alt={art.title}
                              onError={() => markImageBroken(art.id)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className="h-full w-full flex flex-col items-center justify-center bg-sand-100 text-brown-400 p-0.5 text-center"
                              title="Image missing or expired - click Edit to re-upload"
                            >
                              <Palette className="w-3.5 h-3.5 text-terracotta" />
                              <span className="text-[7px] font-bold text-terracotta tracking-tight">
                                Re-upload
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="min-w-44">
                          <div className="font-serif text-xs font-bold text-midnight-900">{art.title}</div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-terracotta">
                            {art.series}
                          </div>
                          <p className="max-w-xs truncate text-[11px] text-brown-600">{art.story}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2 capitalize text-brown-700 text-xs">{art.category}</td>
                      <td className="px-3 py-2 font-mono font-bold text-olive text-xs">{art.year}</td>
                      <td className="px-3 py-2 font-bold text-midnight-900 text-xs">{formatPrice(art.price) ?? '-'}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${art.status === 'Available'
                            ? 'bg-olive-100 text-olive-800 border border-olive-300'
                            : art.status === 'Exhibition Feature'
                              ? 'bg-terracotta-100 text-terracotta border border-terracotta-300'
                              : 'bg-sand-200 text-brown-800 border border-sand-300'
                            }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => handleEditProduct(art)}
                            className="inline-flex items-center gap-1 rounded-md border border-sand-300 bg-white px-2 py-1 text-xs font-medium text-midnight-900 hover:bg-bone-100 transition"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(art)}
                            disabled={deletingProductId === art.id}
                            className="inline-flex items-center gap-1 rounded-md border border-terracotta-200 bg-terracotta-50 px-2 py-1 text-xs font-medium text-terracotta hover:bg-terracotta-100 disabled:opacity-60 transition"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>{deletingProductId === art.id ? '...' : 'Del'}</span>
                          </button>
                          <button
                            onClick={() => setActiveModalArtwork(art)}
                            className="inline-flex items-center gap-1 rounded-md border border-sand-300 bg-white px-2 py-1 text-xs font-medium text-olive hover:bg-bone-100 transition"
                          >
                            <Info className="h-3 w-3" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-xl border border-sand-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Artwork Visual Representation */}
                  <div className="h-44 bg-gradient-to-br from-bone-100 via-sand-200 to-bone-300 relative flex items-center justify-center p-4 overflow-hidden">
                    {art.image_url && !brokenImageIds[art.id] ? (
                      <img
                        src={art.image_url}
                        alt={art.title}
                        onError={() => markImageBroken(art.id)}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-bone-100 via-sand-100 to-bone-200">
                        <div className="w-10 h-10 rounded-xl bg-white/80 border border-sand-300 shadow-sm flex items-center justify-center mb-1.5">
                          <Palette className="w-5 h-5 text-terracotta" />
                        </div>
                        <h4 className="text-xs font-serif font-bold text-midnight-900 line-clamp-1">{art.title}</h4>
                        <span className="text-[9px] text-olive font-semibold uppercase tracking-wider mt-0.5">
                          {art.series}
                        </span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${art.status === 'Available'
                          ? 'bg-olive-100 text-olive-800 border border-olive-300'
                          : art.status === 'Exhibition Feature'
                            ? 'bg-terracotta-100 text-terracotta border border-terracotta-300'
                            : 'bg-sand-200 text-brown-800 border border-sand-300'
                          }`}
                      >
                        {art.status}
                      </span>
                    </div>

                    {/* Inspect Button */}
                    <button
                      onClick={() => setActiveModalArtwork(art)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-md bg-white/80 hover:bg-white text-midnight-900 shadow-sm transition"
                      title="View Artwork Details"
                    >
                      <Maximize2 className="w-3 h-3 text-brown-700" />
                    </button>
                  </div>

                  {/* Text Info — compact single block */}
                  <div className="px-3 py-2.5 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-bold text-terracotta tracking-wider leading-none">{art.series}</p>
                        <h3 className="text-xs font-serif font-bold text-midnight-900 truncate mt-0.5">{art.title}</h3>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-olive whitespace-nowrap">{formatPrice(art.price) ?? ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-brown-500">
                      <span className="font-mono font-bold text-olive-700">{art.year}</span>
                      <span>·</span>
                      <span className="capitalize">{art.category}</span>
                      <span>·</span>
                      <span className="truncate italic">{art.story}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-3.5 pb-3 pt-2 border-t border-sand-200 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => setActiveModalArtwork(art)}
                    className="font-semibold text-olive hover:text-olive-700 transition flex items-center gap-1 text-[11px]"
                  >
                    <Info className="w-3 h-3" />
                    <span>Details</span>
                  </button>

                  {art.status === 'Available' && (
                    <button
                      onClick={() => handleAddToCart(art)}
                      disabled={addingToCartId === art.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-olive hover:bg-olive-600 disabled:opacity-60 text-white text-[11px] font-semibold shadow-sm transition"
                    >
                      {addingToCartId === art.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-3 h-3" />
                      )}
                      <span>{addingToCartId === art.id ? 'Adding…' : 'Add to Cart'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('contact')}
                    className="font-semibold text-terracotta hover:text-terracotta-700 transition flex items-center gap-1 text-[11px]"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-sand-300 bg-white p-6 text-center shadow-sm">
          <p className="text-xs font-semibold text-midnight-900">No gallery products yet.</p>
          <p className="mt-1 text-[11px] text-brown-600">
            Products added by an admin will appear here.
          </p>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {editingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-sand-200/90 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-xl relative">
            <button
              onClick={closeEditModal}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-brown-600 hover:bg-bone-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-0.5 pr-8">
              <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">
                Edit Product
              </span>
              <h2 className="text-xl font-serif font-bold text-midnight-900">
                {editingProductTitle}
              </h2>
              <p className="text-[11px] text-brown-600">
                Choose a new image only if you want to replace the current one.
              </p>
            </div>

            <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editProduct.title}
                  onChange={(event) => handleEditProductFieldChange('title', event.target.value)}
                  className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive"
                  placeholder="Artwork title"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Series</label>
                <input
                  type="text"
                  required
                  value={editProduct.series}
                  onChange={(event) => handleEditProductFieldChange('series', event.target.value)}
                  className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive"
                  placeholder="Collection or series"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Price (RWF)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={editProduct.price}
                  onChange={(event) => handleEditProductFieldChange('price', event.target.value)}
                  className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive"
                  placeholder="250000"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Year</label>
                <input
                  type="text"
                  required
                  value={editProduct.year}
                  onChange={(event) => handleEditProductFieldChange('year', event.target.value)}
                  className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive"
                  placeholder="2026"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Status</label>
                <select
                  value={editProduct.status}
                  onChange={(event) =>
                    handleEditProductFieldChange('status', event.target.value as GalleryStatus)
                  }
                  className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 focus:outline-none focus:border-olive"
                >
                  <option value="Available">Available</option>
                  <option value="Private Collection">Private Collection</option>
                  <option value="Exhibition Feature">Exhibition Feature</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Replace Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      handleEditProductFieldChange('image_file', file);
                      setEditImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                    className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 file:mr-2 file:border-0 file:rounded file:bg-olive file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-white"
                  />
                  {editImagePreview && (
                    <img
                      src={editImagePreview}
                      alt="New preview"
                      className="h-8 w-8 shrink-0 rounded-md object-cover border border-sand-300"
                    />
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Category</label>
                <select
                  value={editProduct.category}
                  onChange={(event) =>
                    handleEditProductFieldChange('category', event.target.value as GalleryCategory)
                  }
                  className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 focus:outline-none focus:border-olive"
                >
                  <option value="children">Children</option>
                  <option value="abstract">Abstract</option>
                  <option value="figurative">Figurative</option>
                  <option value="heritage">Heritage</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Size</label>
                <input
                  type="text"
                  value={editProduct.dimensions}
                  onChange={(event) => handleEditProductFieldChange('dimensions', event.target.value)}
                  className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive"
                  placeholder="Any size"
                />
              </div>

              <div className="sm:col-span-12">
                <label className="block text-[10px] font-semibold text-brown-700 mb-1">Story</label>
                <textarea
                  required
                  rows={3}
                  value={editProduct.story}
                  onChange={(event) => handleEditProductFieldChange('story', event.target.value)}
                  className="w-full px-2.5 py-1.5 bg-bone-50 border border-sand-300 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive resize-y"
                  placeholder="Short artwork story or product description"
                />
              </div>

              <div className="sm:col-span-12 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2 border-t border-sand-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-sand-300 bg-white text-xs font-semibold text-brown-700 hover:bg-bone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-600 disabled:opacity-60 text-white text-xs font-semibold shadow-sm transition"
                >
                  <Save className={`w-3.5 h-3.5 ${createLoading ? 'animate-pulse' : ''}`} />
                  <span>{createLoading ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ARTWORK DETAIL MODAL ================= */}
      {activeModalArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-sand-200/90 max-w-md w-full p-5 space-y-4 shadow-xl relative">
            <button
              onClick={() => setActiveModalArtwork(null)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-brown-600 hover:bg-bone-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pr-6">
              <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">
                {activeModalArtwork.series}
              </span>
              <h2 className="text-xl font-serif font-bold text-midnight-900">
                {activeModalArtwork.title}
              </h2>
              <p className="text-[11px] text-brown-600 italic font-serif">
                {activeModalArtwork.dimensions} ({activeModalArtwork.year})
              </p>
              {formatPrice(activeModalArtwork.price) && (
                <p className="text-sm font-bold text-olive">{formatPrice(activeModalArtwork.price)}</p>
              )}
            </div>

            {activeModalArtwork.image_url && !brokenImageIds[activeModalArtwork.id] ? (
              <img
                src={activeModalArtwork.image_url}
                alt={activeModalArtwork.title}
                onError={() => markImageBroken(activeModalArtwork.id)}
                className="h-48 w-full rounded-xl object-cover border border-sand-300"
              />
            ) : (
              <div className="h-48 w-full rounded-xl border border-sand-300 bg-gradient-to-br from-bone-100 via-sand-100 to-bone-200 flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-white/80 border border-sand-300 shadow-sm flex items-center justify-center mb-2">
                  <Palette className="w-6 h-6 text-terracotta" />
                </div>
                <h3 className="text-sm font-serif font-bold text-midnight-900">{activeModalArtwork.title}</h3>
                <span className="text-[10px] text-olive font-semibold uppercase tracking-wider mt-0.5">{activeModalArtwork.series}</span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-bone-50 border border-sand-200 space-y-1">
              <span className="text-[10px] font-bold text-olive uppercase tracking-wider">
                Artist Commentary
              </span>
              <p className="text-xs text-brown-800 leading-relaxed font-serif italic">
                “{activeModalArtwork.story}”
              </p>
            </div>

            <div className="flex items-center justify-end text-xs text-brown-700">
              <span className="font-semibold text-olive text-[11px]">{activeModalArtwork.status}</span>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-sand-200">
              <button
                onClick={() => setActiveModalArtwork(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brown-700 hover:bg-bone-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModalArtwork(null);
                  onNavigate('contact');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-terracotta hover:bg-terracotta-600 text-white shadow-sm transition"
              >
                Inquire About Piece
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM DIALOG ================= */}
      {confirmDeleteArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-sand-200/90 w-full max-w-sm p-6 shadow-2xl space-y-5">
            {/* Icon + heading */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-midnight-900">Delete Artwork?</h2>
                <p className="text-xs text-brown-600 mt-1 leading-relaxed">
                  You're about to permanently delete{' '}
                  <span className="font-semibold text-midnight-900">"{confirmDeleteArtwork.title}"</span>.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Artwork preview strip */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-bone-50 border border-sand-200">
              <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-bone-100 border border-sand-300">
                {confirmDeleteArtwork.image_url && !brokenImageIds[confirmDeleteArtwork.id] ? (
                  <img
                    src={confirmDeleteArtwork.image_url}
                    alt={confirmDeleteArtwork.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="w-5 h-5 text-terracotta" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-serif font-bold text-midnight-900 truncate">{confirmDeleteArtwork.title}</p>
                <p className="text-[10px] text-terracotta font-semibold uppercase tracking-wider truncate">{confirmDeleteArtwork.series}</p>
                <p className="text-[10px] text-brown-500">{confirmDeleteArtwork.year} · {confirmDeleteArtwork.category}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmDeleteArtwork(null)}
                className="flex-1 py-2.5 rounded-xl border border-sand-300 bg-white hover:bg-bone-100 text-midnight-900 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDelete}
                className="flex-1 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-sm transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
