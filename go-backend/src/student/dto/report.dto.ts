import { IsNumber, IsString, IsEnum } from "class-validator";

export enum GroupNameEnum {
  natural = 'natural',
  core = 'core',
  social = 'social',
  foreign = 'foreign',
}

export class GroupNameParamDto {
  @IsEnum(GroupNameEnum)
  groupName: GroupNameEnum;
}

export class ScoreReportDto {
  @IsString()
  subject: string;

  @IsNumber()
  excellent: number;

  @IsNumber()
  good: number;

  @IsNumber()
  average: number;

  @IsNumber()
  poor: number;
}

export class TopStudentDto {
  @IsString()
  candidateId: string;

  @IsNumber()
  math: number;

  @IsNumber()
  physics: number;

  @IsNumber()
  chemistry: number;

  @IsNumber()
  totalScore: number;
}