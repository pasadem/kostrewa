import useSWR, { mutate } from 'swr';
import { useEffect, useState } from 'react';

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function Cart() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) location.href = '/login';
    setToken(t);
  }, []);

  const { data: items } = useSWR(token ? ['/api/cart', token] : null, fetcher);

  if (!items) return <div className="p-4">Загрузка...</div>;

  const total = items.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );
  
  const placeOrder = async () => {
  if (!token) return;

  const res = await fetch('/api/order', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    alert('Заказ оформлен!');
    mutate(['/api/cart', token]);
  } else {
    alert('Ошибка при оформлении заказа');
  }
};


  const removeFromCart = async (productId: number) => {
    if (!token) return;
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    mutate(['/api/cart', token]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Корзина</h1>
      {items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item: any) => (
              <li key={item.id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <div>{item.product.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.quantity} × {item.product.price} грн
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-600 underline"
                >
                  Удалить
                </button>
                <button
  onClick={placeOrder}
  className="mt-4 w-full bg-green-600 text-white py-2 rounded"
>
  Оформить заказ
</button>

              </li>
            ))}
          </ul>
          <div className="mt-4 font-bold">Итого: {total} грн</div>
        </>
      )}
    </div>
  );
}
