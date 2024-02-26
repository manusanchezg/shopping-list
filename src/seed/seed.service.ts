import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/items/entities';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';

import { ItemsService } from 'src/items/items.service';
import { ListItemService } from 'src/list-item/list-item.service';
import { ListsService } from 'src/lists/lists.service';
import { UsersService } from 'src/users/users.service';

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed() {
    if (this.isProd)
      throw new UnauthorizedException("Can't run SEED on production!");
    await this.deleteDatabase();
    const user = await this.loadUsers();
    await this.loadItems(user);
    const list = await this.loadLists(user);
    const items = await this.itemsService.findAll(
      user,
      { limit: 15, offset: 0 },
      {},
    );
    await this.loadListItems(list, items);
    return true;
  }

  async deleteDatabase() {
    // List Items
    await this.listItemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Lists
    await this.listsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }
    await Promise.all(itemsPromises);
  }

  async loadLists(user: User): Promise<List> {
    const lists = [];
    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }
    return lists[0];
  }

  async loadListItems(list: any, items: Item[]) {
    for (const item of items) {
      this.listItemsService.create({
        // random 1 & 0 values made boolean
        completed: Boolean(Math.round(Math.random())),
        quantity: Math.round(Math.random() * 10),
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
