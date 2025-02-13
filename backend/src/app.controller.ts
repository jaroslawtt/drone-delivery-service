import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  public getHelloWorld() {
    return 'Hello, world';
  }
}
