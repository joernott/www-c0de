package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

// clock is the time of the tests; they move it on.
type clock struct{ now time.Time }

func newAPI() (*API, *clock) {
	c := &clock{time.Date(2026, 11, 12, 10, 0, 0, 0, time.UTC)}
	return &API{now: func() time.Time { return c.now }}, c
}

// do sends a request from 192.0.2.1 and returns the answer.
func do(t *testing.T, a *API, method, target, body string, header ...string) *httptest.ResponseRecorder {
	t.Helper()
	r := httptest.NewRequest(method, target, strings.NewReader(body))
	r.RemoteAddr = "192.0.2.1:50000"
	for i := 0; i+1 < len(header); i += 2 {
		r.Header.Set(header[i], header[i+1])
	}
	w := httptest.NewRecorder()
	if err := a.ServeHTTP(w, r, nil); err != nil {
		t.Fatal(err)
	}
	if got := w.Header().Get("Cache-Control"); got != "no-store" {
		t.Errorf("%s %s: Cache-Control %q", method, target, got)
	}
	return w
}

func decode[T any](t *testing.T, w *httptest.ResponseRecorder) T {
	t.Helper()
	var value T
	if err := json.Unmarshal(w.Body.Bytes(), &value); err != nil {
		t.Fatalf("%q: %v", w.Body.String(), err)
	}
	return value
}

func TestEcho(t *testing.T) {
	a, _ := newAPI()
	for _, method := range strings.Split(allMethods, ", ") {
		w := do(t, a, method, "/api/tutorial/echo/lamps/attic?on=true", `{"on":true}`, "X-Token", "abc", "Accept", "a", "Content-Type", "application/json")
		if w.Code != http.StatusOK || !strings.HasPrefix(w.Header().Get("Content-Type"), "application/json") {
			t.Errorf("%s: %d %s", method, w.Code, w.Header().Get("Content-Type"))
		}
		got := decode[echoed](t, w)
		if got.Method != method || got.Path != "/api/tutorial/echo/lamps/attic" || got.Query != "on=true" ||
			got.Body != `{"on":true}` || got.Headers["x-token"] != "abc" || got.Headers["host"] != "example.com" {
			t.Errorf("%s: %+v", method, got)
		}
	}
	if allow := do(t, a, http.MethodOptions, "/api/tutorial/echo", "").Header().Get("Allow"); allow != allMethods {
		t.Errorf("Allow: %q", allow)
	}
	if w := do(t, a, http.MethodPost, "/api/tutorial/echo", strings.Repeat("x", maxEchoBody+1)); w.Code != http.StatusRequestEntityTooLarge {
		t.Errorf("a large body: %d", w.Code)
	}
}

func TestUnknownEndpoints(t *testing.T) {
	a, _ := newAPI()
	for _, path := range []string{"/api/", "/api/tutorial", "/api/tutorial/echoes", "/api/tutorial/todos"} {
		if w := do(t, a, http.MethodGet, path, ""); w.Code != http.StatusNotFound || decode[map[string]string](t, w)["error"] == "" {
			t.Errorf("%s: %d %s", path, w.Code, w.Body)
		}
	}
}

func TestTodo(t *testing.T) {
	a, clock := newAPI()
	const list = "/api/tutorial/todo"

	if w := do(t, a, http.MethodGet, list, ""); w.Code != http.StatusOK || strings.TrimSpace(w.Body.String()) != "[]" {
		t.Errorf("the empty list: %d %s", w.Code, w.Body)
	}
	w := do(t, a, http.MethodPost, list, `{"title": "  Feed the cats "}`)
	if w.Code != http.StatusCreated || w.Header().Get("Location") != list+"/1" {
		t.Fatalf("POST: %d %s %s", w.Code, w.Header().Get("Location"), w.Body)
	}
	if got := decode[item](t, w); got != (item{ID: 1, Title: "Feed the cats"}) {
		t.Errorf("POST: %+v", got)
	}
	do(t, a, http.MethodPost, list, `{"title": "Mine diamonds", "done": true}`)

	if got := decode[item](t, do(t, a, http.MethodPatch, list+"/1", `{"done": true}`)); got != (item{1, "Feed the cats", true}) {
		t.Errorf("PATCH: %+v", got)
	}
	if got := decode[item](t, do(t, a, http.MethodPut, list+"/2", `{"title": "Mine emeralds"}`)); got != (item{2, "Mine emeralds", false}) {
		t.Errorf("PUT: %+v", got)
	}
	if got := decode[item](t, do(t, a, http.MethodGet, list+"/2", "")); got.Title != "Mine emeralds" {
		t.Errorf("GET: %+v", got)
	}
	if w := do(t, a, http.MethodDelete, list+"/1", ""); w.Code != http.StatusNoContent {
		t.Errorf("DELETE: %d", w.Code)
	}
	if got := decode[[]item](t, do(t, a, http.MethodGet, list, "")); len(got) != 1 || got[0].ID != 2 {
		t.Errorf("the list after DELETE: %+v", got)
	}
	for _, path := range []string{list + "/1", list + "/x", list + "/2/3"} {
		if w := do(t, a, http.MethodGet, path, ""); w.Code != http.StatusNotFound {
			t.Errorf("GET %s: %d", path, w.Code)
		}
	}

	// The next day, the list is empty and the numbers start at 1 again.
	clock.now = clock.now.Add(14 * time.Hour)
	if got := decode[[]item](t, do(t, a, http.MethodGet, list, "")); len(got) != 0 {
		t.Errorf("the next day: %+v", got)
	}
	if got := decode[item](t, do(t, a, http.MethodPost, list, `{"title": "a"}`)); got.ID != 1 {
		t.Errorf("the first entry of the next day: %+v", got)
	}
}

func TestTodoMethods(t *testing.T) {
	a, _ := newAPI()
	do(t, a, http.MethodPost, "/api/tutorial/todo", `{"title": "a"}`)
	for path, allow := range map[string]string{
		"/api/tutorial/todo":   "GET, HEAD, POST, OPTIONS",
		"/api/tutorial/todo/1": "GET, HEAD, PUT, PATCH, DELETE, OPTIONS",
	} {
		if w := do(t, a, http.MethodOptions, path, ""); w.Code != http.StatusNoContent || w.Header().Get("Allow") != allow {
			t.Errorf("OPTIONS %s: %d %q", path, w.Code, w.Header().Get("Allow"))
		}
		if w := do(t, a, http.MethodTrace, path, ""); w.Code != http.StatusMethodNotAllowed || w.Header().Get("Allow") != allow {
			t.Errorf("TRACE %s: %d", path, w.Code)
		}
	}
}

func TestTodoRefusesBadEntries(t *testing.T) {
	a, _ := newAPI()
	for name, body := range map[string]string{
		"no JSON":           `Feed the cats`,
		"no title":          `{"done": true}`,
		"an empty title":    `{"title": "   "}`,
		"a long title":      `{"title": "` + strings.Repeat("é", MaxTitle+1) + `"}`,
		"a control char":    `{"title": "a\u0007b"}`,
		"a right-to-left":   `{"title": "a‮b"}`,
		"a zero-width":      `{"title": "a​b"}`,
		"an unknown field":  `{"title": "a", "owner": "Steve"}`,
		"a title no string": `{"title": 7}`,
		"two objects":       `{"title": "a"} {"title": "b"}`,
		"too large":         `{"title": "a", "done": false` + strings.Repeat(" ", maxTodoBody) + `}`,
	} {
		if w := do(t, a, http.MethodPost, "/api/tutorial/todo", body); w.Code != http.StatusBadRequest && w.Code != http.StatusRequestEntityTooLarge {
			t.Errorf("%s: %d %s", name, w.Code, w.Body)
		}
	}
	if w := do(t, a, http.MethodPost, "/api/tutorial/todo", `{"title": "`+strings.Repeat("é", MaxTitle)+`"}`); w.Code != http.StatusCreated {
		t.Errorf("a title of %d characters: %d %s", MaxTitle, w.Code, w.Body)
	}
}

func TestTodoIsLimited(t *testing.T) {
	a, clock := newAPI()
	for i := 0; i < MaxTodos; i++ {
		clock.now = clock.now.Add(time.Second) // stays below the rate limit
		if w := do(t, a, http.MethodPost, "/api/tutorial/todo", `{"title": "a"}`); w.Code != http.StatusCreated {
			t.Fatalf("entry %d: %d", i+1, w.Code)
		}
	}
	if w := do(t, a, http.MethodPost, "/api/tutorial/todo", `{"title": "a"}`); w.Code != http.StatusConflict {
		t.Errorf("entry %d: %d", MaxTodos+1, w.Code)
	}
}

func TestRateLimit(t *testing.T) {
	a, clock := newAPI()
	for i := 0; i < RequestsPerMinute; i++ {
		if w := do(t, a, http.MethodGet, "/api/tutorial/echo", ""); w.Code != http.StatusOK {
			t.Fatalf("request %d: %d", i+1, w.Code)
		}
	}
	w := do(t, a, http.MethodGet, "/api/tutorial/echo", "")
	if w.Code != http.StatusTooManyRequests || w.Header().Get("Retry-After") != "60" {
		t.Errorf("request %d: %d", RequestsPerMinute+1, w.Code)
	}
	// Other clients aren't affected.
	r := httptest.NewRequest(http.MethodGet, "/api/tutorial/echo", nil)
	r.RemoteAddr = "192.0.2.2:50000"
	other := httptest.NewRecorder()
	_ = a.ServeHTTP(other, r, nil)
	if other.Code != http.StatusOK {
		t.Errorf("another client: %d", other.Code)
	}
	clock.now = clock.now.Add(time.Minute)
	if w := do(t, a, http.MethodGet, "/api/tutorial/echo", ""); w.Code != http.StatusOK {
		t.Errorf("the next minute: %d", w.Code)
	}
}
