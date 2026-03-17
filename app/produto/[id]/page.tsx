import type { Metadata } from 'next';
import { productService } from '@/lib/services/ProductService';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import ProductContactButton from '@/components/ProductContactButton';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lunarlocacoes.com.br';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const products = await productService.getAllProducts();
    return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await productService.getProductById(id);

    if (!product) {
        return { title: 'Produto não encontrado' };
    }

    const title = product.name; // o template do layout raiz adiciona "| Lunar Locações"
    const fullTitle = `${product.name} | Lunar Locações`; // usado no OG/Twitter
    const description =
        product.description ||
        `Alugue ${product.name} com facilidade na Lunar Locações. Qualidade, praticidade e entrega rápida.`;

    const keywords = [
        product.name,
        `locação de ${product.name}`,
        `aluguel de ${product.name}`,
        ...(product.category ? [product.category.name, `locação ${product.category.name}`] : []),
        ...(product.tags ? product.tags.split(',').map((t) => t.trim()) : []),
        'locação de equipamentos',
        'aluguel',
        'Lunar Locações',
    ];

    const imageUrl = product.images?.[0] || `${BASE_URL}/assets/lunar-logo.png`;
    const canonicalUrl = `${BASE_URL}/produto/${id}`;

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: 'website',
            locale: 'pt_BR',
            url: canonicalUrl,
            siteName: 'Lunar Locações',
            title: fullTitle,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
            },
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;

    const product = await productService.getProductById(id);

    if (!product) {
        notFound();
    }

    const images = product.images.length > 0 ? product.images : ['/assets/placeholder-product.jpg'];
    const canonicalUrl = `${BASE_URL}/produto/${id}`;

    // JSON-LD — Schema.org Product
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: images,
        url: canonicalUrl,
        brand: {
            '@type': 'Brand',
            name: 'Lunar Locações',
        },
        offers: {
            '@type': 'Offer',
            availability: product.available
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            priceCurrency: 'BRL',
            seller: {
                '@type': 'Organization',
                name: 'Lunar Locações',
                url: BASE_URL,
            },
        },
        ...(product.category && {
            category: product.category.name,
        }),
    };

    return (
        <>
            {/* Dados estruturados para o Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                {/* Coluna Esquerda: Galeria Interativa */}
                <div className="lg:col-span-7 lg:sticky lg:top-32 self-start">
                    <ProductGallery
                        images={product.images}
                        productName={product.name}
                        isAvailable={product.available}
                    />
                </div>

                {/* Coluna Direita: Informações */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl lg:sticky lg:top-32">

                        {product.category && (
                            <span className="inline-block px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white mb-3 sm:mb-4" style={{ background: '#D8C28A' }}>
                                {product.category.name}
                            </span>
                        )}

                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 leading-tight text-gray-900">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <span className={`w-2.5 h-2.5 sm:w-3 h-3 rounded-full ${product.available ? 'animate-pulse' : ''}`} style={{ background: product.available ? '#22c55e' : '#ef4444' }} />
                            <span className={`text-[11px] sm:text-[13px] font-bold uppercase tracking-tight ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                                {product.available ? 'Disponível para hoje' : 'Indisponível no momento'}
                            </span>
                        </div>

                        <div className={`py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm mb-6 sm:mb-8 flex items-center justify-center border ${!product.available ? 'bg-slate-50 text-[#1e3a8a] border-slate-200' : 'bg-[#1e3a8a] text-white border-transparent shadow-lg'}`}>
                            Locação por {product.rentalPeriod}
                        </div>

                        {/* Tags */}
                        {product.tags && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-8 sm:mb-10">
                                {product.tags.split(',').map((tag) => (
                                    <span key={tag} className="px-2.5 sm:px-3 py-1 bg-blue-50 text-[#1e3a8a] text-[10px] sm:text-xs font-bold rounded-lg border border-blue-100 uppercase tracking-tighter">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Descrição */}
                        <div className="mb-8 sm:mb-10">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 border-b pb-2">Descrição</h2>
                            <p className="leading-relaxed text-xs sm:text-sm whitespace-pre-wrap text-gray-600">
                                {product.description || 'Produto de alta qualidade disponível para locação. Entre em contato para mais detalhes e especificações.'}
                            </p>
                        </div>

                        {/* Especificações Técnicas */}
                        {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
                            <div className="mb-8 sm:mb-10">
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 border-b pb-2">Especificações Técnicas</h2>
                                <div className="space-y-2 sm:space-y-3">
                                    {product.specifications.map((spec: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                            <span className="text-xs sm:text-sm text-gray-500 font-medium">{spec.label}</span>
                                            <span className="text-xs sm:text-sm text-gray-900 font-bold">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Botão WhatsApp (Sacola) */}
                        <ProductContactButton
                            product={JSON.parse(JSON.stringify(product))}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
