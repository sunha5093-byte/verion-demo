// 외부 공개 전용: 네트워크 요청/관리자 연동/개인정보 영구 저장이 없습니다.
const ExperienceStore=(()=>{
 const key='verion-public-demo-experience-v1';let memoryCount=0;
 return {complete(){try{const old=JSON.parse(localStorage.getItem(key)||'{}');memoryCount=Number.isInteger(old.completedCount)&&old.completedCount>=0?Math.min(old.completedCount+1,999999):1;localStorage.setItem(key,JSON.stringify({version:1,completedCount:memoryCount}));}catch{memoryCount++;}return memoryCount;}};
})();
function publicSuccess(){return publicHeader()+'<section class="public-success"><div class="success-seal">✓</div><div class="public-kicker">VERION · DEMONSTRATION</div><h1>신청 완료 화면입니다.</h1><p>시연용 접수 체험이 완료되었습니다.<br>실제로 접수되거나 담당자에게 전송되지 않았습니다.</p><p class="public-field-help">입력 내용은 저장하지 않았습니다.<br>이 페이지는 사업계획 검토를 위한 고객 화면 데모입니다.</p><a class="public-btn" href="#public">홈으로 돌아가기</a></section>'+publicFooter();}
function go(route){const valid=['public','apply','consult','application-complete'];route=valid.includes(route)||isVerionInfoRoute(route)?route:'public';location.hash='#'+route;renderPublic(route);}
function renderPublic(route){if(isVerionInfoRoute(route)){renderVerionInfoPage(route);return;}
 if(route==='application-complete'&&!applicationComplete)route='public';
 document.title='베리온 | VERION · 외부 시연';
 const root=$('#public-root');root.innerHTML=route==='public'?publicHome():route==='application-complete'?publicSuccess():publicForm(route);
 const form=$('#publicApplicationForm');if(!form)return;
 const fillButton=document.createElement('button');fillButton.type='button';fillButton.className='demo-fill';fillButton.textContent='가상 정보로 이 단계 채우기';form.prepend(fillButton);fillButton.onclick=()=>fillDemoStage(form);
 form.addEventListener('input',event=>refreshPublicField(form,event.target));form.addEventListener('change',event=>refreshPublicField(form,event.target));
 const phone=form.elements.phone;if(phone)phone.addEventListener('input',()=>{phone.value=formatPublicPhone(phone.value)});
 form.onsubmit=event=>{
  event.preventDefault();const kind=form.dataset.kind,inputs=Object.fromEntries(new FormData(form));const data=kind==='apply'?{...applicationDraft,...inputs}:inputs;
  const final=kind==='consult'||applicationStep===3;
  if(final){data.privacyRequired=!!inputs.privacyRequired;data.optionalInfoConsent=!!inputs.optionalInfoConsent;}
  if(!validatePublicForm(form,data,kind,final))return;
  if(!final){applicationDraft=data;applicationStep++;renderPublic('apply');$('.public-form-page')?.scrollIntoView?.({block:'start'});return;}
  // 수집한 입력값은 사용하지 않습니다. 비식별 체험 횟수만 기록합니다.
  applicationComplete={experience:ExperienceStore.complete()};applicationDraft={};applicationStep=0;form.reset();go('application-complete');
 };
 const previous=$('#publicPrevious');if(previous)previous.onclick=()=>{applicationDraft={...applicationDraft,...Object.fromEntries(new FormData(form))};applicationStep--;renderPublic('apply');};
}
function fillDemoStage(form){
 const sample={name:'가상 체험자',gender:'여성',birth:'1994',region:'서울',job:'가상 직업',education:'대학교 졸업',religion:'무교',height:'165',marriage:'초혼',children:'없음',phone:'010-0000-0000',smoking:'비흡연',drinking:'가끔',hobbies:'가상 취미',personality:'차분함',weekday:'주간 규칙형',timing:'1~2년 이내',dualIncome:'희망',childPlan:'함께 결정',postRegion:'협의 가능',spending:'균형형',intro:'사업계획 검토를 위한 가상 자기소개입니다.',min:'28',max:'40',prefRegion:'무관',prefJob:'',prefEducation:'무관',prefReligion:'무관',prefMarriage:'무관',prefChildren:'무관',prefSmoking:'무관',prefDrinking:'무관',top0:'비흡연',top1:'가치관',top2:'지역',other:'가상 희망사항',date:publicToday(),time:'협의 희망',method:'전화',inquiry:'시연용 문의입니다. 실제로 접수하지 않습니다.'};
 for(const [key,value] of Object.entries(sample))if(form.elements[key]){form.elements[key].value=value;form.elements[key].dispatchEvent(new Event('input',{bubbles:true}));}
}
document.addEventListener('click',event=>{const link=event.target.closest('[data-scroll-public]');if(link){event.preventDefault();go('public');$('#public-principles')?.scrollIntoView?.({behavior:'smooth'});}});
function renderRoute(){const hash=location.hash.slice(1);if(isVerionInfoRoute(hash)){renderVerionInfoPage(hash);return;}if(hash==='public-principles'){renderPublic('public');$('#public-principles')?.scrollIntoView?.();return;}if(!['public','apply','consult','application-complete'].includes(hash)){go('public');return;}renderPublic(hash);}
window.addEventListener('hashchange',renderRoute);renderRoute();
