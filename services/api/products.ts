type CreateProductData = {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen?: string | null;
  categoriaId: number;
  activo?: boolean;
};

type UpdateProductData = Partial<CreateProductData>;

export async function getProducts(categoriaId?: number) {
  const url = categoriaId 
    ? `/api/products?categoriaId=${categoriaId}`
    : '/api/products';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(data: CreateProductData) {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: number, data: UpdateProductData) {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

