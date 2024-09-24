import { configService } from './utils/configService';
import { DataSource } from 'typeorm';

const doctor_user_id = 1;

async function addDefaultTimingsToADoctor() {
  const dataSource = new DataSource(configService);
  await dataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // check if user have timings
    const timings = await queryRunner.query(`
            SELECT * FROM "Timings" WHERE doctor_user_id = ${doctor_user_id}
        `);

    console.log(timings);

    if (timings.length > 0) {
      console.error(
        'Timings already exists for the doctor! Try adding manually for this doctor',
      );
      return;
    }

    await queryRunner.startTransaction();
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    for (const day of days) {
      console.log('days', day);
      await queryRunner.query(
        `INSERT INTO "Timings" (doctor_user_id, day, "to", "from", break_from, break_to) VALUES ($1, $2, $3, $4, $5, $6)`,
        [doctor_user_id, day, '17:00:00', '09:00:00', '13:00:00', '14:00:00'],
      );
    }
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(
      'Transaction failed, rolled back because of :',
      error.message,
    );
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

addDefaultTimingsToADoctor().catch((error) =>
  console.error('Error running script:', error),
);
