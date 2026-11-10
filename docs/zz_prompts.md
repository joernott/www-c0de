# Prompts

This file collects all prompts used to work on this repository.

## 2026-11-10 – Sprint 0: concept review and implementation plan

I want you to use the same rules, we used for the minecraft-c0de project for the work on the project www-c0de. Please create a sprint-0 branch and review the concept in the www-c0de folder. Then create an implementation plan for it.

## 2026-11-10 – Answers to the review questions

Answers to the questions:
Q1: Let's use /c0de/minecraft for the libraries, that will make it easier to implement documentations from Libraries provided by additional mods, like c0de-net/http etc.

Q3: VitePress is OK

Q5: The site will be hosted on my own linux web server running on an amd64 architecture. New versions will be deployed by restarting the container-c0de systemd service that uses podman and pulls the latest version of the container before running it. It may later move to a different linux container/VM

Q7: The Operator will be me, the imprint data can be taken from www.ott-consult.de. Access logs will be kept.

## 2026-11-10 – Answers to the follow-up and remaining questions

Answers to this:
Q5.1: The web server runs multiple IP addresses and c0de.at will be hosted on a dedicated IP, where port 80/443 will be available.
Q5.2 I control the DNS server and the server won't habe an IPv6 address for now.
Q7.1: Access logs should rotate daily and will be kept for 3 months. The full IP will be kept.

Q2: One tab for "home", one tab for the language itself and one for each library will always be visible. Additional tabs for each chapter will show below one of those tabs, if it was selected. As this is dynamic, there is no maximum amount of tabs, so there should be some scrolling mechanism

Q4: The latest version is OK
Q6: BSD 3 clause, the same as the mod itself
Q8: Yes, dark and light mode please
Q9: Focus is "Desktop browser first"
Q10: Initially, English and German, Support for multiple languages can be added if someone provides those translated versions in the respective mods.
Q11: The suggested colors are fine
Q12: The proposal is fine

## 2026-11-10 – Answers to the last open questions

Q2,1: I'd prefer one tab per function
Q10.1: Yes, the German translations should be planned in the mods themselves.

Podman does not run rootless.

## 2026-11-10 – Development environment

You can use the Windows workstation and the development VM 192.168.178.101 that we used for the other mods as well, there you have SSH access and passwordless sudo rights. Github actions should be used and the current stable versions of each package. Go 1.27.3 is installed on Windows and I can update it, if needed

## 2026-11-10 – Sprint 1

yes, please proceed

## 2026-11-10 – Docker on the VM, sprint 2

Please use docker on the VM instead of Podman, I'll handle the server to accomodate podman later.

You can continue with sprint-2 then

## 2026-11-10 – Sprint 3

please continue with sprint 3

## 2026-11-10 – Sprint 4

please continue with sprint 4

Answers to the questions about the legal notice: the operator is Jörn Ott personally (Hauptstr. 2, 53604 Bad Honnef); contact: phone +49 2224 9408-73, e-mail c0de@c0de.at; no tax or VAT numbers.

## 2026-11-10 – Sprint 5

The legal documents are fine. I am hosting the servers myself. The email address is already working, I've tested it.
Please start with sprint 5

## 2026-11-10 – Release 0.1.0

please go ahead with step 1

## 2026-11-10 – Package visibility

the package already has already been set as public

## 2026-11-10 – Data folder on the server

I will use a slightly different way of deployment on the backend server to better fit my needs. A part of this is that I am using the local folder /data/c0de/data to store the data. What UID/GID should own that folder?
