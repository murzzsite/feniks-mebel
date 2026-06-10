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
    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Отправляю...';
    btn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    delete data._gotcha;
    if (formData.get('_gotcha')) return;

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        form.innerHTML = '<div class="form__success"><div class="form__success-icon">✓</div><h3>Заявка отправлена!</h3><p>Мы свяжемся с вами в ближайшее время и согласуем удобное время для встречи.</p></div>';
      } else throw new Error();
    } catch {
      btn.textContent = orig;
      btn.disabled = false;
      alert('Ошибка отправки. Пожалуйста, напишите нам в ВКонтакте: vk.com/fenixmebel54');
    }
  });
});
