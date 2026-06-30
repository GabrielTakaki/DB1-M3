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
import { UsuarioService } from "./usuario.service";
import { CreateUsuarioDTO } from "./dto/create-usuario.dto";
import { UpdateUsuarioDTO } from "./dto/update-usuario.dto";

@Controller("usuario")
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() dto: CreateUsuarioDTO) {
    return this.usuarioService.create(dto);
  }

  @Get(":id")
  findBy(@Param("id", ParseIntPipe) id: number) {
    return this.usuarioService.findBy(id);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDTO
  ) {
    return this.usuarioService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usuarioService.remove(id);
  }
}
