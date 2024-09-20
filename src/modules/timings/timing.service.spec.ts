import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimingsService } from './timings.service';
import { Timings } from './timings.entity';
import { createTimingDto } from './dtos/create_timing.dto';
import { UpdateTimingDto } from './dtos/update_timing.dto';

describe('TimingsService', () => {
  let service: TimingsService;
  let repository: Repository<Timings>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimingsService,
        {
          provide: getRepositoryToken(Timings),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TimingsService>(TimingsService);
    repository = module.get<Repository<Timings>>(getRepositoryToken(Timings));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addTimings', () => {
    it('should add a new timing', async () => {
      const createDto: createTimingDto = {
        doctor_user_id: 1,
        day: 'monday',
        from: '09:00',
        to: '17:00',
        break_from: '12:00',
        break_to: '13:00',
      };

      const timing = { ...createDto, id: 1 };
      jest.spyOn(repository, 'create').mockReturnValue(timing as any);
      jest.spyOn(repository, 'save').mockResolvedValue(timing as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(false as any);

      await service.addTimings(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(timing);
    });
  });

  describe('getAllTimingsForADoctor', () => {
    it('should return all timings for a doctor', async () => {
      const doctor_user_id = 1;
      const timings = [
        {
          doctor: { user_id: 1 },
          id: 1,
          day: 'Monday',
          from: '09:00',
          to: '17:00',
          break_from: '12:00',
          break_to: '13:00',
        },
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(timings),
      } as any);

      const result = await service.getAllTimingsForADoctor(doctor_user_id);

      expect(result).toEqual([
        {
          id: 1,
          day: 'Monday',
          from: '09:00',
          to: '17:00',
          break_from: '12:00',
          break_to: '13:00',
        },
      ]);
    });
  });

  describe('modifyTimingDetails', () => {
    it('should modify timing details', async () => {
      const doctor_user_id = 1;
      const day = 'Monday';
      const updateDto: UpdateTimingDto = {
        from: '10:00',
        to: '18:00',
        break_from: '13:00',
        break_to: '14:00',
      };

      const timing = {
        doctor_user_id,
        day,
        from: '09:00',
        to: '17:00',
        break_from: '12:00',
        break_to: '13:00',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(timing as any);
      const updateSpy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(null);
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue({ ...timing, ...updateDto } as any);

      const result = await service.modifyTimingDetails(
        doctor_user_id,
        day,
        updateDto,
      );

      expect(updateSpy).toHaveBeenCalledWith(
        { doctor_user_id, day },
        updateDto,
      );
      expect(result).toEqual({ ...timing, ...updateDto });
    });

    it('should return null if timing not found', async () => {
      const doctor_user_id = 1;
      const day = 'Monday';
      const updateDto: UpdateTimingDto = {
        from: '10:00',
        to: '18:00',
        break_from: '13:00',
        break_to: '14:00',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.modifyTimingDetails(
        doctor_user_id,
        day,
        updateDto,
      );

      expect(result).toBeNull();
    });
  });

  describe('deleteSingleTiming', () => {
    it('should delete a timing', async () => {
      const doctor_user_id = 1;
      const day = 'Monday';

      const deleteSpy = jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(null);

      await service.deleteSingleTiming(doctor_user_id, day);

      expect(deleteSpy).toHaveBeenCalledWith({ doctor_user_id, day });
    });
  });
});
