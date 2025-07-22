// =============================
// EtsAI Team – Jewelry Edition
// Frontend Script (app.js)
// =============================

const state = {
  productType: null,
  brief: '',
  generated: false,
  loadingBlocks: new Set(),
  socialLoaded: false,
  outputs: {
    title: '',
    description: '',
    tags: '',
    materials: '',
    discount_idea: '',
    social_twitter: '',
    social_pinterest_title: '',
    social_pinterest_desc: ''
  },
  tagReasons: []
};

// ---------- DOM ELEMENTS ----------
const splashEl = document.getElementById('splash');
const briefEl = document.getElementById('briefInput');
const briefStatusEl = document.getElementById('briefStatus');
const generateBtn = document.getElementById('generateBtn');
const typeButtons = document.querySelectorAll('.type-btn');

const appHeader = document.getElementById('appHeader');
const appMain = document.getElementById('appMain');

const titleEl = document.getElementById('out-title');
const titleCountEl = document.getElementById('titleCount');
const descEl = document.getElementById('out-description');
const tagsEl = document.getElementById('out-tags');
const materialsEl = document.getElementById('out-materials');
const discountEl = document.getElementById('out-discount_idea');

const socialSection = document.getElementById('socialSection');
const toggleSocialBtn = document.getElementById('toggleSocialBtn');
const socialTwitterEl = document.getElementById('out-social-twitter');
const socialPinTitleEl = document.getElementById('out-social-pinterest-title');
const socialPinDescEl = document.getElementById('out-social-pinterest-desc');

const tagReasonsDetails = document.getElementById('tagReasonsDetails');
const tagReasonsList = document.getElementById('tagReasonsList');

const toastEl = document.getElementById('toast');
const resetBtn = document.getElementById('resetBtn');

// ---------- HELPERS ----------
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(()=> toastEl.classList.remove('show'), 1800);
}

function gateValid(){
  return state.productType && briefEl.value.trim().length >= 5;
}

function updateBriefStatus(){
  const len = briefEl.value.trim().length;
  if(len < 5){
    briefStatusEl.textContent = 'Enter at least 5 characters.';
    generateBtn.disabled = true;
  } else {
    briefStatusEl.textContent = state.productType ? 'Ready.' : 'Select product type.';
    generateBtn.disabled = !state.productType;
  }
}

function selectType(type){
  state.productType = type;
  typeButtons.forEach(btn=>{
    if(btn.dataset.type === type){
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  updateBriefStatus();
}

function hideSplash(){
  splashEl.classList.add('fade-out');
  setTimeout(()=>{
    splashEl.remove();
    appHeader.classList.remove('hidden');
    appMain.classList.remove('hidden');
  }, 560);
}

function setLoading(blockKey, isLoading){
  if(isLoading){
    state.loadingBlocks.add(blockKey);
  } else {
    state.loadingBlocks.delete(blockKey);
  }
  const panel = document.querySelector(`[id='panel-${blockKey.replace(/_.*/, '')}']`) || null;
  if(panel){
    let spinner = panel.querySelector('.loading-inline');
    if(state.loadingBlocks.has(blockKey)){
      if(!spinner){
        spinner = document.createElement('div');
        spinner.className = 'loading-inline';
        spinner.textContent = 'Refreshing...';
        panel.appendChild(spinner);
      }
    } else if(spinner){
      spinner.remove();
    }
  }
}

function escapeHTML(str){
  return str.replace(/[&<>"']/g, c=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[c]));
}

function fillOutputs(data, refreshTarget=null){
  if(data.title && (!refreshTarget || refreshTarget==='title')){
    state.outputs.title = data.title;
    titleEl.value = data.title;
    updateTitleCount();
  }
  if(data.description && (!refreshTarget || refreshTarget==='description')){
    state.outputs.description = data.description;
    descEl.value = data.description;
  }
  if(Array.isArray(data.tags) && data.tags.length && (!refreshTarget || refreshTarget==='tags')){
    const line = data.tags.join(', ');
    state.outputs.tags = line;
    tagsEl.value = line;
  }
  if(Array.isArray(data.materials) && data.materials.length && (!refreshTarget || refreshTarget==='materials')){
    const line = data.materials.join(', ');
    materialsEl.value = line;
    state.outputs.materials = line;
  }
  if(data.discount_idea && (!refreshTarget || refreshTarget==='discount_idea')){
    state.outputs.discount_idea = data.discount_idea;
    discountEl.value = data.discount_idea;
  }
  // Social
  if(data.social){
    if(data.social.twitter && (!refreshTarget || refreshTarget==='social_twitter')){
      state.outputs.social_twitter = data.social.twitter;
      socialTwitterEl.value = data.social.twitter;
    }
    if(data.social.pinterest && (!refreshTarget ||
       refreshTarget==='social_pinterest')){
      if(data.social.pinterest.title){
        state.outputs.social_pinterest_title = data.social.pinterest.title;
        socialPinTitleEl.value = data.social.pinterest.title;
      }
      if(data.social.pinterest.description){
        state.outputs.social_pinterest_desc = data.social.pinterest.description;
        socialPinDescEl.value = data.social.pinterest.description;
      }
    }
  }
  // Tag reasons
  if(Array.isArray(data.tag_reasons) && data.tag_reasons.length && (!refreshTarget || refreshTarget==='tags')){
    state.tagReasons = data.tag_reasons;
    renderTagReasons();
  }
}

function renderTagReasons(){
  tagReasonsList.innerHTML = state.tagReasons.map(tr=>(
    `<li><strong>${escapeHTML(tr.tag)}</strong> – ${escapeHTML(tr.reason)}</li>`
  )).join('');
}

function updateTitleCount(){
  const len = titleEl.value.length;
  titleCountEl.textContent = `${len}/140`;
  if(len > 140){
    titleCountEl.style.color = 'var(--danger)';
  } else {
    titleCountEl.style.color = '#6b7280';
  }
}

// ---------- BACKEND CALL ----------
async function callBackend(payload){
  const resp = await fetch('/api/generate', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  if(!resp.ok){
    throw new Error('Server error: '+resp.status);
  }
  return await resp.json();
}

async function generateAll({refreshTarget=null, wantSocial=false}={}){
  const brief = briefEl.value.trim();
  state.brief = brief;
  const payload = {
    productType: state.productType,
    brief,
    refreshTarget,
    wantSocial
  };
  const targetKey = refreshTarget || 'all';
  setLoading(refreshTarget || 'title', true); // show at least one spinner
  try{
    const data = await callBackend(payload);
    fillOutputs(data, refreshTarget);
    if(!state.generated){
      state.generated = true;
      hideSplash();
    }
    showToast(refreshTarget ? 'Updated.' : 'Generated.');
  }catch(e){
    console.error(e);
    showToast('Error generating.');
  }finally{
    setLoading(refreshTarget || 'title', false);
  }
}

// ---------- EVENT BINDINGS ----------
typeButtons.forEach(btn=>{
  btn.addEventListener('click', ()=> selectType(btn.dataset.type));
});
briefEl.addEventListener('input', updateBriefStatus);
generateBtn.addEventListener('click', ()=>{
  if(!gateValid()) return;
  generateAll();
});
resetBtn.addEventListener('click', ()=>{
  if(!confirm('Reset and start over?')) return;
  location.reload();
});

// Refresh & Copy buttons (event delegation)
document.addEventListener('click', e=>{
  const refreshBtn = e.target.closest('[data-refresh]');
  if(refreshBtn){
    const target = refreshBtn.getAttribute('data-refresh');
    if(target.startsWith('social')){
      // ensure social loaded
      if(!state.socialLoaded){
        showToast('Open Social first.');
        return;
      }
    }
    generateAll({refreshTarget: target, wantSocial: target.startsWith('social')});
  }
  const copyBtn = e.target.closest('[data-copy]');
  if(copyBtn){
    const key = copyBtn.getAttribute('data-copy');
    let text = '';
    switch(key){
      case 'title': text = titleEl.value; break;
      case 'description': text = descEl.value; break;
      case 'tags': text = tagsEl.value; break;
      case 'materials': text = materialsEl.value; break;
      case 'discount_idea': text = discountEl.value; break;
      case 'social_twitter': text = socialTwitterEl.value; break;
      case 'social_pinterest': 
        text = socialPinTitleEl.value + '\\n' + socialPinDescEl.value;
        break;
    }
    if(!text){ showToast('Nothing to copy'); return; }
    navigator.clipboard.writeText(text).then(()=>{
      showToast('Copied');
    }).catch(()=>{
      showToast('Copy failed');
    });
  }
});

toggleSocialBtn.addEventListener('click', ()=>{
  if(socialSection.classList.contains('hidden')){
    socialSection.classList.remove('hidden');
    toggleSocialBtn.textContent = 'Hide';
    if(!state.socialLoaded){
      generateAll({refreshTarget:null, wantSocial:true});
      state.socialLoaded = true;
    }
  } else {
    socialSection.classList.add('hidden');
    toggleSocialBtn.textContent = 'Show';
  }
});

titleEl.addEventListener('input', updateTitleCount);

// Init
updateBriefStatus();
updateTitleCount();
