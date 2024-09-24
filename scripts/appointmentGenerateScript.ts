import { faker } from '@faker-js/faker';

const generateAppointment = () => {
  return {
    appointment: {
      doctor_user_id: faker.number.int({ min: 1, max: 10 }),
      fees: faker.number.int({ min: 100, max: 1000 }),
      ivr_app_id: '',
      patient_complaint: faker.lorem.words(2),
      patient_current_weight: faker.number.int({ min: 40, max: 100 }),
      patient_user_id: faker.number.int({ min: 1, max: 10 }),
      visit_type: faker.helpers.arrayElement(['offline', 'online']),
      status: faker.helpers.arrayElement([
        'scheduled',
        'rescheduled',
        'cancelled',
        'reschedule_needed',
      ]),
      appointment_date_time: faker.date.future().getTime(),
    },
  };
};

const appointments = Array.from({ length: 10 }, generateAppointment);

console.log(JSON.stringify(appointments, null, 2));
