# PIPES - Programming In Pretty Easy Script

## Introduction
PIPES est une plateforme permettant la création de programme exécutable sur une diversité de support (web, desktop, mobile, arduino, etc...)

La logique du de code informatique peut sembler compliquée et abstraite pour les néophytes, PIPES tend a simplifier les paradigmes de programmation pour rendre les plus accessible.

Un traitement informatisé peut être comparé à un tuyau : On lui donne des donnée en entrée, et il ressort une donnée en sortie. Potentiellement des traitements sont appliqués pour passer de la valeur d'entrée a la valeur de sortie ; quoi qu'il arrive ceux ci sont consistent dans le temps : si on donne A, il sort B, si on donne C on obtiendrq D mais si on redonne A on aura de nouveau B en sortie.

En assemblant les tuyaux les un au autres (chaque tuyau n'ayant qu'une entrée et une sortie, on peut connecter la sotie du premier a l'entrée du suivant). Si un tuyau donne B pour A et un autre donne C pour B, En conectant l'entrée du second sur la sortie du premier, individuellement, le comportement de chacun ne change pas, mais au final on a une "chaîne de tuyau" qui transforme A en C.

PIPES implémente ce paradigme et met à disposition un ensemble de tuyau (pipe) connectable les uns aux autres et va faire transité un flux de données à travers les chaines de pipes pour réaliser des suites de traitement.


## Qu'est ce qu'un PIPE
Un pipe est la plus petites unité logique dans le monde de PIPES ; il a toujours une et une seule entrée et une et une seule sortie. Un pipe peut être de trois type :

**BOX**
une boite est un pipe qui peut stocker une donnée pour une utilisation ultérieure
ne modifie pas l'entrée, n'envoie pas de valeur en sortie (comportement à changer, une boite ne devrait pas avoir d'influence sur le flux de donnée)

**PIPE_NATIVE**
un pipe natif est un pipe qui va provoquer un traitement sur la donnée en entrée, ou déclencher une action (ou les deux), et retransmettre une donnée en sortie
vous pouvez éventuellement influer sur le comportement du pipe via les paramètre qu'il expose

**PIPE_FUNC**
une pipe_func est un pipe qui va comme pour un pipe natif soit déclencher un traitement, soit des actions autre, soit encore une fois les deux, mais celui ci n'a pas de paramètre, en revanche il peut être composé de pipe, à vous de faire en sorte qu'il fasse quelque chose d'intéressant ;)
