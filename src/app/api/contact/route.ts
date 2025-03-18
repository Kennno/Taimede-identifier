import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Kõik väljad on kohustuslikud" },
        { status: 400 },
      );
    }

    // Log the contact form submission (instead of sending email)
    console.log("Contact form submission:", { name, email, subject, message });

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in contact form submission:", error);
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 });
  }
}
