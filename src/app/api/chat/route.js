import { addData } from "@/app/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { collectionName, data } = body;
    await addData(collectionName, data);

    return NextResponse.json({
      message: "Chat created successfully",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong!",
    });
  }
}
