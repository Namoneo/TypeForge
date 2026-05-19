import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MentorQueryType {
  EXPLAIN_ERRORS = 'explain_errors',
  REVIEW_CODE = 'review_code',
  HINT = 'hint',
  EXPLAIN_CONCEPT = 'explain_concept',
}

class DiagnosticDto {
  @ApiProperty() code: number;
  @ApiProperty() message: string;
  @ApiPropertyOptional() line?: number;
  @ApiPropertyOptional() column?: number;
}

export class AskMentorDto {
  @ApiProperty({ enum: MentorQueryType })
  @IsEnum(MentorQueryType)
  type: MentorQueryType;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiPropertyOptional({
    description: 'Challenge description, concept name, or extra context',
  })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiPropertyOptional({ type: [DiagnosticDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiagnosticDto)
  errors?: DiagnosticDto[];
}
