#!/usr/bin/env sh

export FILES_HOME=./api-secrets
if test -d ${FILES_HOME};
then
  # parse all .env files in the current dir, and export its content as env-var
  for FILE in ${FILES_HOME}/*.env
    do
      echo "processing env-vars from $FILE"
      for line in $(cat ${FILE}); do
          echo "- exporting `echo ${line} | cut -d '=' -f 1`"
          export ${line}
      done
    done
else
  echo "$FILES_HOME doesn't exist! do nothing..."
fi
