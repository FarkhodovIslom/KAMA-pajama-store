"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faHeart, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/lib/hooks/useSearch";

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { searchValue, setSearchValue } = useSearch();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <>
      <header className={`nav ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            🌸 KAMA
          </Link>

          {/* Search */}
          <form className="nav-search" onSubmit={handleSearchSubmit}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="nav-search-icon" style={{ width: 14, height: 14 }} />
            <input
              placeholder="Поиск..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>



          {/* Actions */}
          <div className="nav-actions">
            {/* Favorites */}
            <button className="ibtn desktop-only" aria-label="Избранное">
              <FontAwesomeIcon icon={faHeart} style={{ width: 20, height: 20 }} />
            </button>

            {/* Cart Button */}
            <button
              className="nav-cart-btn"
              onClick={toggleCart}
              aria-label="Корзина"
            >
              <FontAwesomeIcon icon={faBagShopping} style={{ width: 16, height: 16 }} />
              Корзина
              {totalItems > 0 && (
                <span className="nav-cart-badge">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}