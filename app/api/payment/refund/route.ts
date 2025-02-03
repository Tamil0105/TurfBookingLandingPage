import { NextResponse } from "next/server";

const getCashfreeUrl = (path: string) =>
  process.env.CASHFREE_ENVIRONMENT === "sandbox"
    ? `https://sandbox.cashfree.com${path}`
    : `https://api.cashfree.com${path}`;

const clientId = process.env.CASHFREE_CLIENT_ID;
const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Client credentials not found");
}

export async function POST(req: Request ) {
 
  try {
    const {orderId, refundId, refundAmount, refundReason } = await req.json();
    console.log(orderId,refundId,refundAmount)

    if (!refundId || !refundAmount || !refundReason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const url = getCashfreeUrl(`/pg/orders/${orderId}/refunds`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": clientId as string,
        "X-Client-Secret": clientSecret as string,
        "X-Api-Version": "2023-08-01",
      },
      body: JSON.stringify({
        refund_id: refundId,
        refund_amount: refundAmount,
        refund_reason: refundReason,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, data }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: data.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}