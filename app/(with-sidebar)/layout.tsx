import { SidebarProvider } from '@/contexts/SidebarContext';

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
