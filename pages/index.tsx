/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/index.tsx
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const router = useRouter();
  const categoryId = router.query.category;

  const { data: products, error } = useSWR(
    categoryId ? `/api/products?category=${categoryId}` : "/api/products",
    fetcher
  );

  const { data: categories } = useSWR("/api/categories", fetcher);

  if (error) return <div>Ошибка загрузки</div>;
  if (!products) return <div>Загрузка...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Каталог товаров</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => router.push("/")}
          className={`px-3 py-1 rounded border ${
            !categoryId ? "bg-blue-600 text-white" : ""
          }`}
        >
          Все
        </button>
        {categories?.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/?category=${cat.id}`)}
            className={`px-3 py-1 rounded border ${
              categoryId == cat.id ? "bg-blue-600 text-white" : ""
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.category?.name}</p>
            <p className="text-sm font-bold">{product.price} грн</p>
            <Link
              href={`/product/${product.id}`}
              className="text-blue-500 text-sm underline"
            >
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
