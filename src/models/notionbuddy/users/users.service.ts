import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotionBuddyUser } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(NotionBuddyUser)
    private userRepository: Repository<NotionBuddyUser>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto).save();
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(userId, updateUserDto);
  }

  async isRegisteredUser(userSearchObject: FindOptionsWhere<NotionBuddyUser>) {
    return await this.userRepository.existsBy(userSearchObject);
  }

  async getRegisteredUser(userSearchObject: FindOptionsWhere<NotionBuddyUser>) {
    return await this.userRepository.findOne({
      where: userSearchObject,
    });
  }
}
