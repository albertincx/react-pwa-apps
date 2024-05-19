pnpm run examples $1

DD=
if [ "$2" != "" ]; then
  DD=$2
fi
if [ "$3" != "" ]; then
  exit
fi
if [ "$DD" != "" ]; then
  echo $DD
  rm -r $DD/assets/*
  cp -r ./examples/$1/dist/* $DD/
  cp $DD/favicon.png $DD/assets/
  echo "COPIED"
fi
