import clerkClient from "@clerk/clerk-sdk-node";
import { db } from "./db";

export const initialMember = async (clerkUserId: string) => {
    const user = await clerkClient.users.getUser(clerkUserId);

    if (!user) {
        return false;
    }

    const member = await db.user.findUnique({
        where: {
            clerkId: user.id,
        },
    });

    if (member) {
        return member;
    }

    const newMember = await db.user.create({
        data: {
            clerkId: user.id
        },
    });

    return newMember;
};
