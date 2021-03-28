#!/bin/bash

array1=( colossus collins )
org='tumblr'
for i in "${array1[@]}"
do
  echo
  echo "Generating stats for ${org}/$i with token $1"
	npm run app stats github "${org}" X "$i" $1
done

npm run app os