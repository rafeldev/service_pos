import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const customerSchema = z.object({
  nombre: z.string().min(1),
  direccion: z.string().min(1),
  cedula: z.string().min(1),
  email: z.union([
    z.string().email(),
    z.literal(''),
    z.null()
  ]).optional().transform(val => val === '' ? null : val),
  telefono: z.union([
    z.string(),
    z.literal(''),
    z.null()
  ]).optional().transform(val => val === '' ? null : val),
});

const customerUpdateSchema = customerSchema.partial();

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customers', details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Convertir strings vacíos a null para campos opcionales
    const processedData = {
      ...body,
      email: body.email && body.email.trim() !== '' ? body.email : null,
      telefono: body.telefono && body.telefono.trim() !== '' ? body.telefono : null,
    };
    
    const data = customerSchema.parse(processedData);

    const customer = await prisma.customer.create({
      data,
    });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create customer', details: error },
      { status: 500 }
    );
  }
}