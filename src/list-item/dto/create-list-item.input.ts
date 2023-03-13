import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateListItemInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
