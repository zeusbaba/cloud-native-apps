#!/usr/bin/env sh

#echo "`go version`"
go version

APPNAME=baet-api

echo "making builds... linux"
GOOS=linux GOARCH=amd64 go build ${APPNAME}.go
mv ${APPNAME} ${APPNAME}_linux

echo "making builds... mac"
GOOS=darwin GOARCH=amd64 go build ${APPNAME}.go
mv ${APPNAME} ${APPNAME}_mac

echo "making builds... windows"
GOOS=windows GOARCH=amd64 go build ${APPNAME}.go
mv ${APPNAME}.exe ${APPNAME}_win.exe

echo "making builds... -> default"
go build ${APPNAME}.go

