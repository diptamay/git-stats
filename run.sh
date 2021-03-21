#!/bin/bash

array1=( colossus collins )
for i in "${array1[@]}"
do
	npm run app stats github tumblr "$i" "$i" 401776fc1ca3a1937fc2ffb0dd8f252463970838
done

array2=( dalor conductor darkwing-sql darking-dotnet infrastructure )
for j in "${array2[@]}"
do
  npm run app stats ado axon-eng rms-integrations "$j" cjzvflboxrliqjf56qh4oo6rad6mks63ydyzptx7adfhwq6tatkq
done
