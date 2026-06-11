import type { ReactNode } from "react";

interface AppHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
}

export function AppHeader({ title, actions }: AppHeaderProps) {
  return (
    <header className="spk-header">
      <div className="spk-header-inner">
        <div className="min-w-0 flex-1">{title}</div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}

export function EventTitle() {
  return (
    <div>
      <h1 className="text-base font-black leading-tight text-white sm:text-lg md:text-xl">
        <span className="block">Inspirasj-</span>
        <span className="relative inline-block">
          <span className="line-through decoration-spk-red decoration-4">
            onsdag
          </span>
        </span>
        <span className="block">torsdag</span>
      </h1>
      <p className="mt-0.5 text-xs text-white/60 sm:text-sm">
        🎪 Vulkanarena · 11. juni
      </p>
    </div>
  );
}

export function SpkFooter() {
  return (
    <footer className="spk-footer">
      <div className="spk-footer-logo">
        <span className="text-2xl font-black tracking-tight">SPK</span>
        <span className="text-left text-xs font-normal leading-tight text-white/80">
          STATENS
          <br />
          PENSJONSKASSE
        </span>
      </div>
    </footer>
  );
}
