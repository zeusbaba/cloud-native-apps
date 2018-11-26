package api

import (
	"encoding/json"
	"net/http"
)


// HelloHandleFunc to be used as http.HandleFunc for Hello API
func HelloHandleFunc(w http.ResponseWriter, r *http.Request) {

	message := Hello{"(hello) Welcome to BAET API with Golang."}
	jsonMessage, err := json.Marshal(message)

	if err != nil {
		panic(err)
	}

	w.Header().Add("Content-Type", "application/json; charset=utf-8")
	w.Write(jsonMessage)
}
