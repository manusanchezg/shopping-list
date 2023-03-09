import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType()
export class LogInInput {
    @IsEmail()
    @Field(() => String)
    email: string;
    
    @MinLength(6)
    @Field(() => String)
    password: string;

}