import { Controller, Get, Inject } from "@nestjs/common";
import { DATABASE_POOL } from "../database/database.module";
import * as promise from "mysql2/promise";

@Controller("health")
export class HealthController {
  constructor(@Inject(DATABASE_POOL) private readonly pool: promise.Pool) {}

  @Get()
  async healthCheck() {
    await this.pool.query("SELECT 1");
    return { status: "ok" };
  }
}
