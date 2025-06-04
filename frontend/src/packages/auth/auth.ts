import { http } from "~/libs/packages/http/http";
import { AuthApi } from "./auth-api";

export {
  type AuthSignInRequestDto,
  type AuthSignUpRequestDto,
  type AuthSignInResponseDto,
  type AuthGetCurrentResponseDto,
  type AuthGenerateAccessResponseDto,
  type AuthSignUpResponseDto,
} from "./libs/types/types";
export {
  authSignInValidationSchema,
  authSignUpValidationSchema,
} from "./libs/validation-schemas/validation-schemas";
export { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "./libs/constants";

const authApi = new AuthApi({
  baseUrl: process.env["NEXT_PUBLIC_API_ORIGIN_URL"] as string,
  http: http,
});

export { authApi };
