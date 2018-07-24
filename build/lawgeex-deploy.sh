
if [ $# -eq 1 ] 
then
   sudo docker ps #not required - just to prompt the user for sudo password
   grunt
   cd ../word
   sudo docker cp sdk-all-min.js "$1":/var/www/onlyoffice/documentserver/sdkjs/word
   sudo docker cp sdk-all.js "$1":/var/www/onlyoffice/documentserver/sdkjs/word
else
    echo "execution failed. required args: <container-id>"
fi


