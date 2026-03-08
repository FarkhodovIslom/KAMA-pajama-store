"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";

export function useSearch(initialValue = "") {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(initialValue);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/");
    }
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    router.push("/");
  };

  return {
    searchValue,
    setSearchValue: handleSearchChange,
    clearSearch,
  };
}
