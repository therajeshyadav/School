// app/api/schools/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = params;
    const conn = await getConnection();
    const [rows] = await conn.execute(
      "SELECT created_by FROM schools WHERE id=?",
      [id]
    );

    if (rows.length === 0)
      return NextResponse.json({ error: "School not found" }, { status: 404 });

    if (rows[0].created_by !== decoded.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await conn.execute("DELETE FROM schools WHERE id=?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE school error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const token = request.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await request.json();

    if (body.image && body.image.length > 65535) {
      return NextResponse.json({ error: "Image too long" }, { status: 400 });
    }

    const conn = await getConnection();
    const [result] = await conn.execute(
      `UPDATE schools 
       SET name=?, address=?, city=?, state=?, contact=?, email_id=?, image=? 
       WHERE id=? AND created_by=?`,
      [
        body.name,
        body.address,
        body.city,
        body.state,
        body.contact,
        body.email_id,
        body.image || null,
        id,
        decoded.email,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating school:", err);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("Fetching school with id:", id);
    const conn = await getConnection();

    const [rows] = await conn.execute("SELECT * FROM schools WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]); 
  } catch (err) {
    console.error("Error fetching school:", err);
    return NextResponse.json(
      { error: "Failed to fetch school" },
      { status: 500 }
    );
  }
}
