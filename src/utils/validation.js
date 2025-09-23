const { z } = require("zod");

// ---------------------- Zod Schema ----------------------
const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Email is not valid"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  gender: z
    .string()
    .optional()
    .refine((val) => !val || ["Male", "Female", "Other"].includes(val), {
      message: "Gender must be Male, Female, or Other",
    }),
  age: z.number().min(15).optional(),
  about: z.string().optional(),
  photoUrl: z.url().optional(),
  skills: z.array(z.string()).optional(),
  isPremium: z.boolean().optional(),
  membershipType: z.string().optional(),
});
// Validator function
const validateSignUpData = (req) => {
  return signUpSchema.parse(req.body); // throws if invalid
};

module.exports = { validateSignUpData };
