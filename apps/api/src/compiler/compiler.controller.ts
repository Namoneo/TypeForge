import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { CompilerService } from './compiler.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class CompileDto {
  @IsString() code: string;
  @IsOptional() @IsBoolean() strict?: boolean;
}

@ApiTags('compiler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('compiler')
export class CompilerController {
  constructor(private compiler: CompilerService) {}

  @Post('compile')
  @ApiOperation({ summary: 'Compile TypeScript code and return diagnostics' })
  compile(@Body() dto: CompileDto) {
    return this.compiler.compile(dto.code, dto.strict ?? true);
  }
}
