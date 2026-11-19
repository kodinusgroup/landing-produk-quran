import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

// Smooth scroll untuk link a.scroll[href^="#"]
document.querySelectorAll('a.scroll[href^="#"]').forEach((link) => {
  const hash = link.getAttribute('href');
  if (hash === '#' || hash === '#0') return;

  link.addEventListener('click', (e) => {
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

// Navbar sticky + tombol back-to-top
const navbar = document.querySelector('.navbar');
const bttButton = document.querySelector('.btt-wrapper .btn');

bttButton?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const onScroll = () => {
  const scrolled = window.scrollY > 50;
  bttButton?.classList.toggle('is-visible', scrolled);
  navbar?.classList.toggle('is-scrolled', scrolled);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Carousel testimoni (pengganti owl-carousel)
document.querySelectorAll('.swiper').forEach((el) => {
  new Swiper(el, {
    modules: [Navigation],
    rewind: true,
    spaceBetween: 12,
    slidesPerView: 1,
    navigation: { nextEl: el.querySelector('.swiper-button-next'), prevEl: el.querySelector('.swiper-button-prev') },
    breakpoints: { 768: { slidesPerView: 2, spaceBetween: 16 }, 1200: { slidesPerView: 3, spaceBetween: 20 } },
  });
});

// Tombol 'Pilih seri ini' mengisi pilihan seri di form
document.querySelectorAll('[data-seri]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const select = document.getElementById('form-6');
    if (select) select.value = btn.dataset.seri;
  });
});

// Form pemesanan: kirim ringkasan pesanan ke WhatsApp
const HARGA = 135000;
const WA_TUJUAN = '6283391225122';
const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID');

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const orderForm = document.getElementById('order-form');
if (orderForm) {
  const jumlah = orderForm.elements.jumlah;
  const total = document.getElementById('order-total');
  const hitung = () => {
    const n = Math.max(1, parseInt(jumlah.value, 10) || 1);
    total.textContent = rupiah(n * HARGA);
  };
  jumlah.addEventListener('input', hitung);

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }
    const f = orderForm.elements;
    const n = Math.max(1, parseInt(f.jumlah.value, 10) || 1);
    const pesan = [
      'Halo, saya ingin memesan buku Qalam Kecil.',
      '',
      `Nama: ${f.nama.value.trim()}`,
      `WhatsApp: ${f.wa.value.trim()}`,
      `Alamat: ${f.alamat.value.trim()}`,
      `Pembayaran: ${f.bayar.value}`,
      `Seri: ${f.seri.value}`,
      `Jumlah: ${n} buku`,
      `Total: ${rupiah(n * HARGA)}`,
    ].join('\n');
    window.open(`https://wa.me/${WA_TUJUAN}?text=${encodeURIComponent(pesan)}`, '_blank', 'noopener');
  });
}
