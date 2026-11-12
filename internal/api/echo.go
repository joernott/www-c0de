package api

import (
	"io"
	"net/http"
	"strings"
)

// maxEchoBody is the largest body the echo sends back.
const maxEchoBody = 64 << 10

// allMethods are the methods the echo answers (and every other one, too).
const allMethods = "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE"

// echoed is the request as the echo got it.
type echoed struct {
	Method string `json:"method"`
	Path   string `json:"path"`
	Query  string `json:"query"`
	// Headers has lower-case names; repeated headers are joined with ", ".
	Headers map[string]string `json:"headers"`
	Body    string            `json:"body"`
}

// echo answers every method, also HEAD, OPTIONS and TRACE, with the request it got as JSON
// (for TRACE too, instead of message/http, so programs read it with FROM_JSON). Everything
// behind /api/tutorial/echo/ is echoed as well, so the recipes can try their endpoints.
func echo(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxEchoBody))
	if err != nil {
		writeError(w, http.StatusRequestEntityTooLarge, "the body is larger than 64 KiB")
		return
	}
	headers := map[string]string{"host": r.Host}
	for name, values := range r.Header {
		headers[strings.ToLower(name)] = strings.Join(values, ", ")
	}
	if r.Method == http.MethodOptions {
		w.Header().Set("Allow", allMethods)
	}
	writeJSON(w, http.StatusOK, echoed{
		Method:  r.Method,
		Path:    r.URL.Path,
		Query:   r.URL.RawQuery,
		Headers: headers,
		Body:    string(body),
	})
}
