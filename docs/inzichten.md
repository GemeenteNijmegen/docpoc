# Inzichten opgedaan bij implementeren ZaakDMS ZGW Documenten API

## Modulariteit van de APIs
De APIs werken goed wanneer ze allemaal gebruikt worden, maar het is lastig om de APIs los van elkaar te gebruiken. Bijvoorbeeld alleen OpenZaak of alleen OpenDocumenten. Er zijn veel connecties en data duplicatie.

## Standaard managment
Release notes komen niet overeen met de wijzigingen die in de standaard zitten. 1.4.2 en 1.4.3 zijn hetzelfde op het versie nummer na, maar de release notes zeggen wat anders.

## Downloaden van bestanden
Use case: downloaden van bestanden (informatie objecten) uit de documenten-api. Het wordt heel lastig om documenten te downloaden uit de documenten-api door inwoners omdat dit altijd via een applicatie moet lopen. De authorisatie is immers ingericht op applicatie niveau. 

Vraag: waarom een inhoud veld? combineren van de document inhoud in een xml/json bericht zorgt voor problemen als documenten groot worden.