import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { CurrentUser } from './user.decorator';
import { CreateUserInput, LoginInput, UpdatePassword } from './user.interface';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() userInput: CreateUserInput) {
    return this.userService.create(userInput);
  }

  @Post('login')
  async login(@Body() loginInput: LoginInput) {
    return this.userService.login(loginInput);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findOne(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('update-password')
  async updatePassword(
    @Body() input: UpdatePassword,
    @CurrentUser() user: User,
  ) {
    return this.userService.updatePassword(user.id, input);
  }

  @Post('forget-password')
  async forgetPassword(@Body() email: string) {
    return this.userService.forgetPassword(email);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('by-quarter')
  async getByQuarter(@Param('year') year: number) {
    return this.userService.getByQuarter(year);
  }
}
