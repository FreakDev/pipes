# Pipes

### Programming In Pretty Easy Stuff

Un exécutable pipes est composé de plusieurs chaînes de pipe (une chaîne est ensemble de “tuyau” à sens unique connecté les uns à la suite des autres).

L'exécution d’un pipe représente représente l’exécution d’une petite procédure qui aura pour but de traiter une donnée acquise en “entrée” pour produire une donnée de “sortie”.

L’exécution d’une chaîne de pipes représente l’exécution successive de tous les pipes de la chaînes, la sortie du premier devenant l’entrée du second et ainsi de suite. L’exécution du premier pipe de la chaîne est elle déclenchée par un événement qui fournira la première donnée d’entrée

Le nombre de chaînes de pipes et de pipe par chaîne est illimité.
