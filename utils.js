export const id=()=>globalThis.crypto?.randomUUID?.()||'rh2-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
export const copy=x=>structuredClone(x);
export const now=()=>new Date().toISOString();
export const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export const monthNow=()=>today().slice(0,7);
export const monthOK=m=>/^\d{4}-(0[1-9]|1[0-2])$/.test(m||'');
export const dateOK=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(d))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
export function cents(value){const s=String(value).trim().replace(',','.');if(!/^\d+(\.\d{1,2})?$/.test(s))throw Error('Informe valor positivo com até dois centavos.');const [a,b='']=s.split('.');const n=Number(a)*100+Number(b.padEnd(2,'0'));if(!Number.isSafeInteger(n)||n>1e12)throw Error('Valor fora do limite.');return n;}
export const money=n=>(n/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export const value=n=>(n/100).toFixed(2);
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const brDate=d=>d?String(d).slice(0,10).split('-').reverse().join('/'):'—';
export function csv(headers,rows){return '\uFEFF'+[headers,...rows].map(r=>r.map(v=>{let s=String(v??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(';')).join('\r\n');}
export function download(name,text,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
