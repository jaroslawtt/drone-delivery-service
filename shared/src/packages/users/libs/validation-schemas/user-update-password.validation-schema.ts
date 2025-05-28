import { z } from "zod";
import { userUpdatePasswordValidationMessage } from "../enums/enums.js";
import { UserValidationMessage } from "../enums/user-validation-message.enum.js";

const userUpdatePassword = z
  .object({
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
    repeatPassword: z
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
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: userUpdatePasswordValidationMessage.PASSWORDS_DO_NOT_MATCH,
    path: ["repeatPassword"],
  });

export { userUpdatePassword };
