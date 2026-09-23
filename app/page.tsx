'use client'

import Image from 'next/image'
import { useState, type FormEvent } from 'react'
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Menu, MessageCircle, Phone, X } from 'lucide-react'

const images = {
  jana: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-24%20at%2010.31.25%20PM%20%281%29-u4TECeSB0zOabaUV6tjexu2mW19Scb.jpeg',
  khamsin: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-24%20at%2010.31.25%20PM-4ZcpTQhzcNcA20r151M70BPmCuzc87.jpeg',
  khamsinPair: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-25%20at%2012.29.45%20AM%20%282%29-9E9fV3GDgMobhcxuPPyvZTl5dj0C0R.jpeg',
  dustpan: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-25%20at%2012.29.45%20AM%20%281%29-DBLvsg8CfDvBtGqvKA1ELDwhZsH8mc.jpeg',
  tray: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-04%20at%209.02.35%20PM-s0IrCnJbj6xsJ5S2xa1tuDobh3q4EX.jpeg',
}

const logo = '/baraka-logo.png'

type Product = {
  name: string
  size: string
  image: string
  gallery: string[]
  colors: string
}

function makeProduct(name: string, gallery: string[], size = 'منتج بلاستيكي عالي الجودة'): Product {
  return { name, size, image: gallery[0], gallery, colors: 'ألوان متعددة' }
}

const products: Product[] = [
  { name: 'طبق جنى', size: 'قطر 28 سم · ارتفاع 10 سم', image: images.jana, gallery: [images.jana, images.khamsin, '/طبق .jpeg', '/طبق 1.jpeg'], colors: 'أحمر، أزرق، أخضر، بنفسجي' },
  { name: 'طقم أطباق خمسين', size: 'مجموعة بألوان متعددة · مقاس 50 سم', image: images.khamsinPair, gallery: [images.khamsinPair, '/خمسن12.jpeg'], colors: 'أحمر، أزرق، أخضر' },
  makeProduct('باسكت زباله', ['/بسكت زباله.jpeg', '/بسكت زباله 1.jpeg', '/بسكت زباله 2.jpeg']),
  makeProduct('جروف', ['/جروف .jpeg', '/جروف 1.jpeg']),
  makeProduct('شفشف ماء / عصير', ['/شفشف.jpeg']),
  makeProduct('شفشف ماء / عصير', ['/شفشف اتنين.jpeg']),
  makeProduct('صينيه مقاس سته', ['/66.jpeg', '/6.jpeg'], 'قطر 60 سم'),
  makeProduct('صينيه مقاس اربعه', ['/4.jpeg', '/44.jpeg'], 'قطر 41 سم'),
  makeProduct('صينيه مقاس اتنين', [images.tray, '/صينيه مقاس اتنين.jpeg', '2.jpeg'], 'قطر 35 سم'),
  makeProduct('صينيه', ['/صينه 2.jpeg', '/صينه اتنين.jpeg', '/صينه اربعه.jpeg']),
  makeProduct('صينيه ', ['/صينه تالته.jpeg', '/صينه تلات.jpeg', '/صينه تلات1.jpeg', '/صينه واحد.jpeg']),
  makeProduct('صينيه تقديم', ['/صينه شاي.jpeg', '/صينه شاي1.jpeg']),
  makeProduct(' حافظة طعام', ['/طبق تلاجه.jpeg', '/طبق خزين.jpeg']),
  makeProduct('طبق عز', ['/طبق عز.jpeg', '/طبق عز 1.jpeg', '/طبق عز اتنين.jpeg'], 'قطر 38 سم · ارتفاع 16 سم'),
  makeProduct('طبق كبير', ['/طبق غسيل.jpeg', '/طبق غسيل .jpeg', '/طبق غسيل1.jpeg']),
  makeProduct('لبانه', ['/لبانه.jpeg', '/لبانه1.jpeg']),
]

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
}

export default function Page() {
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[number] | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [contactError, setContactError] = useState('')

  function openProduct(product: Product) {
    setSelectedProduct(product)
    setSelectedImageIndex(0)
  }

  function changeProductImage(direction: number) {
    if (!selectedProduct || selectedProduct.gallery.length < 2) return
    setSelectedImageIndex((currentIndex) => (currentIndex + direction + selectedProduct.gallery.length) % selectedProduct.gallery.length)
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setContactStatus('sending')
    setContactError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          message: formData.get('message'),
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر إرسال الطلب')
      form.reset()
      setContactStatus('success')
    } catch (error) {
      setContactStatus('error')
      setContactError(error instanceof Error ? error.message : 'تعذر إرسال الطلب حاليًا.')
    }
  }

  return (
    <main dir="rtl">
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="#home" className="brand"><Image src={logo} alt="البركة للبلاستيك" width={150} height={98} priority /></a>
          <nav className={open ? 'nav-links open' : 'nav-links'}>
            <a href="#home" onClick={() => setOpen(false)}>الرئيسية</a><a href="#about" onClick={() => setOpen(false)}>من نحن</a><a href="#products" onClick={() => setOpen(false)}>المنتجات</a><a href="#contact" onClick={() => setOpen(false)}>تواصل معنا</a>
          </nav>
          <a className="nav-cta" href="#contact">اطلب عرض سعر <ArrowLeft size={16} /></a>
          <button className="menu-button" aria-label="فتح القائمة" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section id="home" className="hero container">
        <div className="hero-copy"><span className="eyebrow">مصنع وطني للمنتجات البلاستيكية المنزلية</span><h1>البركة للبلاستيك<br /><strong>جودة نصنعها بثقة</strong></h1><p>نصنع منتجات بلاستيكية عملية ومتينة بألوان ومقاسات تلبي احتياجات التجار والموزعين والمنازل حول المملكة.</p><div className="hero-actions"><a href="#products" className="button primary">تصفح المنتجات <ArrowLeft size={18} /></a><a href="#contact" className="button secondary">تواصل معنا</a></div><div className="hero-proof"><div><b>15+</b><span>عاماً من الخبرة</span></div><div><b>100%</b><span>جودة موثوقة</span></div><div><b>24/7</b><span>خدمة العملاء</span></div></div></div>
        <div className="hero-image"><div className="image-frame"><Image src={images.jana} alt="طبق جنى البلاستيكي بألوان متعددة" fill priority sizes="(max-width: 768px) 90vw, 520px" /></div><div className="floating-note"><Check size={17} /><span>منتجات آمنة<br />ومطابقة للجودة</span></div></div>
      </section>

      <section className="promise"><div className="container promise-grid"><div><span className="eyebrow light">لماذا البركة؟</span><h2>نحوّل البلاستيك إلى<br /><strong>منتجات تدوم</strong></h2></div><p>من خطوط الإنتاج إلى باب منزلك، نلتزم بالدقة في كل تفصيلة لنقدم منتجات تجمع بين العملية، المتانة والتصميم العصري.</p><div className="promise-items"><span><Check /> خامات آمنة</span><span><Check /> ألوان ثابتة</span><span><Check /> توريد سريع</span></div></div></section>

      <section id="about" className="about section"><div className="container about-grid"><div className="about-card"><div className="about-number">01</div><h3>خبرة تصنع الفرق</h3><p>في مصنع البركة للبلاستيك، نؤمن أن الجودة تبدأ من اختيار الخامة وتنتهي برضا العميل. نعمل بخبرة محلية وفهم عميق لاحتياجات السوق.</p><a href="#contact" className="text-link">اعرف المزيد <ArrowLeft size={16} /></a></div><div><SectionTitle eyebrow="من نحن" title="شريكك الموثوق في عالم البلاستيك" copy="نقدم حلولاً بلاستيكية للاستخدام اليومي والتوزيع التجاري، بجودة ثابتة وقدرة إنتاجية تلبي الطلبات الصغيرة والكبيرة." /><div className="about-points"><div><b>جودة ثابتة</b><span>فحص دقيق واختيار أفضل الخامات</span></div><div><b>مرونة في الطلب</b><span>كميات ومقاسات تناسب نشاطك</span></div></div></div></div></section>

      <section id="products" className="products section"><div className="container"><SectionTitle eyebrow="منتجاتنا" title="حلول عملية للاستخدام اليومي والتوزيع التجاري" copy="اكتشف تشكيلة من المنتجات البلاستيكية المصممة لتخدم احتياجاتك بجودة تثق بها." /><div className="product-grid">{products.map((product) => <article className="product-card" key={product.name} role="button" tabIndex={0} onClick={() => openProduct(product)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openProduct(product) }}><div className="product-image">{product.gallery.map((image, index) => <div className="product-thumb" key={image}><Image src={image} alt={`${product.name} - صورة ${index + 1}`} fill sizes="(max-width: 768px) 90vw, 280px" /></div>)}</div><div className="product-info"><span className="product-tag">منتج البركة</span><h3>{product.name}</h3><p>{product.size}</p><div className="card-bottom"><span>ألوان متنوعة</span><a href="#contact" aria-label={`اطلب ${product.name}`}><ArrowLeft size={18} /></a></div></div></article>)}</div><div className="center"><a className="button secondary" href="#contact">عرض جميع المنتجات <ArrowLeft size={17} /></a></div></div></section>

      {selectedProduct && <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-detail-title" onClick={() => setSelectedProduct(null)}><div className="product-modal-card" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="إغلاق التفاصيل" onClick={() => setSelectedProduct(null)}><X /></button><div className="modal-image"><Image src={selectedProduct.gallery[selectedImageIndex]} alt={`${selectedProduct.name} - صورة ${selectedImageIndex + 1}`} fill sizes="(max-width: 768px) 90vw, 520px" />{selectedProduct.gallery.length > 1 && <><button className="gallery-control gallery-next" aria-label="الصورة التالية" onClick={() => changeProductImage(1)}><ChevronRight /></button><button className="gallery-control gallery-prev" aria-label="الصورة السابقة" onClick={() => changeProductImage(-1)}><ChevronLeft /></button><div className="gallery-dots">{selectedProduct.gallery.map((image, index) => <button className={index === selectedImageIndex ? 'gallery-dot active' : 'gallery-dot'} key={image} aria-label={`عرض الصورة ${index + 1}`} onClick={() => setSelectedImageIndex(index)} />)}</div></>}</div><div className="modal-copy"><span className="product-tag">منتج البركة</span><h2 id="product-detail-title">{selectedProduct.name}</h2><p className="modal-size">{selectedProduct.size}</p><p>منتج عملي ومتين مصنوع بخامات عالية الجودة، مناسب للاستخدام اليومي والتوزيع التجاري. متوفر بعدة ألوان مع إمكانية توفير الكميات المطلوبة.</p><div className="modal-specs"><span><b>الألوان</b>{selectedProduct.colors}</span><span><b>التوريد</b>كميات صغيرة وكبيرة</span></div><a href="#contact" className="button primary" onClick={() => setSelectedProduct(null)}>اطلب هذا المنتج <ArrowLeft size={17} /></a></div></div></div>}

      <section id="contact" className="contact section"><div className="container contact-grid"><div><SectionTitle eyebrow="تواصل معنا" title="جاهزون لخدمتك" copy="يسعد فريقنا مساعدتك في اختيار المنتجات والكميات المناسبة لنشاطك." /><div className="contact-list"><a href="tel:+201100160920"><Phone /> <span><small>اتصل بنا</small>01100160920</span></a><a href="https://wa.me/201100160920" target="_blank" rel="noreferrer"><MessageCircle /> <span><small>واتساب</small>تحدث معنا مباشرة</span></a><div><span className="pin">⌖</span><span><small>الموقع</small> جمهورية مصر العربية </span></div></div></div><form className="contact-form" onSubmit={handleContactSubmit}><label>الاسم الكامل<input name="name" required minLength={2} maxLength={100} placeholder="اكتب اسمك" /></label><label>رقم الجوال<input name="phone" required type="tel" inputMode="tel" pattern="[+\\d][\\d\\s()-]{7,20}" placeholder="01xxxxxxxxx" /></label><label>رسالتك<textarea name="message" required minLength={5} maxLength={2000} rows={4} placeholder="كيف يمكننا مساعدتك؟" /></label><button className="button primary" type="submit" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? 'جارٍ الإرسال...' : 'إرسال الطلب'} {contactStatus !== 'sending' && <ArrowLeft size={17} />}</button>{contactStatus === 'success' && <p className="form-success" role="status">تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.</p>}{contactStatus === 'error' && <p className="form-error" role="alert">{contactError}</p>}</form></div></section>

      <footer><div className="container footer-wrap"><div className="brand"><Image src={logo} alt="البركة للبلاستيك" width={150} height={98} /></div><span>© 2026 مصنع البركة للبلاستيك. جميع الحقوق محفوظة.</span><a href="#home">العودة للأعلى <ChevronDown size={15} className="rotate" /></a></div></footer>
    </main>
  )
}
