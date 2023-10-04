import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async authenticate(name: string, password: string) {
    try {
      const user = await this.userService.validateUser(name, password);

      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.SECRET_JWT,
        {
          expiresIn: '7d',
        },
      );
      return { token, user: { id: user.id } };
    } catch (error) {}
  }
}
