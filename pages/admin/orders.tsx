import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());

export default function AdminOrders() {
  const [token] = useState(() => localStorage.getItem('token'));
  const { data: orders, error } = useSWR(token ? ['/api/admin/orders', token] : null, fetcher);

  if (error) return <div>Ошибка загрузки</div>;
  if (!orders) return <div>Загрузка...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Заказы пользователей</h1>
      {orders.map((order: any) => (
        <div key={order.id} className="border rounded p-4 mb-4">
          <div>
            Заказ №{order.id} — {new Date(order.createdAt).toLocaleString()}
          </div>
          <div>Пользователь: {order.user.email}</div>
          <ul className="mt-2">
            {order.items.map((item: any) => (
              <li key={item.id}>
                {item.product.name} × {item.quantity} = {item.price * item.quantity} грн
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold">Итого: {order.total} грн</div>
        </div>
      ))}
    </div>
  );
}
