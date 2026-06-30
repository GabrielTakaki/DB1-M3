import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export enum TipoConteudo {
  TEXTO = "texto",
  IMAGEM = "imagem",
  AUDIO = "audio",
  VIDEO = "video",
}

export class CreateMensagemDTO {
  @IsInt()
  @IsPositive()
  chat_id: number;

  @IsInt()
  @IsPositive()
  remetente_id: number;

  @IsString()
  @IsNotEmpty()
  conteudo: string;

  @IsEnum(TipoConteudo)
  @IsOptional()
  tipo_conteudo?: TipoConteudo;

  @IsInt()
  @IsPositive()
  @IsOptional()
  respondendo_msg_id?: number;
}
