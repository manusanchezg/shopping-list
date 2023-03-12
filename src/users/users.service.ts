import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpInput } from '../auth/dto/inputs';
import { UpdateUserInput, CreateUserInput } from './dto/inputs';
import { User } from './entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    if (roles.length === 0)
      return this.usersRepository.find({
        //? not neccessary because we have lazy in lastUpdatedBy
        // relations: {
        //   lastUpdateBy: true,
        // },
      });
    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      // looks for the role value in the DB Array
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      // helps for SQL injection, same names as above ...roles
      .setParameter('roles', roles);
      if (search) {
      queryBuilder.andWhere('LOWER(full_name) like :full_name', {
        full_name: `%${search.toLowerCase()}%`,
      });
    }
    return queryBuilder.getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updatedBy: User,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id,
      });
      console.log(updatedBy);
      user.lastUpdateBy = updatedBy;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return await this.usersRepository.save(userToBlock);
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }
}
