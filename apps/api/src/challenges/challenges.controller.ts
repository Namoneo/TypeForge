import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChallengesService, CreateChallengeDto, SubmitChallengeDto } from './challenges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Difficulty } from '@prisma/client';

@ApiTags('challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('challenges')
export class ChallengesController {
  constructor(private challenges: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'List all published challenges' })
  @ApiQuery({ name: 'track', required: false })
  @ApiQuery({ name: 'difficulty', required: false, enum: Difficulty })
  findAll(@Query('track') track?: string, @Query('difficulty') difficulty?: Difficulty) {
    return this.challenges.findAll(track, difficulty);
  }

  @Get('my-attempts')
  @ApiOperation({ summary: 'Get current user\'s submission history' })
  myAttempts(@Req() req: any, @Query('challengeId') challengeId?: string) {
    return this.challenges.getUserAttempts(req.user.id, challengeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single challenge by ID' })
  findOne(@Param('id') id: string) {
    return this.challenges.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new challenge (admin)' })
  create(@Body() dto: CreateChallengeDto) {
    return this.challenges.create(dto);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit code for a challenge' })
  submit(@Req() req: any, @Body() dto: SubmitChallengeDto) {
    return this.challenges.submit(req.user.id, dto);
  }
}
