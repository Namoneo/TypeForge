import { Controller, Get, Req, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  me(@Req() req: any) {
    return this.users.getProfile(req.user.id);
  }

  @Get('me/progress')
  @ApiOperation({ summary: 'Get current user learning progress' })
  myProgress(@Req() req: any) {
    return this.users.getProgress(req.user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get global leaderboard' })
  leaderboard(@Query('limit') limit?: string) {
    return this.users.getLeaderboard(limit ? parseInt(limit, 10) : 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public profile by user ID' })
  findOne(@Param('id') id: string) {
    return this.users.getProfile(id);
  }
}
