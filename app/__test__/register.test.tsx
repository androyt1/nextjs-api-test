/**
 * @jest-environment node
 */

import { createUser, findUser, POST } from "../api/register/route";
import { prismaMock } from "../lib/singleton";
import { NextRequest } from "next/server";

test("should create new user ", async () => {
    const user = {
        id: "1",
        username: "Rich",
        password: "hello@prisma.io",
    };

    prismaMock.user.create.mockResolvedValue(user);

    await expect(createUser(user)).resolves.toEqual({
        id: "1",
        username: "Rich",
        password: "hello@prisma.io",
    });
});

test("should return a user when username exists", async () => {
    const mockUser = { id: "1", username: "johndoe", password: "johndoe@example.com" };

    // Mock the Prisma client response
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const user = await findUser("johndoe");
    expect(user).toEqual(mockUser);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { username: "johndoe" },
    });
});

test("should return null when username does not exist", async () => {
    // Mock the Prisma client response
    prismaMock.user.findUnique.mockResolvedValue(null);

    const user = await findUser("nonexistentuser");
    expect(user).toBeNull();
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { username: "nonexistentuser" },
    });
});

test("should return 400 if username or email is missing", async () => {
    const req = new NextRequest("http://localhost/api/register", {
        method: "POST",
        body: JSON.stringify({ username: "", email: "" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("Username and  password are required");
});
