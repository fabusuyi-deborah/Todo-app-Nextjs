"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SetNamePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSave = () => {
    if (!name.trim()) return;
    localStorage.setItem("username", name.trim());
    router.push("/"); // redirect to Home
  };

  return (
    <div className="flex items-center justify-center bg-[#f5f5f7] px-4 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-12 max-w-xs sm:max-w-md md:max-w-md text-center space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          What's your name?
        </h1>
        <Input
          aria-label="input name"
          placeholder="What should we call you?"
          value={name}
          className="w-full"
          onChange={(e) => setName(e.target.value)}
        />
        <Button className="w-full" onClick={handleSave}>
          Save and Continue
        </Button>
      </div>
    </div>
  );
}
