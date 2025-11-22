import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';
import { SubjectModule } from './subject/subject.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [StudentModule, PrismaModule, SubjectModule, GroupModule],
})
export class AppModule { }
