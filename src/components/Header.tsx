"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { Chevron, Close, Menu } from "./Icons";
import { EnquiryButton } from "./EnquiryButton";
import { LanguageSelector } from "./LanguageSelector";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AboutDropdown({ item, pathname }: { item: (typeof nav)[number]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLLIElement>(null);
  const active = isActive(pathname, "/about");

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <li
      ref={wrap}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          (wrap.current?.querySelector("button") as HTMLElement | null)?.focus();
        }
      }}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="about-menu"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9rem] font-bold hover:text-copper-ink ${active ? "text-copper-ink" : "text-ink"}`}
      >
        {item.label}
        <Chevron size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        id="about-menu"
        hidden={!open}
        className="card absolute left-0 top-full z-50 w-64 p-2"
      >
        {item.children?.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              aria-current={pathname === c.href ? "page" : undefined}
              className={`block rounded-lg px-3 py-2 text-[0.92rem] font-semibold no-underline hover:bg-beige hover:text-copper-ink ${pathname === c.href ? "text-copper-ink" : "text-ink"}`}
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Header() {
  const pathname = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const d = drawer.current;
    if (!d) return;
    if (drawerOpen && !d.open) d.showModal();
    if (!drawerOpen && d.open) d.close();
  }, [drawerOpen]);

  // close the drawer after navigating
  useEffect(() => setDrawerOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
      <div className="container-x flex items-center justify-between gap-4 py-3">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((item) =>
              item.children ? (
                <AboutDropdown key={item.label} item={item} pathname={pathname} />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9rem] font-bold no-underline hover:text-copper-ink ${
                      isActive(pathname, item.href) ? "text-copper-ink" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageSelector className="hidden md:block" id="lang-select-desktop" />
          <EnquiryButton className="hidden whitespace-nowrap !py-2.5 sm:inline-flex" arrow>
            Request a quote
          </EnquiryButton>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink xl:hidden"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <dialog
        id="mobile-drawer"
        ref={drawer}
        className="drawer"
        aria-label="Menu"
        onClose={() => setDrawerOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDrawerOpen(false);
        }}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo />
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink"
          >
            <Close size={22} />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
          <ul>
            {nav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={aboutOpen}
                      aria-controls="drawer-about"
                      onClick={() => setAboutOpen((o) => !o)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-lg font-bold text-ink hover:bg-beige"
                    >
                      {item.label}
                      <Chevron className={`transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
                    </button>
                    <ul id="drawer-about" hidden={!aboutOpen} className="mb-1 ml-4 border-l-2 border-line pl-2">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded-lg px-3 py-2.5 font-semibold text-ink no-underline hover:bg-beige">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 text-lg font-bold no-underline hover:bg-beige ${
                      isActive(pathname, item.href) ? "text-copper-ink" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-4 border-t border-line p-5">
          <LanguageSelector id="lang-select-mobile" />
          <div onClick={() => setDrawerOpen(false)}>
            <EnquiryButton className="w-full">Request a quote</EnquiryButton>
          </div>
        </div>
      </dialog>
    </header>
  );
}
