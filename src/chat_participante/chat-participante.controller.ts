import { Controller } from "@nestjs/common";
import { ChatParticipanteService } from "./chat-participante.service";

@Controller("/chats/:chatId/participantes")
export class ChatParticipanteController {
  constructor(private readonly participanteService: ChatParticipanteService) {}

  // ..
}
