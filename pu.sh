cp config.xml www
cp -r resources www

git add .
git commit -a -m "$*"
git clean -f
git push origin master 
ionic upload

curl -u mark@learnsomestuff.com -X PUT -d 'data={"pull":"true"}' https://build.phonegap.com/api/v1/apps/1532972