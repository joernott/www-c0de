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
