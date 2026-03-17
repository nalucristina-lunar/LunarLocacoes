'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { SettingsProvider } from '@/context/WhatsAppContext';
import { AdminUser } from '@/lib/controllers/AuthController';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import BagFloatingButton from '@/components/BagFloatingButton';
import BagModal from '@/components/BagModal';

export default function ClientLayout({
    children,
    categories,
    whatsapp,
    email,
    user,
    products,
}: {
    children: React.ReactNode;
    categories: any[];
    whatsapp: string;
    email: string;
    user: AdminUser | null;
    products: any[];
}) {
    const pathname = usePathname();

    // Ocultar Navbar em rotas de admin e login
    const hideNavbar = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    return (
        <SettingsProvider initialWhatsapp={whatsapp} initialEmail={email}>
            <CartProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#141414',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                        },
                    }}
                />
                {!hideNavbar && <AdminToolbar user={user} />}
                {!hideNavbar && <Navbar categories={categories} user={user} products={products} />}
                {children}
                {!hideNavbar && <Footer />}
                
                {/* Componentes da Sacola */}
                {!hideNavbar && (
                    <>
                        <BagFloatingButton />
                        <BagModal />
                    </>
                )}
            </CartProvider>
        </SettingsProvider>
    );
}
