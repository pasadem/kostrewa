import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());

export default function Orders() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) location.href = '/login';
    setToken(t);
  }, []);

  const { data: orders } = useSWR(token ? ['/api/orders', token] : null, fetcher);

  if (!orders) return <div className="p-4">Загрузка заказов...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Мои заказы</h1>
      {orders.length === 0 ? (
        <p>У вас ещё нет заказов.</p>
      ) : (
        orders.map((order: any) => (
          <div key={order.id} className="border rounded p-4 mb-4">
            <div className="font-semibold">
              Заказ №{order.id} — {new Date(order.createdAt).toLocaleString()}
            </div>
            <ul className="mt-2 space-y-1">
              {order.items.map((item: any) => (
                <li key={item.id} className="text-sm">
                  {item.product.name} × {item.quantity} = {item.price * item.quantity} грн
                </li>
              ))}
            </ul>
            <div className="mt-2 font-bold">Итого: {order.total} грн</div>
          </div>
        ))
      )}
    </div>
  );
}
