export async function addProductToCart(productId: number) {
  const response = await fetch(route('cart.add', productId), {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
  })

  if (!response.ok) {
    throw new Error('Failed to add product to cart')
  }

  return response.json() as Promise<{ added: boolean; cart_count?: number }>
}
