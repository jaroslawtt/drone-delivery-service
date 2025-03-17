import { z } from "zod";
import { UserValidationMessage } from "~/packages/users/libs/enums/enums.js";

const authSignIn = z.object({
  email: z
    .string({
      required_error: UserValidationMessage.EMAIL_REQUIRED,
      invalid_type_error: UserValidationMessage.EMAIL_INVALID_TYPE,
    })
    .email(UserValidationMessage.EMAIL_INVALID)
    .toLowerCase()
    .trim(),
  password: z
    .string({
      required_error: UserValidationMessage.PASSWORD_REQUIRED,
      invalid_type_error: UserValidationMessage.PASSWORD_INVALID_TYPE,
    })
    .min(8, UserValidationMessage.PASSWORD_MIN_LENGTH)
    .max(50, UserValidationMessage.PASSWORD_MAX_LENGTH)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      UserValidationMessage.PASSWORD_REGEX,
    ),
});

export { authSignIn };
