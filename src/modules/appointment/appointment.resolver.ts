import { Inject } from "@nestjs/common";
import { Resolver } from "@nestjs/graphql";
import { AppointmentService } from "./appointment.service";


@Resolver()
export class AppointmentResolver {
    constructor(
        @Inject('AppointmentService')
        private readonly appointmentService: AppointmentService
    ) {}

    
}