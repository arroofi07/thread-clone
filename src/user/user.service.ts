import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'; // Import library bcrypt
import { Comments } from './entities/comments.entity';
import { Follow } from './entities/follow.entity';
import { CreateFollowDto } from './dto/follow.dto';
import { Postingan } from './entities/postingan.entity';
import { CreatePostingDto } from './dto/create-postingan.dto';
import * as fs from 'fs';
import { Profile } from './entities/profile.entity.';
import { Likes } from './entities/likes.entity';
import { LikesDto } from './dto/likes.dto';
import { LikesComments } from './entities/likesComments.entity';
import { LikesCommentsDto } from './dto/likesComment.dto';
import { NextedComments } from './entities/nextedComments.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager, // Tambahkan ini
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(Postingan)
    private postinganRepository: Repository<Postingan>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(LikesComments)
    private likesCommentsRepository: Repository<LikesComments>,
    @InjectRepository(NextedComments)
    private nextedComments: Repository<NextedComments>,
  ) {}

  //
  //  register
  async create(createUserDto: CreateUserDto) {
    if (!/^[a-zA-Z0-9\s]+$/.test(createUserDto.password)) {
      throw new BadRequestException(
        'Password must only contain letters and numbers.',
      );
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.entityManager.save(newUser);
  }
  //
  // login
  async validateUser(name: string, password: string | Buffer) {
    const user = await this.userRepository.findOne({
      where: { name },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid Credentials');
    }
    return user;
  }

  // followers
  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async followUser(
    followDto: CreateFollowDto,
    userId: number,
    userIdFollowing: number,
  ) {
    const { followerId, followingId } = followDto;
    const following = await this.findUserById(followingId);
    const follower = await this.findUserById(followerId);

    let follow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
        userId,
        userIdFollowing,
      },
    });

    if (!follow) {
      follow = new Follow();
      follow.follower = follower;
      follow.following = following;
      follow.followStatus = true;
      follow.userId = userId;
      follow.userIdFollowing = userIdFollowing;
      await this.followRepository.save(follow);
      return 'Follow';
    } else {
      follow.followStatus = !follow.followStatus;
      await this.followRepository.remove(follow);
      return 'Unfollow';
    }
  }

  //user
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: [
        'followers',
        'following',
        'postings',
        'profile',
        'postings.liked',
        'postings.comment',
        'postings.comment.likedComments',
        'postings.comment.nextedComments',
      ],
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: [
        'followers',
        'following',
        'postings',
        'profile',
        'postings.liked',
        'postings.comment',
        'postings.comment.likedComments',
        'postings.comment.nextedComments',
      ],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    user.name = updateUserDto.name;
    user.password = updateUserDto.password;
    await this.entityManager.save(user);
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   const user = await this.userRepository.findOneBy({ id });
  //   const comments = updateUserDto.comments.map(
  //     (createCommentdto) => new Comment(createCommentdto),
  //   );
  //   user.comments = comments;
  //   await this.entityManager.save(user);
  // }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }

  // create post
  async createPostingForUser(
    id: number,
    text: string,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    const postingan = new Postingan();
    if (text) {
      postingan.user = user;
      postingan.text = text;
    }
    if (file) {
      postingan.user = user;
      postingan.originalName = file.originalname;
      postingan.fileName = file.filename;
      postingan.filePath = file.path;
    }

    return this.postinganRepository.save(postingan);
  }

  // update post
  async updatePostingForUser(
    id: number,
    text: string,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    const postingan = await this.postinganRepository.findOne({ where: { id } });

    // menghapus file di folder upload yang dikirm sebelumnya
    if (postingan.filePath) {
      fs.unlinkSync(postingan.filePath);
    }

    postingan.user = user;
    postingan.text = text;
    postingan.originalName = file.originalname;
    postingan.fileName = file.filename;
    postingan.filePath = file.path;

    await this.postinganRepository.save(postingan);

    return postingan;
  }

  // remove post
  async deletePostingForUser(userId: number, postingId: number): Promise<void> {
    const postingan = await this.postinganRepository.findOne({
      where: { id: postingId, user: { id: userId } },
    });

    if (postingan.filePath) {
      try {
        fs.unlinkSync(postingan.filePath); // Hapus file dari sistem file
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    await this.postinganRepository.remove(postingan);
  }

  // profile
  async createProfile(
    id: number,
    alamat: string,
    bio: string,
    tautan: string,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    const profile = new Profile();
    profile.user = user;
    if (alamat) {
      profile.alamat = alamat;
    }
    if (bio) {
      profile.bio = bio;
    }
    if (tautan) {
      profile.tautan = tautan;
    }
    if (file) {
      profile.fileName = file.filename;
      profile.filePath = file.path;
    }
    return this.profileRepository.save(profile);
  }

  async updateProfile(
    id: number,
    alamat: string,
    bio: string,
    tautan: string,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    const profile = await this.profileRepository.findOne({
      where: { user: { id } },
    });

    profile.user = user;
    if (alamat) {
      profile.alamat = alamat;
    }
    if (bio) {
      profile.bio = bio;
    }
    if (tautan) {
      profile.tautan = tautan;
    }
    if (file) {
      profile.fileName = file.filename;
      profile.filePath = file.path;
      if (!profile.filePath) {
        fs.unlinkSync(profile.filePath);
      }
    }
    await this.profileRepository.save(profile);
    return profile;
  }

  // async deleteProfile(userId: number, profileId: number) {
  //   const profile = await this.profileRepository.findOne({
  //     where: { id: profileId, user: { id: userId } },
  //   });

  //   if (profile.filePath) {
  //     fs.unlinkSync(profile.filePath);
  //   }

  //   await this.profileRepository.remove(profile);
  // }

  // likes features
  async findPostinganById(id: number): Promise<Postingan | undefined> {
    return this.postinganRepository.findOne({
      where: { id },
    });
  }

  async likesUser(likesDto: LikesDto, liking: number, postinganId: number) {
    const { likedId } = likesDto;
    const liked = await this.findPostinganById(likedId);

    let likes = await this.likesRepository.findOne({
      where: {
        liking: liking,
        liked: { id: likedId },
        postinganId: postinganId,
      },
    });

    if (!likes) {
      likes = new Likes();
      likes.liking = liking;
      likes.liked = liked;
      likes.postinganId = postinganId;
      likes.likesStatus = true;
      await this.likesRepository.save(likes);
      return 'Liked';
    } else {
      likes.likesStatus = !likes.likesStatus;
      await this.likesRepository.remove(likes);
      return 'Unliked';
    }
  }

  async createComments(
    id: number,
    text: string,
    userId: number,
    userName: string,
    photoProfile: string,
  ) {
    const postinganId = await this.postinganRepository.findOne({
      where: { id },
    });

    const comment = new Comments();
    comment.comment = postinganId;
    comment.text = text;
    comment.userId = userId;
    comment.photoProfile = photoProfile;
    comment.postId = id;
    comment.userName = userName;

    return await this.commentsRepository.save(comment);
  }

  //
  //
  // likesComment
  async findCommentById(id: number): Promise<Comments | undefined> {
    try {
      return await this.commentsRepository.findOne({
        where: { id },
      });
    } catch (err) {
      console.error('find id comments filed', err);
    }
  }
  async createLikesComment(
    likesCommentsDto: LikesCommentsDto,
    liking: number,
    commentId: number,
  ) {
    const { likedCommentsId } = likesCommentsDto;
    const liked = await this.findCommentById(likedCommentsId);

    let likes = await this.likesCommentsRepository.findOne({
      where: {
        likedComments: liked,
        liking: liking,
        commentId: commentId,
      },
    });

    if (!likes) {
      likes = new LikesComments();
      likes.likedComments = liked;
      likes.liking = liking;
      likes.commentId = commentId;
      likes.likesStatus = true;
      await this.likesCommentsRepository.save(likes);
      return 'Liked';
    } else {
      likes.likesStatus = !likes.likesStatus;
      await this.likesCommentsRepository.remove(likes);
      return 'Unliked';
    }
  }

  //
  //nexted comment
  async createNextedComments(
    id: number,
    text: string,
    userId: number,
    userName: string,
    photoProfile: string,
  ) {
    const commentsId = await this.commentsRepository.findOne({
      where: { id },
    });

    const newComments = new NextedComments();
    newComments.nextedComments = commentsId;
    newComments.text = text;
    newComments.photoProfile = photoProfile;
    newComments.userId = userId;
    newComments.commentId = id;
    newComments.userName = userName;

    return await this.nextedComments.save(newComments);
  }
}
