#!/usr/bin/env sh

for FILE in ./*.env
do
    for line in $(cat $FILE); do
        echo "- exporting `echo $line | cut -d '=' -f 1`"
        export $line
    done
done
