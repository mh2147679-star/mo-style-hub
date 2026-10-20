"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ExistingReview {
  id: string;
  rating: number;
  comment: string | null;
}

interface Props {
  productId: string;
  existingReview?: ExistingReview | null;
}

export function ReviewForm({ productId, existingReview }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isEditing = !!existingReview;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment: comment.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review.");

      setSubmitted(true);
      // Refresh the page so the new review appears in the list
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!existingReview) return;
    if (!confirm("Delete your review?")) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/reviews/${existingReview.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete review.");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-sans-clean p-4">
        ✓ Your review has been {isEditing ? "updated" : "submitted"}. Thank you!
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f7] border border-[#e8e4de] p-6">
      <h3 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-5">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star rating picker */}
        <div>
          <p className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-3">
            Rating <span className="text-red-400">*</span>
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                className="text-2xl transition-colors focus:outline-none"
              >
                <span
                  className={
                    star <= (hovered || rating)
                      ? "text-[#c9a96e]"
                      : "text-[#e8e4de]"
                  }
                >
                  ★
                </span>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs font-sans-clean text-[#6b6b6b] self-center">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="review-comment"
            className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2"
          >
            Comment <span className="text-[#9a9a9a] normal-case">(optional)</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Share your thoughts about this product…"
            className="input-luxury w-full resize-none"
          />
          <p className="text-right text-xs text-[#9a9a9a] font-sans-clean mt-1">
            {comment.length}/1000
          </p>
        </div>

        {error && (
          <p className="text-xs font-sans-clean text-red-500 bg-red-50 border border-red-200 p-3">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold px-8 py-3 text-sm disabled:opacity-50"
          >
            {loading
              ? "Submitting…"
              : isEditing
              ? "Update Review"
              : "Submit Review"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs font-sans-clean text-[#6b6b6b] hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete review"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
