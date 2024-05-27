import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { collectionName, data } = body;
    console.log(collectionName, data, " from");
    return NextResponse.json({
      message: "Chat retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong!",
    });
  }
}
