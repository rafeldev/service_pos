import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const tableUpdateSchema = z.object({
  numero: z.string().min(1).optional(),
  capacidad: z.number().int().positive().optional().nullable(),
  activa: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = tableUpdateSchema.parse(body);
    
    const table = await prisma.table.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(table);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update table', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.table.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Table deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete table', details: error },
      { status: 500 }
    );
  }
}

