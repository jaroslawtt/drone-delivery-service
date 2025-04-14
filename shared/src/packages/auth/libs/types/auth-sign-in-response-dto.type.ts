import { type UserGetAllItemReponseDto } from "~/packages/users/libs/types/user-get-all-item-response-dto.type.js";

type AuthSignInResponseDto = {
  user: UserGetAllItemReponseDto;
  accessToken: string;
};

export { type AuthSignInResponseDto };
