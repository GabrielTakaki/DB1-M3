import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DATABASE_POOL } from "../database/database.module";
import * as promise from "mysql2/promise";
import { CreateChatDTO } from "./dto/create-chat.dto";
import { UpdateChatDTO } from "./dto/update-chat.dto";

@Injectable()
export class ChatService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: promise.Pool) {}

  async create(dto: CreateChatDTO) {
    await this.pool.query(
      `INSERT INTO chat(tipo, nome, descricao) VALUES (?, ?, ?)`,
      [dto.tipo, dto.nome, dto.descricao]
    );
    return {
      status: HttpStatus.CREATED,
      message: "Chat criado!",
    };
  }

  async findBy(id: number) {
    const [result] = await this.pool.query(
      "SELECT * FROM chat WHERE id = ?",
      id
    );
    if (!result) throw new NotFoundException(`Chat com ${id} nao encontrado!`);
    return result;
  }

  async findAll() {
    const [result] = await this.pool.query("SELECT * FROM chat");
    return { status: HttpStatus.OK, content: result };
  }

  async update(id: number, dto: UpdateChatDTO) {
    await this.findBy(id);
    const campos = Object.entries(dto).filter(([, v]) => v !== undefined);
    if (campos.length > 0) return { status: HttpStatus.NO_CONTENT };

    const clause = campos.map(([colum]) => `${colum} = ?`).join(", ");
    const values = campos.map(([, val]) => val);

    await this.pool.query(`UPDATE chat SET ${clause} WHERE id = ?`, [
      ...values,
      id,
    ]);

    return this.findBy(id);
  }

  async remove(id: number) {
    await this.findBy(id);
    await this.pool.query("DELETE FROM usuario WHERE id = ?", [id]);
    return {
      status: HttpStatus.OK,
      message: `Usuario com [${id}] removido!`,
    };
  }
}
