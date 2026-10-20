import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserManagement } from "@/components/admin/UserManagement";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const PAGE_SIZE = 20;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: { select: { total: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
    }),
    prisma.user.count(),
  ]);

  const initialUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as "USER" | "ADMIN",
    createdAt: u.createdAt.toISOString(),
    orderCount: u._count.orders,
    totalSpend: u.orders.reduce((sum, o) => sum + Number(o.total), 0),
  }));

  return (
    <UserManagement
      initialUsers={initialUsers}
      initialTotal={total}
      initialPages={Math.ceil(total / PAGE_SIZE)}
      currentUserId={session.user.id}
    />
  );
}
