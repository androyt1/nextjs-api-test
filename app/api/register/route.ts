import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const findUser = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    return user;
};

export const createUser = (user: { username: string; password: string }) => {
    return prisma.user.create({
        data: {
            username: "test",
            password: "<PASSWORD>",
        },
    });
};

export const checkUserAndPassword = (username: string, password: string) => {
    if (!username || !password) {
        return false;
    }
};

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

const POST = async (req: NextRequest) => {
    const { username, password } = await req.json();
    if (!checkUserAndPassword(username, password)) {
        return NextResponse.json(
            { message: "Username and  password are required" },
            { status: 400 }
        );
    }
    const user = await findUser(username);
    if (user) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
};
export { POST };
