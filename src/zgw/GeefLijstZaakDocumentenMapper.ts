import { UUID } from 'crypto';
import { EnkelvoudigInformatieObject, EnkelvoudigInformatieObjectSchema } from './EnkelvoudigInformatieObjectSchema';
import { getFileSizeForBase64String } from './utils';
import { ZaakDocument, ZaakDocumenten } from './ZaakDocument';


export class GeefLijstZaakDocumentenMapper {
  map(docs: ZaakDocumenten): UUID[] {
    const results = docs.map((doc: any) => doc['zkn:gerelateerde']['zkn:identificatie'].text);
    return results;
  }
}

export class GeefZaakDocumentMapper {
  map(doc: ZaakDocument): EnkelvoudigInformatieObject {
    const url = `${process.env.APPLICATION_BASE_URL}/enkelvoudiginformatieobjecten/${doc['zkn:identificatie'].text}`;
    const enkelvoudigInformatieObject: EnkelvoudigInformatieObject = {
      url: url,
      auteur: doc['zkn:auteur'].text,
      beginRegistratie: this.mapDate(doc['zkn:creatiedatum'].text),
      link: `${url}/download`,
      bestandsdelen: [{
        url: `${url}/download`,
        lock: 'randomzogenaamdehash', //TODO hash opnemen??
        omvang: getFileSizeForBase64String(doc['zkn:inhoud'].text),
        volgnummer: 1,
        voltooid: true,
      }],
      bronorganisatie: '123456789',
      creatiedatum: this.mapDate(doc['zkn:creatiedatum'].text),
      informatieobjecttype: 'https://example.com', //TODO Catalogus API referentie
      locked: false, //Placeholder
      taal: this.mapLanguage(doc['zkn:taal'].text),
      titel: doc['zkn:titel'].text,
      versie: 1, //Placeholder
      bestandsnaam: doc['zkn:inhoud']['stuf:bestandsnaam'],
      beschrijving: doc['zkn:dct.omschrijving'].text,
    };
    console.debug(enkelvoudigInformatieObject);
    return EnkelvoudigInformatieObjectSchema.parse(enkelvoudigInformatieObject);
  }

  mapLanguage(iso6391: string) {
    if (iso6391 == 'nl') {
      return 'dut';
    } else {
      throw Error('Language not supported');
    };
  }

  mapDate(yyyymmdd: any) {
    const dateString = yyyymmdd.toString();
    const year = Number(dateString.substring(0, 4));
    const month = Number(dateString.substring(4, 6));
    const day = Number(dateString.substring(6, 8));
    const date = new Date(year, month - 1, day);
    return date.toISOString();
  }
}
