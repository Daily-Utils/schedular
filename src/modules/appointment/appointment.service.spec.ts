import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import {
  createAppointmentDTO,
  updateAppointmentDTO,
} from './dtos/appointment.dto';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let repository: Repository<Appointment>;

  const mockAppointmentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    repository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllAppointmentsForDoctor', () => {
    it('should return all appointments for a doctor', async () => {
      const doctorId = 1;
      const appointments = [{ id: 1, doctor_user_id: doctorId }];
      mockAppointmentRepository.find.mockResolvedValue(appointments);

      const result = await service.getAllAppointmentsForDoctor(doctorId);
      expect(result).toEqual(appointments);
      expect(mockAppointmentRepository.find).toHaveBeenCalledWith({
        where: { doctor_user_id: doctorId },
      });
    });
  });

  describe('getAllAppointmentsForPatient', () => {
    it('should return all appointments for a patient', async () => {
      const patientId = 1;
      const appointments = [{ id: 1, patient_user_id: patientId }];
      mockAppointmentRepository.find.mockResolvedValue(appointments);

      const result = await service.getAllAppointmentsForPatient(patientId);
      expect(result).toEqual(appointments);
      expect(mockAppointmentRepository.find).toHaveBeenCalledWith({
        where: { patient_user_id: patientId },
      });
    });
  });

  describe('createAppointment', () => {
    it('should create a new appointment', async () => {
      const appointmentDto: createAppointmentDTO = {
        patient_user_id: 1,
        doctor_user_id: 1,
        appointment_date_time: new Date(),
        fees: 100,
        visit_type: 'online',
        ivr_app_id: '123',
        patient_complaint: 'fever',
        patient_current_weight: 50,
        status: 'scheduled',
      };
      const appointment = { id: 1, ...appointmentDto };
      mockAppointmentRepository.save.mockResolvedValue(appointment);

      const result = await service.createAppointment(appointmentDto);
      expect(result).toEqual(appointment);
      expect(mockAppointmentRepository.save).toHaveBeenCalledWith(
        appointmentDto,
      );
    });
  });

  describe('getAppointmentById', () => {
    it('should return an appointment by id', async () => {
      const id = 1;
      const appointment = { id, doctor_user_id: 1, patient_user_id: 1 };
      mockAppointmentRepository.findOne.mockResolvedValue(appointment);

      const result = await service.getAppointmentById(id);
      expect(result).toEqual(appointment);
      expect(mockAppointmentRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('updateAppointment', () => {
    it('should update an appointment', async () => {
      const updateDto: updateAppointmentDTO = {
        id: 1,
        fees: 150,
      };
      const updateResult = { affected: 1 };
      mockAppointmentRepository.update.mockResolvedValue(updateResult);

      const result = await service.updateAppointment(updateDto);
      expect(result).toEqual(updateResult);
      expect(mockAppointmentRepository.update).toHaveBeenCalledWith(
        updateDto.id,
        { fees: 150 },
      );
    });
  });

  describe('deleteAppointment', () => {
    it('should delete an appointment', async () => {
      const id = 1;
      const deleteResult = { affected: 1 };
      mockAppointmentRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.deleteAppointment(id);
      expect(result).toEqual(deleteResult);
      expect(mockAppointmentRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
