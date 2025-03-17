import { Injectable } from "@nestjs/common";
import { type UserUpdate, type UserCreate, User } from "./libs/types/types.js";
import { UserEntity } from "./user.entity.js";
import { UserRepository } from "./user.repository.js";
import { IService } from "~/libs/interfaces/interfaces.js";

@Injectable()
class UserService implements Omit<IService, "findAll"> {
  private readonly userRepository: UserRepository;

  public constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async create(payload: UserCreate) {
    const { email, passwordHash, passwordSalt, firstName, lastName } = payload;

    const user = await this.userRepository.create(
      UserEntity.initializeNew({
        email,
        firstName,
        lastName,
        passwordHash,
        passwordSalt,
      }),
    );

    return user.toObject();
  }

  public async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    return user.toObject();
  }

  public async find(userId: number) {
    const user = await this.userRepository.find(userId);

    if (!user) {
      return null;
    }

    return user.toObject();
  }

  public async getUserPrivateData(userId: number) {
    const user = await this.userRepository.find(userId);

    if (!user) {
      return null;
    }

    return user.privateData;
  }

  public async update(id: User["id"], payload: UserUpdate) {
    const { firstName, lastName } = payload;

    const user = await this.userRepository.update(
      UserEntity.initialize({
        id,
        email: null,
        firstName,
        lastName,
        passwordHash: null,
        passwordSalt: null,
      }),
    );

    return user.toObject();
  }

  public async delete() {}
}

export { UserService };
