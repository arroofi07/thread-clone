import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateFollowDto } from './dto/follow.dto';
// import { CreateUnfollowDto } from './dto/unfollow.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostingDto } from './dto/create-postingan.dto';
import { Postingan } from './entities/postingan.entity';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { LikesDto } from './dto/likes.dto';
import { LikesCommentsDto } from './dto/likesComment.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authservice: AuthService,
  ) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  async login(@Body() body: { name: string; password: string }) {
    try {
      return await this.authservice.authenticate(body.name, body.password);
    } catch (error) {
      throw new UnauthorizedException('Authentication Failed');
    }
  }

  @Post('/follow')
  async followUser(
    @Body() followDto: CreateFollowDto,
    @Body('userId') userId: number,
    @Body('userIdFollowing') userIdFollowing: number,
  ) {
    const followStatus = await this.userService.followUser(
      followDto,
      userId,
      userIdFollowing,
    );
    return { followStatus };
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // postingan
  // @Post('/file')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
  //         callback(null, filename);
  //       },
  //     }),
  //   }),
  // )
  // async handleUpload(@UploadedFile() file: Express.Multer.File) {
  //   console.log('file', file);
  //   return 'file upload API';
  // }

  @Get('uploads/:filename')
  async serveAvatar(@Param('filename') filename, @Res() res): Promise<any> {
    const path = join(process.cwd(), 'uploads', filename);
    return res.sendFile(path);
  }

  // create post
  @Post('/file/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async handleUpload(
    @Param('id') id: number,
    @Body('text') text: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.userService.createPostingForUser(id, text, file);
    return result;
  }

  // update post
  @Patch('/file/updated/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async handleUpdate(
    @Param('postId') postId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('text') text: string,
  ) {
    const result = await this.userService.updatePostingForUser(
      postId,
      text,
      file,
    );
    return result;
  }

  // remove post

  @Delete('/remove/:userId/:postingId')
  async deletePostingForUser(
    @Param('userId') userId: number,
    @Param('postingId') postingId: number,
  ) {
    await this.userService.deletePostingForUser(userId, postingId);
    return { message: 'Postingan and related files deleted successfully' };
  }

  //
  //
  //
  // profile
  @Get('profile/:filename')
  async serveProfileImage(
    @Param('filename') filename,
    @Res() res,
  ): Promise<any> {
    const path = join(process.cwd(), 'profile', filename);
    return res.sendFile(path);
  }

  @Post('/profile/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'profile/',
        filename: (req, file, callback) => {
          const uniqName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${file.originalname}-${uniqName}${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async handleProfile(
    @Param('id') id: number,
    @Body('alamat') alamat: string,
    @Body('bio') bio: string,
    @Body('tautan') tautan: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.userService.createProfile(
      id,
      alamat,
      bio,
      tautan,
      file,
    );
    return result;
  }

  @Patch('/profile/updated/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'profile/',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async handleUpdateProfile(
    @Param('id') postId: number,
    @Body('alamat') alamat: string,
    @Body('bio') bio: string,
    @Body('tautan') tautan: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.userService.updateProfile(
      postId,
      alamat,
      bio,
      tautan,
      file,
    );
    return result;
  }

  // likes
  @Post('/likes')
  async likesUser(
    @Body() likesDto: LikesDto,
    @Body('liking') liking: number,
    @Body('postinganId') postinganId: number,
  ) {
    const likesStatus = await this.userService.likesUser(
      likesDto,
      liking,
      postinganId,
    );
    return { likesStatus };
  }

  // commment
  @Post('/comments/:id/:userId/:photoProfile/:userName')
  async createComments(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Param('userName') userName: string,
    @Body('text') text: string,
    @Param('photoProfile') photoProfile: string,
  ) {
    const result = await this.userService.createComments(
      id,
      text,
      userId,
      userName,
      photoProfile,
    );
    return result;
  }

  // likes comments
  @Post('/likesComments')
  async createLikesComments(
    @Body() likesCommentsDto: LikesCommentsDto,
    @Body('liking') liking: number,
    @Body('commentId') commentId: number,
  ) {
    const likesStatus = await this.userService.createLikesComment(
      likesCommentsDto,
      liking,
      commentId,
    );
    return { likesStatus };
  }

  @Post('/nextedComments/:id/:userId/:photoProfile/:userName')
  async createNextedComments(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Param('userName') userName: string,
    @Param('photoProfile') photoProfile: string,
    @Body('text') text: string,
  ) {
    const result = await this.userService.createNextedComments(
      id,
      text,
      userId,
      userName,
      photoProfile,
    );
    return result;
  }
}
