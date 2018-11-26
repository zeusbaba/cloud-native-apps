package api

import (
	"github.com/vjeantet/jodaTime"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

func LinksHandleFunc(w http.ResponseWriter, r *http.Request) {

	switch method := r.Method; method {

	case http.MethodGet:
		links := AllLinks()
		responseWriteJSON(w, links)

	case http.MethodPost:
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		link := LinkFromJSON(body)
		link, created := CreateLink(link)
		if created {
			w.Header().Add("Location", "/links/"+link.LinkId)
			w.WriteHeader(http.StatusCreated)
			responseWriteJSON(w, link)
		} else {
			w.WriteHeader(http.StatusConflict)
		}

	case http.MethodPut:
		linkid := r.URL.Path[len("/links/"):]
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		link := LinkFromJSON(body)
		exists := UpdateLink(linkid, link)
		if exists {
			w.WriteHeader(http.StatusOK)
			responseWriteJSON(w, link)
		} else {
			w.WriteHeader(http.StatusNotFound)
		}

	default:
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Unsupported request method."))
	}
}

// FIXME: re-implement with db integration
// returns the link for a given linkid
func GetLink(isbn string) (Link, bool) {
	link, found := links[isbn]
	return link, found
}


// CreateLink creates a new Link if it does not exist
func CreateLink(link Link) (Link, bool) {
	existing, exists := links[link.LinkId]
	if exists {
		return existing, false
	}

	shortIdOptions := ShortIdOptions{
		Number: 6,
		StartWithYear: false,
		EndWithHost: false,
	}
	link.LinkId = strings.ToLower(ShortIdGenerate(shortIdOptions))

	// FIXME: remove this after db integration! used only for local testing
	if len(link.SimpleLinks) == 0 {
		shortIdOptions.Number = 3
		link.SimpleLinks = append(link.SimpleLinks,
			"01"+strings.ToLower(ShortIdGenerate(shortIdOptions)))
	}

	//link.CreatedAt = time.Now().String()
	link.CreatedAt = jodaTime.Format("YYYY-MM-ddTHH:mm:ss", time.Now())

	links[link.LinkId] = link

	return link, true
}

// UpdateLink updates an existing link
func UpdateLink(id string, link Link) bool {
	_, exists := links[id]
	if exists {
		link.UpdatedAt = jodaTime.Format("YYYY-MM-ddTHH:mm:ss", time.Now())
		links[id] = link
	}
	return exists
}

// -- mock-data --
// returns a slice of all
func AllLinks() []Link {
	values := make([]Link, len(links))
	idx := 0
	for _, link := range links {
		values[idx] = link
		idx++
	}
	return values
}
var links = map[string]Link{
	"01linkid":{
		"01linkid", "http://long_link",
		[]string{"simple_link01","simple_link02"},
		"", "",
	},
}


