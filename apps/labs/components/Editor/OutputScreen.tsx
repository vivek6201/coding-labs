"use client";
import { usePathname } from "next/navigation";
import React, { Suspense, useState } from "react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/ui/input";
import { Repeat, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export default function OutputScreen() {
  const slug = usePathname().split("/").at(-1);
  const [outputUrl, setOutputUrl] = useState(
    `http://${slug}.lab-output.letscodeofficial.tech`
  );
  const [key, setKey] = useState(0);

  const handleUrl = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOutputUrl(`http://${(e.target as HTMLInputElement).value}`);
    }
  };

  const handleReload = () => {
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <Suspense fallback={"Loading..."}>
      <div className="w-full h-full flex flex-col">
        <div className="p-2 flex items-center justify-between gap-2">
          <Input
            type="text"
            defaultValue={outputUrl}
            onKeyDown={handleUrl}
            placeholder="https://"
          />
          <Link href={outputUrl} target="_blank">
            <Button variant={"outline"} size={"icon"}>
              <SquareArrowOutUpRight size={16} />
            </Button>
          </Link>
          <Button onClick={handleReload} variant={"outline"} size={"icon"}>
            <Repeat size={16} />
          </Button>
        </div>
        <div className="flex-grow">
          <iframe
            key={key}
            width="100%"
            height="100%"
            src={outputUrl}
            title="Output"
          />
        </div>
      </div>
    </Suspense>
  );
}
