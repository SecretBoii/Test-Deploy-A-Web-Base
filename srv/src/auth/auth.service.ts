import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwtService: JwtService, 
    ) {}

    async vallidateUser(username: string, pass: string): Promise<any> {
        const user = await this.prisma.userprofile.findFirst({
            where: { username },
        });

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    login(user: any) {
        const payload = { username: user.username, sub: user.userId, roleId: user.roleId };
        return this.jwtService.sign(payload); 
    }
}
