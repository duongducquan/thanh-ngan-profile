// ---- Theme toggle ----
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme){
  if(theme === 'dark'){
    root.setAttribute('data-theme','dark');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    root.removeAttribute('data-theme');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

const savedTheme = localStorage.getItem('ngan_theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('ngan_theme', next);
});

// ---- Copy to clipboard ----
const toast = document.getElementById('copyToast');
let toastTimer = null;

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const text = btn.getAttribute('data-copy');
    try{
      await navigator.clipboard.writeText(text);
      showToast('Đã sao chép: ' + text);
    }catch(err){
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Đã sao chép: ' + text);
    }
  });
});


// ---- Real music player (YouTube IFrame API) ----
const YT_VIDEO_ID = 'vLa5jvCJMGk';
const playBtn = document.getElementById('playBtn');
const musicStatus = document.getElementById('musicStatus');
let ytPlayer = null;
let ytReady = false;
let isPlaying = false;

function onYouTubeIframeAPIReady(){
  ytPlayer = new YT.Player('ytPlayerHolder', {
    height: '0',
    width: '0',
    videoId: YT_VIDEO_ID,
    playerVars: { autoplay: 0, controls: 0 },
    events: {
      onReady: () => { ytReady = true; },
      onStateChange: (e) => {
        if(e.data === YT.PlayerState.PLAYING){
          isPlaying = true;
          playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          musicStatus.textContent = 'Đang phát...';
        } else if(e.data === YT.PlayerState.PAUSED){
          isPlaying = false;
          playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          musicStatus.textContent = 'Đã tạm dừng';
        } else if(e.data === YT.PlayerState.ENDED){
          isPlaying = false;
          playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          musicStatus.textContent = 'Đã phát xong';
        }
      }
    }
  });
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

playBtn.addEventListener('click', () => {
  if(!ytReady || !ytPlayer){
    showToast('Đang tải trình phát nhạc...');
    return;
  }
  if(isPlaying){
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
});

