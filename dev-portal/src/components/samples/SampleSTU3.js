const SampleSTU3 =
  '{\n' +
  '    "resourceType": "Patient",\n' +
  '    "id": "hhPTufqen3Qp-997382",\n' +
  '    "meta": {\n' +
  '        "versionId": "1",\n' +
  '        "lastUpdated": "2019-01-31T14:48:33+00:00"\n' +
  '    },\n' +
  '    "text": {\n' +
  '        "status": "generated",\n' +
  '        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><table><tbody><tr><td>Name</td><td>Peter James <b>Chalmers</b> (&quot;Jim&quot;)</td></tr><tr><td>Address</td><td>534 Erewhon, Pleasantville, Vic, 3999</td></tr><tr><td>Contacts</td><td>Home: unknown. Work: (03) 5555 6473</td></tr><tr><td>Id</td><td>MRN: 12345 (Acme Healthcare)</td></tr></tbody></table>    </div>"\n' +
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
  '            "value": "hhPTufqen3Qp997382",\n' +
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
  '            "family": "Smith",\n' +
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
  '                "255 Somewhere Rd"\n' +
  '            ],\n' +
  '            "city": "Pleasant Valley",\n' +
  '            "state": "Somewhere",\n' +
  '            "postalCode": "3999"\n' +
  '        }\n' +
  '    ],\n' +
  '    "contact": [\n' +
  '        {\n' +
  '            "relationship": [\n' +
  '                {\n' +
  '                    "coding": [\n' +
  '                        {\n' +
  '                            "system": "http://hl7.org/fhir/v2/0131",\n' +
  '                            "code": "CP"\n' +
  '                        }\n' +
  '                    ]\n' +
  '                }\n' +
  '            ],\n' +
  '            "name": {\n' +
  '                "family": "Smith",\n' +
  '                "given": [\n' +
  '                    "Jane"\n' +
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
  '        "reference": "Organization/hhPTufqen3Qp-997382-RZq1u"\n' +
  '    }\n' +
  '}'

module.exports = SampleSTU3
