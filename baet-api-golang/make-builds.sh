#!/usr/bin/env sh

echo "`go version`"

echo "making builds... linux"
GOOS=linux GOARCH=amd64 go build baet-api.go
mv baet-api baet-api_linux

echo "making builds... mac"
GOOS=darwin GOARCH=amd64 go build baet-api.go
mv baet-api baet-api_mac

echo "making builds... windows"
GOOS=windows GOARCH=amd64 go build baet-api.go
mv baet-api.exe baet-api_win.exe

echo "making builds... -> default"
go build baet-api.go

