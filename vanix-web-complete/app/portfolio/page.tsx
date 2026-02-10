"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  user: {
    username: string;
  };
};

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Website", "App", "Design", "UI Kit", "Other"];

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  async function fetchPortfolioItems() {
    try {
      const response = await fetch("/api/portfolio");
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            Our Portfolio
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Projects we've built for our clients
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                selectedCategory === cat
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="text-center text-white text-lg py-20">
            Loading portfolio...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white/90 rounded-2xl shadow-lg p-10 text-center">
            <p className="text-gray-700 text-lg">
              No portfolio items yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-600 uppercase">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      by {item.user.username}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
