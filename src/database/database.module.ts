import {Global, Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {createPool, Pool} from "mysql2/promise";

export const DATABASE_POOL = "DATABASE_POOL";

@Global()
@Module({
    providers: [{
        provide: DATABASE_POOL,
        inject: [ConfigService],
        useFactory: (config: ConfigService): Pool =>
            createPool({
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                user: config.get<string>('DB_USER'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_NAME'),
                connectionLimit: 10,
                waitForConnections: true
            })
    }],
    exports: [DATABASE_POOL]
})
export class DatabaseModule {}