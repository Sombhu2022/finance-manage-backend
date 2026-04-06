import { db } from '../core/database/index.js';
import { users } from '../modules/users/v1/users.model.js';
import { transactions } from '../modules/finance/v1/finance.model.js';
import { securityUtil } from '../shared/utils/security.util.js';
import { UserRole, UserStatus, TransactionType } from '../shared/constants/enums.js';

async function seed() {
  console.log('🌱 Seeding database with professional demo data...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(transactions);
    await db.delete(users);

    // Default password for all demo users
    const hashedPassword = await securityUtil.hashPassword('Password123');

    // 1. Create Users
    console.log('👤 Creating demo users...');
    const demoUsers = [
      {
        email: 'admin@zorvyn.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'analyst@zorvyn.com',
        password: hashedPassword,
        role: UserRole.ANALYST,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'viewer@zorvyn.com',
        password: hashedPassword,
        role: UserRole.VIEWER,
        status: UserStatus.ACTIVE,
      },
    ];

    const insertedUsers = await db.insert(users).values(demoUsers).returning({
      id: users.id,
      email: users.email,
      role: users.role,
    });

    const admin = insertedUsers.find((u) => u.role === UserRole.ADMIN)!;
    const analyst = insertedUsers.find((u) => u.role === UserRole.ANALYST)!;
    const viewer = insertedUsers.find((u) => u.role === UserRole.VIEWER)!;

    // 2. Generate Transactions
    console.log('💰 Generating professional transactions...');

    const categories = {
      [TransactionType.INCOME]: ['Salary', 'Freelance', 'Dividends', 'Bonus', 'Rental Income'],
      [TransactionType.EXPENSE]: [
        'Housing',
        'Food & Dining',
        'Transportation',
        'Utilities',
        'Health & Fitness',
        'Shopping',
        'Entertainment',
        'Travel',
        'Education',
      ],
    };

    const generateTransactions = (userId: string, count: number, style: 'high' | 'medium' | 'low') => {
      const txs = [];
      const now = new Date();

      for (let i = 0; i < count; i++) {
        // More expenses than income
        const type = Math.random() > 0.3 ? TransactionType.EXPENSE : TransactionType.INCOME;
        const categoryList = categories[type];
        const category = categoryList[Math.floor(Math.random() * categoryList.length)];

        let amount: number;
        if (type === TransactionType.INCOME) {
          if (category === 'Salary') {
             amount = style === 'high' ? 9500 : style === 'medium' ? 6000 : 3500;
          } else {
             amount = Math.floor(Math.random() * (style === 'high' ? 3000 : 1500) + 200);
          }
        } else {
          if (category === 'Housing') {
             amount = style === 'high' ? 2800 : style === 'medium' ? 1800 : 900;
          } else {
             amount = Math.floor(Math.random() * (style === 'high' ? 600 : 300) + 15);
          }
        }

        // Spread dates over the last 180 days
        const date = new Date(now);
        date.setDate(now.getDate() - Math.floor(Math.random() * 180));

        txs.push({
          userId,
          amount: amount.toFixed(2),
          type,
          category,
          date,
          notes: `Monthly ${category} ${type}`,
          createdAt: date,
          updatedAt: date,
        });
      }
      return txs;
    };

    const allTransactions = [
      ...generateTransactions(admin.id, 100, 'high'),
      ...generateTransactions(analyst.id, 60, 'medium'),
      ...generateTransactions(viewer.id, 30, 'low'),
    ];

    // Insert transactions
    await db.insert(transactions).values(allTransactions);

    console.log(`✅ Successfully seeded:
- 3 Users (admin, analyst, viewer)
- ${allTransactions.length} Transactions across 6 months`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
