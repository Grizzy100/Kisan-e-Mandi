import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─────────────────────────────────────────────────────────────────
// protect – verifies the JWT and attaches req.user
// Usage: router.get("/protected-route", protect, handler)
// ─────────────────────────────────────────────────────────────────
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized – no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Exclude sensitive fields from the attached user object
    req.user = await User.findById(decoded.id).select(
      "-password -emailVerifyToken -resetPasswordToken"
    );

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized – user no longer exists" });
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized – token is invalid or expired" });
  }
};

// ─────────────────────────────────────────────────────────────────
// authorizeRoles – restricts access to specific roles
// Usage: router.get("/admin", protect, authorizeRoles("admin"), handler)
// ─────────────────────────────────────────────────────────────────
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied – role '${req.user?.role}' is not permitted`,
      });
    }
    next();
  };
};
