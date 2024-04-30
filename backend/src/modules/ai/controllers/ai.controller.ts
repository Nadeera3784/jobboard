import { Controller, Header, Post } from '@nestjs/common';

@Controller('ai')
export class AiController {
  @Post('/suggestions')
  @Header('Content-Type', 'application/json')
  public async suggestions() {}

  @Post('/magicWriter')
  @Header('Content-Type', 'application/json')
  public async magicWriter() {}
}
