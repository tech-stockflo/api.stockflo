// src/user-management/user-management.service.ts

import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UserManagementService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService,
        private readonly config: ConfigService,
    ) { }

    // Get user by userId
    async getUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const { password, ...userWithoutPassword } = user
        return {
            success: true,
            data: userWithoutPassword,
            statusCode: HttpStatus.OK
        }
    }

    // Disable account by admin
    async disableAccount(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: 'DISABLED',
            },
        });

        return {
            success: true,
            message: 'Account disabled successfully',
            statusCode: HttpStatus.OK,
        };
    }

    // Enable account by admin
    async enableAccount(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: 'ENABLED',
            },
        });

        return {
            success: true,
            message: 'Account enabled successfully',
        };
    }
}
