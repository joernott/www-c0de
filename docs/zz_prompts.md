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

## 2026-11-10 – HTTP only behind a reverse proxy

As I need to run the web server behind an existing reverse proxy that does the ssl offloading, I need a way to serve http, ideally with a commandline flag --httponly.

## 2026-11-10 – Release 0.2.0

yes, please go ahead

## 2026-11-10 – c0de.at is live

yes, please go ahead, the server is live now

## 2026-11-10 – Check after fixing the proxy

I have fixed the issues, please check again

## 2026-11-10 – HSTS header fixed

The header should be fixed now

## 2026-11-11 – Lesson plan of the tutorials

I have expanded the description of the tutorials in docs/concept.md (line 172 to 176). Please use that as a base to come up with a more detailed plan of lessions/examples for each of the paths.

## 2026-11-11 – Documentation sprint for the tutorials of c0de.at

To answer the questions:
T1, T2: The proposals make sense
T3: The proposal makes sense, please add a new sprint in the implementation plans for minecraft-c0de and minecraft-code-net, labeled documentation. Add this as task to these sprints, also add a task to generate the german translation to the existing documentation to these sprints.
T4: Add another step to the documentation sprint of minecraft-c0de to extract every block as a 3d models and use something like https://modelviewer.dev/ here to display the examples as 3d models. Screenshots still make sense though as a fallback and for displaying outputs.
T5: The proposal is fine, maybe also implement a version checker for c0de by checking the latest release version on github for the minecraft-c0de project.
T6: Yes, this should be stated somewhere explicitly.
T7: The proposal makes sense

## 2026-11-11 – Version constants

Add a task to the sprints on c0de and c0de-net to provide a constant C0DE_VERSION respective C0DE_NET_VERSION that will always contain the mod version. That should close the gap. After that, please push the three branches

## 2026-11-11 – Sprint 6

can you start with sprint 6 of www-c0de in the meantime, the workflow is still queued, so it may take some time

## 2026-11-11 – Releases

yes, please do (VM review and release 0.3.0 of the website, release 0.2.0 of c0de net)

## 2026-11-11 – Release 0.3.0

v0.3.0 has been pushed and the container is deployed

## 2026-11-11 – Sprint 7

please continue

## 2026-11-12 – Sprint 8

please start with the website sprint 8

## 2026-11-12 – Release 0.4.0

let's release now, taking screenshots will need some time

## 2026-11-12 – Release 0.4.0 is live

The release is live at c0de.at, please go ahead with your tasks
