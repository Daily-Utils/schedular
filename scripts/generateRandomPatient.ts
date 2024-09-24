import { faker } from '@faker-js/faker';

function generateRandomPatient() {
  const patient = {
    register: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      role: 'patient',
      password: faker.internet.password(),
      health_issues: [
        faker.helpers.arrayElement(['Asthma', 'Diabetes', 'Hypertension']),
      ],
      phone: faker.phone.number(),
      sex: faker.helpers.arrayElement(['male', 'female']),
      age: faker.number.int({ min: 0, max: 100 }),
      family_member: [],
      relation: [],
      blood_group: faker.helpers.arrayElement(['A+', 'B+', 'AB-', 'O-']),
      weight: faker.number.int({ min: 30, max: 150 }),
    },
  };

  console.log('Patient generated successfully:', patient);
}

generateRandomPatient();
