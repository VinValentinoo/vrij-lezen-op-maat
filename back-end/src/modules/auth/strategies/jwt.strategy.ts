import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET'),
        })
    }

    async validate(payload: { sub: string, role: string}){
        return { userId: payload.sub, role: payload.role };
        // mogelijkheid om de user op te halen uit de database en terug te geven, dit vangt ook een verwijderde account op, maar voor nu onnodig.
    }
}