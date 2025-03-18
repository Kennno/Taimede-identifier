import { NextRequest, NextResponse } from "next/server";

// This route has been deprecated in v0.0.4
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: "This functionality has been removed" },
    { status: 404 },
  );
}
