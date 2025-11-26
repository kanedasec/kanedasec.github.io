---
layout: post
title: "Password reset poisoning via middleware"
date: 2024-02-02
author: Kanedasec
category: Solving Portswigger Labs with ZAP
---

Solving Portswigger Labs with ZAP: Password reset poisoning via middleware
================================================================================


Lab Info:
---------

This lab is vulnerable to password reset poisoning. The user `carlos` will carelessly click on any links in emails that he receives. You can log in to your own account using the following credentials: `wiener:peter`. Any emails sent to this account can be read via the email client on the exploit server.  

Goal:
-----
 
To solve the lab, log in to Carlos's account.  
  
Steps:
------
 
1) Aways test the application's functionalities with the valid credentials. You will test the "Update E-mail" and the "Forgot Password?" functionalities. For this lab, only the later is relevant. After you submit the Wiener username, you will receive an e-mail in the exploit server with and url with a temporary token. It will look like this:  
  
  
![4-1.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-reset-poisoning-via-middleware/4-1.png)  
The "Forgot Password?" password request  
  
![4-2.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-reset-poisoning-via-middleware/4-2.png)  
The e-mail on the exploit server with the temporary token in the url  
  
2) If we just change the username in the request, what would happen? The application would check its database for the e-mail associated with this username and send an e-mail with the temporary token to it. As we know that the "Forgot Password?" functionality is the attack vector (because of the lab description), we will focus on stressing the forgot-password request.

This means we can change the http methods to look for errors, try injection attacks, and try host header manipulation. After testing these vectors, we understand that the application only allow GET and POST methods, and neither the parameter username nor the cookie session is vulnerable to injection attacks. With host header manipulation we found that the application allows the X-Forwarded-Host header. 

The **`X-Forwarded-Host`** (XFH) header is a de-facto standard header for identifying the original host requested by the client in the Host HTTP request header. As the the exploit server /log system will receive a log entry, we will confirm that the application is in fact accepting the X-Forwarded-Host header, therefore it is vulnerable.  
  
![4-3.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-reset-poisoning-via-middleware/4-3.png)  
A diagram I drew to explain the attack  
  
  
![4-4.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-reset-poisoning-via-middleware/4-4.png)  
Request to the vulnerable function (forgot-password) with the host header X-Forwarded-Host with the server we (the attacker) controll and the username "carlos"  
  
![4-5.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-reset-poisoning-via-middleware/4-5.png)  
Entry we received in the log system of our server, containing the temporary token.  
  
3) Now its only a matter to make a GET request with the token to the forgot-password function and you will get a response that, after html rendered, will be a page that prompts you to create a new password for user "carlos". Now you can just login to "carlos" account.  
  
![4-6.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-reset-poisoning-via-middleware/4-6.png)  
Get request with the temporary token sent so we can make the application reset "carlos" password  
  
  
![4-7.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-reset-poisoning-via-middleware/4-7.png)  
POST request sent with username "carlos" and a new password crafted by the attacker, allowing us to login as the victims user.  
  
**

Lab Solved
----------

**
