import { PrismaClient } from "../generated/prisma";
import * as fs from 'fs';
import readline from "readline";

const prisma = new PrismaClient();
const csvFilePath = "dataset/diem_thi_thpt_2024.csv";

function floatOrNull(v: string) {
  return v === "" || v == null ? null : parseFloat(v);
}

const groups = [
  { name: "core" },
  { name: "foreign" },
  { name: "natural" },
  { name: "social" }
];

const subjects = [
  { code: 'toan', name: 'Toán', group: 'core' },
  { code: 'ngu_van', name: 'Ngữ Văn', group: 'core' },
  { code: 'ngoai_ngu', name: 'Ngoại Ngữ', group: 'foreign' },
  { code: 'vat_li', name: 'Vật Lý', group: 'natural' },
  { code: 'hoa_hoc', name: 'Hóa Học', group: 'natural' },
  { code: 'sinh_hoc', name: 'Sinh Học', group: 'natural' },
  { code: 'lich_su', name: 'Lịch Sử', group: 'social' },
  { code: 'dia_li', name: 'Địa Lý', group: 'social' },
  { code: 'gdcd', name: 'GDCD', group: 'social' }
];


async function seedStudents(subjectMap: Record<string, string>): Promise<void> {
  function parseCsvLine(line: string) {
    const parts = line.split(",");
    return {
      sbd: parts[0],
      toan: parts[1],
      ngu_van: parts[2],
      ngoai_ngu: parts[3],
      vat_li: parts[4],
      hoa_hoc: parts[5],
      sinh_hoc: parts[6],
      lich_su: parts[7],
      dia_li: parts[8],
      gdcd: parts[9],
      ma_ngoai_ngu: parts[10],
    };
  }

  async function processLines(lines: any[], subjectMap: Record<string, string>): Promise<void> {
    const data = lines.map(row => ({
      candidateId: row.sbd,
      foreignLanguageId: row.ma_ngoai_ngu,
      scores: [
        { subjectId: subjectMap["toan"], score: parseFloat(row.toan) },
        { subjectId: subjectMap["ngu_van"], score: parseFloat(row.ngu_van) },
        { subjectId: subjectMap["ngoai_ngu"], score: floatOrNull(row.ngoai_ngu) },
        { subjectId: subjectMap["vat_li"], score: floatOrNull(row.vat_li) },
        { subjectId: subjectMap["hoa_hoc"], score: floatOrNull(row.hoa_hoc) },
        { subjectId: subjectMap["sinh_hoc"], score: floatOrNull(row.sinh_hoc) },
        { subjectId: subjectMap["lich_su"], score: floatOrNull(row.lich_su) },
        { subjectId: subjectMap["dia_li"], score: floatOrNull(row.dia_li) },
        { subjectId: subjectMap["gdcd"], score: floatOrNull(row.gdcd) },
      ]
    }));

    await prisma.student.createMany({
      data
    });

  }

  console.log("Seeding students...");

  const rl = readline.createInterface({
    input: fs.createReadStream(csvFilePath),
    crlfDelay: Infinity
  });

  const BATCH_SIZE = 500;
  let batch: any[] = [];
  let lineNumber = 0;

  for await (const line of rl) {
    lineNumber++;

    if (lineNumber === 1) continue;
    if (!line.trim()) continue;

    const row = parseCsvLine(line);
    batch.push(row);

    if (batch.length >= BATCH_SIZE) {
      await processLines(batch, subjectMap);
      console.log(`Inserted batch of ${BATCH_SIZE} students`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await processLines(batch, subjectMap);
  }
  console.log("Students seeded!");
}

async function seedGroups(): Promise<void> {
  console.log("Seeding groups...");
  for (const g of groups) {
    await prisma.group.upsert({
      where: { name: g.name },
      update: {},
      create: g
    });
  }
  console.log("Groups seeded!");
}

async function seedSubjects(groupMap: Record<string, string>): Promise<void> {
  console.log("Seeding subjects...");
  for (const sub of subjects) {
    await prisma.subject.upsert({
      where: { code: sub.code },
      update: {},
      create: {
        code: sub.code,
        name: sub.name,
        groupId: groupMap[sub.group]
      }
    });
  }
}

async function main(): Promise<void> {
  await seedGroups();
  const allGroups = await prisma.group.findMany();
  const groupMap: Record<string, string> = {};
  allGroups.forEach(g => groupMap[g.name] = g.id);

  await seedSubjects(groupMap);
  const allSubjects = await prisma.subject.findMany();
  const subjectMap: Record<string, string> = {};
  allSubjects.forEach(s => subjectMap[s.code] = s.id);

  await seedStudents(subjectMap);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());