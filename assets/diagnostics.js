window.__siteDiagnostics={errors:[]};
window.addEventListener('error',function(e){window.__siteDiagnostics.errors.push(e.message||'Resource: '+(e.target.src||e.target.href||e.target.tagName));},true);
window.addEventListener('unhandledrejection',function(e){window.__siteDiagnostics.errors.push(String(e.reason));});
