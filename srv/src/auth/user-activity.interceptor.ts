import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
    constructor(private prisma: PrismaService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user && user.userId) {
            this.prisma.userProfile.update({
                where: {userId: user.userId},
                data: {lastActiveAt: new Date()},
            }).catch((err) => { 
                console.error("Failed to update lastActiveAt: ", err);
             });
        }
        return next.handle();
    }
}