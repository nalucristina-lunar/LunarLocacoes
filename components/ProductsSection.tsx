'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/context/WhatsAppContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

// ── Tipos ──────────────────────────────────────────────────────────────────
export interface Product {
    id: string;
    name: string;
    description: string;
    available: boolean;
    rentalPeriod: string;
    images: string[];
    categoryId?: string | null;
    category?: {
        id: string;
        name: string;
    } | null;
    tags?: string | null;
}

interface Category {
    id: string;
    name: string;
}

interface ProductsSectionProps {
    initialProducts: Product[];
    categories: Category[];
}

// ── Ícones das Categorias (SVG) ───────────────────────────────────────────
function CategoryIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
    const props = { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

    const lowerName = name.toLowerCase();

    // Mapeamento dinâmico por palavras-chave (Sincronizado com Seed)
    if (lowerName === 'todos') {
        return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    }
    if (lowerName.includes('mobil') || lowerName.includes('cadeira') || lowerName.includes('mesa')) {
        return <svg {...props}><path d="M5 11V6a2 2 0 012-2h10a2 2 0 012 2v5" /><path d="M3 11h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" /><path d="M7 15v4M17 15v4" /></svg>;
    }
    if (lowerName.includes('ilumina') || lowerName.includes('lamp') || lowerName.includes('led') || lowerName.includes('refletor')) {
        return <svg {...props}><path d="M12 2a7 7 0 015 11.9V17a1 1 0 01-1 1H8a1 1 0 01-1-1v-3.1A7 7 0 0112 2z" /><path d="M9 21h6" /></svg>;
    }
    if (lowerName.includes('decor') || lowerName.includes('festa') || lowerName.includes('eventos')) {
        return <svg {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M8 12s1.5-2 4-2 4 2 4 2" /><path d="M9 9.5c0 0 0-1 1-1s1 1 1 1" /><path d="M13 9.5c0 0 0-1 1-1s1 1 1 1" /><path d="M9.5 16c0 0 1 1 2.5 1s2.5-1 2.5-1" /></svg>;
    }
    if (lowerName.includes('tecnolo') || lowerName.includes('som') || lowerName.includes('tv') || lowerName.includes('notebook') || lowerName.includes('drone')) {
        return <svg {...props}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
    }
    if (lowerName.includes('ferramenta') || lowerName.includes('manuten')) {
        return <svg {...props}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>;
    }
    if (lowerName.includes('equipa') || lowerName.includes('industr') || lowerName.includes('profissi')) {
        return <svg {...props}><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>;
    }
    if (lowerName.includes('eletro') || lowerName.includes('casa') || lowerName.includes('gelade') || lowerName.includes('cozinha') || lowerName.includes('alimen')) {
        return <svg {...props}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>;
    }
    if (lowerName.includes('refrige') || lowerName.includes('clima') || lowerName.includes('ar cond')) {
        return <svg {...props}><path d="M12 22a10 10 0 100-20 10 10 0 000 20z" /><path d="M12 12L5 7.5M12 12l7-4.5M12 12v9M12 12l-7 4.5M12 12l7 4.5" /></svg>;
    }
    if (lowerName.includes('limpeza') || lowerName.includes('higie')) {
        return <svg {...props}><path d="M7 11V7a5 5 0 0110 0v4" /><path d="M21 12H3v9a2 2 0 002 2h14a2 2 0 002-2v-9z" /><path d="M7 17h10" /></svg>;
    }
    if (lowerName.includes('veicul') || lowerName.includes('carro') || lowerName.includes('moto')) {
        return <svg {...props}><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 7v2h-5" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    }
    if (lowerName.includes('estru') || lowerName.includes('tenda') || lowerName.includes('galpa')) {
        return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg>;
    }
    if (lowerName.includes('brinquedo') || lowerName.includes('kids') || lowerName.includes('infantil') || lowerName.includes('lazer')) {
        return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
    }

    // Default genérico (Caixa/Estoque)
    return <svg {...props}><path d="M20 7l-8-4-8 4v10l8 4 8-4V7z" /><path d="M12 21v-8M12 13l8-4M12 13l-8-4" /></svg>;
}

// ── Card de Produto ──────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { getWhatsAppLink, refreshSettings } = useSettings();
    const router = useRouter();
    
    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita navegar para detalhes
        if (!product.available) {
            toast.error('Item indisponível, mas você pode adicioná-lo à sacola para consultar previsão.', {
                icon: '⏳',
                duration: 5000
            });
        }
        addToCart(product);
    };

    const handleDirectWhatsApp = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita navegar para detalhes
        const { whatsapp: latestWhatsapp } = await refreshSettings();
        const message = product.available
            ? `Olá! Tenho interesse em alugar: ${product.name}`
            : `Olá! Tenho interesse no item ${product.name}, porém vi no site que está indisponível no momento. Gostaria de solicitar uma reserva ou saber a previsão de disponibilidade.`;
        window.open(getWhatsAppLink(latestWhatsapp, message), '_blank');
    };

    return (
        <div
            onClick={() => router.push(`/produto/${product.id}`)}
            className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl h-full cursor-pointer group/card"
            style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            }}
        >
            {/* Etiquetas de categoria */}
            <div className="relative group/img">
                <div className="flex items-start justify-between gap-1 absolute top-3 left-3 right-3 z-10">
                    <div className="flex flex-wrap gap-1">
                        {product.category && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm"
                                style={{ background: 'rgba(16, 163, 127, 0.85)' }}>
                                {product.category.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* Imagem do Produto */}
                <div
                    className="w-full flex items-center justify-center overflow-hidden relative"
                    style={{ height: 180, background: '#f8fafc' }}
                >
                    {product.images?.[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                        />
                    ) : (
                        <div className="flex flex-col items-center opacity-20">
                            <span className="text-4xl">📦</span>
                            <p className="text-[10px] font-bold mt-2">SEM FOTO</p>
                        </div>
                    )}

                    {!product.available && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center p-3 z-10 backdrop-blur-[1px]">
                            <div className="bg-red-600/90 text-white text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-xl transform -rotate-1 border border-white/20">
                                Indisponível
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Informações */}
            <div className="flex flex-col gap-3 p-5 flex-1 bg-white">
                <div className="min-h-[44px]">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 leading-snug line-clamp-2 min-h-[2.5rem] group-hover/card:text-[#1e3a8a] transition-colors">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: product.available ? '#22c55e' : '#cbd5e1' }} />
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${product.available ? 'text-green-600' : 'text-slate-400'}`}>
                        {product.available ? 'Disponível para hoje' : 'Consultar previsão'}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Período
                    </p>
                    <p className={`text-xs font-black ${!product.available ? 'text-slate-300' : 'text-[#1e3a8a]'}`}>
                        {product.rentalPeriod}
                    </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 mt-auto pt-4">
                    <button
                        onClick={handleDirectWhatsApp}
                        className="flex-[0.4] py-2.5 rounded-xl transition-all border border-green-500 text-green-500 hover:bg-green-500 hover:text-white active:scale-95 flex items-center justify-center cursor-pointer shadow-sm"
                        title="Contato Direto"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 py-2.5 rounded-xl text-[10px] font-black text-white text-center flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95 cursor-pointer shadow-md"
                        style={{ background: product.available ? '#1e3a8a' : '#94a3b8' }}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {product.available ? 'ADICIONAR' : 'RESERVAR'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Constantes ───────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 12;

// ── Componente de Paginação ───────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
        return pages;
    };

    const btnBase = 'w-9 h-9 rounded-xl text-sm font-semibold transition-all flex items-center justify-center cursor-pointer';

    return (
        <div className="flex items-center justify-center gap-1.5 mt-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${btnBase} px-3 gap-1.5 w-auto disabled:opacity-30 disabled:cursor-not-allowed`}
                style={{ background: '#fff', border: '1.5px solid #e5e7eb', color: '#4b5563' }}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline text-xs">Anterior</span>
            </button>

            {getPages().map((page, idx) =>
                page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={btnBase}
                        style={{
                            background: currentPage === page ? '#1e3a8a' : '#fff',
                            color: currentPage === page ? '#fff' : '#4b5563',
                            border: `1.5px solid ${currentPage === page ? '#1e3a8a' : '#e5e7eb'}`,
                            boxShadow: currentPage === page ? '0 4px 12px rgba(30,58,138,0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${btnBase} px-3 gap-1.5 w-auto disabled:opacity-30 disabled:cursor-not-allowed`}
                style={{ background: '#fff', border: '1.5px solid #e5e7eb', color: '#4b5563' }}
            >
                <span className="hidden sm:inline text-xs">Próxima</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

// ── Seção Principal ──────────────────────────────────────────────────────
export default function ProductsSection({ initialProducts, categories }: ProductsSectionProps) {
    const { getWhatsAppLink, refreshSettings } = useSettings();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sectionRef = useRef<HTMLElement>(null);

    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Sincroniza os filtros e a página com os parâmetros da URL
    useEffect(() => {
        const cat = searchParams.get('category') || 'Todos';
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);

        setActiveCategory(cat);
        setSearchQuery(search);
        setCurrentPage(isNaN(page) || page < 1 ? 1 : page);

        // Apenas rola se o usuário estiver fora da seção
        const rect = sectionRef.current?.getBoundingClientRect();
        const isOutsideSection = rect && (rect.top > 120 || rect.bottom < 0);

        if ((searchParams.get('category') || searchParams.get('search')) && isOutsideSection) {
            const element = sectionRef.current;
            if (element) {
                const offset = 100; // Altura do header fixo
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, [searchParams]);

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cat === 'Todos') {
            params.delete('category');
        } else {
            params.set('category', cat);
        }
        params.delete('search');
        params.delete('page'); // Volta para página 1 ao trocar categoria
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', String(page));
        }
        router.push(`/?${params.toString()}`, { scroll: false });
        // Rola suavemente até o topo da seção de produtos
        const element = sectionRef.current;
        if (element) {
            const offset = 100;
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const normalizeText = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[-\s]/g, ''); // Remove hifens e espaços para uma busca mais precisa
    };

    const filtered = initialProducts.filter((p) => {
        const matchesCategory = activeCategory === 'Todos' || p.category?.name === activeCategory;

        if (!searchQuery) return matchesCategory;

        const normalizedSearch = normalizeText(searchQuery);
        const normalizedName = normalizeText(p.name);
        const matchesSearch = normalizedName.includes(normalizedSearch) ||
            p.category?.name && normalizeText(p.category.name).includes(normalizedSearch) ||
            p.tags && normalizeText(p.tags).includes(normalizedSearch);

        return matchesCategory && matchesSearch;
    });

    const getCategoryCount = (catName: string) => {
        if (catName === 'Todos') return initialProducts.length;
        return initialProducts.filter(p => p.category?.name === catName).length;
    };

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const safePage = Math.min(currentPage, totalPages || 1);
    const paginatedProducts = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    return (
        <section id="produtos" ref={sectionRef} className="relative" style={{ background: '#f4f6fb', paddingTop: '5rem', paddingBottom: '4rem', minHeight: '600px' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-10">

                {/* Linha de cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                {searchQuery ? `Resultados para "${searchQuery}"` : 'Explorar Catálogo'}
                            </h2>
                            <span className="bg-[#1e3a8a]/10 text-[#1e3a8a] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {filtered.length} {filtered.length === 1 ? 'item' : 'itens'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {searchQuery
                                ? `Encontramos ${filtered.length} itens correspondentes.`
                                : totalPages > 1
                                    ? `Página ${safePage} de ${totalPages} — ${filtered.length} itens no total.`
                                    : 'Escolha a categoria e encontre o material ideal para sua necessidade.'}
                        </p>
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-10">

                    {/* Filtros: Sidebar (Desktop) / Scroll (Mobile) */}
                    <aside className="lg:col-span-3">
                        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto custom-scrollbar pb-4 lg:pb-0 lg:sticky lg:top-32 lg:max-h-[calc(100vh-200px)] lg:pr-2">
                            <h4 className="hidden lg:block text-[10px] font-bold text-[#D8C28A] uppercase tracking-[0.2em] mb-4 ml-1">
                                Categorias
                            </h4>
                            {['Todos', ...categories.map(c => c.name)].map((cat) => {
                                const isActive = activeCategory === cat;
                                const count = getCategoryCount(cat);
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className="flex items-center justify-between gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap lg:w-full group"
                                        style={{
                                            background: isActive ? '#1e3a8a' : '#fff',
                                            color: isActive ? '#fff' : '#4b5563',
                                            border: `1.5px solid ${isActive ? '#1e3a8a' : '#e5e7eb'}`,
                                            boxShadow: isActive ? '0 8px 16px rgba(30,58,138,0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                                        }}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <CategoryIcon name={cat} className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#1e3a8a]'}`} />
                                            <span>{cat}</span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Grade de produtos */}
                    <main className="lg:col-span-9 mt-4 lg:mt-0">
                        {filtered.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={safePage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed border-gray-300 bg-white/50 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {searchQuery ? `Nenhum resultado para "${searchQuery}"` : 'Nenhum item nesta categoria'}
                                </h3>
                                <p className="text-gray-500 text-sm max-w-md text-center mb-8">
                                    Não encontramos o que você precisa por aqui no momento. Tente buscar por outro termo.
                                </p>
                                <button
                                    onClick={() => handleCategoryChange('Todos')}
                                    className="px-8 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 cursor-pointer"
                                    style={{ background: '#1e3a8a' }}
                                >
                                    Ver Todos os Produtos
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Botão flutuante do WhatsApp */}
            <button
                onClick={async () => {
                    const { whatsapp } = await refreshSettings();
                    window.open(getWhatsAppLink(whatsapp), '_blank');
                }}
                className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
                style={{ background: '#25d366', boxShadow: '0 8px 24px rgba(37,211,102,0.45)' }}
                title="Falar pelo WhatsApp"
            >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                </svg>
            </button>
        </section>
    );
}
