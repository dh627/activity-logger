import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Weight } from 'src/entities/weight.entity';
import { Repository } from 'typeorm';
import * as moment from "moment";
import { WeightDto } from './dto/weight.dto';

@Injectable()
export class WeightService {
    constructor(
        @InjectRepository(Weight) private readonly weightRepository: Repository<Weight>
    ){}
    
    async postWeight(weightDto: WeightDto): Promise<Weight> {
        const weightEntity = new Weight();
        weightEntity.stone = weightDto.stone;
        weightEntity.pounds = weightDto.pounds;
        weightEntity.date = moment(new Date()).format("YYYY-MM-DD");
        return this.weightRepository.save(weightEntity);
    }
}

