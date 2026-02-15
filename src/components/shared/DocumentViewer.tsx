"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/lib/hooks/useScrollLock";
import { Button } from "@plexui/ui/components/Button";
import {
  ArrowLeftLg,
  ArrowRotateCw,
  ChevronLeftMd,
  ChevronRightMd,
  Download,
  Minus,
  Plus,
} from "@plexui/ui/components/Icon";
import { toTitleCase } from "@/lib/utils/format";
import type { DocumentViewerItem } from "@/lib/types";

const ZOOM_STEPS = [25, 50, 75, 100, 125, 150, 200];

export function DocumentViewer({
  items,
  initialIndex,
  onClose,
}: {
  items: DocumentViewerItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;
  const hasExtractions =
    item.extractedData && Object.keys(item.extractedData).length > 0;

  // Lock body scroll on mount
  useScrollLock(true);

  const goPrev = useCallback(() => {
    if (hasPrev) setIndex((i) => i - 1);
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (hasNext) setIndex((i) => i + 1);
  }, [hasNext]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => {
      const nextIdx = ZOOM_STEPS.findIndex((s) => s > prev);
      return nextIdx >= 0 ? ZOOM_STEPS[nextIdx] : prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const steps = [...ZOOM_STEPS].reverse();
      const nextIdx = steps.findIndex((s) => s < prev);
      return nextIdx >= 0 ? steps[nextIdx] : prev;
    });
  }, []);

  const rotateClockwise = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = item.photo.url;
    a.download = item.photo.url.split("/").pop() || "photo.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [item.photo.url]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-" || e.key === "_") zoomOut();
      if (e.key === "r" || e.key === "R") rotateClockwise();
      if (e.key === "0") setZoom(100);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext, zoomIn, zoomOut, rotateClockwise]);

  const filename = item.photo.url.split("/").pop() || item.photo.label;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* ─── Top Bar ─── */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
        {/* Left: back + label */}
        <div className="flex items-center gap-3">
          <Button
            color="secondary"
            variant="ghost"
            size="sm"
            uniform
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeftLg />
          </Button>
          <span className="text-sm text-white/80">{filename}</span>
        </div>

        {/* Center: zoom + rotate */}
        <div className="flex items-center gap-1">
          <Button
            color="secondary"
            variant="ghost"
            size="sm"
            uniform
            onClick={zoomOut}
            disabled={zoom <= ZOOM_STEPS[0]}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <Minus />
          </Button>
          <span className="w-14 text-center text-xs tabular-nums text-white/60">
            {zoom}%
          </span>
          <Button
            color="secondary"
            variant="ghost"
            size="sm"
            uniform
            onClick={zoomIn}
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <Plus />
          </Button>
          <div className="mx-1 h-5 w-px bg-white/10" />
          <Button
            color="secondary"
            variant="ghost"
            size="sm"
            uniform
            onClick={rotateClockwise}
            className="text-white hover:bg-white/10"
          >
            <ArrowRotateCw />
          </Button>
        </div>

        {/* Right: counter + download */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50">
            {index + 1} / {items.length}
          </span>
          <Button
            color="secondary"
            variant="ghost"
            size="sm"
            uniform
            onClick={handleDownload}
            className="text-white hover:bg-white/10"
          >
            <Download />
          </Button>
        </div>
      </div>

      {/* ─── Main Area ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Image viewport */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-auto"
        >
          <Image
            key={index}
            src={item.photo.url}
            alt={item.photo.label}
            width={1920}
            height={1080}
            className="object-contain"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease",
              maxWidth: "85%",
              maxHeight: "85%",
              width: "auto",
              height: "auto",
            }}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            onLoad={() => {
              setZoom(100);
              setRotation(0);
            }}
          />

          {/* Nav arrows */}
          <button
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors enabled:cursor-pointer enabled:hover:bg-white/20 disabled:opacity-30 disabled:cursor-default"
            onClick={goPrev}
            disabled={!hasPrev}
          >
            <ChevronLeftMd />
          </button>
          <button
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors enabled:cursor-pointer enabled:hover:bg-white/20 disabled:opacity-30 disabled:cursor-default"
            onClick={goNext}
            disabled={!hasNext}
          >
            <ChevronRightMd />
          </button>
        </div>

        {/* Sidebar — always visible */}
        <div className="w-80 shrink-0 overflow-auto border-l border-white/10 bg-zinc-950">
          {hasExtractions ? (
            <>
              <div className="border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-medium text-white/80">Extractions</h3>
              </div>
              <div className="divide-y divide-white/5">
                {Object.entries(item.extractedData!).map(([key, value]) => (
                  <div key={key} className="px-4 py-3">
                    <div className="text-xs text-white/40">{key}</div>
                    <div className="mt-0.5 text-sm text-white">
                      {(key === "Full name" || key === "Address") && typeof value === "string"
                        ? toTitleCase(value)
                        : value}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-medium text-white/80">Photo</h3>
              </div>
              <div className="space-y-3 px-4 py-3">
                <div>
                  <div className="text-xs text-white/40">Label</div>
                  <div className="mt-0.5 text-sm text-white">{item.photo.label}</div>
                </div>
                <div>
                  <div className="text-xs text-white/40">Type</div>
                  <div className="mt-0.5 text-sm text-white">{item.verificationType}</div>
                </div>
                <div>
                  <div className="text-xs text-white/40">Capture method</div>
                  <div className="mt-0.5 text-sm capitalize text-white">{item.photo.captureMethod}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
