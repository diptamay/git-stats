#!/bin/bash

array1=( colossus collins )
for i in "${array1[@]}"
do
  echo "Generating stats for $i with token $1"
	npm run app stats github tumblr X "$i" $1
done
