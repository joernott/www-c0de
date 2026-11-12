package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"
	"unicode/utf8"
)

const (
	// MaxTodos is how many entries the to-do list holds.
	MaxTodos = 100
	// MaxTitle is the longest title of an entry, in characters.
	MaxTitle = 100
	// maxTodoBody is the largest body of a request to the to-do list.
	maxTodoBody = 4 << 10
)

// item is an entry of the to-do list.
type item struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

// change is the body of POST, PUT and PATCH; fields that are missing are nil.
type change struct {
	Title *string `json:"title"`
	Done  *bool   `json:"done"`
}

// todos is the to-do list that all players share. It lives in memory only and is emptied
// every day at 00:00 UTC, when the numbers of the entries start at 1 again.
type todos struct {
	mu    sync.Mutex
	day   string
	next  int
	items []item
}

// serve answers a request to /api/tutorial/todo (rest "") or /api/tutorial/todo/<id>.
func (t *todos) serve(w http.ResponseWriter, r *http.Request, rest string, now time.Time) {
	t.mu.Lock()
	defer t.mu.Unlock()
	if day := now.UTC().Format(time.DateOnly); day != t.day {
		t.day, t.next, t.items = day, 1, nil
	}

	if rest == "" || rest == "/" {
		switch r.Method {
		case http.MethodGet, http.MethodHead:
			writeJSON(w, http.StatusOK, append([]item{}, t.items...))
		case http.MethodPost:
			c, ok := readChange(w, r)
			if !ok {
				return
			}
			if c.Title == nil {
				writeError(w, http.StatusBadRequest, "an entry needs a title")
				return
			}
			if len(t.items) >= MaxTodos {
				writeError(w, http.StatusConflict, fmt.Sprintf("the list is full (%d entries); delete one, or wait until it is emptied at 00:00 UTC", MaxTodos))
				return
			}
			entry := item{ID: t.next, Title: *c.Title}
			if c.Done != nil {
				entry.Done = *c.Done
			}
			t.next++
			t.items = append(t.items, entry)
			w.Header().Set("Location", "/api/tutorial/todo/"+strconv.Itoa(entry.ID))
			writeJSON(w, http.StatusCreated, entry)
		default:
			notAllowed(w, r, "GET, HEAD, POST, OPTIONS")
		}
		return
	}

	id, err := strconv.Atoi(strings.TrimPrefix(rest, "/"))
	index := -1
	for i, entry := range t.items {
		if err == nil && entry.ID == id {
			index = i
		}
	}
	if index < 0 {
		writeError(w, http.StatusNotFound, "no such entry")
		return
	}
	entry := &t.items[index]
	switch r.Method {
	case http.MethodGet, http.MethodHead:
		writeJSON(w, http.StatusOK, entry)
	case http.MethodPut, http.MethodPatch:
		c, ok := readChange(w, r)
		if !ok {
			return
		}
		if r.Method == http.MethodPut && c.Title == nil {
			writeError(w, http.StatusBadRequest, "PUT replaces the entry: it needs a title")
			return
		}
		if r.Method == http.MethodPut {
			entry.Done = false
		}
		if c.Title != nil {
			entry.Title = *c.Title
		}
		if c.Done != nil {
			entry.Done = *c.Done
		}
		writeJSON(w, http.StatusOK, entry)
	case http.MethodDelete:
		t.items = append(t.items[:index], t.items[index+1:]...)
		w.WriteHeader(http.StatusNoContent)
	default:
		notAllowed(w, r, "GET, HEAD, PUT, PATCH, DELETE, OPTIONS")
	}
}

// notAllowed answers OPTIONS with the methods of an endpoint, other methods with 405.
func notAllowed(w http.ResponseWriter, r *http.Request, methods string) {
	w.Header().Set("Allow", methods)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	writeError(w, http.StatusMethodNotAllowed, r.Method+" is not allowed here, only "+methods)
}

// readChange reads the JSON body of a request; on errors it answers 400 or 413.
func readChange(w http.ResponseWriter, r *http.Request) (change, bool) {
	var c change
	data, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxTodoBody))
	if err != nil {
		writeError(w, http.StatusRequestEntityTooLarge, "the body is larger than 4 KiB")
		return c, false
	}
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&c); err != nil {
		writeError(w, http.StatusBadRequest, `the body must be JSON like {"title": "Feed the cats", "done": false}: `+err.Error())
		return c, false
	}
	if _, err := decoder.Token(); !errors.Is(err, io.EOF) {
		writeError(w, http.StatusBadRequest, "the body must be one JSON object")
		return c, false
	}
	if c.Title == nil && c.Done == nil {
		writeError(w, http.StatusBadRequest, "the body has neither title nor done")
		return c, false
	}
	if c.Title != nil {
		title := strings.TrimSpace(*c.Title)
		if problem := checkTitle(title); problem != "" {
			writeError(w, http.StatusBadRequest, problem)
			return c, false
		}
		c.Title = &title
	}
	return c, true
}

// checkTitle returns what is wrong with a title, or "". All players see the titles, so
// characters that hide or turn around text (control and format characters) aren't allowed.
func checkTitle(title string) string {
	switch {
	case title == "":
		return "the title is empty"
	case utf8.RuneCountInString(title) > MaxTitle:
		return fmt.Sprintf("the title is longer than %d characters", MaxTitle)
	case strings.ContainsFunc(title, func(r rune) bool {
		return r == utf8.RuneError || unicode.IsControl(r) || unicode.Is(unicode.Cf, r)
	}):
		return "the title contains control or invisible characters"
	}
	return ""
}
