export function initPWA({isBusy=()=>false}={}){
 const install=document.getElementById('install'),update=document.getElementById('update'),status=document.getElementById('pwa-status');let promptEvent,registration,reload=false;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 install.hidden=standalone();
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;install.hidden=false;});
 window.addEventListener('appinstalled',()=>{install.hidden=true;status.textContent='Aplicativo instalado.';});
 install.onclick=async()=>{if(promptEvent){const p=promptEvent;promptEvent=null;await p.prompt();const choice=await p.userChoice;status.textContent=choice.outcome==='accepted'?'Instalação aceita; aguarde o navegador.':'Instalação cancelada.';}else status.textContent='Chrome/Edge: menu → Instalar aplicativo. iPhone/iPad: Safari → Compartilhar → Adicionar à Tela de Início. Primeiro acesso completo em HTTPS.';};
 update.onclick=()=>{if(isBusy()){status.textContent='Termine e feche o formulário antes de atualizar.';return;}if(registration?.waiting&&confirm('Atualizar os arquivos e recarregar? Os registros salvos serão preservados.')){reload=true;registration.waiting.postMessage({type:'UPDATE_RH2'});}};
 navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(reload)location.reload();});
 if(!navigator.serviceWorker||!isSecureContext){status.textContent='Instalação/offline requerem HTTPS e navegador atualizado.';return;}
 const ready=()=>{if(registration.waiting&&navigator.serviceWorker.controller){update.hidden=false;status.textContent='Atualização pronta — confirme quando puder.';}};
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{registration=r;ready();r.addEventListener('updatefound',()=>r.installing?.addEventListener('statechange',()=>{ready();if(!r.installing&&!r.waiting)status.textContent='Recursos offline disponíveis.';}));if(navigator.serviceWorker.controller&&!r.waiting)status.textContent='Recursos offline disponíveis.';}).catch(e=>status.textContent='Não foi possível preparar offline: '+e.message);
}
