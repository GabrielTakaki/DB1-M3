import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_POOL } from "../database/database.module";
import * as promise from "mysql2/promise";

@Injectable()
export class ChatParticipanteService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: promise.Pool) {}
  // ..
}