import { Link } from "react-router-dom";
import { Clock, Users, ChefHat, Bookmark } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { ImageWithFallback } from "./ImageWithFallback";

export function RecipeCard({ recipe, savedIds = [], onSaveToggle }) {
  const recipeId = recipe._id?.toString();

  const imageUrl = recipe.isStatic
    ? recipe.image
    : recipe.image?.[0]
      ? recipe.image[0]
      : null;

  const [saved, setSaved] = useState(savedIds.includes(recipeId));
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to save recipes");

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/save/${recipeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSaved(res.data.saved);
      if (onSaveToggle) onSaveToggle(recipeId, res.data.saved);
    } catch {
      alert("Failed to save recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/recipe/${recipeId}`} className="group h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative flex flex-col h-full">
        {/* Fixed-height image area */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Category badge */}
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {recipe.category}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`absolute top-3 left-3 p-2 rounded-full shadow transition-all ${
              saved
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-400 hover:text-orange-500"
            }`}
            title={saved ? "Unsave" : "Save recipe"}
          >
            <Bookmark className="w-4 h-4" fill={saved ? "white" : "none"} />
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
            {recipe.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span>{recipe.difficulty}</span>
              </div>
            </div>

            {recipe.author && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  by{" "}
                  <span className="font-medium text-gray-700">
                    {recipe.author}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
