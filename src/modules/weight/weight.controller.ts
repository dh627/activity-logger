import { Controller, Get, Post, Body } from '@nestjs/common';
import { WeightService } from './weight.service';
import { Weight } from 'src/entities/weight.entity';
import { WeightDto } from './dto/weight.dto';

@Controller('weight')
export class WeightController {
    constructor(private readonly weightService: WeightService) {}

    // @Get("allweights") 
    // async getWeights() {

    // }

    // @Get("/mostrecentweight") 
    // async getRecentWeight() {

    // }

    @Post()
    // post every wednesday & sunday
    async postWeight(@Body() weightDto: WeightDto): Promise<Weight> {
        return await this.weightService.postWeight(weightDto);
    }
}
