package main

import (
	"./api"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
	"net/http"
	"os"
)

func main() {
	/*
	// usign standard net/http
	http.HandleFunc("/", index)
	http.HandleFunc("/echo", api.EchoHandleFunc)
	http.HandleFunc("/hello", api.HelloHandleFunc)

	http.HandleFunc("/users", api.UsersHandleFunc)
	http.HandleFunc("/links", api.LinksHandleFunc)

	err := http.ListenAndServe(port(), nil)
	checkError(err)
	*/

	// using Gorilla mux, http://www.gorillatoolkit.org/pkg/mux#overview
	r := mux.NewRouter()

	r.HandleFunc("/", index)
	r.HandleFunc("/echo", api.EchoHandleFunc)
	r.HandleFunc("/hello", api.HelloHandleFunc)

	r.HandleFunc("/users", api.UsersHandleFunc)
	r.HandleFunc("/links", api.LinksHandleFunc)

	// TODO implement link related endpoints
	r.HandleFunc("/{link_id}/stats", api.LinksHandleFunc)
	r.HandleFunc("/{link_id}/clicks", api.LinksHandleFunc)
	r.HandleFunc("/{link_id}.json", api.LinksHandleFunc)
	r.HandleFunc("/{link_id}", api.LinksHandleFunc)

	// Negroni for middlware, see https://github.com/urfave/negroni
	n := negroni.Classic() // include default middleware
	/*
	n := negroni.New()
	logger := negroni.NewLogger()
	logger.SetFormat("{{.StartTime}} | [{{.Status}} - {{.Duration}}] | {{.Hostname}} | {{.Method}} {{.Path}} | {{.Request.UserAgent}}")
	n.Use(logger)
	*/

	n.UseHandler(r)

	err := http.ListenAndServe(port(), n)
	checkError(err)
}


func port() string {
	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "4042"
	}
	return ":" + port
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Welcome to BAET API with Golang.")
}
