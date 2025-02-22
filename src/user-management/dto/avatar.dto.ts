import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AvatarDto{ 
    @ApiProperty({
        description: 'Upload profile picture',
        type: 'string',
        format: 'binary'
    })
    @IsString()
    picture: string;
}