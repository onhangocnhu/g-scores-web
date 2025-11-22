import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { StudentService } from './student.service';
import { SearchScoreResponseDto, CandidateIdParamDto } from './dto/search-scores-public.dto';
import { ScoreReportDto, TopStudentDto, GroupNameParamDto } from './dto/report.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Get('search-scores/:candidateId')
  async searchScores(@Param(ValidationPipe) param: CandidateIdParamDto): Promise<SearchScoreResponseDto> {
    return await this.studentService.searchScores(param.candidateId);
  }

  @Get('report/:groupName')
  async getScoreReport(@Param(ValidationPipe) param: GroupNameParamDto): Promise<ScoreReportDto[]> {
    return await this.studentService.getScoreReport(param.groupName);
  }

  @Get('ranking')
  async getTopGroupA(): Promise<TopStudentDto[]> {
    return await this.studentService.getTop10GroupA();
  }
}
