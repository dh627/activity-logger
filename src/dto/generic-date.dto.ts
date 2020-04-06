import { IsString, IsOptional } from "class-validator";
import { IsLaterThanOrEqualTo } from "../utils/custom-date-param.validator";
// tslint:disable: variable-name

export class GenericDateDto {
  @IsString()
  @IsOptional()
  dateFrom: Date;

  @IsString()
  @IsOptional()
  @IsLaterThanOrEqualTo("date_from", {
    message: "date_to must be a valid date later than date_from and not in the future"
  })
  dateTo: Date;

}
