import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId, orderAmount, customerDetails } = await req.json();

  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Client credentials not found" }, { status: 500 });
  }

  const url =
    process.env.CASHFREE_ENVIRONMENT === "sandbox"
      ? "https://sandbox.cashfree.com/pg/orders"
      : "https://api.cashfree.com/pg/orders";

  try {
    console.log(1)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": clientId,
        "X-Client-Secret": clientSecret,
        "X-Api-Version": "2023-08-01", // Specify the valid API version here
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: customerDetails,
        redirect_url: "https://example.com/return-url",
      }),
    });
    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating payment link:", error);
    return NextResponse.json({ error: "Payment link creation failed" }, { status: 500 });
  }
}