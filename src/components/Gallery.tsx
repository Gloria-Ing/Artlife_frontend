import React, { useEffect, useState } from 'react';
import type { NavTab } from './Navbar';
import type { GalleryCategory, GalleryProductCreate, GalleryStatus } from '../types/api';
import { apiService, parseApiError } from '../services/api';
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
} from 'lucide-react';

interface Artwork {
  id: string | number;
  title: string;
  series: string;
  price?: string | number | null;
  image_url?: string | null;
  category: GalleryCategory;
  year: string;
  medium: string;
  dimensions: string;
  status: GalleryStatus;
  story: string;
  colors: string[];
}

const EMPTY_PRODUCT: GalleryProductCreate = {
  title: '',
  series: '',
  price: '',
  image_url: '',
  category: 'children',
  year: new Date().getFullYear().toString(),
  medium: '',
  dimensions: '',
  status: 'Available',
  story: '',
  colors: ['#111111', '#6C705B', '#A56A4F', '#D8C8B4'],
};

const ARTWORKS: Artwork[] = [
  {
    id: 'art-1',
    title: 'Gleam of Innocence',
    series: 'Children of Rwanda',
    category: 'children',
    year: '2025',
    medium: 'Acrylic & Palette Knife on Canvas',
    dimensions: '120 × 90 cm',
    status: 'Available',
    story: 'Capturing moments when children are simply being themselves—playing, laughing, and exploring without thinking about how they are being seen.',
    colors: ['#111111', '#6C705B', '#A56A4F', '#D8C8B4'],
  },
  {
    id: 'art-2',
    title: 'Light Behind the Shadow',
    series: 'Hope & Resilience',
    category: 'abstract',
    year: '2024',
    medium: 'Acrylic Impasto & Palette Knife',
    dimensions: '100 × 100 cm',
    status: 'Exhibition Feature',
    story: 'Luminous colors as a symbol of hope. Using light to represent the possibility and potential within children even in difficult circumstances.',
    colors: ['#6C705B', '#D8C8B4', '#F5F2EA', '#725742'],
  },
  {
    id: 'art-3',
    title: 'The Father’s Portrait',
    series: 'Origins & Heritage',
    category: 'heritage',
    year: '2023',
    medium: 'Acrylic on Heavy Cotton Canvas',
    dimensions: '110 × 85 cm',
    status: 'Private Collection',
    story: 'A tribute to the very first painting Cedrick made of his father, which inspired the founding of his permanent Kigali studio.',
    colors: ['#111111', '#725742', '#A56A4F', '#F5F2EA'],
  },
  {
    id: 'art-4',
    title: 'Echoes of Play',
    series: 'Children of Rwanda',
    category: 'children',
    year: '2025',
    medium: 'Acrylic, Ink & Texture Paste',
    dimensions: '90 × 75 cm',
    status: 'Available',
    story: 'Dynamic palette knife strokes evoking the kinetic movement, laughter, and camaraderie of Kigali youth at play.',
    colors: ['#A56A4F', '#6C705B', '#D8C8B4', '#111111'],
  },
  {
    id: 'art-5',
    title: 'Beyond What Words Can Say',
    series: 'Abstract Emotion',
    category: 'abstract',
    year: '2024',
    medium: 'Acrylic Mixed Media on Canvas',
    dimensions: '140 × 110 cm',
    status: 'Available',
    story: '“Not everything we feel can be explained through a face... Sometimes a color, a texture, or a mark speaks where language fails.”',
    colors: ['#6C705B', '#725742', '#A56A4F', '#D8C8B4'],
  },
  {
    id: 'art-6',
    title: 'Sanctuary of Imagination',
    series: 'TBRI Creative Spaces',
    category: 'figurative',
    year: '2024',
    medium: 'Acrylic & Brushwork with Impasto',
    dimensions: '95 × 80 cm',
    status: 'Exhibition Feature',
    story: 'Inspired by the safe creative spaces fostered at the Gisimba After School programs, where children express dreams without hesitation.',
    colors: ['#111111', '#A56A4F', '#6C705B', '#F5F2EA'],
  },
];

interface GalleryProps {
  onNavigate: (tab: NavTab) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalArtwork, setActiveModalArtwork] = useState<Artwork | null>(null);
  const [managedArtworks, setManagedArtworks] = useState<Artwork[]>([]);
  const [newProduct, setNewProduct] = useState<GalleryProductCreate>(EMPTY_PRODUCT);
  const [colorText, setColorText] = useState(EMPTY_PRODUCT.colors.join(', '));
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const artworks = managedArtworks.length > 0 ? managedArtworks : ARTWORKS;

  useEffect(() => {
    let mounted = true;

    apiService
      .getGalleryProducts()
      .then((products) => {
        if (!mounted) return;
        setManagedArtworks(
          products.map((product) => ({
            id: product.id,
            title: product.title,
            series: product.series,
            price: product.price,
            image_url: product.image_url,
            category: product.category,
            year: product.year,
            medium: product.medium,
            dimensions: product.dimensions,
            status: product.status,
            story: product.story,
            colors: product.colors,
          }))
        );
      })
      .catch(() => {
        // Keep the static gallery visible if the backend endpoint is not deployed yet.
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

  const resetProductForm = () => {
    setNewProduct(EMPTY_PRODUCT);
    setColorText(EMPTY_PRODUCT.colors.join(', '));
  };

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    const colors = colorText
      .split(',')
      .map((color) => color.trim())
      .filter(Boolean);

    if (colors.length === 0) {
      setCreateError('Please add at least one palette color.');
      return;
    }

    try {
      setCreateLoading(true);
      const created = await apiService.createGalleryProduct({
        ...newProduct,
        colors,
      });

      setManagedArtworks((current) => [
        {
          id: created.id,
          title: created.title,
          series: created.series,
          price: created.price,
          image_url: created.image_url,
          category: created.category,
          year: created.year,
          medium: created.medium,
          dimensions: created.dimensions,
          status: created.status,
          story: created.story,
          colors: created.colors,
        },
        ...current,
      ]);
      setCreateSuccess(`${created.title} was added to the gallery.`);
      resetProductForm();
      setIsProductFormOpen(false);
    } catch (err) {
      setCreateError(parseApiError(err));
    } finally {
      setCreateLoading(false);
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

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount);
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
              onClick={() => setIsProductFormOpen((open) => !open)}
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
              <label className="block text-[11px] font-semibold text-brown-700 mb-1">Price</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={newProduct.price}
                onChange={(event) => handleProductFieldChange('price', event.target.value)}
                className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                placeholder="1250.00"
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

            <div className="lg:col-span-6">
              <label className="block text-[11px] font-semibold text-brown-700 mb-1">Image URL</label>
              <input
                type="url"
                required
                value={newProduct.image_url}
                onChange={(event) => handleProductFieldChange('image_url', event.target.value)}
                className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                placeholder="https://example.com/artwork.jpg"
              />
            </div>

            <div className="lg:col-span-2">
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

            <div className="lg:col-span-4">
              <label className="block text-[11px] font-semibold text-brown-700 mb-1">Medium</label>
              <input
                type="text"
                required
                value={newProduct.medium}
                onChange={(event) => handleProductFieldChange('medium', event.target.value)}
                className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                placeholder="Acrylic on canvas"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-[11px] font-semibold text-brown-700 mb-1">Dimensions</label>
              <input
                type="text"
                required
                value={newProduct.dimensions}
                onChange={(event) => handleProductFieldChange('dimensions', event.target.value)}
                className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                placeholder="100 x 80 cm"
              />
            </div>

            <div className="lg:col-span-3">
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

            <div className="lg:col-span-2">
              <label className="block text-[11px] font-semibold text-brown-700 mb-1">Palette</label>
              <input
                type="text"
                required
                value={colorText}
                onChange={(event) => setColorText(event.target.value)}
                className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                placeholder="#111111, #6C705B"
              />
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

            <div className="lg:col-span-12 flex justify-end">
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

      {/* ================= ARTWORKS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredArtworks.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Artwork Visual Representation */}
              <div className="h-64 bg-gradient-to-br from-bone-100 via-sand-200 to-bone-300 relative flex items-center justify-center p-6 overflow-hidden">
                {art.image_url ? (
                  <img
                    src={art.image_url}
                    alt={art.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6C705B_1px,transparent_1px)] [background-size:16px_16px]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/35 via-transparent to-white/10" />

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
                  className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 hover:bg-white text-midnight-900 shadow-sm transition"
                  title="View Artwork Details"
                >
                  <Maximize2 className="w-4 h-4 text-brown-700" />
                </button>

                {/* Title Card Canvas */}
                <div className="relative z-10 text-center space-y-2 p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-sand-300 shadow-sm max-w-[85%] transform group-hover:scale-102 transition-transform">
                  <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">
                    {art.series}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-midnight-900">{art.title}</h3>
                  <p className="text-xs text-brown-600 italic font-serif">{art.medium}</p>
                  {formatPrice(art.price) && (
                    <p className="text-sm font-bold text-olive">{formatPrice(art.price)}</p>
                  )}
                </div>

                {/* Swatch dots */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                  {art.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-brown-600 font-medium">
                  <span className="font-mono text-olive font-bold">{art.year}</span>
                  <span className="font-mono text-[11px] text-brown-600">{art.dimensions}</span>
                </div>
                {formatPrice(art.price) && (
                  <div className="text-sm font-bold text-midnight-900">{formatPrice(art.price)}</div>
                )}
                <p className="text-xs text-brown-700 leading-relaxed line-clamp-3">{art.story}</p>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="px-6 pb-6 pt-3 border-t border-sand-200 flex items-center justify-between text-xs">
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
                {activeModalArtwork.medium} • {activeModalArtwork.dimensions} ({activeModalArtwork.year})
              </p>
              {formatPrice(activeModalArtwork.price) && (
                <p className="text-lg font-bold text-olive">{formatPrice(activeModalArtwork.price)}</p>
              )}
            </div>

            {activeModalArtwork.image_url && (
              <img
                src={activeModalArtwork.image_url}
                alt={activeModalArtwork.title}
                className="h-64 w-full rounded-2xl object-cover border border-sand-300"
              />
            )}

            <div className="p-4 rounded-xl bg-bone-100 border border-sand-300 space-y-2">
              <span className="text-[11px] font-bold text-olive uppercase tracking-wider">
                Artist Commentary
              </span>
              <p className="text-sm text-brown-800 leading-relaxed font-serif italic">
                “{activeModalArtwork.story}”
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-brown-700">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Palette:</span>
                <div className="flex items-center space-x-1.5">
                  {activeModalArtwork.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-sand-300 shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
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
