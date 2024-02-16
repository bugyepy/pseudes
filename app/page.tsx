"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
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
    setPestedUrl(null)

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

    setPestedUrl(null)
  };

  return (
    <main className="min-h-screen p-24">
      <h1 className="pb-2 text-4xl font-bold">
        Pseudes - Pesting for quickly.
      </h1>
      <h2 className="pb-8 text-xl font-semibold">
        安心で安全。完全に無料。サーバに画像は保存されません。
      </h2>
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

      <div
        className="mt-8"
        style={{ position: "relative", width: "100%", height: "600px" }}
      >
        {!isOpen && image && (
          <Image
            src={URL.createObjectURL(image)}
            alt={"ファイルを選択してください。"}
            fill
            style={{
              objectFit: "contain",
              objectPosition: "0 0",
              top: "0",
              left: "0",
            }}
          />
        )}
      </div>
    </main>
  );
}
