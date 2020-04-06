// tslint:disable: only-arrow-functions
import {registerDecorator, ValidationOptions, ValidationArguments} from "class-validator";

export function IsLaterThanOrEqualTo(property: string, validationOptions?: ValidationOptions) {
   return function(object: any, propertyname: string) {
        registerDecorator({
            name: "IsLaterThanOrEqualTo",
            target: object.constructor,
            propertyName: propertyname,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    const dateValue = new Date(value);
                    const dateRelatedValue = new Date(relatedValue);
                    const dateNow = new Date();
                    return typeof value === "string"
                          && typeof relatedValue === "string"
                          // 'to' date must be later than 'from' date and earlier than now
                          && dateValue >= dateRelatedValue && dateValue <= dateNow;
                          // you can return a Promise<boolean> here as well, if you want to make async validation
                }
            }
        });
   };
}