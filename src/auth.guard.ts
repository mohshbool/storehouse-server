import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { UserService } from './user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // REST API

    const token = request?.headers?.authorization || '';

    Logger.debug(`Authorization: ${token}`);

    if (token === '') {
      return false;
    }

    const user = await this.userService.validate(token);

    if (user) {
      request.user = user;
    }

    return !!user;
  }
}
