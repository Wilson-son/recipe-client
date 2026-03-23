import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { recipes as staticRecipes, categories } from "../data/recipes";
import { RecipeCard } from "../components/RecipeCard";
import axios from "axios";

export default function Browse() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbRecipes, setDbRecipes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  // Fetch real DB recipes
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/recipes`)
      .then((res) => setDbRecipes(res.data))
      .catch(() => {});
  }, []);

  // Fetch saved IDs for bookmark state
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSavedIds(res.data.savedRecipes?.map(String) || []))
      .catch(() => {});
  }, []);

  const handleSaveToggle = (recipeId, isSaved) => {
    setSavedIds((prev) =>
      isSaved ? [...prev, recipeId] : prev.filter((id) => id !== recipeId),
    );
  };

  // Filter static recipes
  const filteredStatic = staticRecipes.filter((r) => {
    const matchCat =
      selectedCategory === "All" || r.category === selectedCategory;
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filter DB recipes
  const filteredDb = dbRecipes.filter((r) => {
    const matchCat =
      selectedCategory === "All" || r.category === selectedCategory;
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalCount = filteredStatic.length + filteredDb.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Recipes
          </h1>
          <p className="text-gray-600">
            Explore our collection of delicious recipes
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-orange-300 transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
            recipe{totalCount !== 1 && "s"}
          </p>
        </div>

        {totalCount === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              No recipes found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            {/* ── Static recipes first ── */}
            {filteredStatic.length > 0 && (
              <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStatic.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      savedIds={savedIds}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── DB recipes below ── */}
            {filteredDb.length > 0 && (
              <div>
                {filteredStatic.length > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm font-medium text-gray-500 px-3">
                      Community Recipes
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDb.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      savedIds={savedIds}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
