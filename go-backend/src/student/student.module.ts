import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentController } from './student.controller';

@Module({
  imports: [PrismaModule],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentModule]
})
export class StudentModule { }
