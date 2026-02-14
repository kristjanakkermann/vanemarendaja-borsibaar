# Nädal 3 - Standup Tagasiside (Meeskond 36 - Börsibaar)

**Kristjan Akkermann**

---

## E-kiri

**Saaja:** vanemarendajaks@taltech.ee
**Teema:** Nädal 3 standup tagasiside - Kristjan Akkermann (Meeskond 36)

Tere,

Kahjuks jäi mul 3. nädala tagasiside vorm täitmata enne sulgemist. Palun kas oleks võimalik vorm uuesti avada või aktsepteerida minu vastuseid e-kirja teel?

Allpool on minu vastused kõigile 12 küsimusele:

---

**1. Mida Sa eelmisel nädalal tegid ja mis oli selle tegevuse mõju (tiimile, projektile või õppimisele)?**

Koostasin Börsibaari projekti testplaani dokumendi, mis määratleb testimise eesmärgid, testimistasandid (unit, integratsiooni, süsteemitestid), testimise ulatuse ja lähenemise. Kirjutasin backend unit-teste teenuste kihi jaoks (Mockito abil) ja integratsiooni teste kontrollerite jaoks (MockMvc + @SpringBootTest). Kokku loodi 18 testifaili, mis katavad kõiki teenuseid ja kontrollereid. Lisaks seadistasin frontendi testimise raamistiku (Jest + React Testing Library) ja kirjutasin esimesed komponenditestid. Mõju projektile: koodibaasi kvaliteet ja usaldusväärsus paranes oluliselt ning meeskonnal on nüüd selge testimisraamistik nii backendi kui frontendi jaoks.

**2. Mida plaanid sel nädalal teha ja mida Sa sellega saavutada tahad?**

Plaanin seadistada Dockeri konteineriseerimise tootmiskeskkonna jaoks (multi-stage builds), luua docker-compose.prod.yml konfiguratsiooni NGINX reverse proxy-ga ning seadistada CI/CD pipeline'i GitHub Actions abil. Eesmärk on automatiseerida ehitamise, testimise ja deploy protsess, et iga commit oleks automaatselt testitud ja deploymentvalmis.

**3. Millised takistused või väljakutsed on Sul tekkinud ja kuidas need on mõjutanud Sinu edasiliikumist kursusel?**

Peamine väljakutse oli OAuth2 autentimise testimine - SecurityContext'i mockimine ja JWT tokenite käsitlemine testides nõudis põhjalikku uurimist. Samuti oli keeruline tagada testide isolatsioon, et ühe testi olek ei mõjutaks teist. H2 in-memory andmebaasi seadistamine testide jaoks (vs PostgreSQL tootmises) vajas täiendavat konfiguratsiooni. Need väljakutsed aeglustasid edasiliikumist mõnevõrra, kuid lõpptulemus on tugevam testimisbaas.

**4. Mis oli eelmisel nädalal üks otsus või tegevus, mida teeksid nüüd teisiti?**

Oleksin pidanud varem alustama TDD (Test-Driven Development) lähenemisega, mitte kirjutama teste tagantjärele. Testplaani koostamine enne koodi kirjutamist oleks aidanud testimise ulatust algusest peale selgemaks muuta.

**5. Mida Sa eelmisel nädalal õppisid, mida saad edaspidi teadlikult rakendada?**

Õppisin, kuidas efektiivselt kasutada Mockito't teenuste isoleeritud testimiseks ja MockMvc'd kontrollerite integratsiooni testimiseks ilma täieliku serveri käivitamiseta. Samuti sain aru, kui oluline on testide struktureerimine (Arrange-Act-Assert muster) ja kuidas Spring Security teste korrektselt mockida. Seda saan rakendada kõigis tulevastes Java projektides.

**6. Kuidas hindad oma enesetunnet sel nädalal (nt motivatsioon, stressitase)?**

4 (Väga kõrge / positiivne pool) - Motivatsioon on kõrge, testimise teemad olid huvitavad.

**7. Kuidas hindad tiimikoostööd sel nädalal?**

4 (Tiimitöö sujus hästi pool) - Ülesanded on selgelt jaotatud, koostöö sujub.

**8. Kuidas hindad oma panust projekti sel nädalal?**

4 (Panustasin aktiivselt pool) - Andsin olulise panuse testimise infrastruktuuri loomises.

**9. Kuidas hindad mentori abi ja juhendamist?**

4 (Väga kasulik pool) - Mentor on olnud toetav ja andnud kasulikku tagasisidet.

**10. Mis mentori tegevustest aitas Sind kõige rohkem ja mis vajaks parandamist või selgemat juhendamist?**

Kõige rohkem aitasid mentori soovitused testimise parimate praktikate kohta ja konkreetne tagasiside koodi kvaliteedi osas. Edaspidi oleks kasulik rohkem näiteid reaalsete projektide teststrateegiatest.

**11. Kinnitan, et kohtusin sel nädalal oma mentoriga.**

Jah

**12. Muud küsimused ja kommentaarid**

Testimise nädal oli väga kasulik - sundis mõtlema koodi kvaliteedile ja hooldatavusele. Börsibaari projekt on hea näide, kuidas testimine aitab keerukat äriloogikat (inventory management, dynamic pricing) kindlamaks muuta.

---

Lugupidamisega,
Kristjan Akkermann
Meeskond 36
