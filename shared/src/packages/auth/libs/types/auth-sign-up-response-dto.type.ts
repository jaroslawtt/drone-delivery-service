import { type UserGetAllItemReponseDto } from "~/packages/users/libs/types/user-get-all-item-response-dto.type.js";

type AuthSignUpResponseDto = {
  user: UserGetAllItemReponseDto;
  accessToken: string;
};

export { type AuthSignUpResponseDto };
