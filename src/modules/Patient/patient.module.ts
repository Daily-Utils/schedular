import { Module } from "@nestjs/common";
import { Patient } from "./patient.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PatientService } from "./patient.service";


@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}