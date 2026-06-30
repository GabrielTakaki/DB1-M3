import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateMensagemDTO } from "./dto/create-mensagem.dto";
import { UpdateMensagemDTO } from "./dto/update-mensagem.dto";
import { MensagemService } from "./mensagem.service";

@Controller("mensagens")
export class MensagemController {
  constructor(private readonly mensagemService: MensagemService) {}

  @Post()
  create(@Body() dto: CreateMensagemDTO) {
    return this.mensagemService.create(dto);
  }

  // @Query('chatId') lê o ?chatId=N da URL (opcional)
  // ParseOptionalIntPipe converte para number OU mantém undefined se ausente
  @Get()
  findAll(
    @Query("chatId", new ParseIntPipe({ optional: true })) chatId?: number
  ) {
    return this.mensagemService.findAll(chatId);
  }

  @Get(":id")
  findBy(@Param("id", ParseIntPipe) id: number) {
    return this.mensagemService.findBy(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateMensagemDTO
  ) {
    return this.mensagemService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.mensagemService.remove(id);
  }
}
