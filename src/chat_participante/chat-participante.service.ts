import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DATABASE_POOL } from "../database/database.module";
import * as promise from "mysql2/promise";
import { CreateChatParticipanteDTO } from "./dto/create-chat-participante.dto";
import { UpdateChatParticipanteDTO } from "./dto/update-chat-participante.dto";

@Injectable()
export class ChatParticipanteService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: promise.Pool) {}

  async create(chatId: number, dto: CreateChatParticipanteDTO) {
    try {
      await this.pool.query(
        `INSERT INTO chat_participante (chat_id, usuario_id, papel)
         VALUES (?, ?, ?)`,
        [chatId, dto.usuario_id, dto.papel ?? "membro"]
      );
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new ConflictException(
          `Usuário ${dto.usuario_id} já participa do chat ${chatId}`
        );
      }
      throw err;
    }
    return this.findBy(chatId, dto.usuario_id);
  }

  // SELECT todos os participantes de um chat específico
  async findAllByChat(chatId: number) {
    const [rows] = await this.pool.query(
      `SELECT * FROM chat_participante WHERE chat_id = ? ORDER BY entrou_em ASC`,
      [chatId]
    );
    return rows;
  }

  // SELECT pelo par (chat_id, usuario_id) — equivalente ao "findOne" desta PK composta
  async findBy(chatId: number, usuarioId: number) {
    const [rows]: any = await this.pool.query(
      `SELECT * FROM chat_participante WHERE chat_id = ? AND usuario_id = ?`,
      [chatId, usuarioId]
    );
    if (!rows.length) {
      throw new NotFoundException(
        `Usuário ${usuarioId} não é participante do chat ${chatId}`
      );
    }
    return rows[0];
  }

  async update(
    chatId: number,
    usuarioId: number,
    dto: UpdateChatParticipanteDTO
  ) {
    await this.findBy(chatId, usuarioId);

    const campos = Object.entries(dto).filter(([, v]) => v !== undefined);
    if (!campos.length) return this.findBy(chatId, usuarioId);

    const setClause = campos.map(([col]) => `${col} = ?`).join(", ");
    const valores = campos.map(([, v]) => v);

    await this.pool.query(
      `UPDATE chat_participante SET ${setClause}
       WHERE chat_id = ? AND usuario_id = ?`,
      [...valores, chatId, usuarioId]
    );

    return this.findBy(chatId, usuarioId);
  }

  // DELETE pelo par (chat_id, usuario_id); lança 404 se não existir
  async remove(chatId: number, usuarioId: number) {
    await this.findBy(chatId, usuarioId);
    await this.pool.query(
      `DELETE FROM chat_participante WHERE chat_id = ? AND usuario_id = ?`,
      [chatId, usuarioId]
    );
    return {
      message: `Usuário ${usuarioId} removido do chat ${chatId} com sucesso`,
    };
  }
}
