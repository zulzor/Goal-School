__d(
  function (g, r, i, a, m, e, d) {
    (Object.defineProperty(e, '__esModule', { value: !0 }), (e.default = void 0));
    const n = new (class {
      listeners = [];
      async fetch() {
        return this.getConnectionState();
      }
      async getConnectionState() {
        return {
          type: 'wifi',
          isConnected: navigator.onLine,
          isInternetReachable: navigator.onLine,
          details: { isConnectionExpensive: !1 },
        };
      }
      addEventListener(n) {
        (this.listeners.push(n),
          this.getConnectionState().then(t => {
            n(t);
          }));
        const t = () => {
          this.getConnectionState().then(n => {
            this.listeners.forEach(t => t(n));
          });
        };
        return (
          window.addEventListener('online', t),
          window.addEventListener('offline', t),
          () => {
            ((this.listeners = this.listeners.filter(t => t !== n)),
              window.removeEventListener('online', t),
              window.removeEventListener('offline', t));
          }
        );
      }
      removeEventListener(n) {
        this.listeners = this.listeners.filter(t => t !== n);
      }
    })();
    e.default = n;
  },
  1246,
  []
);
