import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/challenges')
export class AdminChallengesController {
  constructor(private challenges: ChallengesService) {}

  @Get()
  @ApiOperation({
    summary: 'List all challenges including unpublished (admin)',
  })
  findAll() {
    return this.challenges.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get full challenge including solution code (admin)',
  })
  findOne(@Param('id') id: string) {
    return this.challenges.findOneAdmin(id);
  }
}
