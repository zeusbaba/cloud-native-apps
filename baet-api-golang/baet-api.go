package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
	"github.com/zeusbaba/cloud-native-apps/baet-api-golang/api"
	"net/http"
	"os"
)

func main() {

	// using Gorilla mux, http://www.gorillatoolkit.org/pkg/mux#overview
	muxRouter := mux.NewRouter()

	muxRouter.HandleFunc("/", index)

	muxRouter.HandleFunc("/users", api.UsersHandler)
	muxRouter.HandleFunc("/links", api.LinksHandler)

	// TODO implement link related endpoints
	muxRouter.HandleFunc("/{link_id}/stats", api.LinksHandler)
	muxRouter.HandleFunc("/{link_id}/clicks", api.LinksHandler)
	muxRouter.HandleFunc("/{link_id}.json", api.LinksHandler)
	muxRouter.HandleFunc("/{link_id}", api.LinksHandler)

	// Negroni for middleware, see https://github.com/urfave/negroni
	middlewareNegroni := negroni.Classic() // include default middleware

	middlewareNegroni.UseHandler(muxRouter)

	fmt.Println("API server starting at port", port())
	err := http.ListenAndServe(port(), middlewareNegroni)
	api.CheckError(err)
}

func port() string {
	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "4042"
	}
	return ":" + port
}


func index(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = fmt.Fprintf(w, "BAET.no API powered with Golang.")
}
