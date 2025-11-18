import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Welcome to My Next App</h1>
      <Button className="mt-4">Click Me</Button>
    </div>
  );
}
