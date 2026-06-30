import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ChatParticipanteService } from "./chat-participante.service";
import { CreateChatParticipanteDTO } from "./dto/create-chat-participante.dto";
import { UpdateChatParticipanteDTO } from "./dto/update-chat-participante.dto";

@Controller("/chats/:chatId/participantes")
export class ChatParticipanteController {
  constructor(private readonly service: ChatParticipanteService) {}

  @Post()
  create(
    @Param("chatId", ParseIntPipe) chatId: number,
    @Body() dto: CreateChatParticipanteDTO
  ) {
    return this.service.create(chatId, dto);
  }

  @Get()
  findAll(@Param("chatId", ParseIntPipe) chatId: number) {
    return this.service.findAllByChat(chatId);
  }

  @Patch(":usuarioId")
  update(
    @Param("chatId", ParseIntPipe) chatId: number,
    @Param("usuarioId", ParseIntPipe) usuarioId: number,
    @Body() dto: UpdateChatParticipanteDTO
  ) {
    return this.service.update(chatId, usuarioId, dto);
  }

  @Delete(":usuarioId")
  remove(
    @Param("chatId", ParseIntPipe) chatId: number,
    @Param("usuarioId", ParseIntPipe) usuarioId: number
  ) {
    return this.service.remove(chatId, usuarioId);
  }
}
