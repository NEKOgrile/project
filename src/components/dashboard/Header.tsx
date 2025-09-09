import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { User, AppSettings } from '../../types';
import { t } from '../../utils/translations';
import { cn } from '../../utils/cn';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onToggleSidebar: () => void;
  settings: AppSettings;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onNavigateToProfile,
  onNavigateToSettings,
  onToggleSidebar,
  settings,
  className
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

const updateCoords = () => {
  const btn = buttonRef.current;
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const dropdownWidth = 192; // 48 * 4 (taille w-48 en tailwind = 12rem = 192px)
  const margin = 8; // petit espace

  let left = rect.left + window.scrollX;
  const top = rect.bottom + window.scrollY + margin;

  // Si le menu dépasse à droite → on le cale à droite du bouton
  if (left + dropdownWidth > window.innerWidth - margin) {
    left = rect.right + window.scrollX - dropdownWidth;
  }

  setCoords({ top, left });
};

  useEffect(() => {
    if (dropdownOpen) {
      updateCoords();
      const onResize = () => updateCoords();
      const onScroll = () => updateCoords();

      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onScroll, true);

      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll, true);
      };
    }
  }, [dropdownOpen]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    if (dropdownOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dropdownOpen]);

  // dropdown content (rendered via portal)
  const dropdown = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998]" onClick={() => setDropdownOpen(false)} />

      {/* Menu */}
      <div
        className="z-[9999] rounded-xl shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-2 w-48"
        style={{ position: 'absolute', top: coords.top, left: coords.left }}
        role="menu"
        aria-hidden={!dropdownOpen}
      >
        <div className="p-1">
          <button
            onClick={() => {
              onNavigateToProfile();
              setDropdownOpen(false);
            }}
            className="w-full flex items-center space-x-3 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            <UserIcon className="w-4 h-4" />
            <span>{t('profile', settings.language)}</span>
          </button>

          <button
            onClick={() => {
              onNavigateToSettings();
              setDropdownOpen(false);
            }}
            className="w-full flex items-center space-x-3 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            <Settings className="w-4 h-4" />
            <span>{t('settings', settings.language)}</span>
          </button>

          <hr className="border-white/10 my-2" />

          <button
            onClick={() => {
              onLogout();
              setDropdownOpen(false);
            }}
            className="w-full flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout', settings.language)}</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <header
      className={cn(
        'bg-white/5 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between',
        className
      )}
    >
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FutureApp</h1>
            <p className="text-white/70 text-sm hidden sm:block">
              {t('welcome', settings.language)}, {user.username}
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div>
        <button
          ref={buttonRef}
          onClick={() => setDropdownOpen(v => !v)}
          className="flex items-center space-x-3 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-expanded={dropdownOpen}
          aria-haspopup="menu"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:block font-medium">{user.username}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {dropdownOpen && createPortal(dropdown, document.body)}
      </div>
    </header>
  );
};

export default Header;
