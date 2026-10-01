const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.seoSetting.update({
    where: { id: 'seo_default' },
    data: {
      favicon: '/favicon.svg',
    },
  });
  console.log('Updated SEO Setting:', JSON.stringify(updated, null, 2));
}

main().finally(() => prisma.$disconnect());
