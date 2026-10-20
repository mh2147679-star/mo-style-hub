import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "Mo Style Hub <orders@mostylehub.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrderEmailItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderEmailData {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderEmailItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// ── HTML template ─────────────────────────────────────────────────────────────

function orderConfirmationHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ede8; vertical-align: top;">
          <div style="font-family: sans-serif; font-size: 13px; font-weight: 600; color: #1a1a1a;">
            ${item.name}
          </div>
          <div style="font-family: sans-serif; font-size: 12px; color: #6b6b6b; margin-top: 2px;">
            ${item.size} · ${item.color} · Qty ${item.quantity}
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ede8; text-align: right; vertical-align: top; font-family: sans-serif; font-size: 13px; color: #1a1a1a; white-space: nowrap;">
          ${fmt(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  const { shippingAddress: addr } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation — ${data.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf9f7; font-family: sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf9f7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e8e4de;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <div style="font-size: 22px; letter-spacing: 6px; text-transform: uppercase; color: #ffffff;">
                Mo Style Hub
              </div>
            </td>
          </tr>

          <!-- Hero message -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center; border-bottom: 1px solid #e8e4de;">
              <div style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #c9a96e; margin-bottom: 12px;">
                Order Confirmed
              </div>
              <div style="font-size: 26px; letter-spacing: 2px; color: #1a1a1a; margin-bottom: 12px;">
                Thank you, ${data.customerName.split(" ")[0]}!
              </div>
              <div style="font-size: 13px; color: #6b6b6b; line-height: 1.6;">
                Your order <strong style="color: #1a1a1a;">${data.orderNumber}</strong> has been received
                and is being processed. We'll notify you when it ships.
              </div>
            </td>
          </tr>

          <!-- Order items -->
          <tr>
            <td style="padding: 32px 40px;">
              <div style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #c9a96e; margin-bottom: 16px;">
                Order Summary
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                <!-- Subtotal -->
                <tr>
                  <td style="padding: 12px 0 4px; font-size: 12px; color: #6b6b6b;">Subtotal</td>
                  <td style="padding: 12px 0 4px; text-align: right; font-size: 12px; color: #6b6b6b;">${fmt(data.subtotal)}</td>
                </tr>
                <!-- Shipping -->
                <tr>
                  <td style="padding: 4px 0; font-size: 12px; color: #6b6b6b;">Shipping</td>
                  <td style="padding: 4px 0; text-align: right; font-size: 12px; color: #6b6b6b;">
                    ${data.shippingCost === 0 ? "Free" : fmt(data.shippingCost)}
                  </td>
                </tr>
                <!-- Total -->
                <tr>
                  <td style="padding: 12px 0 0; border-top: 1px solid #e8e4de; font-size: 15px; font-weight: 700; color: #1a1a1a;">
                    Total
                  </td>
                  <td style="padding: 12px 0 0; border-top: 1px solid #e8e4de; text-align: right; font-size: 15px; font-weight: 700; color: #1a1a1a;">
                    ${fmt(data.total)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping address -->
          <tr>
            <td style="padding: 0 40px 32px; border-top: 1px solid #e8e4de;">
              <div style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #c9a96e; margin: 24px 0 12px;">
                Shipping To
              </div>
              <div style="font-size: 13px; color: #6b6b6b; line-height: 1.8;">
                <strong style="color: #1a1a1a;">${addr.firstName} ${addr.lastName}</strong><br/>
                ${addr.address}<br/>
                ${addr.city}, ${addr.state} ${addr.zipCode}<br/>
                ${addr.country}
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <a
                href="${APP_URL}/orders"
                style="display: inline-block; background-color: #c9a96e; color: #ffffff; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; padding: 14px 32px;"
              >
                View Your Orders
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf9f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e8e4de;">
              <div style="font-size: 11px; color: #9a9a9a; line-height: 1.6;">
                © ${new Date().getFullYear()} Mo Style Hub. All rights reserved.<br/>
                Questions? Reply to this email or visit
                <a href="${APP_URL}" style="color: #c9a96e; text-decoration: none;">${APP_URL.replace(/https?:\/\//, "")}</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Plain-text fallback ───────────────────────────────────────────────────────

function orderConfirmationText(data: OrderEmailData): string {
  const itemLines = data.items
    .map(
      (i) =>
        `• ${i.name} (${i.size} / ${i.color}) x${i.quantity} — ${fmt(i.price * i.quantity)}`
    )
    .join("\n");

  const { shippingAddress: a } = data;

  return `ORDER CONFIRMED — Mo Style Hub

Hi ${data.customerName},

Your order ${data.orderNumber} has been received!

ORDER SUMMARY
${itemLines}

Subtotal: ${fmt(data.subtotal)}
Shipping: ${data.shippingCost === 0 ? "Free" : fmt(data.shippingCost)}
Total:    ${fmt(data.total)}

SHIPPING TO
${a.firstName} ${a.lastName}
${a.address}
${a.city}, ${a.state} ${a.zipCode}
${a.country}

View your orders: ${APP_URL}/orders

© ${new Date().getFullYear()} Mo Style Hub
`;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Send an order confirmation email.
 * Swallows errors so a failed email never breaks the order flow.
 */
export async function sendOrderConfirmation(data: OrderEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping order confirmation email.");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: data.customerEmail,
      subject: `Order Confirmed — ${data.orderNumber}`,
      html: orderConfirmationHtml(data),
      text: orderConfirmationText(data),
    });
    console.log(`[email] Order confirmation sent to ${data.customerEmail} for ${data.orderNumber}`);
  } catch (err: any) {
    // Log but never throw — a failed email must not break the order
    console.error("[email] Failed to send order confirmation:", err.message);
  }
}
