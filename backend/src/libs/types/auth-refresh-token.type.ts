import { type AuthToken } from "./auth-token.type.js";

type AuthRefreshToken = {
  type: "refresh";
} & AuthToken;

export { type AuthRefreshToken };
