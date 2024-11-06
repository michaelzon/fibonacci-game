### 7 juni 

misschien moet ik de grid wel laten bestaan uit een 2d array, maar als ik ga zoeken voor een sequence een andere data structuur gebruiken zoals set of map. 

maak er een 2d grid van 
als er een wijziging in de grid komt, maak dan een subcollectie van arrays - bestaande uit vijf objecten, inclusief locatie van elke cellwaarde. Deze subcollectie moet alleen cellen bevatten die kans maken om geleegd te worden. Dus, het zullen altijd vier aangrenzende buren zijn van de cellen die opgewaardeerd worden plus de opgewaarde cel. 

eerst focussen op collecties maken voor het controleren voor reeksen van links naar rechts 
dan van boven naar onder 
als bonus kan ik later ook nog doen van rechts naar links en van onder naar boven 
extra bonus is diagonaal. 

misschien kan voor elke reeks van vijf die je controleerd, hem ontoveren in een map, zodat je snel kan controleren of er wel een waarde is in de reeks die voorkomt in de fibonacci reeks, alvorens je waardes met elkaar gaat vergelijken. 

je kan subSetof gebruiken voor de reeks die je checkt, die controleert of alle waardes onderdeel zijn van een set. alleen werkt dit niet voor firefox. mijn plan is om die voor nu even te gebruiken, en dan later een listener voor de browser toe te voegen die (https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent). 

er zal altijd een orde gemaakt moeten worden naar keuze van de programmeur of je eerst van boven naar beneden of van beneden naar boven controleert

in mijn oude spel, kon je een sequence van zes maken, bijvoorbeeld van 3, 5, 8, 13, 21, 34. Omdat ie hier 2x een sequence ziet, namelijk 3, 5, 8, 13, 21 en 5, 8, 13, 21, 34. Maar dat is gek, want dan lijkt het voor de gebruiker alsof je een sequence van zes maakt, terwijl in wijze hij 2 keer een sequence van 5 doet, omdat ie in mijn oude spel alles de hele tijd controleert. maar als je nou zegt hee ik controleer alleen de vier aangrenzende buren van een cell die wordt opgewaardeerd, dan heb je dat probleem niet. 


    // todo check ook nog of ze achtereenvolgend in de fiboseq zijn. ik retrieve de key uit de cache met de eerste value van de sequence (en daarmee ook de laagste, hoef ik minder te ittereren tijdens het ophalen van de key en ga daarna gewoon kijken of de vier values van de opeenvolgende keys uit het cache object overeenkomen met de waardes in mijn cache. )
    // moet je wel aparte regels schrijven voor wanner je van boven naar onder gaat controleren? of je sorteert ze gewoon eerst altijd oplopend 
    // je wil dit ook pas doen als fibInSeq op true staat, anders gaat ie onnodig values opzoeken die toch niet in de fibreeks staan. 