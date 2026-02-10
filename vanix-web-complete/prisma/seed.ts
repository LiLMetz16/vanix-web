import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vanix.com' },
    update: {},
    create: {
      email: 'admin@vanix.com',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create sample portfolio items
  const portfolioItems = [
    {
      title: 'Modern E-commerce Platform',
      description: 'A fully responsive e-commerce website built with Next.js and Stripe integration for seamless payments.',
      imageUrl: '/shop/e-commerce.png',
      category: 'Website',
      tags: ['Next.js', 'Stripe', 'Tailwind CSS'],
      featured: true,
      userId: admin.id,
    },
    {
      title: 'Business Landing Page',
      description: 'Professional business website with modern design, contact forms, and SEO optimization.',
      imageUrl: '/shop/buisness.png',
      category: 'Website',
      tags: ['Landing Page', 'SEO', 'Responsive'],
      featured: true,
      userId: admin.id,
    },
    {
      title: 'Admin Dashboard',
      description: 'Feature-rich admin dashboard with charts, tables, and real-time data visualization.',
      imageUrl: '/shop/admindashboard.png',
      category: 'App',
      tags: ['Dashboard', 'Charts', 'Admin Panel'],
      featured: true,
      userId: admin.id,
    },
  ];

  for (const item of portfolioItems) {
    const created = await prisma.portfolioItem.create({
      data: item,
    });
    console.log('✅ Created portfolio item:', created.title);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
