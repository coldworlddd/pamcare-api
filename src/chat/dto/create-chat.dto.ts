import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsOptional()
    context?: string;
}
