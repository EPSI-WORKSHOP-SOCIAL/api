import { db } from "../lib/db";
const { faker } = require('@faker-js/faker');

async function main() {
    // Générer des fausses entreprises
    for (let i = 0; i < 5; i++) {
        const company = await db.company.create({
            data: {
                name: faker.company.name(),
                logo: faker.image.url(640, 480, 'business', true),
                contracts: {
                    create: [
                        {
                            amount: faker.finance.amount(5000, 10000, 2),
                            maxReviews: faker.number.int({ min: 5, max: 20 }),
                        },
                    ],
                },
                posts: {
                    create: [
                        {
                            url: faker.internet.url(),
                            content: faker.lorem.sentence(),
                            show: faker.datatype.boolean(),
                            origin: faker.location.country(),
                            isOffensive: faker.datatype.boolean(),
                        },
                    ],
                },
            },
        });

        console.log(`Company created: ${company.name}`);
    }

    // Générer des fausses raisons
    for (let i = 0; i < 5; i++) {
        const reason = await db.reason.create({
            data: {
                content: faker.lorem.sentence(),
            },
        });

        console.log(`Reason created: ${reason.content}`);
    }

    // Générer des utilisateurs avec des soldes et des avis
    for (let i = 0; i < 10; i++) {
        const user = await db.user.create({
            data: {
                clerkId: faker.string.uuid(),
                balance: faker.number.float({ min: 0, max: 1000 }),
                reviews: {
                    create: [
                        {
                            post: {
                                connect: {
                                    id: (await db.post.findFirst())?.id,
                                },
                            },
                            answer: faker.datatype.boolean(),
                            price: faker.finance.amount(10, 100, 2),
                        },
                    ],
                },
            },
        });

        console.log(`User created: ${user.clerkId}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
