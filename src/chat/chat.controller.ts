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
import { ChatService } from "./chat.service";
import { CreateChatDTO } from "./dto/create-chat.dto";
import { UpdateChatDTO } from "./dto/update-chat.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() dto: CreateChatDTO) {
    return this.chatService.create(dto);
  }

  @Get(":id")
  findBy(@Param("id", ParseIntPipe) id: number) {
    return this.chatService.findBy(id);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateChatDTO
  ) {
    return this.chatService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.chatService.remove(id);
  }
}
