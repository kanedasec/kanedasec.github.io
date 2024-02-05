---
layout: post
title: "Broken brute-force protection, multiple credentials per request"
date: 2024-02-04
author: Kanedasec
category: Solving Portswigger Labs with ZAP
---

Solving Portswigger Labs with ZAP: Broken brute-force protection, multiple credentials per request
================================================================================


Lab Info:
---------
 
This lab is vulnerable due to a logic flaw in its brute-force protection. Victim's username: `carlos`  


Goal:
-----
  
To solve the lab, brute-force Carlos's password, then access his account page.  


Steps:
------
  
1) After stress testing the login panel, we quickly found that there's a blocking mechanism in place to mitigate brute-force attacks, which activates after 3 incorrect attempts.  
  
  
![6-1.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Broken-brute-force-protection-multiple-credentials-per-request/6-1.png)  
Rendered in the browser  
  
  
![6-2.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Broken-brute-force-protection-multiple-credentials-per-request/6-2.png)  
Incorrect attempt but not locked out yet  
  
  
![6-3.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Broken-brute-force-protection-multiple-credentials-per-request/6-3.png)  
Incorrect attempt and locked out (notice the different response lenght)  
  
2) Notice that the request body is formatted in JSON. If the application improperly handles the password field by accepting both single strings and arrays of strings, an attacker could exploit this by sending multiple passwords in a single request, effectively circumventing the security measures designed to prevent brute-force attacks. Therefore, we'll construct an array of strings to populate the password field.  
  
To do this, we'll utilize the terminal to convert the Portswigger password list into an array of strings using the `jq` command-line JSON processor:  
  
**Commands example:**  
  
jq -R -s -c 'split("\\n")\[:-1\]' portswigger-passwords  
  
The result will look something like this:  
  
\["123456","password","12345678","qwerty","123456789","12345", ...\]  
  
  
![6-4.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Broken-brute-force-protection-multiple-credentials-per-request/6-4.png)  
This is the request we submitted using the crafted payload. Note that the response is different from the 200 status code we received previously with the incorrect credential.  
  
  
![6-5.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Broken-brute-force-protection-multiple-credentials-per-request/6-5.png)  
Notice here that in the response header, we got the session cookie to login as "carlos", therefore solving the lab.  
  
**

Lab Solved
----------

**
