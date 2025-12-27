import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productUpdateSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional().nullable(),
  precio: z.number().positive().optional(),
  imagen: z.string().optional().nullable(),
  categoriaId: z.number().int().positive().optional(),
  activo: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = productUpdateSchema.parse(body);
    
    const updateData: Record<string, unknown> = { ...data };
    if (data.precio !== undefined) {
      updateData.precio = data.precio.toString();
    }
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { categoria: true },
    });
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update product', details: error },
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
    
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product', details: error },
      { status: 500 }
    );
  }
}

