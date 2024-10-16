import clerkClient from "@clerk/clerk-sdk-node";
import { db } from "./db";

export const initialMember = async (userId: string) => {
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
        return false;
    }

    const member = await db.member.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (member) {
        return member;
    }

    const newMember = await db.member.create({
        data: {
            userId: user.id,
        },
    });

    return newMember;
};
