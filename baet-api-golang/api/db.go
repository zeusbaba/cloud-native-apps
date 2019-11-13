package api

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"os"
	"time"
)

var dbName = "baet"
var collectionPrefix = "baet_"
func DbConnect()(client *mongo.Client) {
	mongoUrl := os.Getenv("MONGODB_URL")

	var ctx, cancel = context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoUrl))
	checkError(err)
	err = client.Ping(ctx, readpref.Primary())
	checkError(err)

	return
}

func DbGetLinks() {
	dbClient := DbConnect()

	var ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := dbClient.Database(dbName).Collection(collectionPrefix+"links")
	findOptions := options.Find()
	findOptions.SetLimit(2)
	findOptions.SetSort(bson.D{{"createdAt", -1}})
	cur, err := collection.Find(ctx, bson.D{{}}, findOptions)
	checkError(err)
	defer cur.Close(ctx)

	counter := 0
	for cur.Next(ctx) {
		var result bson.M
		err := cur.Decode(&result)
		checkError(err)

		counter++
		fmt.Printf("%d : %v \n", counter, result)
	}
}
func DbCountLinks() {
	dbClient := DbConnect()
	//defer dbClient.Disconnect(ctx)

	var ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := dbClient.Database(dbName).Collection(collectionPrefix+"links")
	count, _ := collection.CountDocuments(ctx, bson.D{})
	fmt.Printf("count docs: %v \n", count)
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}
