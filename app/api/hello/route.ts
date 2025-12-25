import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const tableSchema = z.object({
  numero: z.string(),
});

// Exportar función POST para manejar peticiones POST
export async function POST(req: NextRequest) {
  try {
    const result = await createTable(req);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create table', details: error },
      { status: 400 }
    );
  }
}

// Exportar función GET si también quieres manejar GET
export async function GET() {
  try {
    const tables = await prisma.table.findMany();
    return NextResponse.json(tables);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tables', details: error },
      { status: 500 }
    );
  }
}

async function createTable(req: NextRequest) {
  const request = tableSchema.parse(await req.json());

  const table = await prisma.table.create({
    data: { numero: request.numero },
  });
  return table;
}