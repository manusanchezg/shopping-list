import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType() // If we extend the class we don't have to redeclare them here
export class UpdateItemInput extends PartialType(CreateItemInput) {
  // Partial type creates all the properties os the create item input
  // but makes them optional, except for the ones that we declare below
  @Field(() => ID)
  @IsUUID()
  id: string;
}
