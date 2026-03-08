"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faHome, faSearch, faShoppingBag, faList } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { toggleCart, totalItems } = useCart();

  const navLinks = [
    { href: "/", label: "Каталог", icon: faHome },
    { href: "/search", label: "Поиск", icon: faSearch },
  ];

  const handleLinkClick = () => {
    onClose();
  };

  const handleCartClick = () => {
    onClose();
    toggleCart();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="mobile-menu open" onClick={onClose} />

      {/* Panel */}
      <div
        className="mobile-menu-panel"
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1001, transform: "translateX(0)" }}
      >
        <button className="mobile-menu-close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} style={{ width: 18, height: 18 }} />
        </button>

        <div className="mobile-menu-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-menu-link ${pathname === link.href ? "active" : ""}`}
              onClick={handleLinkClick}
              style={{
                background: pathname === link.href ? "var(--subtle)" : undefined,
              }}
            >
              <FontAwesomeIcon icon={link.icon} style={{ width: 20, height: 20 }} />
              {link.label}
            </Link>
          ))}

          {/* Cart Link */}
          <button
            className="mobile-menu-link"
            onClick={handleCartClick}
            style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}
          >
            <FontAwesomeIcon icon={faShoppingBag} style={{ width: 20, height: 20 }} />
            Корзина {totalItems > 0 && `(${totalItems})`}
          </button>
        </div>
      </div>
    </>
  );
}