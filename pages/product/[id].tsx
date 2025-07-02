import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: product } = useSWR(id ? `/api/products/${id}` : null, fetcher);

  const [quantity, setQuantity] = useState(1);
  const [token, setToken] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const addToCart = async () => {
    if (!token) return router.push('/login');

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: Number(id), quantity }),
    });

    if (res.ok) setMsg('Товар добавлен в корзину!');
    else setMsg('Ошибка добавления');
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600">{product.category?.name}</p>
      <p className="my-2">{product.description}</p>
      <p className="text-lg font-semibold">{product.price} грн</p>
      <div className="mt-4 flex gap-2 items-center">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 border p-1 rounded"
        />
        <button onClick={addToCart} className="bg-blue-600 text-white px-4 py-2 rounded">
          Добавить в корзину
        </button>
      </div>
      {msg && <p className="mt-2 text-green-600">{msg}</p>}
    </div>
  );
}
