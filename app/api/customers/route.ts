import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const customerSchema = z.object({
  nombre: z.string(),
  email: z.string().email(),
  telefono: z.string(),
});

export async function GET() {
  try {
    const customers = await prisma.customer.findMany();
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customers', details: error },
      { status: 500 }
    );
  }
}