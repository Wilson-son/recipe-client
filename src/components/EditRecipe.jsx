import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Image } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("4");
  const [difficulty, setDifficulty] = useState("Medium");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [existingImage, setExistingImage] = useState(null); // filename from DB
  const [newImage, setNewImage] = useState(null); // new File object
  const [preview, setPreview] = useState(null); // preview URL
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing recipe data
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const r = res.data;
        setTitle(r.title);
        setDescription(r.description);
        setCategory(r.category);
        setPrepTime(r.prepTime);
        setServings(r.servings);
        setDifficulty(r.difficulty);
        setIngredients(r.ingredients.length ? r.ingredients : [""]);
        setInstructions(r.instructions.length ? r.instructions : [""]);
        if (r.image?.[0]) {
          setExistingImage(r.image[0]);
          setPreview(`${import.meta.env.VITE_API_URL}/uploads/${r.image[0]}`);
        }
      })
      .catch(() => navigate("/profile"))
      .finally(() => setFetching(false));
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setNewImage(null);
    setExistingImage(null);
    setPreview(null);
  };

  const handleAddIngredient = () => setIngredients([...ingredients, ""]);
  const handleRemoveIngredient = (i) =>
    setIngredients(ingredients.filter((_, idx) => idx !== i));
  const handleIngredientChange = (i, val) => {
    const updated = [...ingredients];
    updated[i] = val;
    setIngredients(updated);
  };

  const handleAddInstruction = () => setInstructions([...instructions, ""]);
  const handleRemoveInstruction = (i) =>
    setInstructions(instructions.filter((_, idx) => idx !== i));
  const handleInstructionChange = (i, val) => {
    const updated = [...instructions];
    updated[i] = val;
    setInstructions(updated);
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
    formData.append("existingImage", existingImage || ""); // tell backend to keep it
    if (newImage) formData.append("image", newImage); // or replace with this

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/recipes/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        alert("Recipe updated!");
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update recipe");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return <p className="text-center mt-20 text-gray-400">Loading recipe...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Profile
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Recipe</h1>
          <p className="text-gray-600 mb-8">Update your recipe details below</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Image
                </label>
                <div
                  onClick={() =>
                    document.getElementById("editImageInput").click()
                  }
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
                      <p className="text-sm">Click to upload a new photo</p>
                    </div>
                  )}
                </div>
                <input
                  id="editImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {preview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                      "Salads",
                      "Desserts",
                      "Soups",
                      "Japanese",
                      "Appetizers",
                      "Breakfast",
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
            <div className="space-y-3 pt-6 border-t border-gray-200">
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
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={ing}
                    onChange={(e) => handleIngredientChange(i, e.target.value)}
                    placeholder={`Ingredient ${i + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(i)}
                      className="p-2 text-red-500 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
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
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-semibold flex-shrink-0 mt-2">
                    {i + 1}
                  </span>
                  <textarea
                    required
                    value={step}
                    onChange={(e) => handleInstructionChange(i, e.target.value)}
                    placeholder={`Step ${i + 1}`}
                    rows={2}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(i)}
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
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
