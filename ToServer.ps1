ng build
pause
winscp.exe Mediq /keepuptodate "C:\Users\Annaniks LLC\Desktop\lift_front_local\dist\lift-frontend" /var/www/lift /defaults
pause
plink -ssh root@46.101.179.50 -pw LCto6XSk "sudo service nginx restart"