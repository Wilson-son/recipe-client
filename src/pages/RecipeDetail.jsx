import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Calendar,
  Bookmark,
} from "lucide-react";
import { recipes as staticRecipes } from "../data/recipes";
import { ReviewSection } from "../components/ReviewSection";
import axios from "axios";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // First check static data — static recipes have short string ids like "1","2"
    const staticMatch = staticRecipes.find((r) => r._id === id);
    if (staticMatch) {
      setRecipe({ ...staticMatch, isStatic: true });
      setLoading(false);
      return;
    }

    // Otherwise fetch from backend DB
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(() => setRecipe(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Check if already saved (only for DB recipes)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ids = res.data.savedRecipes?.map(String) || [];
        setSaved(ids.includes(id));
      })
      .catch(() => {});
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to save recipes");
    if (recipe?.isStatic) return alert("Only community recipes can be saved");
    setSaving(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/save/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSaved(res.data.saved);
    } catch {
      alert("Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Recipe Not Found
          </h1>
          <Link to="/browse" className="text-orange-500 hover:text-orange-600">
            Browse all recipes
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = recipe.isStatic
    ? recipe.image
    : recipe.image?.[0]
      ? recipe.image[0]
      : "https://placehold.co/800x400?text=No+Image";

  const formattedDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to recipes
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96">
            <img
              src={imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />

            {/* Category badge */}
            <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full text-sm font-semibold text-gray-700">
              {recipe.category}
            </div>

            {/* Save button — only for DB recipes */}
            {!recipe.isStatic && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow transition-all ${
                  saved
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                }`}
              >
                <Bookmark className="w-4 h-4" fill={saved ? "white" : "none"} />
                {saved ? "Saved" : "Save Recipe"}
              </button>
            )}
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {recipe.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{recipe.description}</p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">Prep Time</p>
                  <p className="font-semibold text-gray-900">
                    {recipe.prepTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">Servings</p>
                  <p className="font-semibold text-gray-900">
                    {recipe.servings}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">Difficulty</p>
                  <p className="font-semibold text-gray-900">
                    {recipe.difficulty}
                  </p>
                </div>
              </div>
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500">Posted</p>
                    <p className="font-semibold text-gray-900">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Author */}
            {recipe.author && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-gray-600">
                  Recipe by{" "}
                  <span className="font-semibold text-gray-900">
                    {recipe.author}
                  </span>
                </p>
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Instructions
              </h2>
              <ol className="space-y-4">
                {recipe.instructions?.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
          <ReviewSection recipeId={id} recipeName={recipe?.title} />
        </div>

        {/* CTA */}
        <div className="mt-8 bg-orange-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Made this recipe?
          </h3>
          <p className="text-gray-600 mb-4">
            Share your own recipe with the community!
          </p>
          <Link
            to="/add"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Add Your Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
