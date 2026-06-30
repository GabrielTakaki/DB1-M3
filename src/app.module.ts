import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { UsuarioModule } from "./usuario/usuario.module";
import { ChatModule } from "./chat/chat.module";
import { ChatParticipanteModule } from "./chat_participante/chat-participante.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    UsuarioModule,
    ChatModule,
    ChatParticipanteModule,
  ],
})
export class AppModule {}
