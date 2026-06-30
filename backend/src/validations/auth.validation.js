const { z } = require("zod");

const registerAdminSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters."),

  email: z.string().trim().email("Please enter a valid email address."),

  password: z.string().min(8, "Password must contain at least 8 characters."),

  department: z.string().trim().min(2, "Department is required."),
});

module.exports = {
  registerAdminSchema,
};
