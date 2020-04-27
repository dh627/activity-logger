import { Module } from '@nestjs/common';
import { WeightController } from './weight.controller';
import { WeightService } from './weight.service';
import { Weight } from 'src/entities/weight.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Weight])],
  controllers: [WeightController],
  providers: [WeightService]
})
export class WeightModule {}
