// 영상은 재생이 확인된 뒤에만 표시합니다. 실패/재생 제한 시 기존 정적 디자인을 유지합니다.
function initializeHeroVideo(root){
 const hero=root.querySelector('.public-hero'),video=hero?.querySelector('.verion-hero-video');if(!video)return;
 const button=hero.querySelector('.verion-video-toggle');
 video.muted=true;video.defaultMuted=true;video.playsInline=true;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const fallback=()=>{hero.classList.remove('is-video-ready');button.hidden=true;};
 const play=()=>{if(reduced?.matches){video.removeAttribute('autoplay');fallback();return;}try{const pending=video.play();if(pending?.catch)pending.catch(fallback);}catch{fallback();}};
 video.addEventListener('playing',()=>{if(reduced?.matches){if(!video.paused)video.pause();fallback();return;}hero.classList.add('is-video-ready');button.hidden=false;button.textContent='영상 일시정지';button.setAttribute('aria-label','배경영상 일시정지');});
 video.addEventListener('error',fallback);video.querySelector('source')?.addEventListener('error',fallback);video.addEventListener('canplay',play);
 button.addEventListener('click',()=>{if(video.paused){play();}else{video.pause();button.textContent='영상 재생';button.setAttribute('aria-label','배경영상 재생');}});
 if(reduced?.matches)video.removeAttribute('autoplay');
 reduced?.addEventListener?.('change',event=>{if(event.matches){if(!video.paused)video.pause();video.removeAttribute('autoplay');fallback();}else{video.setAttribute('autoplay','');play();}});
}
