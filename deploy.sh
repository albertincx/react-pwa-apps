pnpm run examples $1

DD=$(grep -v '^#' .env | grep -e "DIR" | sed -e 's/.*=//')
if [ "$2" != "" ]; then
  DD=$2
fi
if [ "$DD" != "" ]; then
  echo $DD
  rm -r $DD/assets/*
  rm -r $DD/workbox-*
  cp -r ./examples/$1/dist/* $DD/
  cp $DD/favicon.png $DD/assets/
  echo "COPIED"
fi
