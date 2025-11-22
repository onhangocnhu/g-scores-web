import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchScoreResponseDto } from './dto/search-scores-public.dto';
import { ScoreReportDto, TopStudentDto } from './dto/report.dto';
import { CountScoreDto } from './dto/count-score.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {
  }

  async searchScores(candidateId: string): Promise<SearchScoreResponseDto> {
    const student = await this.prisma.student.findUnique({
      where: { candidateId: candidateId },
    });

    if (!student) {
      throw new NotFoundException();
    }

    const subjectIds = student.scores
      .filter(s => s.score !== null)
      .map(s => s.subjectId);

    const subjects = await this.prisma.subject.findMany({
      where: { id: { in: subjectIds } }
    });

    const subjectNameMap = new Map(subjects.map(sb => [sb.id, sb.name]));

    const subjectDtos = student.scores.map(s => ({
      name: subjectNameMap.get(s.subjectId) ?? '',
      score: s.score,
    }));

    return {
      candidateId: student.candidateId,
      foreignLanguageId: student.foreignLanguageId,
      subjects: subjectDtos,
    };
  }

  async getScoreReport(groupName: string): Promise<ScoreReportDto[]> {
    const group = await this.prisma.group.findUnique({
      where: { name: groupName },
      select: { id: true }
    });

    if (!group) {
      throw new NotFoundException()
    }

    const subjects = await this.prisma.subject.findMany({
      where: { groupId: group.id },
      select: { id: true, name: true }
    });

    if (subjects.length === 0) {
      throw new NotFoundException()
    }

    const reportPromises = subjects.map(async (subject) => {

      const excellentResult = await this.prisma.student.aggregateRaw({
        pipeline: [
          {
            $match: {
              scores: {
                $elemMatch: {
                  subjectId: subject.id,
                  score: { $gte: 8 }
                }
              }
            }
          },
          {
            $count: "count"
          }
        ]
      });

      const excellent = (excellentResult as unknown as CountScoreDto)[0]?.count ?? 0;

      const goodResult = await this.prisma.student.aggregateRaw({
        pipeline: [
          {
            $match: {
              scores: {
                $elemMatch: {
                  subjectId: subject.id,
                  score: { $gte: 6, $lt: 8 }
                }
              }
            }
          },
          { $count: "count" }
        ]
      });
      const good = (goodResult as unknown as CountScoreDto)[0]?.count ?? 0;

      const averageResult = await this.prisma.student.aggregateRaw({
        pipeline: [
          {
            $match: {
              scores: {
                $elemMatch: {
                  subjectId: subject.id,
                  score: { $gte: 4, $lt: 6 }
                }
              }
            }
          },
          { $count: "count" }
        ]
      });
      const average = (averageResult as unknown as CountScoreDto)[0]?.count ?? 0;

      const poorResult = await this.prisma.student.aggregateRaw({
        pipeline: [
          {
            $match: {
              scores: {
                $elemMatch: {
                  subjectId: subject.id,
                  score: { $lt: 4 }
                }
              }
            }
          },
          { $count: "count" }
        ]
      });
      const poor = (poorResult as unknown as CountScoreDto)[0]?.count ?? 0;

      return {
        subject: subject.name,
        excellent,
        good,
        average,
        poor
      };
    });

    return await Promise.all(reportPromises);
  }

  async getTop10GroupA(): Promise<TopStudentDto[]> {
    const [math, physics, chemistry] = await Promise.all([
      this.prisma.subject.findUnique({
        where: { code: "toan" },
        select: { id: true }
      }),
      this.prisma.subject.findUnique({
        where: { code: "vat_li" },
        select: { id: true }
      }),
      this.prisma.subject.findUnique({
        where: { code: "hoa_hoc" },
        select: { id: true }
      })
    ]);

    if (!math || !physics || !chemistry) {
      throw new NotFoundException();
    }

    const result = await this.prisma.student.aggregateRaw({
      pipeline: [
        {
          $match: {
            "scores.subjectId": { $all: [math.id, physics.id, chemistry.id] }
          }
        },
        {
          $project: {
            _id: 0,
            candidateId: 1,
            math: {
              $first: {
                $filter: {
                  input: "$scores",
                  as: "s",
                  cond: { $eq: ["$$s.subjectId", math.id] }
                }
              }
            },
            physics: {
              $first: {
                $filter: {
                  input: "$scores",
                  as: "s",
                  cond: { $eq: ["$$s.subjectId", physics.id] }
                }
              }
            },
            chemistry: {
              $first: {
                $filter: {
                  input: "$scores",
                  as: "s",
                  cond: { $eq: ["$$s.subjectId", chemistry.id] }
                }
              }
            }
          }
        },
        {
          $addFields: {
            math: "$math.score",
            physics: "$physics.score",
            chemistry: "$chemistry.score"
          }
        },
        {
          $addFields: {
            totalScore: {
              $round: [
                { $add: ["$math", "$physics", "$chemistry"] },
                2
              ]
            }
          }
        },
        { $sort: { totalScore: -1 } },
        { $limit: 10 }
      ]
    }) as unknown as TopStudentDto[]

    return result
  }
}
