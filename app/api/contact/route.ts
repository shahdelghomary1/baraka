import { Resend } from 'resend'

const destination = 'shahdelgomary@gmail.com'

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!name || name.length < 2 || name.length > 100) {
      return Response.json({ error: 'يرجى إدخال الاسم بشكل صحيح.' }, { status: 400 })
    }
    if (!/^[+\d][\d\s()-]{7,20}$/.test(phone)) {
      return Response.json({ error: 'يرجى إدخال رقم جوال صحيح.' }, { status: 400 })
    }
    if (!message || message.length < 5 || message.length > 2000) {
      return Response.json({ error: 'يرجى كتابة رسالة واضحة.' }, { status: 400 })
    }
    if (!process.env.RESEND_API_KEY) {
      console.error('[v0] RESEND_API_KEY is missing')
      return Response.json({ error: 'تعذر إرسال الطلب حاليًا. حاول مرة أخرى لاحقًا.' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: 'موقع مصنع البركة <onboarding@resend.dev>',
      to: [destination],
      subject: `طلب تواصل جديد من ${name}`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.8"><h2>طلب تواصل جديد</h2><p><strong>الاسم:</strong> ${escapeHtml(name)}</p><p><strong>رقم الجوال:</strong> ${escapeHtml(phone)}</p><p><strong>الرسالة:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p></div>`,
      text: `طلب تواصل جديد\n\nالاسم: ${name}\nرقم الجوال: ${phone}\nالرسالة:\n${message}`,
    }, { idempotencyKey: `contact-form/${crypto.randomUUID()}` })

    if (error) {
      console.error('[v0] Resend email error:', error.message)
      return Response.json({ error: 'تعذر إرسال الطلب حاليًا. حاول مرة أخرى لاحقًا.' }, { status: 502 })
    }

    return Response.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('[v0] Contact form error:', error)
    return Response.json({ error: 'حدث خطأ غير متوقع. حاول مرة أخرى لاحقًا.' }, { status: 500 })
  }
}
