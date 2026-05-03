export function setupChunkErrorHandler() {
  // Captura erros de carregamento dinâmico
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('Chunk load error detected, reloading...', event);
    window.location.reload();
  });

  // Captura erros gerais de import dinâmico
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || '';
    
    if (
      errorMessage.includes('Failed to fetch dynamically imported module') ||
      errorMessage.includes('Importing a module script failed') ||
      errorMessage.includes('Loading chunk') ||
      errorMessage.includes('Loading CSS chunk')
    ) {
      console.warn('Dynamic import error, reloading page...');
      
      // Marca que já tentou recarregar (evitar loop)
      const reloadKey = 'chunk_error_reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      
      if (!lastReload || (now - parseInt(lastReload)) > 10000) {
        sessionStorage.setItem(reloadKey, now.toString());
        window.location.reload();
      }
    }
  });

  // Captura promises rejeitadas (para imports dinâmicos)
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason?.message || '';
    
    if (
      errorMessage.includes('Failed to fetch dynamically imported module') ||
      errorMessage.includes('Importing a module script failed')
    ) {
      console.warn('Dynamic import promise rejected, reloading...');
      
      const reloadKey = 'chunk_error_reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      
      if (!lastReload || (now - parseInt(lastReload)) > 10000) {
        sessionStorage.setItem(reloadKey, now.toString());
        window.location.reload();
      }
    }
  });
}
