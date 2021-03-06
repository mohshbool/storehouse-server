export class CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export class UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  deleted?: boolean;
}

export class LoginInput {
  email: string;
  password: string;
}

export class UpdatePassword {
  password: string;
  oldPassword: string;
}
