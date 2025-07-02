import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [{ name: "Ноутбуки" }, { name: "Смартфоны" }, { name: "Аксессуары" }],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "hashed-password", // не забудь хэшировать
      role: "ADMIN",
    },
  });

  console.log("База данных заполнена");
}

main();
