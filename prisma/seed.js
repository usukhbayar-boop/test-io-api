const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zangia.io' },
    update: { username: 'admin' },
    create: {
      first_name: 'Admin',
      last_name: 'User',
      phone: '+97699999999',
      email: 'admin@zangia.io',
      username: 'admin',
      password_hash: adminPassword,
      role: 'admin',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@zangia.io' },
    update: {},
    create: {
      first_name: 'Test',
      last_name: 'User',
      phone: '+97688888888',
      email: 'user@zangia.io',
      password_hash: userPassword,
      role: 'user',
    },
  });

  console.log('Seeded:', { admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
