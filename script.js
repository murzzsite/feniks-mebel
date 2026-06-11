const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/MNPMWSSSA4';

document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('.faq__item details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) document.querySelectorAll('.faq__item details').forEach(o => { if (o !== d) o.removeAttribute('open'); });
    });
  });

  const form = document.getElementById('leadForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(form);

    // honeypot
    if (formData.get('_gotcha')) return;

    const name = (formData.get('name') || '').trim();
    const phone = (formData.get('phone') || '').trim();
    const consent = formData.get('consent');

    if (!name) { alert('Пожалуйста, укажите ваше имя'); form.querySelector('[name=name]').focus(); return; }
    if (!phone || phone.replace(/\D/g, '').length < 11) { alert('Пожалуйста, введите корректный номер телефона'); form.querySelector('[name=phone]').focus(); return; }
    if (!consent) { alert('Пожалуйста, подтвердите согласие с политикой конфиденциальности'); return; }

    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Отправляю...';
    btn.disabled = true;

    const data = Object.fromEntries(formData.entries());
    delete data._gotcha;
    delete data.consent;

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        form.innerHTML = '<div class="form__success"><div class="form__success-icon">✓</div><h3>Заявка отправлена!</h3><p>Мы свяжемся с вами в ближайшее время и согласуем удобное время для встречи.</p></div>';
      } else {
        throw new Error('HTTP ' + res.status);
      }
    } catch (err) {
      console.error('Form submit error:', err);
      btn.textContent = orig;
      btn.disabled = false;
      alert('Не удалось отправить заявку. Напишите нам напрямую в ВКонтакте: vk.com/fenixmebel54 — ответим быстро.');
    }
  });
});
