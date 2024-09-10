import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

export const configService: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false, // Adjust as needed
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
};

async function createRolesTable() {
  const dataSource = new DataSource(configService);
  await dataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        roles_name VARCHAR(50) PRIMARY KEY,
        appointment_permission TEXT[] NOT NULL,
        support_tickets_permissions TEXT[] NOT NULL,
        feedback_permission TEXT[] NOT NULL
      );
    `);

    await queryRunner.query(`
      INSERT INTO roles (roles_name, appointment_permission, support_tickets_permissions, feedback_permission) VALUES
      ('admin', '{"create", "read", "update", "delete"}', '{"create", "read", "update", "delete"}', '{"create", "read", "update", "delete"}'),
      ('doctor', '{"read", "update", "delete"}', '{"read"}', '{"read", "update"}'),
      ('patient', '{"create", "read", "update", "delete"}', '{"read", "create"}', '{"read", "create"}');
    `);

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Transaction failed, rolled back:', error);
  } finally {
    try {
      await queryRunner.release();
    } catch (releaseError) {
      console.error('Failed to release query runner:', releaseError);
    }

    try {
      await dataSource.destroy();
    } catch (destroyError) {
      console.error('Failed to close data source:', destroyError);
    }
  }
}

createRolesTable().catch((error) =>
  console.error('Error running script:', error),
);
