import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("ready")
  ready() {
    return { status: "ready" };
  }
}
