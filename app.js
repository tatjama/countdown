// ======== Initialization ========
  const urlParams = new URLSearchParams(window.location.search);
  const isEmbed = urlParams.get('embed') === 'true';

  // Elements
  const titleEl = document.getElementById('title');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const settingsEl = document.getElementById('settings');
  const iframeCodeEl = document.getElementById('iframeCode');

  const inputTitle = document.getElementById('inputTitle');
  const inputDate = document.getElementById('inputDate');
  const inputTime = document.getElementById('inputTime');
  const inputTheme = document.getElementById('inputTheme');
  const applyBtn = document.getElementById('applyBtn');

  if (isEmbed) {
    settingsEl.style.display = 'none';
  }

  // ======== State from URL or default ========
  let title = urlParams.get('title') || 'Project Launch';
  let targetDateParam = urlParams.get('date');
  let theme = urlParams.get('theme') || 'dark';

  let targetDate = targetDateParam ? new Date(targetDateParam) : new Date(Date.now() + 24*60*60*1000);

  titleEl.textContent = title;
  document.body.style.backgroundColor = theme==='dark'? '#000' : theme==='light'? '#fff' : 'transparent';
  document.body.style.color = theme==='dark'? '#fff' : theme==='light'? '#000' : '#000';

  inputTitle.value = title;
  inputDate.value = targetDate.toISOString().split('T')[0];
  inputTime.value = targetDate.toTimeString().slice(0,5);
  inputTheme.value = theme;

  // ======== Countdown Logic ========
  function updateCountdown() {
    const now = new Date().getTime();
    let diff = targetDate.getTime() - now;
    if (diff < 0) diff = 0;

    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff / (1000*60*60)) % 24);
    const m = Math.floor((diff / (1000*60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(d).padStart(2,'0');
    hoursEl.textContent = String(h).padStart(2,'0');
    minutesEl.textContent = String(m).padStart(2,'0');
    secondsEl.textContent = String(s).padStart(2,'0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ======== Apply & Generate iframe ========
  applyBtn.addEventListener('click', () => {
    title = inputTitle.value;
    const dateStr = inputDate.value;
    const timeStr = inputTime.value;
    theme = inputTheme.value;

    targetDate = new Date(`${dateStr}T${timeStr}`);

    // Update DOM
    titleEl.textContent = title;
    document.body.style.backgroundColor = theme==='dark'? '#000' : theme==='light'? '#fff' : 'transparent';
    document.body.style.color = theme==='dark'? '#fff' : theme==='light'? '#000' : '#000';

    // Update URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('title', title);
    newUrl.searchParams.set('date', targetDate.toISOString());
    newUrl.searchParams.set('theme', theme);
    newUrl.searchParams.set('embed', true);
    window.history.replaceState({}, '', newUrl);

    // Generate iframe code
    iframeCodeEl.textContent = `<iframe src="${newUrl}" width="100%" height="400px" style="border:none;border-radius:12px;"></iframe>`;
  });
