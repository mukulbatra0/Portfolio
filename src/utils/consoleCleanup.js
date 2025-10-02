// Console cleanup utility to reduce development noise

export const initConsoleCleanup = () => {
  if (process.env.NODE_ENV === 'development') {
    // Store original console methods
    const originalWarn = console.warn;
    const originalLog = console.log;
    const originalTable = console.table;

    // Filter out known non-critical warnings
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Filter out font preload warnings
      if (message.includes('preloaded using link preload but not used')) {
        return;
      }
      
      // Filter out performance observer warnings
      if (message.includes('PerformanceObserver')) {
        return;
      }
      
      // Filter out resource timing warnings
      if (message.includes('resource timing')) {
        return;
      }
      
      // Allow other warnings through
      originalWarn.apply(console, args);
    };

    // Filter out performance logging
    console.table = (...args) => {
      const firstArg = args[0];
      
      // Filter out performance metrics tables
      if (Array.isArray(firstArg) && firstArg.length > 0 && 
          firstArg[0].hasOwnProperty('name') && 
          firstArg[0].hasOwnProperty('duration')) {
        return;
      }
      
      originalTable.apply(console, args);
    };

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      console.warn = originalWarn;
      console.log = originalLog;
      console.table = originalTable;
    });
  }
};