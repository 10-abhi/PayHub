import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete from dependent tables first to avoid foreign key constraint issues
  await prisma.p2pTransfer.deleteMany({});
  await prisma.onRampTransaction.deleteMany({});
  await prisma.balance.deleteMany({});

  // Then delete from independent tables
  await prisma.user.deleteMany({});
  await prisma.merchant.deleteMany({});

  console.log('✅ All data deleted successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error deleting data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
