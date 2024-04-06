"use client";
import Crag from "@/app/_components/explorer/Crag";
import "../scss/application.scss";

export default function Explorer() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Crag />
    </main>
  );
}
