import { NextResponse } from "next/server";
import { SchoolService } from "@/lib/schoolService";
import { initializeDatabase } from "@/lib/database";
import { verifyToken } from "@/lib/auth"; // yaha tumne pehle banaya tha

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

export async function GET(request) {
  try {
    await ensureDbInitialized();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search");

    let schools;
    if (query) {
      schools = await SchoolService.searchSchools(query);
    } else {
      schools = await SchoolService.getSchools();
    }

    return NextResponse.json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await ensureDbInitialized();

    // ✅ Check Authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Please login first" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ✅ Continue only if authenticated
    const formData = await request.formData();

    const schoolData = {
      name: formData.get("name"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      contact: formData.get("contact"),
      email_id: formData.get("email_id"),
      image: formData.get("image") || null,
      created_by: decoded.email,
    };

    const result = await SchoolService.createSchool(schoolData);

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
