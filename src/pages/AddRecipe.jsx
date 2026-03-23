import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, X, Image } from "lucide-react";
import { Link } from "react-router";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("4");
  const [difficulty, setDifficulty] = useState("Medium");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [image, setImage] = useState(null); // ← NEW
  const [preview, setPreview] = useState(null); // ← NEW
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = () => setIngredients([...ingredients, ""]);
  const handleRemoveIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handleAddInstruction = () => setInstructions([...instructions, ""]);
  const handleRemoveInstruction = (index) =>
    setInstructions(instructions.filter((_, i) => i !== index));
  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  // ← NEW: handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      alert("Please upload a JPG, PNG, WEBP or AVIF image");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("prepTime", prepTime);
    formData.append("servings", servings);
    formData.append("difficulty", difficulty);
    formData.append("ingredients", JSON.stringify(ingredients.filter(Boolean)));
    formData.append(
      "instructions",
      JSON.stringify(instructions.filter(Boolean)),
    );
    if (image) formData.append("image", image); // ← the actual file

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes`, {
        method: "POST",
        headers: {
          // ← NO Content-Type header — browser sets it automatically with boundary for FormData
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Recipe added successfully!");
        navigate("/browse");
      } else {
        alert(data.message || "Failed to add recipe");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm-6 lg-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Share Your Recipe
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to share your delicious recipe
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>

              {/* ← NEW: Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Image
                </label>
                <div
                  onClick={() => document.getElementById("imageInput").click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors overflow-hidden"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <Image className="w-10 h-10 mb-2" />
                      <p className="text-sm">Click to upload a photo</p>
                      <p className="text-xs mt-1">JPG, PNG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Creamy Pasta Carbonara"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your recipe"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    {[
                      "Main Course",
                      "Breakfast",
                      "Appetizers",
                      "Starters",
                      "Side Dish",
                      "Salads",
                      "Soups",
                      "Seafood",
                      "Grilled",
                      "Baked",
                      "Desserts",
                      "Snacks",
                      "Drinks & Smoothies",
                      "Vegetarian",
                      "Vegan",
                      "Japanese",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    required
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    {["Easy", "Medium", "Hard"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prep Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g., 30 mins"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servings *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Ingredients
                </h2>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="flex items-center gap-1 text-orange-500 font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Ingredient
                </button>
              </div>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    placeholder="e.g., 2 cups flour"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-2 text-red-500 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Instructions
                </h2>
                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="flex items-center gap-1 text-orange-500 font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Step
                </button>
              </div>
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-semibold flex-shrink-0 mt-2">
                    {index + 1}
                  </span>
                  <textarea
                    required
                    value={instruction}
                    onChange={(e) =>
                      handleInstructionChange(index, e.target.value)
                    }
                    placeholder="Describe this step..."
                    rows={2}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(index)}
                      className="p-2 text-red-500 rounded-lg h-fit mt-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
