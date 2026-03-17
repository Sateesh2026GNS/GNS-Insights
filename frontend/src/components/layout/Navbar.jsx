import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, User, Settings, Menu, UserCircle, LogOut } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import GlobalSearch from "../common/GlobalSearch";
import useSettings from "../../context/SettingsContext";

export default function Navbar({ onMenuClick }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { language, updateLanguage, companyName } = useSettings();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [dropdownRect, setDropdownRect] = useState(null);
  const langButtonRef = useRef(null);

  const handleLanguageSelect = (e, lang) => {
    e.preventDefault();
    e.stopPropagation();
    updateLanguage(lang);
    setShowLanguage(false);
  };

  const openLanguage = () => {
    setShowLanguage((v) => !v);
    setShowNotifications(false);
    setShowProfile(false);
  };

  useLayoutEffect(() => {
    if (showLanguage && langButtonRef.current) {
      const rect = langButtonRef.current.getBoundingClientRect();
      setDropdownRect({ top: rect.bottom + 4, right: window.innerWidth - rect.right, width: 160 });
    } else {
      setDropdownRect(null);
    }
  }, [showLanguage]);

  useEffect(() => {
    if (!showLanguage) return;
    const onPointerDown = (e) => {
      if (langButtonRef.current && !langButtonRef.current.contains(e.target) &&
          !e.target.closest("[data-language-menu]")) {
        setShowLanguage(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showLanguage]);

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between gap-4 px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm">
      {/* Left: Logo + Global Search */}
      <div className="flex flex-1 items-center gap-6">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-lg shadow-lg shadow-teal-500/25">
            S
          </div>
          <span className="font-bold text-xl text-slate-800 dark:text-slate-100">SMRT</span>
        </Link>
        <div className="hidden sm:flex flex-1 max-w-md">
          <GlobalSearch />
        </div>
      </div>

      {/* Right: Company Name | Notifications | Language | User Profile | Settings */}
      <div className="flex items-center gap-3">
        <span className="hidden lg:block text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-[140px]" title={companyName}>
          {companyName}
        </span>
        <div className="flex items-center gap-1">
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowNotifications(!showNotifications); setShowLanguage(false); setShowProfile(false); }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${showNotifications ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            title={t("common.notifications")}
          >
            <Bell className="h-5 w-5" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 shadow-xl" onMouseLeave={() => setShowNotifications(false)}>
              <div className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">{t("common.notifications")}</div>
              <div className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Bell className="h-4 w-4 shrink-0" />
                {t("common.noNotifications")}
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            ref={langButtonRef}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openLanguage();
            }}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all ${showLanguage ? "border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30" : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            title={t("common.language")}
            aria-expanded={showLanguage}
            aria-haspopup="true"
          >
            <span className="text-lg">🌐</span>
            <span className="hidden md:inline text-sm font-medium">{t("common.language")}</span>
          </button>
          {showLanguage && dropdownRect &&
            createPortal(
              <div
                data-language-menu
                role="menu"
                className="fixed rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-1.5 shadow-xl z-[9999]"
                style={{ top: dropdownRect.top, right: dropdownRect.right, width: dropdownRect.width }}
              >
                <button type="button" role="menuitem" onClick={(e) => handleLanguageSelect(e, "English")} className={`w-full px-4 py-2.5 text-left text-sm rounded-lg mx-1 transition-colors ${language === "English" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium" : "hover:bg-slate-50 dark:hover:bg-slate-700"}`}>English</button>
                <button type="button" role="menuitem" onClick={(e) => handleLanguageSelect(e, "Hindi")} className={`w-full px-4 py-2.5 text-left text-sm rounded-lg mx-1 transition-colors ${language === "Hindi" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium" : "hover:bg-slate-50 dark:hover:bg-slate-700"}`}>हिन्दी</button>
                <button type="button" role="menuitem" onClick={(e) => handleLanguageSelect(e, "Tamil")} className={`w-full px-4 py-2.5 text-left text-sm rounded-lg mx-1 transition-colors ${language === "Tamil" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium" : "hover:bg-slate-50 dark:hover:bg-slate-700"}`}>தமிழ்</button>
                <button type="button" role="menuitem" onClick={(e) => handleLanguageSelect(e, "Telugu")} className={`w-full px-4 py-2.5 text-left text-sm rounded-lg mx-1 transition-colors ${language === "Telugu" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium" : "hover:bg-slate-50 dark:hover:bg-slate-700"}`}>తెలుగు</button>
              </div>,
              document.body
            )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowLanguage(false); }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${showProfile ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            title="User Profile"
          >
            <User className="h-5 w-5" />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 shadow-xl overflow-hidden" onMouseLeave={() => setShowProfile(false)}>
              <div className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                    {(user?.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || "User"}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">user@smrt.com</div>
                    <div className="text-xs font-medium text-teal-600 dark:text-teal-400 mt-0.5">{user?.role ? `${user.role} · ${companyName}` : companyName}</div>
                  </div>
                </div>
              </div>
              <Link to="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"><UserCircle className="h-4 w-4" />{t("common.myAccount")}</Link>
              <button type="button" onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"><LogOut className="h-4 w-4" />{t("common.signOut")}</button>
            </div>
          )}
        </div>
        <Link
          to="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 transition-all"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
        </div>
      </div>
    </header>
  );
}
