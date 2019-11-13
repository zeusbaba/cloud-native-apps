package api

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// for json, see https://golang.org/pkg/encoding/json/#Marshal
func responseWriteJSON(w http.ResponseWriter, i interface{}) {
	b, err := json.Marshal(i)
	if err != nil {
		panic(err)
	}
	w.Header().Add("Content-Type", "application/json; charset=utf-8")
	w.Write(b)
}

func ResponseWithJSON(w http.ResponseWriter, json []byte, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	w.Write(json)
}
func ErrorWithJSON(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	fmt.Fprintf(w, "{message: %q}", message)
}

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

// -- USER --
type User struct {
	UserId   string            `json:"userid"`
	Password string            `json:"password"`
	MetaData map[string]string `json:"meta_data,omitempty"`

	CreatedAt string `json:"createdAt,omitempty"`
	//CreatedAt time.Time  `json:"createdAt,omitempty"`
	UpdatedAt string `json:"updatedAt,omitempty"`
	Strategy  string `json:"strategy,omitempty"` // "local" when generating new token
}
func (user User) displayUser() {
	fmt.Printf("userId: %v | createdAt %v", user.UserId, user.CreatedAt)
}
func (user User) UserToJSON() []byte {
	ToJSON, err := json.Marshal(user)
	if err != nil {
		panic(err)
	}
	return ToJSON
}
func UserFromJSON(data []byte) User {
	out := User{}
	err := json.Unmarshal(data, &out)
	if err != nil {
		panic(err)
	}

	return out
}

// -- LINK --
type Link struct {
	LinkId      string   `json:"short_link"`
	LongLink    string   `json:"long_link"`
	SimpleLinks []string `json:"simple_links,omitempty"`

	CreatedAt string `json:"createdAt,omitempty"`
	UpdatedAt string `json:"updatedAt,omitempty"`
}

func (link Link) LinkToJSON() []byte {
	ToJSON, err := json.Marshal(link)
	if err != nil {
		panic(err)
	}
	return ToJSON
}
func LinkFromJSON(data []byte) Link {
	out := Link{}
	err := json.Unmarshal(data, &out)
	if err != nil {
		panic(err)
	}
	return out
}

// -- LINK STATS --
type LinkStats struct {
	ShortLink string            `json:"_id"`
	Stats     map[string]string `json:"stats"`

	CreatedAt string `json:"createdAt,omitempty"`
	UpdatedAt string `json:"updatedAt,omitempty"`
}

func (linkStats LinkStats) LinkStatsToJSON() []byte {
	ToJSON, err := json.Marshal(linkStats)
	if err != nil {
		panic(err)
	}
	return ToJSON
}
func LinkStatsFromJSON(data []byte) LinkStats {
	out := LinkStats{}
	err := json.Unmarshal(data, &out)
	if err != nil {
		panic(err)
	}
	return out
}
