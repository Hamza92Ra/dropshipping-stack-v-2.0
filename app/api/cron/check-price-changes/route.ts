import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendMail } from '@/lib/mailer';

// Configured in vercel.json to run on a schedule.
// Vercel automatically sends the Authorization header below for cron invocations;
// we double check it so the route can't be triggered by randoms hitting the URL.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dueAlerts = await query<{
    id: number;
    user_id: number;
    tool_id: number;
    target_price: number;
    email: string;
    name: string;
    current_price: number;
  }>(
    `SELECT pa.id, pa.user_id, pa.tool_id, pa.target_price, u.email, t.name, t.current_price
     FROM price_alerts pa
     JOIN users u ON u.id = pa.user_id
     JOIN tools t ON t.id = pa.tool_id
     WHERE pa.active = 1 AND t.current_price <= pa.target_price`
  );

  for (const alert of dueAlerts) {
    await sendMail(
      alert.email,
      `Price drop: ${alert.name}`,
      `<p>${alert.name} just dropped to $${alert.current_price}, at or below your target of $${alert.target_price}.</p>`
    );
    await query('UPDATE price_alerts SET active = 0 WHERE id = ?', [alert.id]);
  }

  return NextResponse.json({ checked: dueAlerts.length });
}
