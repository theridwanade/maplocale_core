import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { TypedConfigService } from "src/config/typed-config.service";
import { Request } from "express";
import { JwtPayload } from "src/common/types/jwt-payload.type";

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies.access_token || null;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: TypedConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
