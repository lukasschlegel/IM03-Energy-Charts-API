# Projekt: Visuelle Darstellung des Stromverbrauchs europäischer Länder (STROMFRESSER)

## Projektidee
Ziel dieses Projekts war es, den Stromverbrauch verschiedener europäischer Länder über einen Zeitraum von 24 Stunden visuell darzustellen und so die Unterschiede zwischen den Ländern aufzuzeigen. Um den Stromverbrauch der Länder in einen sinnvollen Kontext zu setzen, haben wir zusätzlich eine API verwendet, die Informationen zur Bevölkerung von europäischen Ländern liefert. So kann man den Verbrauch besser vergleichen.

### Verwendete APIs:
1. **Länder API**: [https://documenter.getpostman.com/view/1134062/T1LJjU52?ref=freepublicapis.com](https://documenter.getpostman.com/view/1134062/T1LJjU52?ref=freepublicapis.com)
   - Diese API lieferte zuverlässig Daten zu allen europäischen Ländern, darunter den Ländernamen, die Hauptstadt, die Einwohnerzahl und die Landesflagge. Sie erwies sich als eine sehr stabile und nützliche Quelle für unsere Zwecke.

2. **Stromdaten API**: [https://api.energy-charts.info/?ref=freepublicapis.com](https://api.energy-charts.info/?ref=freepublicapis.com)
   - Auf den ersten Blick schien diese API gut geeignet, da sie auf der Webseite freepublicapis.com als zuverlässig dargestellt wurde. Es stellte sich jedoch heraus, dass sie schnell überlastet war, wenn Daten für zu viele Länder abgefragt wurden. Besonders bei Ländern wie der Schweiz wurden häufig keine Stromdaten zurückgeliefert, was die Visualisierung erschwerte. Ähnlich war es bei Deutschland. Hingegen funktionierte die API bei Ländern wie Portugal und Spanien besser, wobei der Stromverbrauch der letzten 24 Stunden zuverlässig abgerufen werden konnte. 

### Technische Herausforderungen
- Ein Problem bei der Stromdaten-API war, dass sie sehr oft keine Daten lieferte, insbesondere wenn mehrere Länder gleichzeitig abgefragt wurden. Dies führte dazu, dass wir die Auswahl der Länder einschränken mussten. Trotz dieser Einschränkung hatten wir bei bestimmten Ländern wie der Schweiz oft keine Daten, sodass eine Darstellung des Stromverbrauchs nicht möglich war.
- Eine weiteres Problem war, dass sich manchmal der Ländername nach einer erneuten Suche nach einem anderen Land in der Suchleiste immer noch angezeigt wurde. Hier konnten wir den Fehler im Code nicht finden und nehmen an, dass es sich um einen Bug handelt.


Ein weiteres technisches Problem trat bei der Verwendung der Karte von **Mapbox** ([https://www.mapbox.com/](https://www.mapbox.com/)) auf. Während die Karte insgesamt gut funktionierte und das Anfliegen der Länder korrekt umsetzte, gab es bei der Suche nach Kosovo einen Fehler: Es wurden fälschlicherweise zwei Marker auf der Karte gesetzt, und das System stieg aus. Wir vermuten, dass dies ein Fehler in der Länder-API ist, da er sich im Code nicht nachvollziehen liess.

### Interaktive Elemente
Um die Wichtigkeit der Thematik Strom auf eine spielerische Art zu betonen, haben wir einen "Lights-out-Button" oben links auf der Webseite platziert. Wenn dieser gedrückt wird, fallen alle Lichter auf der Webseite aus und nur ein Zitat in der Mitte, das die Bedeutung von Strom hervorhebt, bleibt sichtbar. Diese Funktion lässt sich nur durch das Neuladen der Seite rückgängig machen.

### Learning
Für zukünftige Projekte würden wir APIs im Vorfeld intensiver auf ihre Zuverlässigkeit testen, bevor wir sie als zentrales Element in ein Projekt integrieren. Ausserdem würden wir mehr Zeit in die visuelle Gestaltung der Daten und ihre Positionierung auf verschiednen Endgeräten investieren. Die Zusammenarbeit mit der KI, insbesondere mit ChatGPT, erwies sich als wertvolle Unterstützung, sei es bei der Strukturierung des Codes, der Fehlersuche oder der Ideenfindung. Dennoch betonen wir, dass ein grundlegendes Verständnis des Codes erforderlich ist, um Anpassungen selbstständig vorzunehmen und die KI sinnvoll als Hilfswerkzeug einzusetzen. Ohne dieses Verständnis wäre auch ChatGPT nur begrenzt nützlich.

Ein Projekt von Ella Ricci und Lukas Schlegel