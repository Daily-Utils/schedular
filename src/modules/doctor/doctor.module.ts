import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctor } from "./doctor.entity";
import { DoctorService } from "./doctor.service";



@Module({
    imports: [TypeOrmModule.forFeature([Doctor])],
    controllers: [],
    providers: [DoctorService],
    exports: [DoctorService],
})
export class DoctorModule {}