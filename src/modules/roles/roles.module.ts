import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesResolver } from "./roles.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Roles } from "./roles.entity";



@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  controllers: [],
  providers: [RolesService, RolesResolver],
  exports: [RolesService],
})
export class RolesModule {}