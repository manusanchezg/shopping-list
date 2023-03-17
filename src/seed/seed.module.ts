import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ListsModule } from 'src/lists/lists.module';
import { ListItemModule } from 'src/list-item/list-item.module';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule,
    ListItemModule,
    ListsModule,
  ],
})
export class SeedModule {}
