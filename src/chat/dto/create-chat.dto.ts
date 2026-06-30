import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { TipoChat } from "./update-chat.dto";

/*
    tipo      VARCHAR(15)  NOT NULL,
    nome      VARCHAR(100) NULL,
    descricao VARCHAR(255) NULL,
 */

export class CreateChatDTO {
  @IsEnum(TipoChat)
  tipo: TipoChat;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descricao?: string;
}
