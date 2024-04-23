import { PrismaClient } from '@prisma/client';
import { itemTypesData } from './seedData';

const prisma = new PrismaClient();

const main = async () => {
  console.log('creating item types');

  await prisma.$transaction([
    prisma.item_type.deleteMany(),
    prisma.item_type.createMany({ data: itemTypesData }),
    prisma.auction_category.deleteMany(),
    prisma.auction_category.createMany({ data: itemTypesData }),
  ]);
};

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
