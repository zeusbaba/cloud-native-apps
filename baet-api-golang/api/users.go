package api

import (
	"encoding/json"
	"github.com/vjeantet/jodaTime"
	"io/ioutil"
	"net/http"
	"time"
)

func UsersHandler(w http.ResponseWriter, r *http.Request) {

	var respStatus int
	var respData []byte
	var err error

	switch method := r.Method; method {

	case http.MethodGet:
		users := AllUsers()
		//responseWriteJSON(w, users)
		respData, err = json.Marshal(users)
		if err == nil {
			respStatus = http.StatusOK
		} else {
			respStatus = http.StatusInternalServerError
			respData = []byte(err.Error())
		}
		ResponseWithJSON(w, respData, respStatus)

	case http.MethodPost:
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		user := UserFromJSON(body)
		user, created := CreateUser(user)
		if created {
			w.Header().Add("Location", "/users/"+user.UserId)
			w.WriteHeader(http.StatusCreated)
			user.Password = "" // remove password from response
			responseWriteJSON(w, user)
		} else {
			w.WriteHeader(http.StatusConflict)
		}

	case http.MethodPut:
		userid := r.URL.Path[len("/users/"):]
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		user := UserFromJSON(body)
		exists := UpdateUser(userid, user)
		if exists {
			w.WriteHeader(http.StatusOK)
			user.Password = "" // remove password from response
			responseWriteJSON(w, user)
		} else {
			w.WriteHeader(http.StatusNotFound)
		}

	default:
		//w.WriteHeader(http.StatusBadRequest)
		//w.Write([]byte("Unsupported request method."))
		respStatus = http.StatusBadRequest
		respData = []byte("Unsupported request method.")
		ResponseWithJSON(w, respData, respStatus)
	}
}

// FIXME: re-implement with db integration
// returns the user for a given userid
func GetUser(isbn string) (User, bool) {
	user, found := users[isbn]
	return user, found
}

// CreateUser creates a new User if it does not exist
func CreateUser(user User) (User, bool) {
	existing, exists := users[user.UserId]
	if exists {
		return existing, false
	}
	//user.CreatedAt = time.Now().String()
	user.CreatedAt = jodaTime.Format("YYYY-MM-ddTHH:mm:ss", time.Now())

	users[user.UserId] = user
	return user, true
}

// UpdateUser updates an existing user
func UpdateUser(id string, user User) bool {
	_, exists := users[id]
	if exists {
		user.UpdatedAt = jodaTime.Format("YYYY-MM-ddTHH:mm:ss", time.Now())
		users[id] = user
	}
	return exists
}

// -- mock-data --
// returns a slice of all
func AllUsers() []User {
	values := make([]User, len(users))
	idx := 0
	for _, user := range users {
		values[idx] = user
		idx++
	}
	return values
}
var users = map[string]User{
	"01userid":{"01userid", "1234pwd", nil, "", "",""},
	"02userid":{"02userid", "1234pwd", nil, "", "",""},
	"03userid":{"03userid", "1234pwd", nil, "", "",""},
}


