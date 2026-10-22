// 서버 API와 무관한 히어로 영상 재생 제어입니다.
function initializeHeroVideo(root){
 const hero=root.querySelector('.public-hero'),video=hero?.querySelector('.hero-video');if(!video)return;
 const button=hero.querySelector('.verion-video-toggle');
 video.muted=true;video.defaultMuted=true;video.playsInline=true;
 const fallback=(reason)=>{hero.classList.add('is-video-fallback');hero.classList.remove('is-video-ready');button.hidden=true;if(reason)console.error('[VERION 배경영상] 재생 실패:',reason,video.currentSrc||video.querySelector('source')?.src);};
 const play=()=>{if(!video.isConnected)return;video.muted=true;try{const pending=video.play();if(pending?.catch)pending.catch(error=>{if(video.isConnected&&error.name!=='AbortError')fallback(error);});}catch(error){fallback(error);}};
 video.addEventListener('playing',()=>{hero.classList.remove('is-video-fallback');hero.classList.add('is-video-ready');button.hidden=false;button.textContent='영상 일시정지';button.setAttribute('aria-label','배경영상 일시정지');});
 video.addEventListener('error',()=>fallback(video.error||'영상 파일을 불러올 수 없습니다.'));
 video.querySelector('source')?.addEventListener('error',()=>fallback('MP4 소스 로딩 실패'));
 video.addEventListener('canplay',()=>{if(video.paused)play();});
 button.addEventListener('click',()=>{if(video.paused)play();else{video.pause();button.textContent='영상 재생';button.setAttribute('aria-label','배경영상 재생');}});
 // 동적으로 생성된 video도 초기화 직후 재생을 요청합니다. canplay는 보조 재시도입니다.
 play();
}
