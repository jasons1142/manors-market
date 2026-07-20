"use client";
import { Prisma } from "@prisma/client";
import { useState } from "react";

type ProductImage = Prisma.ProductImageGetPayload<{}>;

type ProductImageGalleryProps = {
    images: ProductImage[];
    productName: string;
}

export default function ProductImageGallery({
    images,
    productName,
}: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (images.length === 0) {
        return (
          <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100">
            <span className="text-gray-500">No image available</span>
          </div>
        );
    }

    const selectedImage = images[selectedIndex];

    return (
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            <img
              src={selectedImage.imageUrl}
              alt={`${productName} image ${selectedIndex + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
    
          <div className="flex gap-3 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                  selectedIndex === index
                    ? "border-[#DCC7A6]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
    );
}