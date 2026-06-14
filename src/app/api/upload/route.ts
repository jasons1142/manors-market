import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { uploadRateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();

  const ip = getIp(req);
  const { success } = await uploadRateLimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many upload attempts. Please try again later." },
      { status: 429 }
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
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