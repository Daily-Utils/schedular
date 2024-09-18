import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { DoctorService } from '../doctor/doctor.service';
import {
  createAppointmentDTO,
  updateAppointmentDTO,
} from './dtos/appointment.dto';
import { NotFoundException } from '@nestjs/common';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let repository: Repository<Appointment>;
  let doctorService: DoctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useClass: Repository,
        },
        {
          provide: DoctorService,
          useValue: {
            getAvailableTimeSlotsForADoctor: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    repository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
    doctorService = module.get<DoctorService>(DoctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllAppointmentsForDoctor', () => {
    it('should return all appointments for a doctor', async () => {
      const doctorId = 1;
      const appointments = [{ id: 1, doctor_user_id: doctorId }];
      jest.spyOn(repository, 'find').mockResolvedValue(appointments as any);

      const result = await service.getAllAppointmentsForDoctor(doctorId);
      expect(result).toEqual(appointments);
    });
  });

  describe('getAllAppointmentsForPatient', () => {
    it('should return all appointments for a patient', async () => {
      const patientId = 1;
      const appointments = [{ id: 1, patient_user_id: patientId }];
      jest.spyOn(repository, 'find').mockResolvedValue(appointments as any);

      const result = await service.getAllAppointmentsForPatient(patientId);
      expect(result).toEqual(appointments);
    });
  });

  describe('createAppointment', () => {
    it('should create and return an appointment', async () => {
      const appointmentDto: createAppointmentDTO = {
        patient_user_id: 1,
        doctor_user_id: 2,
        appointment_date_time: new Date('2023-10-02T10:30:00'),
        fees: 100,
        visit_type: 'in-person',
        ivr_app_id: '12345',
        status: 'scheduled',
        patient_complaint: 'Headache',
        patient_current_weight: 70,
      };

      const availableSlots = { slots: ['10:00:00', '10:30:00'] };
      jest
        .spyOn(doctorService, 'getAvailableTimeSlotsForADoctor')
        .mockResolvedValue(availableSlots as any);
      jest.spyOn(repository, 'save').mockResolvedValue(appointmentDto as any);

      const result = await service.createAppointment(appointmentDto);
      expect(result).toEqual(appointmentDto);
    });

    it('should throw an error if slot is not available', async () => {
      const appointmentDto: createAppointmentDTO = {
        patient_user_id: 1,
        doctor_user_id: 2,
        appointment_date_time: new Date('2023-10-01T10:00:00Z'),
        fees: 100,
        visit_type: 'in-person',
        ivr_app_id: '12345',
        status: 'scheduled',
        patient_complaint: 'Headache',
        patient_current_weight: 70,
      };

      const availableSlots = { slots: ['11:00:00'] };
      jest
        .spyOn(doctorService, 'getAvailableTimeSlotsForADoctor')
        .mockResolvedValue(availableSlots as any);

      await expect(service.createAppointment(appointmentDto)).rejects.toThrow(
        'Slot not available',
      );
    });
  });

  describe('getAppointmentById', () => {
    it('should return an appointment by id', async () => {
      const id = 1;
      const appointment = { id };
      jest.spyOn(repository, 'findOne').mockResolvedValue(appointment as any);

      const result = await service.getAppointmentById(id);
      expect(result).toEqual(appointment);
    });
  });

  describe('updateAppointment', () => {
    it('should update and return the appointment', async () => {
      const updateDto: updateAppointmentDTO = {
        id: 1,
        fees: 150,
      };

      const existingAppointment = {
        id: 1,
        doctor_user_id: 2,
        status: 'scheduled',
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingAppointment as any);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.updateAppointment(updateDto);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw an error if appointment not found', async () => {
      const updateDto: updateAppointmentDTO = {
        id: 1,
        fees: 150,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateAppointment(updateDto)).rejects.toThrow(
        'Appointment not found',
      );
    });

    it('should throw an error if appointment is already completed', async () => {
      const updateDto: updateAppointmentDTO = {
        id: 1,
        fees: 150,
      };

      const existingAppointment = {
        id: 1,
        doctor_user_id: 2,
        status: 'completed',
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingAppointment as any);

      await expect(service.updateAppointment(updateDto)).rejects.toThrow(
        'Appointment already completed',
      );
    });

    it('should throw an error if slot is not available', async () => {
      const updateDto: updateAppointmentDTO = {
        id: 1,
        appointment_date_time: new Date('2023-10-01T10:00:00Z'),
      };

      const existingAppointment = {
        id: 1,
        doctor_user_id: 2,
        status: 'scheduled',
      };

      const availableSlots = { slots: ['11:00:00'] };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingAppointment as any);
      jest
        .spyOn(doctorService, 'getAvailableTimeSlotsForADoctor')
        .mockResolvedValue(availableSlots as any);

      await expect(service.updateAppointment(updateDto)).rejects.toThrow(
        'Slot not available',
      );
    });
  });

  describe('deleteAppointment', () => {
    it('should delete an appointment', async () => {
      const id = 1;
      const deleteResult = { affected: 1 };
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult as any);

      const result = await service.deleteAppointment(id);
      expect(result).toEqual(deleteResult);
    });
  });
});
