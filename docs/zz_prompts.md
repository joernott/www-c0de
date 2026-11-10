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
