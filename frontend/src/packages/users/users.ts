import { http } from "~/libs/packages/http/http";
import { UserApi } from "./user-api";

const userApi = new UserApi({
  baseUrl: process.env["NEXT_PUBLIC_API_ORIGIN_URL"] as string,
  http: http,
});

export {
  type UserGetAllItemReponseDto,
  type UserUpdatePasswordDto,
  type UserUpdateRequestDto,
} from "./libs/types/types";
export {
  userUpdateValidationSchema,
  userUpdatePasswordValidationSchema,
} from "./validation-schemas/validation-schemas";
export { userApi };
