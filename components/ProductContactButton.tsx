'use client';

import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductContactButtonProps {
    product: {
        id: string;
        name: string;
        images: string[];
        available: boolean;
        rentalPeriod: string;
    };
}

export default function ProductContactButton({ product }: ProductContactButtonProps) {
    const { addToCart } = useCart();

    const handleAction = () => {
        if (!product.available) {
            toast.error('Item indisponível, mas você pode adicioná-lo à sacola para consultar previsão.', {
                icon: '⏳',
                duration: 5000
            });
        }
        addToCart(product);
    };

    return (
        <button
            onClick={handleAction}
            className="w-full py-3.5 sm:py-4 text-white rounded-xl font-black flex items-center justify-center gap-2 sm:gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl uppercase text-[10px] sm:text-xs tracking-widest cursor-pointer group"
            style={{
                background: product.available ? '#1e3a8a' : '#94a3b8',
                boxShadow: product.available ? '0 10px 20px -5px rgba(30, 58, 138, 0.4)' : '0 10px 20px -5px rgba(148, 163, 184, 0.3)'
            }}
        >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {product.available ? 'ADICIONAR' : 'RESERVAR'}
        </button>
    );
}
