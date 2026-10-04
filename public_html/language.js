/* Language links use Google's translated website view; no translation script or
 * third-party request is made until a visitor chooses a non-English language. */
(function(){
'use strict';
var languages=[
 ['en','🇬🇧','English','English'],
 ['ur','🇵🇰','Urdu','اردو'],
 ['so','🇸🇴','Somali','Soomaali'],
 ['ar','🇸🇦','Arabic','العربية'],
 ['fa','🇮🇷','Farsi','فارسی'],
 ['pt','🇵🇹','Portuguese','Português'],
 ['it','🇮🇹','Italian','Italiano'],
 ['sv','🇸🇪','Swedish','Svenska']
];
var active=new URLSearchParams(location.search).get('_x_tr_tl')||'en';
if(!languages.some(function(l){return l[0]===active}))active='en';
var page=new URL(location.pathname,'https://salsbury.co.uk');
// Only public page locations are shared with the translation service.
page.hash=location.hash;
function target(code){
 if(code==='en')return page.href;
 var url=new URL('https://translate.google.com/translate');
 url.searchParams.set('sl','en');url.searchParams.set('tl',code);url.searchParams.set('u',page.href);
 return url.href;
}
var st=document.createElement('style');st.textContent=
 '#language-slot .dlh-language-bar{padding:0;margin:0}.dlh-compact-header{flex-wrap:wrap}.dlh-compact-header .dlh-language-bar{padding:0;border:0;margin:0 0 0 auto}.dlh-compact-header .home{display:none}.dlh-compact-header .brand{min-width:0}@media(max-width:560px){.dlh-compact-header{gap:8px!important}.dlh-compact-header .logo{width:32px;height:32px;flex:none}.dlh-compact-header .brand{font-size:13px;max-width:115px;line-height:1.2}.dlh-compact-header .brand span{display:block}.dlh-compact-header .dlh-language summary{padding:6px 8px;font-size:12px}}'+
 '.dlh-language-bar{position:relative;z-index:20;display:flex;justify-content:flex-end;padding:8px 14px;box-sizing:border-box;font:600 13px/1.4 Nunito,-apple-system,"Segoe UI",sans-serif;color:#173f35;max-width:1120px;margin:0 auto}'+
 '.shell>.dlh-language-bar{margin:0;border-bottom:1px solid #dbe6df}.app>.dlh-language-bar,.stage>.dlh-language-bar{padding-inline:0}'+
 '.dlh-language{position:relative;max-width:100%;text-align:left}.dlh-language summary{display:flex;align-items:center;gap:7px;list-style:none;cursor:pointer;min-height:40px;padding:7px 12px;border:1px solid #c5dbcf;border-radius:12px;background:#fff;color:#173f35;font:inherit}'+
 '.dlh-language summary::-webkit-details-marker{display:none}.dlh-language summary:after{content:"⌄";margin-left:5px}.dlh-language summary:focus-visible,.dlh-language a:focus-visible{outline:3px solid #e7ae43;outline-offset:2px}'+
 '.dlh-language-panel{position:absolute;top:calc(100% + 6px);right:0;box-sizing:border-box;width:min(330px,calc(100vw - 28px));padding:10px;border:1px solid #c5dbcf;border-radius:14px;background:#fff;box-shadow:0 12px 32px #173f3526}'+
 '.dlh-language .dlh-language-links{display:grid;grid-template-columns:1fr 1fr;gap:4px}.dlh-language .dlh-language-links a{display:flex;align-items:center;gap:8px;min-height:48px;padding:7px 8px;border-radius:9px;color:#173f35;text-decoration:none;font:inherit}.dlh-language a:hover,.dlh-language a[aria-current="true"]{background:#dff1e8}.dlh-language small{display:block;color:#65766f;font-size:11px}.dlh-language-flag{font-size:22px;flex:none}.dlh-language-note{margin:8px 3px 2px!important;color:#65766f;font:400 11px/1.5 Nunito,-apple-system,"Segoe UI",sans-serif!important}';
document.head.appendChild(st);
var bar=document.createElement('div');bar.className='dlh-language-bar notranslate';bar.setAttribute('translate','no');
var details=document.createElement('details');details.className='dlh-language';
var summary=document.createElement('summary'),chosen=languages.find(function(l){return l[0]===active});
summary.textContent=chosen[1]+' '+chosen[2];summary.setAttribute('aria-label','Choose language: '+chosen[2]);
var panel=document.createElement('div');panel.className='dlh-language-panel';
var nav=document.createElement('nav');nav.className='dlh-language-links';nav.setAttribute('aria-label','Choose a website language');
languages.forEach(function(l){var a=document.createElement('a');a.href=target(l[0]);a.setAttribute('aria-label',l[2]+' — '+l[3]);if(l[0]===active)a.setAttribute('aria-current','true');
 var flag=document.createElement('span');flag.className='dlh-language-flag';flag.setAttribute('aria-hidden','true');flag.textContent=l[1];
 var words=document.createElement('span');words.textContent=l[2];if(l[3]!==l[2]){var native=document.createElement('small');native.lang=l[0];native.dir=['ur','ar','fa'].indexOf(l[0])>=0?'rtl':'ltr';native.textContent=l[3];words.appendChild(native);}
 a.appendChild(flag);a.appendChild(words);nav.appendChild(a);
});
var note=document.createElement('p');note.className='dlh-language-note';note.textContent='Other languages open an automatically translated copy in Google Translate. Returning to English opens this site.';
panel.appendChild(nav);panel.appendChild(note);details.appendChild(summary);details.appendChild(panel);bar.appendChild(details);
var slot=document.getElementById('language-slot');
var shell=document.querySelector('.shell'),main=document.querySelector('main.app'),stage=document.querySelector('.stage'),header=document.querySelector('body > header');
if(slot)slot.appendChild(bar);
else if(shell&&shell.querySelector('header')){var h=shell.querySelector('header');h.classList.add('dlh-compact-header');h.appendChild(bar);}
else if(main)main.prepend(bar);
else if(stage)stage.prepend(bar);
else if(header)header.insertAdjacentElement('afterend',bar);
else document.body.prepend(bar);
document.addEventListener('click',function(e){if(!details.contains(e.target))details.open=false;});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&details.open){details.open=false;summary.focus();}});
})();

