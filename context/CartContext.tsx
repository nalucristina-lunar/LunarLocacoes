'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    rentalPeriod: string;
    available: boolean;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    generateWhatsAppMessage: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Carregar do localStorage ao iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('lunar-cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Erro ao carregar carrinho:', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Salvar no localStorage sempre que mudar
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('lunar-cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addToCart = (product: any) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                // Se já existe, apenas abre o carrinho ou poderíamos incrementar
                setIsCartOpen(true);
                return prev;
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                image: product.images?.[0] || '',
                quantity: 1,
                rentalPeriod: product.rentalPeriod || 'Diária',
                available: product.available !== undefined ? product.available : true
            }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems(prev => prev.map(item => 
            item.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalItems = cartItems.length;

    const generateWhatsAppMessage = () => {
        if (cartItems.length === 0) return '';

        const availableItems = cartItems.filter(item => item.available !== false);
        const unavailableItems = cartItems.filter(item => item.available === false);

        let message = `*Orçamento - Lunar Locações*\n\n`;

        if (availableItems.length > 0) {
            message += `Itens disponíveis para locação:\n`;
            availableItems.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - ${item.rentalPeriod}\n`;
            });
            message += `\n`;
        }

        if (unavailableItems.length > 0) {
            message += `Consultar previsão:\n`;
            unavailableItems.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - ${item.rentalPeriod}\n`;
            });
            message += `\n`;
        }

        message += `Aguardo retorno. Obrigado!`;
        return message;
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            isCartOpen,
            setIsCartOpen,
            generateWhatsAppMessage
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
