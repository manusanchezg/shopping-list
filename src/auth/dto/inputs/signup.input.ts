import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class SignUpInput {
    @IsEmail()
    @Field(() => String)
    email: string;

    @IsNotEmpty()
    @Field(() => String)
    fullName: string;
    
    @MinLength(6)
    @Field(() => String)
    password: string;

}