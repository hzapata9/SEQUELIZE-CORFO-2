import bcript from "bcryptjs";

import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

interface UserAttributes {
  uid?: string;
  username?: string;
  password: string;
  email: string;
}

@Table({
  tableName: "users",
})
export class User extends Model<UserAttributes> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  uid!: string;

  @Column(DataType.STRING)
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @IsEmail
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @BeforeUpdate
  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.changed("password")) {
      user.password = await bcript.hash(user.password, 10);
      return user;
    }
    user.password = await bcript.hash(user.password, 10);
  }

  async validatePassword(password: string) {
    return await bcript.compare(password, this.password);
  }
}
