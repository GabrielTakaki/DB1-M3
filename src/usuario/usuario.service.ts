import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DATABASE_POOL } from "../database/database.module";
import * as promise from "mysql2/promise";
import { CreateUsuarioDTO } from "./dto/create-usuario.dto";
import { UpdateUsuarioDTO } from "./dto/update-usuario.dto";

@Injectable()
export class UsuarioService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: promise.Pool) {}

  async create(dto: CreateUsuarioDTO) {
    try {
      await this.pool.query(
        `INSERT INTO usuario(telefone, nome_exibicao, status_recado, foto_url)
            VALUES (?, ?, ?, ?)`,
        [dto.telefone, dto.nome_exibicao, dto.status_recado, dto.foto_url]
      );
      return { status: HttpStatus.CREATED, message: "Usuario criado!" };
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY")
        throw new ConflictException("Telefone ja cadastrado");
      throw err;
    }
  }

  async findBy(id: number) {
    const [result] = await this.pool.query(
      "SELECT * FROM usuario WHERE id = ?",
      id
    );
    if (!result)
      throw new NotFoundException(`Usuario com ${id} nao encontrado!`);
    return result;
  }

  async findAll() {
    const [result] = await this.pool.query("SELECT * FROM usuario");
    return { status: HttpStatus.OK, content: result };
  }

  async update(id: number, dto: UpdateUsuarioDTO) {
    await this.findBy(id);
    const campos = Object.entries(dto).filter(([, v]) => v !== undefined);
    if (campos.length > 0) return { status: HttpStatus.NO_CONTENT };

    const clause = campos.map(([colum]) => `${colum} = ?`).join(", ");
    const values = campos.map(([, val]) => val);

    try {
      await this.pool.query(`UPDATE usuario SET ${clause} WHERE id = ?`, [
        ...values,
        id,
      ]);
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new ConflictException("Telefone já cadastrado");
      }
      throw err;
    }
    return {};
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
