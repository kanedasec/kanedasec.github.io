---
layout: post
title: "Password brute-force via password change"
date: 2024-02-04
author: Kanedasec
category: Solving Portswigger Labs with ZAP
---

Solving Portswigger Labs with ZAP: Password brute-force via password change
================================================================================


Lab Info:
---------
  
This lab's password change functionality makes it vulnerable to brute-force attacks. To solve the lab, use the list of candidate passwords to brute-force Carlos's account and access his "My account" page.  

Goal:
-----

Access Carlos "My account" page  

Steps:
------

1) Always test the application's functionalities using valid credentials. Focus on testing both the "Update Email" and "Change Password" functionalities. For this lab, only the latter is particularly relevant. When evaluating application functionalities, always explore for various errors, including expected errors (such as incorrect passwords, mismatched passwords in confirmation) and injection payloads. Below are the details for the "Change Password" functionality:  
 
  
![5-1.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-1.png)  
"Change password" rendered in the browser  
  
  
![5-2.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-2.png)  
The POST request with the parameters sent with the "Change password". Notice here that I tried the correct current password and different set of new-confirmation passwords. Lets call this TRY 1.  
  
  
![5-3.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-3.png)  
Now resending The POST request with the parameters sent with the "Change password". Notice here that I tried the incorrect current password and different set of new-confirmation passwords. Lets call this TRY 2.  
  
  
![5-4.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-4.png)  
In Try 1, the response were 3,877 bytes long. Rendered in Browser, it looked like this. Notice the "New passwords do not match" error message.  
  
  
![5-5.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-5.png)  
In Try 2, the response were 3,880 bytes long. Rendered in Browser, it looked like this. Notice the "Current password is incorrect". Bingo!  
  
  
2) Through testing the functionality, it's clear that attempting to change the password with an incorrect current password and a mismatched set of new/confirmation passwords results in an error message indicating the current password is wrong. Typically, this type of error can be considered a security vulnerability because it potentially allows for credential guessing through brute force attacks.  
  
However, in this instance, it might not pose a security risk since the function is already secured behind an authentication process. Yet, it's notable that the POST request includes a hidden parameter with the username credential ("wiener"). This suggests the application relies on a hidden field to receive the username parameter, which it then uses to verify the correct current password in the database before proceeding with the password update.  
  
To explore this hypothesis, we can modify the username parameter to "carlos" and attempt to fuzz the current-password parameter. This approach aims to uncover a "New passwords do not match" error message or a response that is 3,877 bytes in length.  
  
  
![5-6.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-6.png)  
The username parameter was updated to "carlos," followed by fuzzing the current-password parameter.  
  
  
  
![5-7.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-7.png)  
I stored the credentials supplied by PortSwigger Labs in the ".ZAP/fuzzers/" directory for convenient use as a "File Fuzzers" payload type.  
  
  
![5-8.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-8.png)  
Upon completing the fuzzing process, we received a response that was 3,877 bytes long, which included the error message "New passwords do not match." From this, we can deduce that the effective payload password in this instance is "george."  
  
  
![5-9.png](/assets/img/posts/Solving-Portswigger-Labs-with-OWASP-ZAP/Password-brute-force-via-password-change/5-9.png)  
And there it is.  
  
**

Lab Solved
----------

**
