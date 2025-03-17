import { z } from "zod";
import { UserValidationMessage } from "../enums/enums.js";

const userUpdate = z.object({
  firstName: z
    .string({
      required_error: UserValidationMessage.FIRST_NAME_REQUIRED,
      invalid_type_error: UserValidationMessage.FIRST_NAME_INVALID_TYPE,
    })
    .min(2, UserValidationMessage.FIRST_NAME_MIN_LENGTH)
    .max(50, UserValidationMessage.FIRST_NAME_MAX_LENGTH)
    .trim(),

  lastName: z
    .string({
      required_error: UserValidationMessage.LAST_NAME_REQUIRED,
      invalid_type_error: UserValidationMessage.LAST_NAME_INVALID_TYPE,
    })
    .min(2, UserValidationMessage.LAST_NAME_MIN_LENGTH)
    .max(50, UserValidationMessage.LAST_NAME_MAX_LENGTH)
    .trim(),
});

export { userUpdate };
