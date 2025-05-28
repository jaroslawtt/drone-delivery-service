import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { type User } from "./libs/types/types.js";
import { UserEntity } from "./user.entity.js";
import { IRepository } from "~/libs/interfaces/interfaces.js";
import * as relations from "~/libs/packages/database/database.schema.js";
import { BaseRepository } from "~/libs/packages/repository/repository.package.js";

@Injectable()
class UserRepository
  extends BaseRepository
  implements Omit<IRepository, "findAll">
{
  public async create(payload: UserEntity): Promise<UserEntity> {
    const { email, firstName, lastName, passwordHash, passwordSalt } =
      payload.toNewObject();

    const newUser = await this.database.transaction(async (trx) => {
      const [result] = await trx
        .insert(relations.users)
        .values({
          email,
          passwordHash,
          passwordSalt,
        })
        .returning({
          userId: relations.users.id,
        });

      if (!result?.userId) {
        throw new Error("Failed to create a new user");
      }

      await trx.insert(relations.userDetails).values({
        userId: result.userId,
        firstName,
        lastName,
      });

      return {
        id: result.userId,
        firstName,
        lastName,
        email,
        passwordHash,
        passwordSalt,
      };
    });

    return UserEntity.initialize({
      id: newUser.id,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      passwordSalt: newUser.passwordSalt,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
  }

  public async findByEmail(email: User["email"]): Promise<UserEntity | null> {
    const user = await this.database.query.users.findFirst({
      where: eq(relations.users.email, email),
      with: {
        userDetails: true,
      },
    });

    if (!user) {
      return null;
    }

    return UserEntity.initialize({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      passwordSalt: user.passwordSalt,
      firstName: user.userDetails.firstName,
      lastName: user.userDetails.lastName,
    });
  }

  public async find(userId: User["id"]): Promise<UserEntity | null> {
    const user = await this.database.query.users.findFirst({
      where: eq(relations.users.id, userId),
      with: {
        userDetails: true,
      },
    });

    if (!user) {
      return null;
    }

    return UserEntity.initialize({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      passwordSalt: user.passwordSalt,
      firstName: user.userDetails.firstName,
      lastName: user.userDetails.lastName,
    });
  }

  public async update(payload: UserEntity): Promise<UserEntity> {
    const { id: userId, firstName, lastName } = payload.toObject();

    await this.database
      .update(relations.userDetails)
      .set({
        firstName,
        lastName,
      })
      .where(eq(relations.userDetails.userId, userId));

    return (await this.find(userId)) as UserEntity;
  }

  public async updatePassword(payload: UserEntity): Promise<UserEntity> {
    const { id: userId } = payload.toObject();
    const { passwordHash, passwordSalt } = payload.privateData;

    await this.database
      .update(relations.users)
      .set({
        passwordHash,
        passwordSalt,
      })
      .where(eq(relations.users.id, userId));

    return (await this.find(userId)) as UserEntity;
  }

  public async delete(userId: User["id"]): Promise<void> {
    return void (await this.database.transaction(async (trx) => {
      await trx
        .delete(relations.userDetails)
        .where(eq(relations.userDetails.userId, userId));

      await trx.delete(relations.users).where(eq(relations.users.id, userId));
    }));
  }
}

export { UserRepository };
