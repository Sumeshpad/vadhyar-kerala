import { NextResponse } from "next/server";

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/8u8s1zwkp9it4";

export async function GET() {
  try {
    const response = await fetch(SHEETDB_API_URL);
    const data = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid API response" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      data.map((item) => ({
        name: item["Name"] || "Unknown",
        services: item["Services"] || "No services listed",
        phone: item["Phone"] || "0000000000",
        image:
          item["Image URL"] && item["Image URL"].startsWith("http")
            ? item["Image URL"]
            : "https://res.cloudinary.com/dyynrlya5/image/upload/v1740233679/brahmin-placeholder_kc2he1.png",
        tags: item["Tags"] || "No tags",
        location: item["Location"] || "Unknown",
      }))
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
