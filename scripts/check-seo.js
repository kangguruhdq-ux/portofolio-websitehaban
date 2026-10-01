const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const seo = await prisma.seoSetting.findUnique({ where: { id: 'seo_default' } });
  console.log('Current SEO Setting:', JSON.stringify(seo, null, 2));
}

main().finally(() => prisma.$disconnect());
