import type { ReactNode } from 'react';
import Navbar from '@/components/clinic/Navbar';
import Footer from '@/components/clinic/Footer';
import ChatWidget from '@/components/chat/ChatWidget';

export interface PageLayoutProps {
  children: ReactNode;
  showChat?: boolean;
}

export const PageLayout = ({ children, showChat = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {showChat && <ChatWidget />}
    </div>
  );
};

export default PageLayout;
