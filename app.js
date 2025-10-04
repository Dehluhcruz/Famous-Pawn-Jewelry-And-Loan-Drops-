(function(){
  const grid = document.getElementById('grid');
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();
  let all=[], view=[], ix=0;
  function captionFrom(file){
    const base = file.file.split('/').pop().replace(/\.[^.]+$/, '');
    const parts = base.split('__');
    return (parts[1]||base).replace(/[-_]/g, ' ');
  }
  function render(){
    grid.innerHTML='';
    if(!view.length){ grid.innerHTML='<div style="opacity:.7">No photos yet.</div>'; return; }
    view.forEach((file, i)=>{
      const card = document.createElement('div'); card.className='card';
      const img = document.createElement('img'); img.src=file.file; img.alt=captionFrom(file); img.loading='lazy';
      const cap = document.createElement('div'); cap.className='cap'; cap.textContent=captionFrom(file);
      const badge = document.createElement('div'); badge.className='badge'; badge.textContent=file.date || 'NEW';
      card.append(img, badge, cap);
      card.addEventListener('click', ()=>open(i));
      grid.append(card);
    });
  }
  function open(i0){
    ix = i0;
    const lb = document.getElementById('lightbox');
    const big = document.getElementById('big');
    const cap = document.getElementById('lbcap');
    big.src = view[ix].file;
    big.alt = captionFrom(view[ix]);
    cap.textContent = captionFrom(view[ix]) + (view[ix].sku ? ' • '+view[ix].sku : '');
    lb.hidden = false;
  }
  function move(d){ ix=(ix+d+view.length)%view.length; open(ix); }
  document.getElementById('close').onclick=()=>document.getElementById('lightbox').hidden=true;
  document.getElementById('prev').onclick=()=>move(-1);
  document.getElementById('next').onclick=()=>move(1);
  document.addEventListener('keydown', e=>{
    const lb=document.getElementById('lightbox');
    if(lb.hidden) return;
    if(e.key==='Escape') lb.hidden=true;
    if(e.key==='ArrowRight') move(1);
    if(e.key==='ArrowLeft') move(-1);
  });
  function applyFilter(kind){
    if(kind==='all') view = all.slice();
    else view = all.filter(x=>x.category===kind);
    render();
  }
  fetch('assets/images.json')
    .then(r=>r.json())
    .then(data=>{
      all = data.items.sort((a,b)=> (b.date||'').localeCompare(a.date||''));
      applyFilter('all');
    });
  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
})();