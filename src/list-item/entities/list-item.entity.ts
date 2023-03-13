import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("ListItems")
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  
  @Column({type: 'numeric'})
  @Field(() => Number)
  quantity: number;
  
  @Column({type: 'boolean'})
  @Field(() => Boolean)
  completed: boolean;

  // Relations
  list: List;

  item: Item;
}
