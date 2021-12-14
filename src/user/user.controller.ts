import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { CurrentUser } from './user.decorator';
import { CreateUserInput, LoginInput, UpdatePassword } from './user.interface';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(userInput: CreateUserInput) {
    return this.userService.create(userInput);
  }

  @Post('login')
  async login(loginInput: LoginInput) {
    return this.userService.login(loginInput);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findOne(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('update-password')
  async updatePassword(input: UpdatePassword, @CurrentUser() user: User) {
    return this.userService.updatePassword(user.id, input);
  }

  @Post('forget-password')
  async forgetPassword(email: string) {
    return this.userService.forgetPassword(email);
  }

  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }
}
