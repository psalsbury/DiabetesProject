/* Install controls and offline registration for the original site. */
(function(){
'use strict';
if(location.hostname!=='salsbury.co.uk'&&location.hostname!=='www.salsbury.co.uk')return;
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).catch(function(e){console.warn('Offline mode unavailable',e);});});}
var deferred=null,button=null,installCard=null,standalone=window.matchMedia('(display-mode: standalone)');
function installed(){return standalone.matches||navigator.standalone===true;}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;if(button)button.textContent='Install app';});
window.addEventListener('appinstalled',function(){deferred=null;if(installCard)installCard.hidden=true;});
function mount(){
 if(document.getElementById('dlh-install')||installed())return;
 var style=document.createElement('style');style.textContent='.dlh-install{padding:8px 14px;border:1px solid #c5dbcf;border-radius:99px;color:#173f35;background:#fff;font:700 13px Nunito,system-ui,sans-serif;cursor:pointer}.dlh-install[hidden]{display:none}.dlh-install:focus-visible{outline:3px solid #e7ae43;outline-offset:3px}.dlh-install-dialog{width:min(430px,calc(100% - 28px));margin:auto;padding:24px;border:1px solid #dbe6df;border-radius:20px;background:#fff;color:#173f35;font:400 15px/1.6 Nunito,system-ui,sans-serif;box-shadow:0 20px 80px #0003}.dlh-install-dialog::backdrop{background:#10251f88}.dlh-install-dialog h2{font:600 26px Fredoka,system-ui,sans-serif;margin:0 0 12px}.dlh-install-dialog p{margin:12px 0}.dlh-install-dialog button{margin-top:10px}.dlh-install-links{display:flex;gap:12px;align-items:center;flex-wrap:wrap;width:min(100% - 28px,820px);margin:16px auto;text-align:center}.dlh-install-links a{color:#173f35;font:700 13px Nunito,system-ui,sans-serif}'+'.dlh-install-card{display:flex;align-items:center;gap:14px;width:min(100% - 28px,820px);box-sizing:border-box;margin:20px auto;padding:16px 18px;border:1px solid #dbe6df;border-radius:16px;background:#edf6f1;text-align:left;font:400 13px/1.5 Nunito,system-ui,sans-serif;color:#65766f}.dlh-install-card[hidden]{display:none}.dlh-install-card.dlh-install-in-footer{width:100%;max-width:none;margin:20px 0}.dlh-install-card-icon{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:#fff;color:#173f35}.dlh-install-card-copy{flex:1;min-width:0}.dlh-install-card-copy strong{display:block;color:#173f35;font-size:15px}.dlh-install-card .dlh-install{flex:none;min-height:44px;padding:10px 18px;background:#173f35;border-color:#173f35;color:#fff}.dlh-install-links{justify-content:center}@media(max-width:480px){.dlh-install-card{flex-wrap:wrap;padding:14px;gap:10px}.dlh-install-card-copy{flex-basis:calc(100% - 54px)}.dlh-install-card .dlh-install{width:100%}}';document.head.appendChild(style);
 button=document.createElement('button');button.type='button';button.id='dlh-install';button.className='dlh-install';button.textContent='Install app';
 var footer=document.querySelector('footer nav'),more=document.querySelector('.more-games');
 installCard=document.createElement('section');installCard.className='dlh-install-card';installCard.setAttribute('aria-label','Install Diabetes Games');
 var icon=document.createElement('span');icon.className='dlh-install-card-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg width="22" height="26" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="1" width="14" height="26" rx="3"/><path d="M9 5h6M10 23h4M12 9v9m-3-3 3 3 3-3"/></svg>';
 var copy=document.createElement('div');copy.className='dlh-install-card-copy';copy.innerHTML='<strong>Keep the games handy</strong><span>Add Diabetes Games to your home screen.</span>';
 installCard.appendChild(icon);installCard.appendChild(copy);installCard.appendChild(button);
 if(footer){installCard.classList.add('dlh-install-in-footer');footer.insertAdjacentElement('afterend',installCard);}
 else{var row=document.createElement('div');row.className='dlh-install-links';var faq=document.createElement('a');faq.href='/#faq';faq.textContent='FAQ';row.appendChild(faq);if(more)more.insertAdjacentElement('afterend',row);else document.body.appendChild(row);row.insertAdjacentElement('afterend',installCard);}
 button.addEventListener('click',async function(){if(deferred){var prompt=deferred;deferred=null;await prompt.prompt();await prompt.userChoice;return;}help();});
 if(standalone.addEventListener)standalone.addEventListener('change',function(){installCard.hidden=installed();});
}
function help(){
 var dialog=document.getElementById('dlh-install-help');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='dlh-install-help';dialog.className='dlh-install-dialog';dialog.setAttribute('aria-labelledby','dlh-install-title');
 dialog.innerHTML='<h2 id="dlh-install-title">Add Diabetes Games</h2><p>Keep the games on your home screen and open them like an app. The English games work offline after your first online visit.</p><p><strong>Android:</strong> open this site in Chrome, tap the ⋮ menu, then <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p><p><strong>iPhone or iPad:</strong> open this site in Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p><p><strong>Computer:</strong> look for your browser’s install icon in the address bar or its menu.</p><button type="button" class="dlh-install">Close</button>';
 dialog.querySelector('button').addEventListener('click',function(){dialog.close();});dialog.addEventListener('click',function(e){if(e.target===dialog){var r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});document.body.appendChild(dialog);}
 dialog.showModal();
}
function revealFAQ(){var faq=document.getElementById('faq');if(faq&&location.hash==='#faq')faq.open=true;}
window.addEventListener('hashchange',revealFAQ);revealFAQ();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
