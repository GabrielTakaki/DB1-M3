import { IsEnum, IsInt, IsOptional, IsPositive } from "class-validator";

export enum PapelParticipante {
  MEMBRO = "membro",
  ADMIN = "admin",
}

export class CreateChatParticipanteDTO {
  @IsInt()
  @IsPositive()
  usuario_id: number;

  @IsEnum(PapelParticipante)
  @IsOptional()
  papel?: PapelParticipante;
}
