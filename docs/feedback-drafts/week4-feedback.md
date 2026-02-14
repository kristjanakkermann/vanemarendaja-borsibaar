# Nädal 4 - Standup Tagasiside (Meeskond 36 - Börsibaar)

**Kristjan Akkermann**

---

## E-kiri

**Saaja:** vanemarendajaks@taltech.ee
**Teema:** Nädal 4 standup tagasiside - Kristjan Akkermann (Meeskond 36)

Tere,

Kahjuks jäi mul 4. nädala tagasiside vorm täitmata enne sulgemist. Palun kas oleks võimalik vorm uuesti avada või aktsepteerida minu vastuseid e-kirja teel?

Allpool on minu vastused kõigile 12 küsimusele:

---

**1. Mida Sa eelmisel nädalal tegid ja mis oli selle tegevuse mõju (tiimile, projektile või õppimisele)?**

Seadistasin Börsibaari projekti tootmiskeskkonna Dockeri abil. Lõin multi-stage Dockerfile'id nii backendi (Spring Boot, JDK build → JRE runtime) kui ka frontendi (Next.js, standalone output) jaoks. Konfigureerisin docker-compose.prod.yml faili koos PostgreSQL, backend, frontend ja NGINX teenustega. Seadistasin NGINX reverse proxy konfiguratsiooni koos SSL/TLS toega (Let's Encrypt) ja OAuth2 routing'uga. Lõin CI/CD pipeline'i GitHub Actions abil, mis automaatselt ehitab, testib, loob Docker image'id ja deployb serverisse. Mõju projektile: deploy protsess on nüüd täielikult automatiseeritud ja reprodutseeritav.

**2. Mida plaanid sel nädalal teha ja mida Sa sellega saavutada tahad?**

Plaanin seadistada AWS infrastruktuuri (EC2 instance), konfigureerida serveri Dockeri ja NGINX-iga ning deployda Börsibaari rakenduse avalikult kättesaadavale domeenile koos HTTPS toega. Eesmärk on saada töötav tootmiskeskkond, kus CI/CD pipeline automaatselt uuendab rakendust igal pushil.

**3. Millised takistused või väljakutsed on Sul tekkinud ja kuidas need on mõjutanud Sinu edasiliikumist kursusel?**

Peamised väljakutsed: (1) Docker networking - konteinerite omavaheline suhtlus ja pordimäärangud nõudsid hoolikat konfigureerimist, (2) NGINX reverse proxy seadistamine OAuth2 callbackide jaoks - frontend ja backend peavad läbi sama domeeni suhtlema, mis nõudis X-Forwarded-* headerite korrektset edastamist, (3) CI/CD pipeline'i SSH deploy seadistamine GitHub secretsiga. Need väljakutsed aeglustasid tööd, kuid andsid palju praktilisi teadmisi.

**4. Mis oli eelmisel nädalal üks otsus või tegevus, mida teeksid nüüd teisiti?**

Oleksin pidanud Docker konfiguratsiooni ja CI/CD pipeline'i seadistama juba projekti alguses, mitte hiljem. Varajane automatiseerimine oleks säästnud palju manuaalset tööd ja vigade otsimist hilisemates etappides.

**5. Mida Sa eelmisel nädalal õppisid, mida saad edaspidi teadlikult rakendada?**

Õppisin multi-stage Docker buildide efektiivsust (väiksemad image'id, kiirem deploy), NGINX reverse proxy konfigureerimist (SSL termination, upstream routing, WebSocket tugi) ja GitHub Actions CI/CD pipeline'ide loomist koos SSH deploy'ga. Eriti kasulik oli aru saada, kuidas Docker Compose orchestreerib mitut teenust ja kuidas environment variables liiguvad läbi kogu stack'i (build-time vs runtime).

**6. Kuidas hindad oma enesetunnet sel nädalal (nt motivatsioon, stressitase)?**

4 (Väga kõrge / positiivne pool) - Docker ja CI/CD teemad olid huvitavad ja motiveerivad.

**7. Kuidas hindad tiimikoostööd sel nädalal?**

4 (Tiimitöö sujus hästi pool) - Koostöö sujub, DevOps ülesanded on jaotatud.

**8. Kuidas hindad oma panust projekti sel nädalal?**

4 (Panustasin aktiivselt pool) - Infrastruktuuri ja deployment'i seadistamine on kriitiline osa projektist.

**9. Kuidas hindad mentori abi ja juhendamist?**

4 (Väga kasulik pool) - Mentor on andnud kasulikku tagasisidet deployment'i strateegia kohta.

**10. Mis mentori tegevustest aitas Sind kõige rohkem ja mis vajaks parandamist või selgemat juhendamist?**

Mentori juhendamine Docker best practices'i ja CI/CD pipeline'i struktuuri osas oli väga kasulik. Edaspidi oleks kasulik rohkem juhendamist pilveinfrastruktuuri (AWS) seadistamise ja turvalisuse osas.

**11. Kinnitan, et kohtusin sel nädalal oma mentoriga.**

Jah

**12. Muud küsimused ja kommentaarid**

Docker ja CI/CD nädal oli väga praktiline. Automatiseeritud deployment pipeline annab meeskonnale palju aega juurde ja vähendab inimlike vigade riski. Börsibaari puhul on eriti oluline, et OAuth2 flow töötab korrektselt läbi NGINX reverse proxy.

---

Lugupidamisega,
Kristjan Akkermann
Meeskond 36
