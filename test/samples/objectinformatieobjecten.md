
Voorbeeld van response uit ZGW GET /objectinformatieobjecten 
```json
[
  {
    "url": "http://zaken/zaakid",
    "informatieobject": "https://documenten-api.vng.cloud/api/v1/enkelvoudiginformatieobjecten/{uuid}", 
    "object": "http://example.com",
    "objectType": "besluit", 
    "_expand": {
      "informatieobject.titel": ""
    }
  }
]
```

- `url`: URL-referentie naar het gerelateerde OBJECT (in deze of een andere API), open zaak url volgens zaken-api standaard
- `object`: zelfde als URL
- `informatieobject`: URL-referentie naar het INFORMATIEOBJECT, download url van document volgens documente-api standaard
- `objectType`: Enum van "besluit" "zaak" "verzoek"



Voorbeeld van een document uit de zaak dms geefLijstZaakdocumenten:
```xml
<zkn:heeftRelevant stuf:entiteittype="ZAKEDC">r
  <zkn:gerelateerde stuf:entiteittype="EDC">
    <zkn:identificatie stuf:exact="true">ad20701c-cc99-4597-a976-7c707105d9ab</zkn:identificatie>
    <zkn:dct.omschrijving stuf:exact="true">Verdaging</zkn:dct.omschrijving>
    <zkn:creatiedatum stuf:exact="true" stuf:indOnvolledigeDatum="V">20230928</zkn:creatiedatum>
    <zkn:titel stuf:exact="true">test d nummer 3</zkn:titel>
    <zkn:formaat stuf:exact="true">.txt</zkn:formaat>
    <zkn:vertrouwelijkAanduiding stuf:exact="true">ZAAKVERTROUWELIJK</zkn:vertrouwelijkAanduiding>
    <zkn:auteur stuf:exact="true">CORSA</zkn:auteur>
  </zkn:gerelateerde>
  <zkn:titel stuf:exact="true">test d nummer 3</zkn:titel>
</zkn:heeftRelevant>
```
