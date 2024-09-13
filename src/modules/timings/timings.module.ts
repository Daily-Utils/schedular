import { TypeOrmModule } from "@nestjs/typeorm";
import { Timings } from "./timings.entity";
import { Module } from "@nestjs/common";
import { TimingsService } from "./timings.service";
import { TimingsResolver } from "./timings.resolver";


@Module({
  imports: [TypeOrmModule.forFeature([Timings])],
  controllers: [],
  providers: [TimingsService, TimingsResolver],
  exports: [],
})
export class TimingModule {}