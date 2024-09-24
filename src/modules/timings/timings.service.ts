import { InjectRepository } from '@nestjs/typeorm';
import { Timings } from './timings.entity';
import { Repository } from 'typeorm';
import { createTimingDto } from './dtos/create_timing.dto';
import { UpdateTimingDto } from './dtos/update_timing.dto';

export class TimingsService {
  constructor(
    @InjectRepository(Timings) private timingsRepository: Repository<Timings>,
  ) {}

  async addTimings(createdTimingDto: createTimingDto) {
    const existingTiming = await this.timingsRepository.findOne({
      where: {
        doctor_user_id: createdTimingDto.doctor_user_id,
        day: createdTimingDto.day,
      },
    });

    if (existingTiming) {
      throw new Error('Timing already exists');
    }

    const timing = this.timingsRepository.create({
      ...createdTimingDto,
    });
    await this.timingsRepository.save(timing);
  }

  async getAllTimingsForADoctor(doctor_user_id: number) {
    const timings = await this.timingsRepository
      .createQueryBuilder('timings')
      .leftJoinAndSelect('timings.doctor', 'doctor')
      .select([
        'doctor.user_id',
        'timings.id',
        'timings.day',
        'timings.from',
        'timings.to',
        'timings.break_from',
        'timings.break_to',
      ])
      .where('doctor.user_id = :doctor_user_id', { doctor_user_id })
      .getMany();

    const mapped_timings = timings.map((timing) => {
      return {
        id: timing.doctor.user_id,
        day: timing.day,
        from: timing.from,
        to: timing.to,
        break_from: timing.break_from,
        break_to: timing.break_to,
      };
    });

    return mapped_timings;
  }

  async modifyTimingDetails(
    doctor_user_id: number,
    day: string,
    updateDTO: UpdateTimingDto,
  ) {
    const timing = await this.timingsRepository.findOne({
      where: { doctor_user_id, day },
    });
    if (!timing) {
      return null;
    }
    await this.timingsRepository.update({ doctor_user_id, day }, updateDTO);
    return this.timingsRepository.findOne({ where: { doctor_user_id, day } });
  }

  async deleteSingleTiming(doctor_user_id: number, day: string) {
    await this.timingsRepository.delete({ doctor_user_id, day });
  }
}
