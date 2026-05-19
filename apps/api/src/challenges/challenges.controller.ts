import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role, Difficulty } from '@prisma/client';
import {
  ChallengesService,
  CreateChallengeDto,
  UpdateChallengeDto,
  SubmitChallengeDto,
} from './challenges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('challenges')
export class ChallengesController {
  constructor(private challenges: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'List all published challenges' })
  @ApiQuery({ name: 'track', required: false })
  @ApiQuery({ name: 'difficulty', required: false, enum: Difficulty })
  findAll(
    @Query('track') track?: string,
    @Query('difficulty') difficulty?: Difficulty,
  ) {
    return this.challenges.findAll(track, difficulty);
  }

  @Get('my-attempts')
  @ApiOperation({ summary: "Get current user's submission history" })
  myAttempts(@Req() req: any, @Query('challengeId') challengeId?: string) {
    return this.challenges.getUserAttempts(req.user.id, challengeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single challenge by ID' })
  findOne(@Param('id') id: string) {
    return this.challenges.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new challenge (admin only)' })
  create(@Body() dto: CreateChallengeDto) {
    return this.challenges.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a challenge (admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) {
    return this.challenges.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a challenge (admin only)' })
  remove(@Param('id') id: string) {
    return this.challenges.remove(id);
  }

  @Post('submit')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit code for a challenge' })
  submit(@Req() req: any, @Body() dto: SubmitChallengeDto) {
    return this.challenges.submit(req.user.id, dto);
  }
}
