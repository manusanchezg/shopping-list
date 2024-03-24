import { InputType, Field, Float } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class CreateListInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  address: string;

  @Field(() => Date)
  @IsDate()
  date: Date;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  available_hours: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total_amount: number;

  @Field(() => String)
  @IsNotEmpty()
  delivery_driver: string

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  is_payed?: boolean = false;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  completed?: boolean = false;
}
