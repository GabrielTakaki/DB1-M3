import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TipoConteudo } from "./create-mensagem.dto";

export class UpdateMensagemDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  conteudo?: string;

  @IsEnum(TipoConteudo)
  @IsOptional()
  tipo_conteudo?: TipoConteudo;
}