import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { uploadRateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getIp(req);
  const { success } = await uploadRateLimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many upload attempts. Please try again later." },
      { status: 429 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      {
        error: "Only JPG, PNG, and WEBP images are allowed.",
      },
      { status: 400 }
    );
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: "Image must be under 5MB.",
      },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "manors-market/products",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return NextResponse.json({
    imageUrl: result.secure_url,
  });
}