import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional().nullable(),
  precio: z.number().positive(),
  imagen: z.string().optional().nullable(),
  categoriaId: z.number().int().positive(),
  activo: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoriaId = searchParams.get('categoriaId');
    
    const where = categoriaId 
      ? { categoriaId: parseInt(categoriaId), activo: true }
      : { activo: true };
    
    const products = await prisma.product.findMany({
      where,
      include: { categoria: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = productSchema.parse(body);
    
    const product = await prisma.product.create({
      data: {
        ...data,
        precio: data.precio.toString(),
      },
      include: { categoria: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product', details: error },
      { status: 500 }
    );
  }
}

