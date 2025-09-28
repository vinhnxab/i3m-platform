package services

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync/atomic"
)

type ReverseProxy struct {
	backends []*url.URL
	counter  uint64
}

func NewReverseProxy(backendURLs []string) *ReverseProxy {
	var backends []*url.URL
	for _, raw := range backendURLs {
		u, err := url.Parse(raw)
		if err == nil {
			backends = append(backends, u)
		}
	}
	return &ReverseProxy{backends: backends}
}

func (rp *ReverseProxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if len(rp.backends) == 0 {
		http.Error(w, "No backend available", http.StatusServiceUnavailable)
		return
	}
	idx := atomic.AddUint64(&rp.counter, 1)
	backend := rp.backends[idx%uint64(len(rp.backends))]
	proxy := httputil.NewSingleHostReverseProxy(backend)
	proxy.ServeHTTP(w, r)
}
