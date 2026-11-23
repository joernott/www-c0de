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

## 2026-11-12 – Sprint 9

I have found a small bug in the 3d display: Blocks, that have text on them, e.g. literals, names etc., don't show those texts in the 3d models. Please add a task to sprint 9 to fix that, then continue with implementing sprint 9

## 2026-11-12 – Release 0.5.0

yes, please release sprint 9

## 2026-11-12 – Release 0.5.0 is live

the page is live

## 2026-11-13 – Sprint 10: c0de 0.5.0

yes, please, then continue with sprint 7 of c0de-net without waiting for my confirmation

## 2026-11-13 – Release 0.6.0

ok, go

## 2026-11-13 – Release 0.6.0 tagged

I have pushed the tag now

## 2026-11-13 – Release 0.6.0 is live

the webserver has been updated

## 2026-11-13 – Sprint 11: c0de net 0.3.0

The projects got approved on curseforge. I have added c0de as a default dependency to c0de-net on curseforge and added it as dependency to every released 0.2.0 mod. You can run the 0.3.0 release for c0de-net now and the remaining steps on www-c0de

## 2026-11-13 – The VM has a new address

The VM got a different IP, it is 192.168.178.183 again

## 2026-11-13 – Sprint 12: CurseForge

Please add another sprint to the www project, when you're ready. The first task in that sprint will be to add the curseforge links on the landing page.

## 2026-11-13 – The slug of c0de net on CurseForge

yes, c0de-net is the slug for the c0de-net project

## 2026-11-13 – Release 0.7.0 tagged

the tag has been pushed but there has been no new package to deploy

## 2026-11-13 – Release 0.7.0 is live

yes, plese add that as a task do sprint 12. Version 0.7.0 has been deployed successfully

## 2026-11-14 – Open-Meteo in CI and the screenshot world

let's add the new task but don't create a new release yet. I wnt to add the screenshots to this release, too.

For the screenshots, I'd like you to assist me in the following way:
- Compile a ToDo list for the screenshots. Each entry contains the page name, the program name, the program code. Also create an accompanying yaml file with the program code.
- Prepare a world on the server, where all the programs from the list have been placed. Leave the first sheet empty and always leave 1 empty sheet between programs to make sure that the screenshots all look similar and don't contain parts of other programs. For each sheet, place the same base setup 3 blocks north of the sheet: A regular trigger with a stone button on top, a debug trigger with a laptop on top, a timer trigger with a switch on top (turned on to disable the timer), an input block , a disk drive and a gray shulker box containing a stack of variable, constant and literal cards each, as well as a disk. place a  line of 6 iron blocks at z:-6 behind those blocks and above those a 4 wide and 3 high display framed by iron blocks.

## 2026-11-14 – Screenshots and the lists of what you need

I have created the screenshots, they are in the screenshots drawer of the first fabric client in the c0de repository and named after the headlines in screenshots.md.

I found the following mistakes:
- In chapter tutorials/libraries/c0de/time/game-time, you claim that you need a trigger block, a timer block and two display blocks but the program only needs one trigger block, a button and one display block.

- In tutorials/libraries/c0de/minecraft/automatic-doors, a timer and a trigger block are mentioned as requirements but the trigger block is never mentioned in the construction.

Please review all the building instructions and make sure, they match the required blocks list, or make it clear in the requirement list, for which example the blocks are.

## 2026-11-14 – Task 12.4.1

yes, please fix 12.4.1 before the release

## 2026-11-14 – Release 0.8.0

the default variants were just experiments based on the description, how all screenshots should look, ignore them, as we have more detailed instruction for every screenshot.

Don't crop the screenshots.

Yes, go ahead with the release

## 2026-11-14 – Sprint 12 is done

v0.8.0 has been deployed

## 2026-11-15 – The VM is at .103, and a library c0de/security

The VM now got the IP 192.168.178.103. Please update that information in all 3 repos.

I also want to introduce a new library c0de/security indo c0de and a few security features:
- The input functions get an additional "hide" parameter that is false by default. If set to true, only * are shown when typing in a laptop.
- Variables, constants and literals get a "hide" option, that is false by default. If set to true, the value is hidden. This can't be turned off again except for clearing the item with the trashcan button.
- There is a new tag "security: sensitive" that can be attached to variables and constants as well as used in structs. Those elements with that tag will not show their content in the debug information but *** instead.
- Every player gets a vault that is kept in memory while he is online. The vault vanishes, when he logs off.
- The vault stores a new language element "SECRET" that is treated like a constant in the code.
- There is a new library c0de/security with the following functions:
  - SET_SECRET creates or updates  a secret in the vault. A secret has a unique name, a type and a value. On top of that, it has a new boolean value "persistent" which will ensure that the secret is written to a file store. If the player has not opened their persistent vault, this will result in an error. The default value for this is "false".
  - Stored secrets will be managed in a <player-uuid>.kdbx file using the Keepass 4.x file format. Handling that file is done by the hudeany/kdbx library on the client only. The server gets a copy but never has access to the files content. A player has only access to their own secrets.
  - There is a CREATE_VAULT function that creates a keepass store for the player. It has a parameter for the password. If that is empty or not set, the player will be prompted in a GUI dialog to enter a password (+ a verification prompt).
  - There is a function OPEN_VAULT that opens an existing vault. It has a parameter for the password, if none is provided, the player is asked for their password. If no vault exists, an error is thrown.
  - There is a DELETE_SECRET function that removes a secret. If the secret was persistent, it is also deleted from the database. If the secret didn't exist, an error is thrown.

## 2026-11-15 – Sprint 13: c0de 0.6.0 and c0de net 0.4.0

please create a new sprint in both and add the tasks for the necessary changes to those. Then make sure, all changes in c0de show up in c0de.at. Wait with preparing a release there as I want to add a few modifications to c0de-net first.

## 2026-11-15 – Sprint 17 of c0de, Dependabot and a mail library for c0de net

I triggered the reruns.
Please plan a c0de sprint 17 for the 0.6.1 fixes. It should also contain the recipe.json unification or rather a solution that multiple mods can provide full featured documentation without needing to change anything in c0de itself.

For c0de-net, please make sure, the open PR from Dependabot is included in the current sprint. Also, I want to add another library named MAIL that implement a SMTP_SERVER data type with all the properties needed to connect to a mail server as well as a SMTP_SEND function implementing an SMTP client.
Another data type would be the IMAP_SERVER and a set of functions that implement an IMAP client:
 - IMAP_CREATE, IMAP_DELETE, IMAP_RENAME, IMAP_LIST, IMAP_STATUS, IMAP_SELECT, IMAP_FETCH, IMAP_SEARCH, IMAP_STORE, IMAP_MOVE and IMAP_EXPUNGE.

## 2026-11-16 – Sprints while the user is at work

I pushed 0.6.1 yesterday night. Please start with the sprint in c0de-net. As I will be off for work for the next 8-9 hours, please complete as many steps as you can without my interaction in the meantime. Once you've done that, please make sure that the www-c0de sprint contains the necessary steps to reflect the changes, both in c0de and c0de-net and has tutorials for the new features

## 2026-11-16 – Rerun of the release of c0de 0.6.1

OK, I triggered the rerun for c0de now.

## 2026-11-16 – c0de net 0.4.0 on the site

I have sorted out vs code, please go ahead with www-c0de

I disabled the various java related extensions

## 2026-11-17 – The test server and the sheets of the screenshot world

the fabric server on the VM does not run, can you start it, so I can take the screenshots

yes, add c0de net 0.4.0 to the server

I have been looking at the screenshots.md and it looks like you messed up the sheet numbers, most likely by inserting new examples between existing entries but wthout adding sheets in the actual dimension.. Please fix the document to match the actual sheets in the dimension and append new entries always at the end of the document. That also makes it much easier for me to spot what needs to be done.

yes, build the new sheets on the server

## 2026-11-17 – Findings while taking the screenshots

I took the first few screenshots and I have three findings:
- You now configure the timer blocks to the new programs and put a lever on to that is on. Somehow, the blocks don't get that and the new programs just started running on their own (and running into errors)
- I left the c0de dimension and when I re-entered it, I always ended up at the very beginning when re-entering it. That seems to have changed from the behavior we had before, where you always ended up at the place you left the dimension.
- I tried to take the screenshot for keeping-keys-open and was asked to enter a password. I intentionally entered the wrong password and the dialog just closed.

## 2026-11-18 – The screenshots of the new recipes

I did some more tests and created the screenshots for the web server. Let's shelve the c0de-net release until we have something more substantial in it.

Please add the screenshots from the folder minecraft-c0de-net/run/screenshots and continue with the remaining tasks for www-c0de

## 2026-11-18 – Release 0.9.0

I added the two remaining screenshots, please add them and go ahead with the release

The tag has been pushed and the site is live

## 2026-11-18 – Sprint 14 planned

yes, add tht to the tasks for  sprint 14 but don't start that sprint yet


## 2026-11-22 – c0de paint on the web page

Concerning minecraft-c0de-paint, we can go ahead with releasing it and starting the work on the web page

please update docs/screenshots.md as well to show me, which screenshots need to be taken

I have restarted the VM after my windows was in sleep mode for a while. So you need to restart the server. Please create the additional sheets on the fabric server on the VM as you did for the other screenshots as well. sheets spaced out onwith a blank sheet in between them and each sheet with a program has a setup with triggers (the timer should not be associated with the program), disk drive, laptop, display, input block etc.
