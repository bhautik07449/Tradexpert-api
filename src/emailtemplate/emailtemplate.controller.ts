import { Controller } from "@nestjs/common";
import { EmailService } from "src/common/email.service";

@Controller('emailtemplate')
export class EmailTemplateController {
    constructor(private readonly emailtemplateService: EmailService) { }

}