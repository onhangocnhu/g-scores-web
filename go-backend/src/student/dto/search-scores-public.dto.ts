import { IsArray, IsNotEmpty, IsNumber, IsString, Length,  } from "class-validator"

export class CandidateIdParamDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  candidateId: string;
}

export class SubjectScoreDto {
  @IsString()
  name: string;

  @IsNumber()
  score: number | null;
}

export class SearchScoreResponseDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  candidateId: string;

  @IsString()
  foreignLanguageId?: string | null;

  @IsArray()
  subjects: SubjectScoreDto[];
}