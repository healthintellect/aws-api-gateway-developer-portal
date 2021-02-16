import React from 'react'
import { Helmet } from 'react-helmet'

import { Message, Segment } from 'semantic-ui-react'

const Hipaa = () => (
  <div>
    <Helmet>
      <title>HIPAA</title>
      <meta
        name="description"
        content="HIPAA BAA for clients accessing HL7.cc tools"
      />
    </Helmet>
    <Segment>
      <div>
        <h1>
          HIPAA Terms and Conditions
        </h1>
        <Message gutterBottom>
            These HIPAA Terms and Conditions (“HIPAA Terms and Conditions”) are
            Additional Terms and Conditions, as defined in the Master Services
            Agreement (“Agreement”) between you (“you” or “Customer”), and
            Health Intellect LLC, dba HL7.cc (“HL7.cc”), and form part of the
            Agreement. These HIPAA Terms and Conditions set forth your and
            HL7.cc’s individual responsibilities under: (i) the Health Insurance
            Portability and Accountability Act of 1996 (Public Law 104-191[H.R.
            3103]) and its associated regulations, (ii) the Health Information
            Technology for Economic and Clinical Health Act of 2009 (HITECH
            Act); and (iii) the final rule (Omnibus Rule), and any amendments to
            each that may be made from time to time (collectively, “HIPAA”).
            These HIPAA Terms and Conditions shall only apply to you to the
            extent that HL7.cc’s provision of Services means HL7.cc is
            determined to be a Business Associate, as defined in HIPAA.
        </Message>
        <Message gutterBottom>
          <strong>1. DEFINITIONS</strong>
          <br />
            1.1. Definitions in HIPAA: In these HIPAA Terms and Conditions, the
            following terms shall have the same meaning as the following terms
            in HIPAA: Breach, Data Aggregation, Designated Record Set,
            Disclosure, Health Care Operations, Individual, Minimum Necessary,
            Notice of Privacy Practices, Protected Health Information, Required
            By Law, Secretary, Security Incident, Subcontractor, Unsecured
            Protected Health Information, and Use.
          <br />
            1.2. Specific definitions: In these HIPAA Terms and Conditions, the
            following terms shall have the following meanings:
          <br />
            (a) “Business Associate” shall generally have the same meaning as
            the term “Business Associate” at 45 CFR 160.103, and in reference to
            these BAA Terms and Conditions, shall mean HL7.cc.
          <br />
            (b) “Covered Entity” shall generally have the same meaning as the
            term “covered entity” at 45 CFR 160.103, and in reference to the
            party to this agreement, shall mean you, or Customer.
          <br />
            1.3. Definitions in Agreement: Any defined terms used in these HIPAA
            Terms and Conditions that are not specifically defined herein shall
            have the defined meanings given to them in the Agreement.
        </Message>
        <Message gutterBottom>
          <strong>
              2. PERMITTED USES AND DISCLOSURES BY BUSINESS ASSOCIATE
          </strong>
          <br />
            2.1. Business Associate may only use or disclose Protected Health
            Information as necessary to perform the Services set forth in the
            Agreement.
          <br />
            2.2. Business Associate may use or disclose Protected Health
            Information as Required By Law.
          <br />
            2.3. Business Associate may not use or disclose Protected Health
            Information in a manner that would violate Subpart E of 45 CFR Part
            164 if done by Covered Entity.
        </Message>
        <Message gutterBottom>
          <strong>3. OBLIGATIONS OF BUSINESS ASSOCIATE</strong>
          <br />
            HL7.cc in its capacity as Business Associate agrees:
          <br />
            3.1. not to use or disclose Protected Health Information other than
            as permitted or required by the Agreement or as Required By Law;
          <br />
            3.2. to use appropriate safeguards, and to comply with Subpart C of
            45 CFR Part 164 with respect to electronic Protected Health
            Information to prevent Use or Disclosure of Protected Health
            Information other than as provided for by the Agreement or as
            Required By Law;
          <br />
            3.3. to notify Covered Entity of any Use or Disclosure of Protected
            Health Information not provided for in the Agreement of which it
            becomes aware, including Breaches of Unsecured Protected Health
            Information as required at 45 CFR 164.410 and any Security Incident
            of which it becomes aware, as soon as possible after discovery of
            such violation;
          <br />
            3.4. to fully cooperate, coordinate with and assist Covered Entity
            in gathering the information necessary to notify affected
            individuals, if any;
          <br />
            3.5. in accordance with 45 CFR 164.502(e)(1)(ii) and 164.308(b)(2),
            if applicable, to ensure that any Subcontractors that create,
            receive, maintain, or transmit Protected Health Information during
            the course of providing Services to Covered Entity on behalf of
            Business Associate to the same restrictions, conditions, and
            requirements that apply to Business Associate with respect to such
            information;
          <br />
            3.6. to make available Protected Health Information in a Designated
            Record Set to Covered Entity as necessary to satisfy its obligations
            under 45 CFR 164.524;
          <br />
            3.7. in the event Covered Entity or any requests access to Protected
            Health Information contained in a Designated Record Set directly
            from the Business Associate, to forward such request to Covered
            Entity in a timely manner allowing Covered Entity to respond to the
            Individual in accordance with 45 CFR 45 164.526;
          <br />
            3.8. to make any amendment(s) to Protected Health Information in a
            Designated Record Set as directed or agreed to by the Covered Entity
            pursuant to 45 CFR 164.526, or take other measures as necessary to
            satisfy Covered Entity’s obligations under 45 CFR 164.526;
          <br />
            3.9. to maintain and make available the information required to
            provide an accounting of Disclosures to the Covered Entity as
            necessary to satisfy Covered Entity’s obligations under 45 CFR
            164.528;
          <br />
            3.10. to the extent the Business Associate is to carry out one or
            more of Covered Entity&#8217;s obligation(s) under Subpart E of 45
            CFR Part 164, comply with the requirements of Subpart E that apply
            to the Covered Entity in the performance of such obligation(s); and
          <br />
            3.11. to make its internal practices, books, and records available
            to the Secretary of Health and Human Services for purposes of
            determining compliance with HIPAA.
        </Message>
        <Message gutterBottom>
          <strong>4. COVERED ENTITY’S OBLIGATIONS</strong>
          <br />
            4.1. Covered Entity shall not request Business Associate to use or
            disclose Protected Health Information in any manner that would not
            be permissible under HIPAA if done by the Covered Entity or that is
            not otherwise expressly permitted under the Agreement.
          <br />
            4.2. Covered Entity shall not request Business Associate to use or
            disclose Protected Health Information in any manner that would not
            be permissible under Subpart E of 45 CFR Part 164 if done by Covered
            Entity.
        </Message>
        <Message gutterBottom>
          <strong>5. TERM AND TERMINATION</strong>
          <br />
            5.1. These HIPAA Terms and Conditions shall continue to be in force
            for the term of the Agreement to which they are incorporated by
            reference.
          <br />
            5.2. Upon termination of the Agreement for any reason, Business
            Associate shall destroy all Protected Health Information received
            from Covered Entity, or created, maintained, or received by Business
            Associate on behalf of Covered Entity that the Business Associate
            still maintains in any form. Business Associate shall retain no
            copies of the Protected Health Information.
          <br />
            5.3. The obligations of Covered Entity and Business Associate under
            these HIPAA Terms and Conditions shall survive the termination of
            this Agreement.
        </Message>
      </div>
    </Segment>
  </div>
)

export default Hipaa
