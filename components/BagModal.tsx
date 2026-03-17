'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/WhatsAppContext';
import { useRouter } from 'next/navigation';

export default function BagModal() {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, generateWhatsAppMessage, clearCart } = useCart();
    const { getWhatsAppLink, whatsappNumber, refreshSettings } = useSettings();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);
    const [removingId, setRemovingId] = React.useState<string | null>(null);

    // Efeito para trigger de animação de entrada
    React.useEffect(() => {
        if (isCartOpen) {
            setMounted(true);
        }
    }, [isCartOpen]);

    const handleClose = () => {
        setMounted(false);
        setTimeout(() => {
            setIsCartOpen(false);
        }, 400); // Duração da animação de saída
    };

    if (!isCartOpen) return null;

    const handleRemove = (id: string) => {
        setRemovingId(id);
        setTimeout(() => {
            removeFromCart(id);
            setRemovingId(null);
        }, 300);
    };

    const handleSendQuote = async () => {
        const { whatsapp } = await refreshSettings();
        const message = generateWhatsAppMessage();
        window.open(getWhatsAppLink(whatsapp, message), '_blank');
    };

    const handleItemClick = (id: string) => {
        handleClose();
        router.push(`/produto/${id}`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${mounted ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full sm:w-[400px] h-[90vh] sm:h-[100vh] bg-white sm:rounded-l-3xl shadow-2xl flex flex-col transition-transform duration-500 ease-out border-l border-gray-100 overflow-hidden ${mounted ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 sm:rounded-tl-3xl">
                    <div>
                        <h2 className="text-xl font-black text-[#1e3a8a] flex items-center gap-2">
                            Minha Sacola
                            <span className="bg-[#1e3a8a]/10 text-[#1e3a8a] text-[11px] px-2.5 py-1 rounded-full text-center">
                                {cartItems.length}
                            </span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Solicitação de Orçamento</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => handleItemClick(item.id)}
                                className={`flex gap-3 group animate-in slide-in-from-bottom-2 cursor-pointer p-2 -m-1 rounded-xl hover:bg-gray-50 transition-all duration-300 ease-in-out max-h-40 ${
                                    removingId === item.id 
                                        ? 'opacity-0 -translate-x-12 scale-95 max-h-0 py-0 my-0 overflow-hidden pointer-events-none' 
                                        : 'opacity-100 translate-x-0'
                                }`}
                            >
                                {/* Image - Slim Version */}
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-sm">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-900 text-[13px] leading-tight line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(item.id);
                                            }}
                                            className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                        Período: {item.rentalPeriod}
                                    </p>

                                    {!item.available && (
                                        <div className="mt-1 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-tight">Sob Consulta / Reserva</span>
                                        </div>
                                    )}

                                    {/* Quantidade removida a pedido do usuário */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-4xl grayscale opacity-40">
                                🛍️
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Sua sacola está vazia</h3>
                            <p className="text-sm text-gray-400 max-w-[240px]">
                                Adicione itens do catálogo para solicitar um orçamento.
                            </p>
                            <button
                                onClick={handleClose}
                                className="mt-8 px-8 py-3 rounded-full bg-[#1e3a8a] text-white text-sm font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all cursor-pointer"
                            >
                                Explorar Catálogo
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                        <div className="flex justify-between items-center text-gray-500">
                            <span className="text-xs font-bold uppercase tracking-widest">Itens Selecionados</span>
                            <button
                                onClick={clearCart}
                                className="text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-tighter"
                            >
                                Limpar Tudo
                            </button>
                        </div>

                        <button
                            onClick={handleSendQuote}
                            className="w-full py-4 rounded-2xl bg-[#22c55e] text-white font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                            </svg>
                            SOLICITAR ORÇAMENTO
                        </button>

                        <p className="text-[10px] text-center text-gray-400 font-medium">
                            Isso abrirá seu WhatsApp com a lista de itens formatada.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
