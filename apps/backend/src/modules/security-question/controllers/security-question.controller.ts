import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Delete,
  Get,
  Header,
} from '@nestjs/common';

import { SecurityQuestionService } from '../services';
import { AuthenticationGuard, RoleGuard } from '../../authentication/guards';
import { SecurityQuestionDto, ValidateSecurityQuestionDto } from '../dto';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import { RolesEnum } from '../../user/enums';

@UseGuards(AuthenticationGuard, RoleGuard)
@Controller('security-question')
export class SecurityQuestionController {
  constructor(
    private readonly securityQuestionService: SecurityQuestionService,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  public async getQuestions(): Promise<string[]> {
    return this.securityQuestionService.getQuestions();
  }

  @Get('/question')
  @Header('Content-Type', 'application/json')
  public async getUserSecurityQuestion(): Promise<void> {
    // TODO: Implement get user security question logic
  }

  @Post('validate')
  @Header('Content-Type', 'application/json')
  public async validateAnswer(
    @Body() _dto: ValidateSecurityQuestionDto,
    @Req() _request,
    @Res() _response,
  ): Promise<void> {
    // TODO: Implement validate security question answer logic
  }

  @Post('define')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async defineSecurityQuestion(
    @Body() _dto: SecurityQuestionDto,
  ): Promise<void> {
    // TODO: Implement define security question logic
  }

  @Delete('undefine')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async unDefineSecurityQuestion(): Promise<void> {
    // TODO: Implement undefine security question logic
  }
}
