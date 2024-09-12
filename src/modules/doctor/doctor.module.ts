import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctor } from "./doctor.entity";
import { DoctorService } from "./doctor.service";
import { UsersModule } from "../users/users.module";
import { DoctorResolver } from "./doctor.resolver";


@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), forwardRef(() => UsersModule)],
  controllers: [],
  providers: [DoctorService, DoctorResolver],
  exports: [DoctorService],
})
export class DoctorModule {}