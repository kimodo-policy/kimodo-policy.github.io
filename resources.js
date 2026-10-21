(() => {
  const tabs = [...document.querySelectorAll('[data-resource]')];
  const config = {
    model: {type:'Model', title:'Kimodo-Policy models', description:'Model checkpoints for Kimodo-Policy: from pretrained text-to-motion priors to visually grounded whole-body control.', tags:['Humanoid robotics','Vision–Language–Action','Model checkpoints'], url:'https://huggingface.co/YunhengWang/kimodo-policy/tree/main', action:'Browse model files ↗'},
    datasets: {type:'Dataset', title:'Kimodo-Policy datasets', description:'Explore the Kimodo-Policy dataset repository and evaluation outputs supporting our humanoid policy experiments.', tags:['Humanoid robotics','Robot learning','Evaluation results'], url:'https://huggingface.co/datasets/YunhengWang/kimodo-policy/tree/main/', action:'Browse dataset files ↗'}
  };
  const $ = id => document.getElementById(id);
  function select(key) {
    const data=config[key];
    document.querySelector('.resource-toggle').classList.toggle('show-datasets',key==='datasets');
    tabs.forEach(tab=>{const active=tab.dataset.resource===key;tab.setAttribute('aria-selected',active);tab.tabIndex=active?0:-1;if(active)$('resource-panel').setAttribute('aria-labelledby',tab.id);});
    $('resource-type').textContent=data.type; $('resource-heading').textContent=data.title;
    $('resource-description').textContent=data.description; $('resource-repo-link').href=data.url;
    $('resource-open').href=data.url; $('resource-open').textContent=data.action;
    $('resource-tags').replaceChildren(...data.tags.map(text=>{const tag=document.createElement('span');tag.textContent=text;return tag;}));
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>select(tab.dataset.resource));
    tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowLeft'||e.key==='ArrowRight')next=1-i;if(e.key==='Home')next=0;if(e.key==='End')next=1;if(next!=null){e.preventDefault();tabs[next].focus();select(tabs[next].dataset.resource);}});
  });
})();
