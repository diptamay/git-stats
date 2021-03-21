#!/bin/bash

array1=( colossus )
for i in "${array1[@]}"
do
  echo "Generating stats for $i with token $1"
	npm run app stats github tumblr X "$i" $1
done

array2=( dalor conductor darkwing-sql darking-dotnet infrastructure )
for j in "${array2[@]}"
do
  echo "Generating stats for $j with token $2"
  npm run app stats ado axon-eng rms-integrations "$j" $2
done
