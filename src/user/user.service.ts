import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { TokenService } from 'src/token/token.service';
import {
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  UpdatePassword,
} from './user.interface';
import { User, UserDocument } from './user.schema';
import { CodeService } from 'src/code/code.service';

@Injectable()
export class UserService {
  constructor(
    private readonly codeService: CodeService,
    private readonly tokenService: TokenService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    createUserInput.email = createUserInput.email.toLocaleLowerCase();
    const userCheck = await this.findUser(createUserInput);

    if (userCheck) {
      throw new BadRequestException('Account already exists');
    }

    const user: UserDocument = new this.userModel(createUserInput);

    if (createUserInput.password && createUserInput.password !== '') {
      user.password = await hash(createUserInput.password, 10);
    }

    try {
      await user.save();
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }

    return {
      ...user.toJSON(),
      token: await this.tokenService.create(user),
    };
  }

  async findAll() {
    return this.userModel.find({ deleted: false });
  }

  async findOne(_id: string) {
    return this.userModel.findOne({ _id, deleted: false });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    if (
      !!(await this.findUser({
        email: updateUserInput.email,
      }))
    ) {
      throw new BadRequestException('Email or Phone already in use');
    }
    try {
      const user = await this.userModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...updateUserInput,
            updated_at: new Date(),
          },
        },
        {
          new: true,
        },
      );

      return user.toJSON();
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async remove(id: string) {
    return this.update(id, { deleted: true });
  }

  async validate(token: string) {
    const auth_token = token?.split(' ').pop();
    return !!(await this.tokenService.findOneByToken(auth_token));
  }

  async findUser({ email }: { email: string }) {
    return this.userModel.findOne({
      deleted: false,
      $or: [
        {
          email: {
            $exists: true,
            $eq: email.toLocaleLowerCase(),
            $ne: '',
          },
        },
      ],
    });
  }

  async login({ password, ...loginInput }: LoginInput) {
    const user = await this.findUser(loginInput);

    if (!user) {
      throw new BadRequestException("User deosn't exist or has been deleted");
    }

    if (password && !(await compare(password, user.password))) {
      throw new BadRequestException('Incorrect credentials');
    }

    return {
      ...user.toJSON(),
      token: await this.tokenService.create(user),
    };
  }

  async updatePassword(id: string, { password, oldPassword }: UpdatePassword) {
    if (oldPassword) {
      const user = await this.findOne(id);
      if (!(await compare(oldPassword, user.password))) {
        throw new BadRequestException('Old password doesnt match');
      }
    }
    return this.update(id, { password: await hash(password, 10) });
  }

  async forgetPassword(email: string) {
    if (email) {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new BadRequestException('No user with this email was found');
      }

      this.codeService.send(user);

      return {
        ...user.toJSON(),
        token: await this.tokenService.create(user),
      };
    }
    return null;
  }

  async refreshToken(user: UserDocument) {
    return this.tokenService.refreshToken(user);
  }

  async getByQuarter(year = 2021) {
    return [
      await this.userModel.count({
        created_at: {
          $gte: new Date(year, 1, 1),
          $lt: new Date(year, 3, 1),
        },
      }),
      await this.userModel.count({
        created_at: {
          $gte: new Date(year, 3, 1),
          $lt: new Date(year, 6, 1),
        },
      }),
      await this.userModel.count({
        created_at: {
          $gte: new Date(year, 6, 1),
          $lt: new Date(year, 9, 1),
        },
      }),
      await this.userModel.count({
        created_at: {
          $gte: new Date(year, 9, 1),
          $lt: new Date(year, 12, 1),
        },
      }),
    ];
  }
}
