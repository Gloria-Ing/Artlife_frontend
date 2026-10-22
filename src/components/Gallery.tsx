import React, { useEffect, useState } from 'react';
import type { NavTab } from './Navbar';
import type { GalleryCategory, GalleryProductCreate, GalleryStatus } from '../types/api';
import { apiService, getStoredBaseUrl, parseApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalArtwork, setActiveModalArtwork] = useState<Artwork | null>(null);
  const [managedArtworks, setManagedArtworks] = useState<Artwork[]>([]);
  const [newProduct, setNewProduct] = useState<GalleryProductCreate>(EMPTY_PRODUCT);
  const [editProduct, setEditProduct] = useState<GalleryProductCreate>(EMPTY_PRODUCT);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [editingProductTitle, setEditingProductTitle] = useState('');
  const [deletingProductId, setDeletingProductId] = useState<string | number | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string | number, boolean>>({});
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

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
    setCreateError(null);
    setCreateSuccess(null);

    if (!newProduct.image_file) {
      setCreateError('Please choose an image from your computer.');
      return;
    }

    try {
      setCreateLoading(true);
      const saved = await apiService.createGalleryProduct({
        ...newProduct,
      });

      const savedArtwork = mapGalleryProduct(saved);
      setManagedArtworks((current) => [savedArtwork, ...current]);
      setCreateSuccess(`${saved.title} was added to the gallery.`);
      resetProductForm();
      setIsProductFormOpen(false);
    } catch (err) {
      setCreateError(parseApiError(err));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditProduct = (art: Artwork) => {
    setCreateError(null);
    setCreateSuccess(null);
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

    setCreateError(null);
    setCreateSuccess(null);

    try {
      setCreateLoading(true);
      const saved = await apiService.updateGalleryProduct(editingProductId, editProduct);
      const savedArtwork = mapGalleryProduct(saved);
      markImageWorking(savedArtwork.id);
      setManagedArtworks((current) =>
        current.map((art) => (art.id === savedArtwork.id ? savedArtwork : art))
      );
      setCreateSuccess(`${saved.title} was updated.`);
      closeEditModal();
    } catch (err) {
      setCreateError(parseApiError(err));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProduct = async (art: Artwork) => {
    const confirmed = window.confirm(`Delete "${art.title}" from the gallery?`);
    if (!confirmed) return;

    setCreateError(null);
    setCreateSuccess(null);

    try {
      setDeletingProductId(art.id);
      await apiService.deleteGalleryProduct(art.id);
      setManagedArtworks((current) => current.filter((item) => item.id !== art.id));
      setCreateSuccess(`${art.title} was deleted.`);
      if (editingProductId === art.id) {
        closeEditModal();
      }
    } catch (err) {
      setCreateError(parseApiError(err));
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

  return (
    <div className="space-y-12 pb-16 animate-fadeIn">
      {/* ================= GALLERY HEADER ================= */}
      <section className="rounded-3xl border border-sand-300 bg-gradient-to-b from-bone-50 via-white to-bone-100 p-8 sm:p-12 text-center shadow-sm">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive-100 text-olive-800 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5 text-terracotta" />
            <span>Kigali Studio Collections</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-midnight-900 tracking-tight">
            Original Artworks & Studies
          </h1>

          <p className="text-sm sm:text-base text-brown-700 leading-relaxed">
            Explorations in figurative painting, tactile impasto textures, luminous light symbolism, and authentic
            emotions of childhood. Created with acrylic paint and palette knives in Kigali, Rwanda.
          </p>
        </div>
      </section>

      {/* ================= CATEGORY FILTER TABS ================= */}
      {isAdmin && (
        <section className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-100 text-olive-800 border border-olive-300 text-xs font-semibold">
                <Plus className="w-3.5 h-3.5 text-terracotta" />
                Admin Gallery Manager
              </span>
              <h2 className="text-2xl font-serif font-bold text-midnight-900 mt-3">
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
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-md shadow-terracotta/20 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isProductFormOpen ? 'Close Form' : 'Add New Product'}</span>
            </button>
          </div>

          {createError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{createError}</span>
            </div>
          )}

          {createSuccess && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-olive-50 border border-olive-200 text-olive-800 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{createSuccess}</span>
            </div>
          )}

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

      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-olive text-white shadow-sm'
              : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
          }`}
        >
          All Collections ({artworks.length})
        </button>

        <button
          onClick={() => setSelectedCategory('children')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'children'
              ? 'bg-olive text-white shadow-sm'
              : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
          }`}
        >
          Children of Rwanda Series
        </button>

        <button
          onClick={() => setSelectedCategory('abstract')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'abstract'
              ? 'bg-olive text-white shadow-sm'
              : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
          }`}
        >
          Light & Luminous Abstracts
        </button>

        <button
          onClick={() => setSelectedCategory('figurative')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'figurative'
              ? 'bg-olive text-white shadow-sm'
              : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
          }`}
        >
          TBRI & Safe Spaces
        </button>

        <button
          onClick={() => setSelectedCategory('heritage')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'heritage'
              ? 'bg-olive text-white shadow-sm'
              : 'bg-white text-brown-700 hover:bg-bone-100 border border-sand-300'
          }`}
        >
          Heritage & Origins
        </button>
      </div>

      {/* ================= ARTWORKS DISPLAY ================= */}
      {filteredArtworks.length > 0 ? (
        isAdmin ? (
          <div className="overflow-hidden rounded-2xl border border-sand-300 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sand-200 text-left text-xs">
                <thead className="bg-bone-100 text-[11px] uppercase tracking-wider text-brown-700">
                  <tr>
                    <th className="px-4 py-3 font-bold">Photo</th>
                    <th className="px-4 py-3 font-bold">Product</th>
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Year</th>
                    <th className="px-4 py-3 font-bold">Price</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {filteredArtworks.map((art) => (
                    <tr key={art.id} className="hover:bg-bone-50 transition">
                      <td className="px-4 py-3">
                        <div className="h-14 w-14 overflow-hidden rounded-lg border border-sand-300 bg-bone-100 flex items-center justify-center">
                          {art.image_url && !brokenImageIds[art.id] ? (
                            <img
                              src={art.image_url}
                              alt={art.title}
                              onError={() => markImageBroken(art.id)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className="h-full w-full flex flex-col items-center justify-center bg-sand-100 text-brown-400 p-1 text-center"
                              title="Image missing or expired - click Edit to re-upload"
                            >
                              <Palette className="w-4 h-4 text-terracotta" />
                              <span className="text-[8px] font-bold text-terracotta tracking-tight mt-0.5">
                                Re-upload
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-48">
                          <div className="font-serif text-sm font-bold text-midnight-900">{art.title}</div>
                          <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-terracotta">
                            {art.series}
                          </div>
                          <p className="mt-1 max-w-xs truncate text-brown-700">{art.story}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-brown-700">{art.category}</td>
                      <td className="px-4 py-3 font-mono font-bold text-olive">{art.year}</td>
                      <td className="px-4 py-3 font-bold text-midnight-900">{formatPrice(art.price) ?? '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            art.status === 'Available'
                              ? 'bg-olive-100 text-olive-800 border border-olive-300'
                              : art.status === 'Exhibition Feature'
                              ? 'bg-terracotta-100 text-terracotta border border-terracotta-300'
                              : 'bg-sand-200 text-brown-800 border border-sand-300'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(art)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-sand-300 bg-white px-3 py-2 font-semibold text-midnight-900 hover:bg-bone-100 transition"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(art)}
                            disabled={deletingProductId === art.id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-terracotta-200 bg-terracotta-50 px-3 py-2 font-semibold text-terracotta hover:bg-terracotta-100 disabled:opacity-60 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{deletingProductId === art.id ? 'Deleting...' : 'Delete'}</span>
                          </button>
                        <button
                          onClick={() => setActiveModalArtwork(art)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-sand-300 bg-white px-3 py-2 font-semibold text-olive hover:bg-bone-100 transition"
                        >
                          <Info className="h-3.5 w-3.5" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Artwork Visual Representation */}
                  <div className="h-52 bg-gradient-to-br from-bone-100 via-sand-200 to-bone-300 relative flex items-center justify-center p-5 overflow-hidden">
                    {art.image_url && !brokenImageIds[art.id] ? (
                      <img
                        src={art.image_url}
                        alt={art.title}
                        onError={() => markImageBroken(art.id)}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-bone-100 via-sand-100 to-bone-200">
                        <div className="w-12 h-12 rounded-2xl bg-white/80 border border-sand-300 shadow-sm flex items-center justify-center mb-2">
                          <Palette className="w-6 h-6 text-terracotta" />
                        </div>
                        <h4 className="text-sm font-serif font-bold text-midnight-900 line-clamp-1">{art.title}</h4>
                        <span className="text-[10px] text-olive font-semibold uppercase tracking-wider mt-0.5">
                          {art.series}
                        </span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          art.status === 'Available'
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
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 hover:bg-white text-midnight-900 shadow-sm transition"
                      title="View Artwork Details"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-brown-700" />
                    </button>
                  </div>

                  {/* Text Info */}
                  <div className="p-4 space-y-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">
                        {art.series}
                      </span>
                      <h3 className="text-base font-serif font-bold text-midnight-900">{art.title}</h3>
                      {formatPrice(art.price) && (
                        <p className="text-sm font-bold text-olive">{formatPrice(art.price)}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-brown-600 font-medium">
                      <span className="font-mono text-olive font-bold">{art.year}</span>
                    </div>
                    <p className="text-xs text-brown-700 leading-relaxed line-clamp-2">{art.story}</p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-4 pb-4 pt-3 border-t border-sand-200 flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => setActiveModalArtwork(art)}
                    className="font-semibold text-olive hover:text-olive-700 transition flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Story & Details</span>
                  </button>

                  <button
                    onClick={() => onNavigate('contact')}
                    className="font-semibold text-terracotta hover:text-terracotta-700 transition flex items-center gap-1"
                  >
                    <span>Acquire / Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-dashed border-sand-300 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-midnight-900">No gallery products yet.</p>
          <p className="mt-2 text-xs text-brown-700">
            Products added by an admin will appear here.
          </p>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {editingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-sand-300 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 p-2 rounded-full text-brown-600 hover:bg-bone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-10">
              <span className="text-xs uppercase font-bold text-terracotta tracking-wider">
                Edit Product
              </span>
              <h2 className="text-2xl font-serif font-bold text-midnight-900">
                {editingProductTitle}
              </h2>
              <p className="text-xs text-brown-700">
                Choose a new image only if you want to replace the current one.
              </p>
            </div>

            <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editProduct.title}
                  onChange={(event) => handleEditProductFieldChange('title', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="Artwork title"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Series</label>
                <input
                  type="text"
                  required
                  value={editProduct.series}
                  onChange={(event) => handleEditProductFieldChange('series', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="Collection or series"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Price (RWF)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={editProduct.price}
                  onChange={(event) => handleEditProductFieldChange('price', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="250000"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Year</label>
                <input
                  type="text"
                  required
                  value={editProduct.year}
                  onChange={(event) => handleEditProductFieldChange('year', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="2026"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Status</label>
                <select
                  value={editProduct.status}
                  onChange={(event) =>
                    handleEditProductFieldChange('status', event.target.value as GalleryStatus)
                  }
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                >
                  <option value="Available">Available</option>
                  <option value="Private Collection">Private Collection</option>
                  <option value="Exhibition Feature">Exhibition Feature</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Replace Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      handleEditProductFieldChange('image_file', file);
                      setEditImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                    className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 file:mr-3 file:border-0 file:rounded-lg file:bg-olive file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  />
                  {editImagePreview && (
                    <img
                      src={editImagePreview}
                      alt="New preview"
                      className="h-10 w-10 shrink-0 rounded-lg object-cover border border-sand-300 shadow-sm"
                    />
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Category</label>
                <select
                  value={editProduct.category}
                  onChange={(event) =>
                    handleEditProductFieldChange('category', event.target.value as GalleryCategory)
                  }
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                >
                  <option value="children">Children</option>
                  <option value="abstract">Abstract</option>
                  <option value="figurative">Figurative</option>
                  <option value="heritage">Heritage</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Size</label>
                <input
                  type="text"
                  value={editProduct.dimensions}
                  onChange={(event) => handleEditProductFieldChange('dimensions', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  placeholder="Any size"
                />
              </div>

              <div className="sm:col-span-12">
                <label className="block text-[11px] font-semibold text-brown-700 mb-1">Story</label>
                <textarea
                  required
                  rows={4}
                  value={editProduct.story}
                  onChange={(event) => handleEditProductFieldChange('story', event.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10 resize-y"
                  placeholder="Short artwork story or product description"
                />
              </div>

              <div className="sm:col-span-12 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 border-t border-sand-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-sand-300 bg-white text-xs font-semibold text-brown-700 hover:bg-bone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-60 text-white text-xs font-semibold shadow-md shadow-terracotta/20 transition"
                >
                  <Save className={`w-3.5 h-3.5 ${createLoading ? 'animate-pulse' : ''}`} />
                  <span>{createLoading ? 'Saving Product...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ARTWORK DETAIL MODAL ================= */}
      {activeModalArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-sand-300 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModalArtwork(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-brown-600 hover:bg-bone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-terracotta tracking-wider">
                {activeModalArtwork.series}
              </span>
              <h2 className="text-2xl font-serif font-bold text-midnight-900">
                {activeModalArtwork.title}
              </h2>
              <p className="text-xs text-brown-600 italic font-serif">
                {activeModalArtwork.dimensions} ({activeModalArtwork.year})
              </p>
              {formatPrice(activeModalArtwork.price) && (
                <p className="text-lg font-bold text-olive">{formatPrice(activeModalArtwork.price)}</p>
              )}
            </div>

            {activeModalArtwork.image_url && !brokenImageIds[activeModalArtwork.id] ? (
              <img
                src={activeModalArtwork.image_url}
                alt={activeModalArtwork.title}
                onError={() => markImageBroken(activeModalArtwork.id)}
                className="h-64 w-full rounded-2xl object-cover border border-sand-300"
              />
            ) : (
              <div className="h-64 w-full rounded-2xl border border-sand-300 bg-gradient-to-br from-bone-100 via-sand-100 to-bone-200 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-white/80 border border-sand-300 shadow-sm flex items-center justify-center mb-3">
                  <Palette className="w-8 h-8 text-terracotta" />
                </div>
                <h3 className="text-base font-serif font-bold text-midnight-900">{activeModalArtwork.title}</h3>
                <span className="text-xs text-olive font-semibold uppercase tracking-wider mt-1">{activeModalArtwork.series}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-bone-100 border border-sand-300 space-y-2">
              <span className="text-[11px] font-bold text-olive uppercase tracking-wider">
                Artist Commentary
              </span>
              <p className="text-sm text-brown-800 leading-relaxed font-serif italic">
                “{activeModalArtwork.story}”
              </p>
            </div>

            <div className="flex items-center justify-end text-xs text-brown-700">
              <span className="font-semibold text-olive">{activeModalArtwork.status}</span>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-sand-200">
              <button
                onClick={() => setActiveModalArtwork(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brown-700 hover:bg-bone-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModalArtwork(null);
                  onNavigate('contact');
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-terracotta hover:bg-terracotta-600 text-white shadow-md transition"
              >
                Inquire About Piece
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
