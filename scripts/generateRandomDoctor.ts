import { faker } from '@faker-js/faker';

async function generateRandomDoctor() {
  try {
    const doctor = {
      register: {
        username: faker.internet.userName(),
        speciality: [
          faker.helpers.arrayElement([
            'neurology',
            'cardiology',
            'orthopedics',
          ]),
        ],
        sex: faker.helpers.arrayElement(['male', 'female']),
        age: faker.number.int({ min: 25, max: 65 }),
        phone: faker.phone.number(),
        services: [faker.lorem.words(2), faker.lorem.words(3)],
        role: 'doctor',
        password: 'Pass@123',
        email: faker.internet.email(),
        facility_type: faker.helpers.arrayElement(['clinic', 'hospital']),
        facility_name: faker.company.name(),
        facility_location: faker.address.streetAddress(),
        default_fee: faker.number.float({ min: 100, max: 500 }),
        average_consulting_time: '00:30:00',
        experience: faker.number.int({ min: 1, max: 40 }),
      },
    };
    console.log('Doctor generated successfully:', doctor);
  } catch (error) {
    console.error('Error generating doctor:', error);
  }
}

generateRandomDoctor();
