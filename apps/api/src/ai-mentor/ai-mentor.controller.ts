import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AiMentorService } from './ai-mentor.service';
import { AskMentorDto } from './ai-mentor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ai-mentor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-mentor')
export class AiMentorController {
  constructor(private mentor: AiMentorService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Ask the AI Mentor — streams response via SSE' })
  ask(@Body() dto: AskMentorDto, @Res() res: Response) {
    return this.mentor.streamResponse(dto, res);
  }
}
