import { HttpStatus, HttpException, Injectable } from "@nestjs/common";
import {
  type UserUpdate,
  type UserCreate,
  User,
  UserUpdatePasswordDto,
} from "./libs/types/types.js";
import { UserEntity } from "./user.entity.js";
import { UserRepository } from "./user.repository.js";
import { IService } from "~/libs/interfaces/interfaces.js";
import { Encrypt } from "~/libs/packages/encrypt/encrypt.js";
import { ConfigService } from "@nestjs/config";

@Injectable()
class UserService implements Omit<IService, "findAll"> {
  private readonly userRepository: UserRepository;
  private readonly encrypt: Encrypt;
  private readonly configService: ConfigService;

  public constructor(
    userRepository: UserRepository,
    encrypt: Encrypt,
    configService: ConfigService,
  ) {
    this.userRepository = userRepository;
    this.encrypt = encrypt;
    this.configService = configService;
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

  public async delete(userId: User["id"]) {
    return void (await this.userRepository.delete(userId));
  }

  public async changePassword(
    userId: User["id"],
    payload: UserUpdatePasswordDto,
  ) {
    const { password, repeatPassword } = payload;

    if (password !== repeatPassword) {
      throw new HttpException("Passwords do not match", HttpStatus.FORBIDDEN);
    }

    const user = await this.userRepository.find(userId);

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const passwordSalt = await this.encrypt.generateSalt(
      this.configService.get<number>("USER_PASSWORD_SALT_ROUNDS") as number,
    );
    const passwordHash = await this.encrypt.encrypt(password, passwordSalt);

    await this.userRepository.updatePassword(
      UserEntity.initialize({
        id: userId,
        passwordHash,
        passwordSalt,
        email: null,
        firstName: null,
        lastName: null,
      }),
    );

    return user.toObject();
  }
}

export { UserService };
