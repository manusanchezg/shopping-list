import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';

@ObjectType({ isAbstract: true })
@Entity({ name: 'lists' })
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => Date)
  date: Date;

  @Column()
  @Field(() => String)
  available_hours: string;

  @Column()
  @Field(() => Float)
  total_amount: number;

  @Column()
  @Field(() => String)
  delivery_driver: string

  @Column({ nullable: true, default: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  is_payed?: boolean = false;

  @Column({ type: 'boolean', nullable: true, default: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  completed?: boolean = false;

  // Relation, index(userId-list-index)
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  // @Field(() => [ListItem])
  listItem: ListItem[];
}
