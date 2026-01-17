import Hero from "@/components/hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News Portal - All the news in one place",
  description: "One of the best news portal in the world.",
};

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
