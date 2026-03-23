import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { recipes as staticRecipes } from "../data/recipes";
import { RecipeCard } from "../components/RecipeCard";
import axios from "axios";

export default function Home() {
  const [dbRecipes, setDbRecipes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  // Fetch DB recipes
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/recipes`)
      .then((res) => setDbRecipes(res.data))
      .catch(() => {});
  }, []);

  // Fetch saved IDs
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

  // Static: first 3 as featured
  const featuredRecipes = staticRecipes.slice(0, 3);
  // Static: next 3 as recent
  const recentStaticRecipes = staticRecipes.slice(3, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Discover & Share Amazing Recipes
            </h1>
            <p className="text-xl mb-8 text-orange-50">
              Join our community of food lovers. Share your culinary creations
              and explore thousands of delicious recipes from around the world.
            </p>
            <div className="flex gap-4">
              <Link
                to="/browse"
                className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                Browse Recipes <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/add"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
              >
                Share Your Recipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured — static recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Recipes
            </h2>
            <p className="text-gray-600">
              Hand-picked favorites from our community
            </p>
          </div>
          <Link
            to="/browse"
            className="text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-2"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              savedIds={savedIds}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      </section>

      {/* Recently Added — static + DB mixed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-8 h-8 text-orange-500" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Recently Added</h2>
            <p className="text-gray-600">
              Fresh recipes from our talented chefs
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Static recent recipes */}
          {recentStaticRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              savedIds={savedIds}
              onSaveToggle={handleSaveToggle}
            />
          ))}
          {/* DB recipes from community */}
          {dbRecipes.slice(0, 3).map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              savedIds={savedIds}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      </section>

      {/* Community Recipes — all DB recipes */}
      {dbRecipes.length > 3 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Community Recipes
              </h2>
              <p className="text-gray-600">Shared by our members</p>
            </div>
            <Link
              to="/browse"
              className="text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbRecipes.slice(3).map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                savedIds={savedIds}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Share Your Recipe?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks and professional chefs sharing their
            favorite dishes.
          </p>
          <Link
            to="/add"
            className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
          >
            Add Your Recipe Now
          </Link>
        </div>
      </section>
    </div>
  );
}
