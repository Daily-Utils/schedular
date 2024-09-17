import { Injectable } from "@nestjs/common";
import { Appointment } from "./appointment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)  
        private readonly appointmentRepository: Repository<Appointment>
    ) {}
}