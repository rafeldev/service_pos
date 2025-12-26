import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const tableSchema = z.object({
  numero: z.string().min(1),
  capacidad: z.number().int().positive().optional().nullable(),
});

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tables);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tables', details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = tableSchema.parse(body);
    
    const table = await prisma.table.create({
      data,
    });
    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create table', details: error },
      { status: 500 }
    );
  }
}