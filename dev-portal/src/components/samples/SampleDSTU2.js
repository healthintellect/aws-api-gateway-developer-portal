const SampleDSTU2 =
  '{\n' +
  '    "resourceType": "Patient",\n' +
  '    "id": "12345997382",\n' +
  '    "meta": {\n' +
  '        "versionId": "1",\n' +
  '        "lastUpdated": "2019-01-31T14:56:21+00:00"\n' +
  '    },\n' +
  '    "text": {\n' +
  '        "status": "generated",\n' +
  '        "div": "<div><table><tbody><tr><td>Name</td><td>Peter James <b>Chalmers</b></td></tr><tr><td>Address</td><td>534 Erewhon, Pleasantville, Vic, 3999</td></tr><tr><td>Contacts</td><td>Home: unknown. Work: (03) 5555 6473</td></tr><tr><td>Id</td><td>MRN: 12345 (Acme Healthcare)</td></tr></tbody></table>    </div>"\n' +
  '    },\n' +
  '    "identifier": [\n' +
  '        {\n' +
  '            "use": "usual",\n' +
  '            "type": {\n' +
  '                "coding": [\n' +
  '                    {\n' +
  '                        "system": "http://hl7.org/fhir/v2/0203",\n' +
  '                        "code": "MR"\n' +
  '                    }\n' +
  '                ]\n' +
  '            },\n' +
  '            "system": "urn:oid:1.2.36.146.595.217.0.1",\n' +
  '            "value": "12345997382",\n' +
  '            "period": {\n' +
  '                "start": "2001-05-06"\n' +
  '            },\n' +
  '            "assigner": {\n' +
  '                "display": "Acme Healthcare"\n' +
  '            }\n' +
  '        }\n' +
  '    ],\n' +
  '    "active": true,\n' +
  '    "name": [\n' +
  '        {\n' +
  '            "use": "official",\n' +
  '            "family": [\n' +
  '                "Chalmers"\n' +
  '            ],\n' +
  '            "given": [\n' +
  '                "Peter",\n' +
  '                "James"\n' +
  '            ]\n' +
  '        }\n' +
  '    ],\n' +
  '    "telecom": [\n' +
  '        {\n' +
  '            "use": "home"\n' +
  '        },\n' +
  '        {\n' +
  '            "system": "phone",\n' +
  '            "value": "(07) 7296 7296",\n' +
  '            "use": "work"\n' +
  '        }\n' +
  '    ],\n' +
  '    "gender": "male",\n' +
  '    "birthDate": "1974-12-25",\n' +
  '    "deceasedBoolean": false,\n' +
  '    "address": [\n' +
  '        {\n' +
  '            "use": "home",\n' +
  '            "line": [\n' +
  '                "255 Erewhon St"\n' +
  '            ],\n' +
  '            "city": "PleasantVille",\n' +
  '            "state": "Vic",\n' +
  '            "postalCode": "3999"\n' +
  '        }\n' +
  '    ],\n' +
  '    "contact": [\n' +
  '        {\n' +
  '            "relationship": [\n' +
  '                {\n' +
  '                    "coding": [\n' +
  '                        {\n' +
  '                            "system": "http://hl7.org/fhir/patient-contact-relationship",\n' +
  '                            "code": "partner"\n' +
  '                        }\n' +
  '                    ]\n' +
  '                }\n' +
  '            ],\n' +
  '            "name": {\n' +
  '                "family": [\n' +
  '                    "du",\n' +
  '                    "Marché"\n' +
  '                ],\n' +
  '                "given": [\n' +
  '                    "Bénédicte"\n' +
  '                ]\n' +
  '            },\n' +
  '            "telecom": [\n' +
  '                {\n' +
  '                    "system": "phone",\n' +
  '                    "value": "+33 (237) 123456"\n' +
  '                }\n' +
  '            ],\n' +
  '            "gender": "female",\n' +
  '            "period": {\n' +
  '                "start": "2012"\n' +
  '            }\n' +
  '        }\n' +
  '    ],\n' +
  '    "managingOrganization": {\n' +
  '        "reference": "Organization/1"\n' +
  '    }\n' +
  '}'

module.exports = SampleDSTU2
