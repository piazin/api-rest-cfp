#!/bin/bash
which yarn 
param1_seq=$1
param2_quantity=$2

green_text=`tput bold setaf 2`
red_text=`tput bold setaf 1`
purple_text=`tput bold setaf 99`
ROCKET='\U1F680'
CHECK='\U2705'


if [ $param1_seq != '-seq' -o -z $param2_quantity ] 
then
    echo "${red_text}invalid params, use: -seq {{number}}"
    exit 1
elif ! [[ "$param2_quantity" =~ ^[0-9]+$ ]]
then
    echo "Sorry integers only"
    exit 1
fi

echo -e " \n ${purple_text} Starting test loop ${ROCKET} \n "
for i in $(seq 1 $param2_quantity); do
    echo -e " \n ${green_text} run test number ${i} \n "
    yarn run test
done

echo -e " \n ${green_text} ${CHECK} finished ${param2_quantity} tests \n "
