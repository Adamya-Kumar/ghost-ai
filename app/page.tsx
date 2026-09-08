import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
      <h1>AI Production Skills</h1>
      <Button>Click me</Button>
    </div>
  );
}
