import { configService } from './utils/configService';
import { DataSource } from 'typeorm';

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
