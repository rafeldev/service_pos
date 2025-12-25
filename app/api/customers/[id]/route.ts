import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const customerUpdateSchema = z.object({
  nombre: z.string().min(1).optional(),
  direccion: z.string().min(1).optional(),
  cedula: z.string().min(1).optional(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  telefono: z.string().optional().nullable().or(z.literal('')),
  activo: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = customerUpdateSchema.parse(body);
    
    // Filtrar campos vacíos y convertir strings vacíos a null para campos opcionales
    const data: Record<string, unknown> = {};
    
    if (validatedData.nombre !== undefined && validatedData.nombre.trim() !== '') {
      data.nombre = validatedData.nombre;
    }
    if (validatedData.direccion !== undefined && validatedData.direccion.trim() !== '') {
      data.direccion = validatedData.direccion;
    }
    if (validatedData.cedula !== undefined && validatedData.cedula.trim() !== '') {
      data.cedula = validatedData.cedula;
    }
    if (validatedData.email !== undefined) {
      data.email = validatedData.email && validatedData.email.trim() !== '' 
        ? validatedData.email 
        : null;
    }
    if (validatedData.telefono !== undefined) {
      data.telefono = validatedData.telefono && validatedData.telefono.trim() !== '' 
        ? validatedData.telefono 
        : null;
    }
    if (validatedData.activo !== undefined) {
      data.activo = validatedData.activo;
    }
    
    // Verificar que hay al menos un campo para actualizar
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update', details: 'At least one field must be provided' },
        { status: 400 }
      );
    }
    
    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    // Mejorar el mensaje de error de Prisma
    let errorDetails: Record<string, unknown> = {};
    
    if (error instanceof Error) {
      errorDetails = {
        message: error.message,
        name: error.name,
      };
      
      // Si es un error de Prisma, agregar más detalles
      if (error.name === 'PrismaClientValidationError' || error.message.includes('prisma')) {
        errorDetails.type = 'PrismaValidationError';
        errorDetails.hint = 'Check that all required fields are provided and have valid values';
      }
    } else {
      errorDetails = { error };
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update customer', 
        details: errorDetails
      },
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
    
    await prisma.customer.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete customer', details: error },
      { status: 500 }
    );
  }
}

