import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());

export default function AdminProducts() {
  const [token] = useState(() => localStorage.getItem('token'));
  const { data: products, error } = useSWR(token ? ['/api/admin/products', token] : null, fetcher);

  if (error) return <div>Ошибка загрузки</div>;
  if (!products) return <div>Загрузка...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Управление товарами</h1>
      <ul>
        {products.map((p: any) => (
          <li key={p.id} className="border p-2 mb-2 rounded">
            <div>{p.name}</div>
            <div>Категория: {p.category?.name}</div>
            <div>Цена: {p.price} грн</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
