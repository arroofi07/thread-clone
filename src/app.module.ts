import { Module } from '@nestjs/common';
// import { BooksModule } from './books/books.module';
// import { typeOrmConfig } from './config/typeorm.config';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  // imports: [TypeOrmModule.forRoot(typeOrmConfig),BooksModule],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
