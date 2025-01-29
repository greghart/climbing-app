#!/bin/sh

Size () {
  ls -sh $1 | awk '{print $1;}'
}

Convert () {
  sizeA=$(Size $1)
  convert $1 -resize 25% $1
  convert $1 -quality 25% $1
  sizeB=$(Size $1)
  echo "Convert $1 from $sizeA to $sizeB"
}

if [ $1 = "all" ]; then
  echo "Converting all files, are you sure?"
  for filename in ./*.jpg; do
    [ -e "$filename" ] || continue
    name=${filename##*/}
    Convert $name
  done
elif [ $# -eq 0 ]; then
  echo "Specify files to convert or pass in \`all\`"
else
  for f in "$@"; do
    if [ -e "/mnt/d/Pictures/Japan 2023/$f" ]; then
      echo "Importing and converting $f"
      # uncomment to pull file in from matey drive
      cp "/mnt/d/Pictures/Japan 2023/$f" ./$f
      Convert $f
    fi
  done
fi

# Convert zanmai_chirashi.jpg