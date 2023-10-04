import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Comments } from './entities/comments.entity';
import { Follow } from './entities/follow.entity';
import { Postingan } from './entities/postingan.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Profile } from './entities/profile.entity.';
import { Likes } from './entities/likes.entity';
import { LikesComments } from './entities/likesComments.entity';
import { NextedComments } from './entities/nextedComments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Comments, 
      Follow,
      Postingan,
      Profile,
      Likes,
      LikesComments,
      NextedComments,
    ]),
    JwtModule.register({
      secret: 'arovi-good',
      signOptions: { expiresIn: '1h' },
    }),
    MulterModule.register({ dest: 'uploads/' }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
