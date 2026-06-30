import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as promise from "mysql2/promise";
import { DATABASE_POOL } from "../database/database.module";
import { CreateMensagemDTO } from "./dto/create-mensagem.dto";
import { UpdateMensagemDTO } from "./dto/update-mensagem.dto";

@Injectable()
export class MensagemService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: promise.Pool) {}

  // Centraliza o tratamento do erro de FK para reutilizar em create e update
  private fkError(err: any): never {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      throw new BadRequestException(
        "Referência inválida: chat_id, remetente_id ou respondendo_msg_id não existe"
      );
    }
    throw err;
  }

  // INSERT INTO mensagem: insere todos os campos; tipo_conteudo e
  // respondendo_msg_id são opcionais (null quando ausentes)
  async create(dto: CreateMensagemDTO) {
    try {
      const [result]: any = await this.pool.query(
        `INSERT INTO mensagem
           (chat_id, remetente_id, conteudo, tipo_conteudo, respondendo_msg_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          dto.chat_id,
          dto.remetente_id,
          dto.conteudo,
          dto.tipo_conteudo ?? "texto",
          dto.respondendo_msg_id ?? null,
        ]
      );
      return this.findBy(result.insertId);
    } catch (err) {
      this.fkError(err);
    }
  }

  // SELECT todas as mensagens; quando chatId é informado filtra pelo chat.
  // WHERE 1=1 é um truque para concatenar condições opcionais sem 'if/else' na string
  async findAll(chatId?: number) {
    const conditions: string[] = ["1=1"];
    const params: any[] = [];

    if (chatId) {
      conditions.push("chat_id = ?");
      params.push(chatId);
    }

    const [rows] = await this.pool.query(
      `SELECT * FROM mensagem
       WHERE ${conditions.join(" AND ")}
       ORDER BY enviada_em ASC`,
      params
    );
    return rows;
  }

  async findBy(id: number) {
    const [rows]: any = await this.pool.query(
      `SELECT * FROM mensagem WHERE id = ?`,
      [id]
    );
    if (!rows.length) {
      throw new NotFoundException(`Mensagem ${id} não encontrada`);
    }
    return rows[0];
  }

  async update(id: number, dto: UpdateMensagemDTO) {
    await this.findBy(id);

    const campos = Object.entries(dto).filter(([, v]) => v !== undefined);
    if (!campos.length) return this.findBy(id);

    const setClause = campos.map(([col]) => `${col} = ?`).join(", ");
    const valores = campos.map(([, v]) => v);

    await this.pool.query(`UPDATE mensagem SET ${setClause} WHERE id = ?`, [
      ...valores,
      id,
    ]);

    return this.findBy(id);
  }

  async remove(id: number) {
    await this.findBy(id);
    await this.pool.query(`DELETE FROM mensagem WHERE id = ?`, [id]);
    return { message: `Mensagem ${id} removida com sucesso` };
  }
}
