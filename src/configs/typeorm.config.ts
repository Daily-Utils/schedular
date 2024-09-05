import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService,
    ): Promise<TypeOrmModuleOptions> => {
        const logging =
            configService.get<string>('nodeEnv') === 'development'
                ? true
                : false;
        const sslRequired =
            configService.get<string>('nodeEnv') === 'development'
                ? true
                :false;
        return {
            type: 'postgres',
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            username: configService.get<string>('database.username'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.name'),
            logging: logging,
            synchronize: true, // Set synchronize to true for automatic schema synchronization
            autoLoadEntities: true,
            extra: {
                charset: 'utf8mb4_unicode_ci',
            },
            ssl: false,
	    entities: [`${__dirname}/../**/*.entity.{js,ts}`],
        };
    },
};
config();
const configService = new ConfigService();

const connectionOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    logging: true,
    synchronize: false,
    migrationsRun:true,
    entities: [`${__dirname}/../**/*.entity.{js,ts}`],
    migrations: [`${__dirname}/../migrations/*.{js,ts}`],
    ssl: false
};

export const typeOrmConfig = new DataSource({...connectionOptions});
