pnpm run examples

DD=$(grep -v '^#' .env | grep -e "DIR" | sed -e 's/.*=//')

if [ "$DD" != "" ]; then
  echo $DD
  rm -r $DD/assets/*
  rm -r $DD/workbox-*
  cp -r ./examples/react-router/dist/* $DD/
  cp $DD/favicon.png $DD/assets/
  echo "COPIED"
fi
