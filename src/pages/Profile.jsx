import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  X,
  Plus,
  Image,
  Clock,
  Users,
  ChefHat,
  Bookmark,
  Check,
} from "lucide-react";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [myRecipes, setMyRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("myRecipes");
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const initial = user?.name?.charAt(0).toUpperCase() || "";

  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const openProfileEdit = () => {
    setNameInput(user.name || "");
    setBioInput(user.bio || "");
    setEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        { name: nameInput, bio: bioInput },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUser((prev) => ({ ...prev, name: res.data.name, bio: res.data.bio }));
      setEditingProfile(false);
    } catch {
      alert("Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/avatar`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
    } catch {
      alert("Failed to upload avatar");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/recipes/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMyRecipes(res.data))
      .catch((err) => console.error("Failed to load recipes", err))
      .finally(() => setLoadingRecipes(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyRecipes((prev) => prev.filter((r) => r._id !== id));
      if (editingRecipe?._id === id) setEditingRecipe(null);
      if (selectedRecipe?._id === id) setSelectedRecipe(null);
    } catch {
      alert("Failed to delete recipe");
    }
  };

  const handleSaved = (updated) => {
    setMyRecipes((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r)),
    );
    setEditingRecipe(null);
    setSelectedRecipe(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex gap-6 p-6">
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 bg-white rounded-2xl shadow-sm flex flex-col sticky top-6 self-start"
        style={{ minHeight: "calc(100vh - 48px)" }}
      >
        <div className="flex flex-col items-center py-8 px-6 border-b border-gray-100">
          <div
            className="relative mb-4 cursor-pointer group"
            onClick={() => document.getElementById("avatarInput").click()}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-100"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-orange-500 text-white text-3xl font-bold ring-4 ring-orange-100">
                {initial}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </div>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />

          {editingProfile ? (
            <div className="w-full space-y-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-300 text-center"
              />
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Short bio..."
                rows={2}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-300 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 bg-orange-500 text-white text-xs py-1.5 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  {savingProfile ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="flex-1 bg-gray-100 text-gray-600 text-xs py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center w-full">
              <h2 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h2>
              {user.bio && (
                <p className="text-xs text-gray-400 mt-1 px-2">{user.bio}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {myRecipes.length} recipes shared
              </p>
              <button
                onClick={openProfileEdit}
                className="mt-3 flex items-center gap-1.5 mx-auto text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                <Pencil className="w-3 h-3" /> Edit Profile
              </button>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {[
            { key: "myRecipes", label: "My Recipes" },
            { key: "saved", label: "Saved" },
            { key: "reviews", label: "Reviews" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === key
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab(key);
                setEditingRecipe(null);
                setSelectedRecipe(null);
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="text-left px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white rounded-2xl shadow-sm p-8">
        {activeTab === "myRecipes" && (
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              My Recipes
            </h3>
            {selectedRecipe && !editingRecipe && (
              <RecipeDetail
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                onEdit={() => {
                  setEditingRecipe(selectedRecipe);
                  setSelectedRecipe(null);
                }}
                onDelete={() => handleDelete(selectedRecipe._id)}
              />
            )}
            {editingRecipe && (
              <div className="mb-6">
                <InlineEditForm
                  recipe={editingRecipe}
                  onSaved={handleSaved}
                  onCancel={() => setEditingRecipe(null)}
                />
              </div>
            )}
            {loadingRecipes ? (
              <p className="text-gray-400">Loading...</p>
            ) : myRecipes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No recipes yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add your first recipe to see it here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {myRecipes.map((recipe) => (
                  <DBRecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    isSelected={selectedRecipe?._id === recipe._id}
                    onClick={() => {
                      setEditingRecipe(null);
                      setSelectedRecipe((prev) =>
                        prev?._id === recipe._id ? null : recipe,
                      );
                    }}
                    onEdit={(e) => {
                      e.stopPropagation();
                      setSelectedRecipe(null);
                      setEditingRecipe(recipe);
                    }}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleDelete(recipe._id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "saved" && <SavedTab />}
        {activeTab === "reviews" && <ReviewsTab />}
      </main>
    </div>
  );
}

function ReviewsTab() {
  const [myReviews, setMyReviews] = useState([]);
  const [reviewsOnMyRecipes, setReviewsOnMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reviews/user/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMyReviews(res.data.myReviews || []);
        setReviewsOnMyRecipes(res.data.reviewsOnMyRecipes || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = async (reviewId) => {
    if (!editComment.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
        { comment: editComment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMyReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? res.data : r)),
      );
      setEditingId(null);
    } catch {
      alert("Failed to edit review");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMyReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch {
      alert("Failed to delete review");
    }
  };

  const handleViewRecipe = async (recipeId) => {
    if (selectedRecipe?._id === recipeId) {
      setSelectedRecipe(null);
      return;
    }
    setLoadingRecipe(true);
    try {
      const { recipes: staticRecipes } = await import("../data/recipes");
      const staticMatch = staticRecipes.find((r) => r._id === recipeId);
      if (staticMatch) {
        setSelectedRecipe(staticMatch);
      } else {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/recipes/${recipeId}`,
        );
        setSelectedRecipe(res.data);
      }
    } catch {
      alert("Could not load recipe");
    } finally {
      setLoadingRecipe(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="space-y-10">
      <h3 className="text-2xl font-semibold text-gray-900">Reviews</h3>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-orange-500 rounded-full inline-block" />
          My Reviews
          <span className="text-gray-400 font-normal text-sm">
            ({myReviews.length})
          </span>
        </h4>
        {myReviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">
              You haven't reviewed any recipes yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myReviews.map((review) => {
              const isEditing = editingId === review._id;
              return (
                <div
                  key={review._id}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-orange-500">
                        {review.recipeName || `Recipe #${review.recipe}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(review._id);
                              setEditComment(review.comment);
                            }}
                            className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(review._id)}
                            className="p-1.5 text-green-500 hover:text-green-600"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    {isEditing ? (
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full border border-orange-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                      />
                    ) : (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-400 rounded-full inline-block" />
          Reviews on My Recipes
          <span className="text-gray-400 font-normal text-sm">
            ({reviewsOnMyRecipes.length})
          </span>
        </h4>
        {reviewsOnMyRecipes.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">
              No one has reviewed your recipes yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedRecipe && (
              <div className="mb-4 bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
                <div className="relative h-48">
                  <img
                    src={
                      selectedRecipe.isStatic
                        ? selectedRecipe.image
                        : selectedRecipe.image?.[0]
                          ? selectedRecipe.image[0]
                          : "https://placehold.co/800x300?text=No+Image"
                    }
                    alt={selectedRecipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {selectedRecipe.category}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">
                      {selectedRecipe.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white shadow"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <div className="p-5 grid grid-cols-2 gap-5">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">
                      Ingredients
                    </h3>
                    <ul className="space-y-1">
                      {selectedRecipe.ingredients?.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-gray-600"
                        >
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">
                      Instructions
                    </h3>
                    <ol className="space-y-1">
                      {selectedRecipe.instructions?.map((step, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-xs text-gray-600"
                        >
                          <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {reviewsOnMyRecipes.map((review) => {
              const avatar = review.avatar || null;
              const isActive =
                selectedRecipe?._id === review.recipe ||
                selectedRecipe?._id?.toString() === review.recipe;
              return (
                <div
                  key={review._id}
                  onClick={() => handleViewRecipe(review.recipe)}
                  className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                    isActive
                      ? "border-blue-400 ring-2 ring-blue-200"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={review.username}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-sm flex-shrink-0">
                        {review.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {review.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <p className="text-xs text-blue-500 font-medium mt-0.5">
                        on: {review.recipeName || `Recipe #${review.recipe}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 italic">
                        Click to view recipe ↓
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Saved Tab ──────────────────────────────────────────────────────────────────
function SavedTab() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const savedIds = res.data.map(String);
        const staticIds = savedIds.filter((id) => /^\d+$/.test(id));
        const dbIds = savedIds.filter((id) => !/^\d+$/.test(id));
        const { recipes: staticRecipes } = await import("../data/recipes");
        const resolvedStatic = staticRecipes.filter((r) =>
          staticIds.includes(r._id),
        );
        let resolvedDb = [];
        if (dbIds.length > 0) {
          const results = await Promise.all(
            dbIds.map((id) =>
              axios
                .get(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`)
                .then((r) => r.data)
                .catch(() => null),
            ),
          );
          resolvedDb = results.filter(Boolean);
        }
        setSavedRecipes([...resolvedStatic, ...resolvedDb]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (recipeId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/save/${recipeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSavedRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      if (selectedRecipe?._id === recipeId) setSelectedRecipe(null);
    } catch {
      alert("Failed to unsave");
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;

  if (savedRecipes.length === 0) {
    return (
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">
          Saved Recipes
        </h3>
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No saved recipes yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Browse recipes and click the bookmark icon to save them!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">
        Saved Recipes
      </h3>
      {selectedRecipe && (
        <SavedRecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onUnsave={handleUnsave}
        />
      )}
      <div className="grid grid-cols-3 gap-6">
        {savedRecipes.map((recipe) => {
          const imageUrl = recipe.isStatic
            ? recipe.image
            : recipe.image?.[0]
              ? recipe.image[0]
              : "https://placehold.co/400x250?text=No+Image";
          const isSelected = selectedRecipe?._id === recipe._id;
          return (
            <div
              key={recipe._id}
              onClick={() =>
                setSelectedRecipe((prev) =>
                  prev?._id === recipe._id ? null : recipe,
                )
              }
              className={`bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${isSelected ? "ring-2 ring-orange-500" : ""}`}
            >
              <div className="relative h-44">
                <img
                  src={imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {recipe.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsave(recipe._id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
                >
                  <Bookmark
                    className="w-3.5 h-3.5 text-orange-500"
                    fill="currentColor"
                  />
                </button>
              </div>
              <div className="p-4">
                <h3
                  className={`font-semibold text-base mb-1 line-clamp-1 transition-colors ${isSelected ? "text-orange-500" : "text-gray-900"}`}
                >
                  {recipe.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {recipe.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {recipe.prepTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {recipe.servings} servings
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefHat className="w-3 h-3" />
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function SavedRecipeDetail({ recipe, onClose, onUnsave }) {
  const imageUrl = recipe.isStatic
    ? recipe.image
    : recipe.image?.[0]
      ? recipe.image[0]
      : "https://placehold.co/800x400?text=No+Image";

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100">
      <div className="relative h-64">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div>
            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block">
              {recipe.category}
            </span>
            <h2 className="text-2xl font-bold text-white">{recipe.title}</h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={() => onUnsave(recipe._id)}
          className="absolute top-4 right-14 flex items-center gap-1.5 px-3 py-2 bg-orange-500 text-white text-xs font-semibold rounded-full hover:bg-orange-600 transition-colors shadow"
        >
          <Bookmark className="w-3.5 h-3.5" fill="white" /> Unsave
        </button>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-5">{recipe.description}</p>
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-orange-50 rounded-xl">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Prep Time</p>
              <p className="font-semibold text-sm text-gray-900">
                {recipe.prepTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Servings</p>
              <p className="font-semibold text-sm text-gray-900">
                {recipe.servings}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Difficulty</p>
              <p className="font-semibold text-sm text-gray-900">
                {recipe.difficulty}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients?.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Instructions</h3>
            <ol className="space-y-2">
              {recipe.instructions?.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function DBRecipeCard({ recipe, isSelected, onClick, onEdit, onDelete }) {
  const imageUrl = recipe.image?.[0]
    ? recipe.image[0]
    : "https://placehold.co/400x250?text=No+Image";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${isSelected ? "ring-2 ring-orange-500" : ""}`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute top-2 right-2 flex gap-1.5"
          style={{ opacity: 1 }}
        >
          <button
            onClick={onEdit}
            className="p-1.5 bg-white rounded-lg shadow hover:bg-orange-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-orange-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-white rounded-lg shadow hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {recipe.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.prepTime}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-3 h-3" />
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}

function RecipeDetail({ recipe, onClose, onEdit, onDelete }) {
  const imageUrl = recipe.image?.[0]
    ? recipe.image[0]
    : "https://placehold.co/800x400?text=No+Image";

  return (
    <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border border-orange-100">
      <div className="relative h-64">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        <div className="absolute bottom-4 left-6 right-6">
          <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block">
            {recipe.category}
          </span>
          <h2 className="text-white text-2xl font-bold">{recipe.title}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-6 mb-4 text-sm text-gray-500 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-400" />
            {recipe.prepTime}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-400" />
            {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-orange-400" />
            {recipe.difficulty}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {recipe.description}
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-base">
              Ingredients
            </h4>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-base">
              Instructions
            </h4>
            <ol className="space-y-3">
              {recipe.instructions?.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-semibold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit Recipe
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-5 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineEditForm({ recipe, onSaved, onCancel }) {
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [category, setCategory] = useState(recipe.category);
  const [prepTime, setPrepTime] = useState(recipe.prepTime);
  const [servings, setServings] = useState(recipe.servings);
  const [difficulty, setDifficulty] = useState(recipe.difficulty);
  const [ingredients, setIngredients] = useState(
    recipe.ingredients?.length ? recipe.ingredients : [""],
  );
  const [instructions, setInstructions] = useState(
    recipe.instructions?.length ? recipe.instructions : [""],
  );
  const [existingImage, setExistingImage] = useState(recipe.image?.[0] || null);
  const [newImage, setNewImage] = useState(null);

  const [preview, setPreview] = useState(
    recipe.image?.[0] ? recipe.image[0] : null,
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
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
    formData.append("existingImage", existingImage || "");
    if (newImage) formData.append("image", newImage);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/recipes/${recipe._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onSaved(res.data);
    } catch {
      alert("Failed to update recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900">Edit Recipe</h3>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <div
            onClick={() => document.getElementById(`img-${recipe._id}`).click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors overflow-hidden"
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                <Image className="w-8 h-8 mb-1" />
                <p className="text-xs">Click to upload</p>
              </div>
            )}
          </div>
          <input
            id={`img-${recipe._id}`}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          {preview && (
            <button
              type="button"
              onClick={() => {
                setNewImage(null);
                setExistingImage(null);
                setPreview(null);
              }}
              className="mt-1 text-xs text-red-500 hover:underline"
            >
              Remove image
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 text-sm"
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prep Time *
            </label>
            <input
              required
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servings *
            </label>
            <input
              type="number"
              required
              min="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty *
            </label>
            <select
              required
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            >
              {["Easy", "Medium", "Hard"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <button
              type="button"
              onClick={() => setIngredients([...ingredients, ""])}
              className="flex items-center gap-1 text-orange-500 text-xs font-medium"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={ing}
                  onChange={(e) => {
                    const u = [...ingredients];
                    u[i] = e.target.value;
                    setIngredients(u);
                  }}
                  placeholder={`Ingredient ${i + 1}`}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setIngredients(ingredients.filter((_, idx) => idx !== i))
                    }
                    className="text-red-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Instructions
            </label>
            <button
              type="button"
              onClick={() => setInstructions([...instructions, ""])}
              className="flex items-center gap-1 text-orange-500 text-xs font-medium"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {instructions.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold flex-shrink-0 mt-1.5">
                  {i + 1}
                </span>
                <textarea
                  value={step}
                  onChange={(e) => {
                    const u = [...instructions];
                    u[i] = e.target.value;
                    setInstructions(u);
                  }}
                  placeholder={`Step ${i + 1}`}
                  rows={2}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setInstructions(
                        instructions.filter((_, idx) => idx !== i),
                      )
                    }
                    className="text-red-400 hover:text-red-600 mt-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
