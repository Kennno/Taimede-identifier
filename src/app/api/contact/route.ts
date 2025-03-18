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

    // Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "RoheAI <kontakt@roheai.ee>",
        to: ["ludacrislsrp@gmail.com"],
        subject: `Kontaktivorm: ${subject}`,
        html: `
          <h2>Uus sõnum kontaktivormist</h2>
          <p><strong>Nimi:</strong> ${name}</p>
          <p><strong>E-post:</strong> ${email}</p>
          <p><strong>Teema:</strong> ${subject}</p>
          <p><strong>Sõnum:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return NextResponse.json(
        { error: "E-kirja saatmine ebaõnnestus" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in contact form submission:", error);
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 });
  }
}
