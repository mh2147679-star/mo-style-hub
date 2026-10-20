import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/store/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profile");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl tracking-widest uppercase mb-10">My Profile</h1>
      <ProfileForm
        initialName={session.user.name ?? ""}
        initialEmail={session.user.email ?? ""}
      />
    </div>
  );
}
