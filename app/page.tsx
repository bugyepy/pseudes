"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const Canvas = dynamic(() => import("../components/ui/canvas"), {
  ssr: false,
});

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<File>();
  const [pestedUrl, setPestedUrl] = useState<string | null>(null);

  const handlePestedUrlChange = (pestedUrl: string) => {
    setPestedUrl(pestedUrl);
  };

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    setImage(e.target.files[0]);
    setIsOpen(true);
  };

  const handleOpenChange = (bool: Boolean) => {
    if (!bool) handleClose();
    if (bool && !image) setIsOpen(false);
    if (bool && image) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setImage(undefined);
    setPestedUrl(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!pestedUrl) return;

    const link = document.createElement("a");
    link.download = "pestedImage.png";
    link.href = pestedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setPestedUrl(null);
  };

  return (
    <main className="flex align-items justify-center min-h-screen p-8 md:p-14 bg-[url('/background.png')]">
      <section className="p-4 md:p-14 bg-white rounded-50 rounded-lg border-8 border-black">
        <h1 className="pb-2 text-2xl md:text-4xl font-bold">
          Pseudes - Pesting for quickly.
        </h1>
        <h2 className="pb-2 text-lg md:text-xl font-semibold">
          安心で安全。完全に無料。サーバに画像は保存されません。
        </h2>

        <p className="pb-8 text-gray-500 dark:text-gray-400">
          Next.jsによるCanvas Demoサイト。デプロイにはVercelを利用している。
          <a
            href="https://github.com/bugyepy/pseudes"
            className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            詳細はGitHub
            <svg
              className="w-4 h-4 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </p>

        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <label className="block">
              <input
                type="file"
                className="block w-full text-sm text-slate-500 file:mr-2 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                id="image"
                accept="image/*"
                placeholder="画像"
                onInput={handleInput}
                ref={inputRef}
              />
            </label>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>画像を偽物にする</DialogTitle>
              <DialogDescription>
                画像に合わせてウォーターマークを移動させてください。
              </DialogDescription>
            </DialogHeader>

            {image && (
              <Canvas
                image={image}
                handlePestedUrlChange={handlePestedUrlChange}
              />
            )}

            <DialogFooter className="gap-y-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button type="button" onClick={handleSave} disabled={!pestedUrl}>
                保存する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}
