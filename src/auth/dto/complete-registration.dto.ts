import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CompleteRegistrationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @IsOptional()
    profile_image: string;
}
