import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Check, MessageCircle } from "lucide-react";
import axios from "axios";

export function ReviewSection({ recipeId, recipeName }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const token = localStorage.getItem("token");

  // Get current user id
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUserId(res.data._id || res.data.id))
      .catch(() => {});
  }, [token]);

  // Fetch reviews
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reviews/${recipeId}`)
      .then((res) => setReviews(res.data))
      .catch(() => {});
  }, [recipeId]);

  const handleSubmit = async () => {
    if (!token) return setError("Please login to leave a review");
    if (!comment.trim()) return setError("Comment cannot be empty");
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews/${recipeId}`,
        { comment, recipeName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReviews((prev) => [res.data, ...prev]);
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (reviewId) => {
    if (!editComment.trim()) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
        { comment: editComment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? res.data : r)),
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to edit review");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch {
      alert("Failed to delete review");
    }
  };

  const avatarUrl = (avatar) =>
    avatar ? `${import.meta.env.VITE_API_URL}/uploads/${avatar}` : null;

  const alreadyReviewed = reviews.some(
    (r) => r.user?.toString() === currentUserId?.toString(),
  );

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews{" "}
          <span className="text-gray-400 font-normal text-lg">
            ({reviews.length})
          </span>
        </h2>
      </div>

      {/* Write a review */}
      {token && !alreadyReviewed && (
        <div className="mb-8 bg-orange-50 rounded-xl p-5">
          <p className="font-semibold text-gray-800 mb-3">Write a Review</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 resize-none bg-white"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </div>
      )}

      {!token && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500">
          <span className="font-medium text-orange-500">Login</span> to leave a
          review
        </div>
      )}

      {alreadyReviewed && (
        <div className="mb-6 p-3 bg-green-50 rounded-xl text-sm text-green-700 font-medium">
          ✓ You've already reviewed this recipe
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No reviews yet — be the first!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwner =
              review.user?.toString() === currentUserId?.toString();
            const isEditing = editingId === review._id;
            const avatar = avatarUrl(review.avatar);

            return (
              <div
                key={review._id}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={review.username}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">
                        {review.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {review.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Edit / Delete buttons for owner */}
                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(review._id);
                          setEditComment(review.comment);
                        }}
                        className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Save / Cancel edit */}
                  {isOwner && isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(review._id)}
                        className="p-1.5 text-green-500 hover:text-green-600 transition-colors"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment or edit box */}
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
  );
}
