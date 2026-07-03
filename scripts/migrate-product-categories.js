const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  const products = await prisma.product.findMany({

    where: {
      categoryId: {
        not: null
      }
    }

  });

  console.log(`Found ${products.length} products`);

  for (const product of products) {

    const exists =
      await prisma.productCategory.findUnique({

        where: {

          productId_categoryId: {

            productId: product.id,

            categoryId: product.categoryId

          }

        }

      });

    if (!exists) {

      await prisma.productCategory.create({

        data: {

          productId: product.id,

          categoryId: product.categoryId

        }

      });

      console.log(`✔ ${product.title}`);

    }

  }

  console.log("Migration completed.");

}

main()

  .catch(console.error)

  .finally(async () => {

    await prisma.$disconnect();

  });