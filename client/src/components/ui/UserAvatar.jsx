// client/src/components/ui/UserAvatar.jsx
// Reusable avatar component.
// Shows the user's profile photo if available.
// Falls back to a colored circle with the first letter of their email (or name).
import { useState } from "react";

/**
 * @param {string}  src       - URL of the user's profile photo (optional)
 * @param {string}  email     - User's email address (used for fallback letter)
 * @param {string}  name      - User's display name (secondary fallback)
 * @param {string}  className - Extra CSS classes for sizing & shape (e.g. "w-9 h-9 rounded-full")
 * @param {string}  alt       - Alt text for the image
 */
const UserAvatar = ({ src, email, name, className = "", alt = "User avatar" }) => {
  const [imgError, setImgError] = useState(false);

  // Derive the fallback letter: prefer first char of email, then name, then "U"
  const fallbackLetter = (email?.[0] || name?.[0] || "U").toUpperCase();

  // Deterministic background color based on email/name
  // so the same user always gets the same color across every page
  const getColor = (str = "") => {
    const colors = [
      "#16a34a", // green
      "#2563eb", // blue
      "#9333ea", // purple
      "#ea580c", // orange
      "#0891b2", // cyan
      "#be123c", // rose
      "#ca8a04", // amber
      "#15803d", // dark green
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getColor(email || name || "");

  // Show image if src exists and hasn't errored
  const showImage = src && !imgError;

  if (showImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={`object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback: colored div with the first letter
  // Using <div> instead of <span> so that Tailwind w-* h-* classes work correctly
  return (
    <div
      className={`flex items-center justify-center font-bold text-white select-none ${className}`}
      style={{ backgroundColor: bgColor }}
      aria-label={alt}
      title={email || name || "User"}
    >
      {fallbackLetter}
    </div>
  );
};

export default UserAvatar;
