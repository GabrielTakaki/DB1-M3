import { PapelParticipante } from "./create-chat-participante.dto";
import { IsDateString, IsEnum, IsOptional } from "class-validator";

export class UpdateChatParticipanteDTO {
  @IsEnum(PapelParticipante)
  @IsOptional()
  papel?: PapelParticipante;

  @IsDateString()
  @IsOptional()
  saiu_em?: string;
}
