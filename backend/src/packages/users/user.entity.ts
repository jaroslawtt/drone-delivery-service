import {
  type UserPrivateDataPayload,
  type UserEntityPayload,
} from "./libs/types/types.js";
import { IEntity } from "~/libs/interfaces/interfaces.js";

class UserEntity implements IEntity {
  private readonly "id": number | null;

  private readonly "email": string | null;

  private readonly "passwordHash": string | null;

  private readonly "passwordSalt": string | null;

  private readonly "firstName": string | null;

  private readonly "lastName": string | null;

  private constructor({
    id,
    email,
    passwordHash,
    passwordSalt,
    firstName,
    lastName,
  }: {
    id: number | null;
    email: string | null;
    passwordHash: string | null;
    passwordSalt: string | null;
    firstName: string | null;
    lastName: string | null;
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.passwordSalt = passwordSalt;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public get privateData(): UserPrivateDataPayload {
    return {
      passwordHash: this.passwordHash as string,
      passwordSalt: this.passwordSalt as string,
    };
  }

  public static initialize({
    id,
    email,
    passwordHash,
    passwordSalt,
    firstName,
    lastName,
  }: {
    id: number | null;
    email: string | null;
    passwordHash: string | null;
    passwordSalt: string | null;
    firstName: string | null;
    lastName: string | null;
  }): UserEntity {
    return new UserEntity({
      id,
      email,
      passwordHash,
      passwordSalt,
      firstName,
      lastName,
    });
  }

  public static initializeNew({
    email,
    passwordHash,
    passwordSalt,
    firstName,
    lastName,
  }: {
    email: string;
    passwordHash: string;
    passwordSalt: string;
    firstName: string;
    lastName: string;
  }): UserEntity {
    return new UserEntity({
      id: null,
      email,
      passwordHash,
      passwordSalt,
      firstName,
      lastName,
    });
  }

  public toNewObject(): {
    email: string;
    passwordHash: string;
    passwordSalt: string;
    firstName: string;
    lastName: string;
  } {
    return {
      email: this.email as string,
      passwordHash: this.passwordHash as string,
      passwordSalt: this.passwordSalt as string,
      firstName: this.firstName as string,
      lastName: this.lastName as string,
    };
  }

  public toObject(): UserEntityPayload {
    return {
      id: this.id as number,
      email: this.email as string,
      firstName: this.firstName as string,
      lastName: this.lastName as string,
    };
  }
}

export { UserEntity };
