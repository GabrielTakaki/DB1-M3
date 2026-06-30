import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUsuarioDTO {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nome_exibicao?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  status_recado?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  foto_url?: string;
}
