import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Item } from './entities';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [TypeOrmModule.forFeature([Item])],
  exports: [ItemsService, TypeOrmModule],
})
export class ItemsModule {}
