"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
// import NotFoundImage from ""; ;

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <div className="p-8 max-w-md text-center space-y-4">
        <Image
          // src={NotFoundImage}
          alt="404 Not Found"
          className="w-48 h-48 mx-auto object-contain"
        />
        <p className="text-muted-foreground text-md">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="block">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Go Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
