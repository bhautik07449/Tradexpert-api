import { BadRequestException, Logger } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class ValidationException extends BadRequestException {

    private errors: any;
    private logger = new Logger(); 
    private static readonly DefaultMessage = "Bad Request: Content Validation Failed";

    constructor(errors: any){
        super('ValidationError');
        this.errors = errors;
    }

    getMessage(): string {
        this.logger.error(JSON.stringify(this.errors));
        if (Array.isArray(this.errors)) {
            let constraints = this.getErrorConstraints(this.errors[0]);
            return constraints?constraints[Object.keys(constraints)[0]]:ValidationException.DefaultMessage;
        } else {
            return ValidationException.DefaultMessage;
        }
    }

    getErrorConstraints(error: ValidationError) {
        let constraints = error?.constraints;
        if (!constraints && Array.isArray(error?.children)) {
            return this.getErrorConstraints(error.children[0])
        }
        return constraints;
    }

    getErrors(): any {
        return this.errors;
    }

}