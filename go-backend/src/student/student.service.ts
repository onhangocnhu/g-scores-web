import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchScoreResponseDto } from './dto/search-scores-public.dto';
import { ScoreReportDto, TopStudentDto } from './dto/report.dto';

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

  async getScoreReport(groupName?: string): Promise<ScoreReportDto[]> {
    let whereSubjectCondition: any = {};

    if (groupName) {
      const group = await this.prisma.group.findUnique({
        where: { name: groupName },
        select: { id: true }
      });

      if (!group) return [];
      whereSubjectCondition = { groupId: group.id };
    }

    const subjects = await this.prisma.subject.findMany({
      where: whereSubjectCondition,
      select: { id: true, name: true }
    });

    if (subjects.length === 0) return [];

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

      const excellent = (excellentResult as any)[0]?.count ?? 0;

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
      const good = (goodResult as any)[0]?.count ?? 0;

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
      const average = (averageResult as any)[0]?.count ?? 0;

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
      const poor = (poorResult as any)[0]?.count ?? 0;

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
    const subjects = await this.prisma.subject.findMany({
      where: { code: { in: ['toan', 'vat_li', 'hoa_hoc'] } }
    });

    const mathId = subjects.find(s => s.code === 'toan')?.id;
    const physId = subjects.find(s => s.code === 'vat_li')?.id;
    const chemId = subjects.find(s => s.code === 'hoa_hoc')?.id;

    if (!mathId || !physId || !chemId) return [];

    const result = await this.prisma.student.aggregateRaw({
      pipeline: [
        {
          $match: {
            scores: {
              $all: [
                { $elemMatch: { subjectId: mathId } },
                { $elemMatch: { subjectId: physId } },
                { $elemMatch: { subjectId: chemId } }
              ]
            }
          }
        },

        {
          $project: {
            _id: 0,
            candidateId: 1,
            math: {
              $first: {
                $map: {
                  input: {
                    $filter: {
                      input: "$scores",
                      as: "s",
                      cond: { $eq: ["$$s.subjectId", mathId] }
                    }
                  },
                  as: "x",
                  in: "$$x.score"
                }
              }
            },
            physics: {
              $first: {
                $map: {
                  input: {
                    $filter: {
                      input: "$scores",
                      as: "s",
                      cond: { $eq: ["$$s.subjectId", physId] }
                    }
                  },
                  as: "x",
                  in: "$$x.score"
                }
              }
            },
            chemistry: {
              $first: {
                $map: {
                  input: {
                    $filter: {
                      input: "$scores",
                      as: "s",
                      cond: { $eq: ["$$s.subjectId", chemId] }
                    }
                  },
                  as: "x",
                  in: "$$x.score"
                }
              }
            }
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
    });

    const cleaned = (result as any).map((r) => ({
      candidateId: r.candidateId,
      math: r.math,
      physics: r.physics,
      chemistry: r.chemistry,
      totalScore: r.totalScore,
    }));

    return cleaned as TopStudentDto[];
  }

}
