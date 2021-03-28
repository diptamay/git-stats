#!/bin/bash

array1=( okta-sdk-dotnet okta-sdk-python okta-sdk-java okta-sdk-nodejs )
org='okta'
for i in "${array1[@]}"
do
  echo
  echo "Generating stats for ${org}/$i with token $1"
	npm run app stats github "${org}" X "$i" $1
done

npm run app os
npm run app ds