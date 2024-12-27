import { Metadata } from "next";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <h1>We Chat frontend</h1>
    </main>
  );
}

export const metadata: Metadata = {
  title: "We Chat",
  description: "Real time chat platform for users",
};