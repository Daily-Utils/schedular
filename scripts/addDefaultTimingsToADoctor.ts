import { configService } from './utils/configService';
import { DataSource } from 'typeorm';

const doctor_user_id = 1;

async function addDefaultTimingsToADoctor(){
    const dataSource = new DataSource(configService);
    await dataSource.initialize();

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();


    try{
        // check whether doctor exists
        const doctor = await queryRunner.query(`
            SELECT * FROM users WHERE user_id = ${doctor_user_id}
        `);

        if(doctor.length === 0){
            console.error('Doctor does not exist');
            return;
        }

        // check if user have timings
        const timings = await queryRunner.query(`
            SELECT * FROM timings WHERE doctor_user_id = ${doctor_user_id}
        `);

        if(timings.length > 0){
            console.error('Timings already exists for the doctor! Try adding manually for this doctor');
            return;
        }

        await queryRunner.startTransaction();
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        for(const day of days){
            await queryRunner.query(`
                INSERT INTO timings (doctor_user_id, day, to, from, break_from, break_to) VALUES
                (${doctor_user_id}, '${day}', '09:00:00', '17:00:00', '13:00:00', '14:00:00')
            `);
        }

    } catch(error){
        console.error('Transaction failed, rolled back because of :', error.message);
    }
}