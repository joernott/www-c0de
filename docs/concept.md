# Concept
The website c0de.at hosts the documentation and tutorials for the c0de web site. This repository contains everything needed to build a web server as a single static go binary, based on caddy and a docker container to host that web site. The documentation part for the mod itself will be hosted at https://c0de.at/c0de, the libraries then will have their own folders like https://c0de.at/minecraft etc. Their contents will be generated from the documentation already in the minecraft-c0de and minecraft-c0de-net repositories.

Tutorials will follow in a second step and will show up under https://c0de.at/tutorials.

As for the tools, I want to use caddy with let's encrypt support as the web server backend and build a static linux binary that contains the whole site. It uses vue,js and the Tailwind CSS framework for the frontend.

The web site looks like an open ring folder with the rings at the left side of the viewport and the pages with the content on the right side. Colored tabs at the right margin are used to indicate the chapters. There is a tab with a house at the top that brings the user back to the home page, followed by tabs for the c0de language documentation in one color and then in different colors, tabs for the libraries.
