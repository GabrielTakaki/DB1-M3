import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export enum TipoChat {
  INDIVIDUAL = "individual",
  GRUPO = "grupo",
}

/*
    tipo      VARCHAR(15)  NOT NULL,
    nome      VARCHAR(100) NULL,
    descricao VARCHAR(255) NULL,
 */
export class UpdateChatDTO {
  @IsEnum(TipoChat)
  @IsOptional()
  tipo?: TipoChat;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descricao?: string;
}
