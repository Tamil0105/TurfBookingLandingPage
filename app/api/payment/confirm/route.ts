import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");


  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Client credentials not found" }, { status: 500 });
  }

  const url =
    process.env.CASHFREE_ENVIRONMENT === "sandbox"
      ? `https://sandbox.cashfree.com/pg/orders/${orderId}`
      : `https://api.cashfree.com/pg/orders/${orderId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": clientId,
        "X-Client-Secret": clientSecret,
        "X-Api-Version": "2023-08-01", // Specify the valid API version here
      },
    });

    const data = await response.json();
    console.log(data);
    
    if (response.ok) {
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}