"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary env vars not set (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "mo-style-hub/products");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? "Upload failed.");
    }

    const data = await res.json();
    return data.secure_url as string;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");

    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const url = await uploadFile(file);
        urls.push(url);
      }
      onChange([...images, ...urls]);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(from: number, to: number) {
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[#e8e4de] hover:border-[#c9a96e] transition-colors rounded-sm p-6 text-center cursor-pointer bg-[#faf9f7]"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-sans-clean text-[#6b6b6b]">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-xs font-sans-clean text-[#6b6b6b]">
              Drag & drop images here, or <span className="text-[#c9a96e]">browse</span>
            </p>
            <p className="text-xs font-sans-clean text-[#9a9a9a]">PNG, JPG, WEBP — first image is the cover</p>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-xs font-sans-clean text-red-500 mt-2">{uploadError}</p>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={url + i} className="relative group">
              <div className="relative aspect-[3/4] bg-[#f0ede8] overflow-hidden">
                <Image src={url} alt={`Product image ${i + 1}`} fill className="object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-[#c9a96e] text-white text-xs px-1.5 py-0.5 font-sans-clean">
                    Cover
                  </span>
                )}
              </div>
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    title="Move left"
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#1a1a1a] text-xs hover:bg-[#c9a96e] hover:text-white transition-colors"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  title="Remove"
                  className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 text-xs hover:bg-red-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    title="Move right"
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#1a1a1a] text-xs hover:bg-[#c9a96e] hover:text-white transition-colors"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
