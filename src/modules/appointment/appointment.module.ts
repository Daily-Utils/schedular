import { Module } from "@nestjs/common";
import { Appointment } from "./appointment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentResolver } from "./appointment.resolver";
import { AppointmentService } from "./appointment.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([Appointment])
    ],
    controllers: [],
    providers: [AppointmentResolver, AppointmentService],
    exports: []
})
export class AppointmentModule { }