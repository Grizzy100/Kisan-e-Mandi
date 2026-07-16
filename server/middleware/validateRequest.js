//server\middleware\validateRequest.js
import { body, validationResult } from "express-validator";

/**
 * Middleware to handle validation errors consistently
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validation rules for creating a post
 */
export const validatePost = [
  body("author")
    .notEmpty()
    .withMessage("Author is required."),
  body("location")
    .notEmpty()
    .withMessage("Location is required."),
  body("content")
    .notEmpty()
    .withMessage("Content is required."),
  handleValidationErrors,
];

/**
 * Validation rules for creating a support ticket
 */
export const validateSupportTicket = [
  body("cropType")
    .notEmpty()
    .withMessage("Crop type is required."),
  body("cropName")
    .notEmpty()
    .withMessage("Crop name is required."),
  body("description")
    .notEmpty()
    .withMessage("Description is required."),
  handleValidationErrors,
];



/**
 * Middleware to validate creating an item (future use)
 */
// export const validateItem = [
//   body("name")
//     .notEmpty()
//     .withMessage("Item name is required."),
//   body("price")
//     .notEmpty()
//     .withMessage("Price is required.")
//     .isNumeric()
//     .withMessage("Price must be a number."),
//   handleValidationErrors,
// ];



// This acts as validator/ folder. We have used express-validator instead of zod and all.
// This is used to validate the request and response but for 
// POST and SUPPORT TICKET
