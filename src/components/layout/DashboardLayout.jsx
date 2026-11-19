import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({
  children,
  pageTitle,
  pageSubtitle,
  showFooter = false, // Retired from authenticated workspace shell
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sb_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sb_sidebar_collapsed', String(next));
      } catch (e) {
        console.warn('Failed to save sidebar collapsed state', e);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] transition-colors duration-200">
      {/* Sidebar (Persistent on desktop with collapsible width, slide-out drawer on mobile) */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content Area: dynamically expands when sidebar collapses */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          onMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={toggleSidebarCollapse}
          title={pageTitle}
          subtitle={pageSubtitle}
        />

        <main className="flex-1 w-full pb-10">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
