'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function BagFloatingButton() {
    const { totalItems, setIsCartOpen, cartItems } = useCart();

    if (totalItems === 0) return null;

    return (
        <>
            <style jsx global>{`
                @keyframes subtle-pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); }
                    50% { transform: scale(1.05); box-shadow: 0 12px 40px 0 rgba(0, 16, 64, 0.45), 0 0 15px rgba(216, 194, 138, 0.3); }
                }
                .animate-subtle-pulse {
                    animation: subtle-pulse 3s ease-in-out infinite;
                }
            `}</style>

            <div className="fixed bottom-6 right-6 z-50 group">
                {/* Tooltip Preview (Só visível em telas maiores e no hover) */}
                <div className="absolute bottom-full right-0 w-64 pb-8 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out hidden md:block">
                    <div className="bg-slate-900/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl relative">
                        {/* Triângulo indicador (opcional, para estética e reforçar conexão) */}
                        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45" />

                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                            <span className="text-[10px] font-black text-[#D8C28A] uppercase tracking-widest">Sua Sacola</span>
                            <span className="text-[10px] text-white/40 font-bold">{totalItems} item(s)</span>
                        </div>
                        
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px]">📦</div>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-white/90 font-medium truncate">{item.name}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-3 pt-2 text-center border-t border-white/5">
                            <span className="text-[9px] text-[#D8C28A] font-bold uppercase tracking-tight">Clique para ver detalhes</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="h-10 px-4 rounded-full flex items-center justify-center gap-3 backdrop-blur-xl border border-white/10 shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer overflow-hidden animate-subtle-pulse"
                    style={{ 
                        background: 'rgba(15, 23, 42, 0.9)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    }}
                    title="Ver Sacola de Orçamentos"
                >
                    {/* Efeito Glow sutil no hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D8C28A]/0 via-[#D8C28A]/5 to-[#D8C28A]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <div className="relative flex items-center">
                        <svg className="w-5 h-5 text-[#D8C28A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        
                        {/* Contador Slim */}
                        <span className="ml-2 bg-[#D8C28A] text-[#0f172a] text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center shadow-sm">
                            {totalItems}
                        </span>
                    </div>
                    
                    <div className="h-4 w-[1px] bg-white/10" />
                    
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em] opacity-90 group-hover:opacity-100 transition-opacity">
                        SACOLA
                    </span>
                </button>
            </div>
        </>
    );
}
