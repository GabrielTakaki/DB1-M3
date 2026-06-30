import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { UsuarioModule } from "./usuario/usuario.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    UsuarioModule,
  ],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
