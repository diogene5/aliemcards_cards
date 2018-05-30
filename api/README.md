# ALIEM Cards API

Node app to build an API. All of the JSON files that make up the API are static and served via GitHub Pages. The JSON files are built by the scripts in the `build` directory. JSON files acting as api endpoints are found in the `dist` directory.

The API also uses an AWS Lambda to handle search. This script is located in the `lambda` directory. AWS provisioning is handled using the [Serverless framework](https://serverless.com/).

## API GitHub Pages Endpoints

### Base URL: https://aliemteam.github.io/aliemcards_cards/

## API Search Endpoint

### GET - https://mexv6u9ex2.execute-api.us-east-1.amazonaws.com/dev/search/:query

Replace `:query` with a URL encoded search term/phrase. Returns JSON response:

```
{
  "message": "Search complete.",
  "cards": [
    {
      "slug": "dental-trauma",
      "title": "Dental Trauma",
      "authors": [
        "Hans Rosenberg, MD"
      ],
      "created": "2011/04/15",
      "updates": null,
      "categories": [
        "ENT"
      ],
      "body": "\n\n\n**DENTITION**\n\n- 32 teeth (each quadrant: 2 incisors, 1 canine, 2 premolars, 3 molars)\n- Numbering: 1 to 32 starting in R maxilla and ending in R mandible\n\n## Tooth Anatomy\n\n- _Pulp_: Central portion, neurovascular supply\n- _Dentin_: Surrounds pulp, majority of tooth\n- _Enamel_: White visible portion of tooth\n- _Periodontium_: Attachment apparatus (gingiva, periodontal ligament, alveolar bone)\n\n## General Approach to Dental Trauma\n\n**Airway:** \n\n- Assess risk of aspiration\n- If loose/displaced tooth, do not manipulate the tooth\n\n**Hemorrhage control:** \n\n- Apply gauze and direct pressure\n\n**Avulsed tooth**\n1.  Handle by crown only to avoid damage of periodontal ligament.\n2.  Gently rise tooth with saline, but do not wipe root and ligament.\n3.  Replace tooth and ask patient to bite on gauze (if not at aspiration risk)\n4.  If unable to place in transport medium: Hank's balance solution, saline, milk\n\n**Identify all fracture fragments:** \n\n- May have been aspirated, lodged in mucosal tissue, intruded into alveolar bone\n\n**Consider radiographs:** CXR and panorex\n\n**Medications:**\n\n- Complicated fractures/avulsions may require Td and antibiotics (**<span drug=\"class\">penicillin V</span>**, **<span drug=\"class\">clindamycin</span>**)\n\nProcedural videos from [thedentalbox.com](http://thedentalbox.com/videos.html)\n\n## Fractures\n\n**Ellis Class I**\n\n- Through enamel\n- Pulp necrosis risk = 0-3%\n- Treatment: Smooth sharp edges with emery board if causing pain \n- F/U with dentist PRN\n\n**Ellis Class II**\n\n- Through enamel and dentin (yellow/pink appearance) \n- Pulp necrosis risk = 1-7%\n- Painful and temperature sensitive\n- Treatment:  \n- Cover tooth with CaOH (eg. Dycal®) after drying tooth with gauze \n- Soft food diet\n- F/U with dentist 24-48 hrs\n\n**Ellis Class III** \n\n- Involving pulp (pink appearance, blood often visible) \n- Pulp necrosis risk = 10-30%\n- Severe pain, temperature sensitive\n- Treatment: Dental emergency - contact on call dentist (If not immediatelyavailable, same treatment as Ellis II except liquid diet)\n\n**Alveolar Fracture**\n\n- Fx of underlying alveolar bone with tooth involvement\n- Associated with high impact trauma\n- Emergency Department goal: Diagnose and preserve tissue, repair mucosal tissue \n- Treatment: Dental emergency - contact on call dentist/oral surgeon \n\n## Avulsion\n\nTooth is complete displaced from periodontal ligament\nTreatment: Dental emergency - contact on call dentist\nIf PRIMAY DENTITION, do not replace because of risk of ankylosis. F/U with dentist in 1-2 weeks.\nIf ADULT DENTITION, \"time is tooth\" - Periodontal ligament necrosis in 60-90 minutes if not in transport medium, loss of viability\n\n- Suction socket with Frasier tip suction\n- Irrigate with saline\n- Implant tooth using firm pressure\n- Apply splint (eg. Coe-Pak): Apply as a bridge to teeth and gingiva\n\n## References\n\n- Benko, K. Acute Dental Emergencies in EM. EM Practice. 2003, 5(5) [[Source](http://www.ebmedicine.net/topics.php?paction=showTopicSeg&topic_id=32&seg_id=566)]\n"
    },
    {
      "slug": "dental-infections",
      "title": "Dental Infections",
      "authors": [
        "Hans Rosenberg, MD"
      ],
      "created": "2011/04/22",
      "updates": null,
      "categories": [
        "ENT"
      ],
      "body": "\n\n\n- **Dental caries** - demineralization of protective enamel and subsequent tooth decay\n- **Pulpitis** - inflammation of pulp secondary to caries\n- **Periodontitis** - loss of supportive bone structure caused by chronic gingivitis\n\n![Cellulitis, necrotic pulp, and periapical abscess diagram](https://raw.githubusercontent.com/aliemteam/aliemcards_cards/master/cards/dental-infections/image-1.png)\n\n![Impaction of food and bacteria diagram](https://raw.githubusercontent.com/aliemteam/aliemcards_cards/master/cards/dental-infections/image-2.png)\n\n## Periapical Abscess\n\nCollection of purulent material at apex of tooth\n\n- Secondary to bacterial invasion from carious destruction of enamel\n- History: Progressive pain, thermal sensitivity\n- Exam: Caries, decayed tooth, pain with percussion, palpation of apex, gingival swelling, erythema, parulis present, mobile tooth\n- Treatment:\n\n- Antibiotics\n\n  - Uncomplicated: <span class=\"drug\">Penicillin</span> or <span class=\"drug\">Clindamycin</span>\n  - Complicated: <span class=\"drug\">Penicillin</span> + <span class=\"drug\">Metronidazole</span>, Piperacillin/Tazobactam, **or** <span class=\"drug\">Clindamycin</span> + <span class=\"drug\">Ceftriaxone</span>\n\n- Pain control\n- I+D if abscess present: probe with 18g needle → purulent → 11 blade stab incision → hemostat blunt dissection +/- packing\n- <span class=\"drug\">Chlorhexidine</span> 0.1% rinses q2-3h if I & D\n- Surgical referral, if complicated infection (Ludwig's, Lemierre's Syndrome)\n\n- Dentist followup:\n\n- Uncomplicated: Generalist in 1-2 days\n- Complicated: Oral Surgery as soon as possible\n\n## Periodontal Abscess\n\n- Localized purulent infection within the gingival wall of the periodontal pocket\n- History: Swelling, pain, loose tooth\n- Exam: Purulent discharge, erythema, fluctuant mass, dental extrusion\n- Treatment:\n\n- Pain Control: Dental block, NSAID’s +/- opioids\n- I & D abscess as needed: 11 blade stab incision → hemostat blunt dissection +/- packing\n- Antibiotics:\n\n  - <span class=\"drug\">Penicillin</span> or <span class=\"drug\">Clindamycin</span>\n  - <span class=\"drug\">Chlorhexidine</span> 0.1% rinses q2-3h\n\n- Dentist followup\n- Generalist in 1-2 days\n\n## Pericoronitis\n\n- Inflammation +/- infection surrounding impacted or partially erupted tooth\n- History: Usually 3rd molar (wisdom tooth), erupting teeth, pain, swelling, halitosis\n- Exam: Erythema, swelling, +/- abscess\n- Treatment: Same as for Periodontal Abscess\n\n  - Pain Control: Dental block, NSAID’s +/- opioids\n  - I & D abscess as needed: 11 blade stab incision → hemostat blunt dissection +/- packing\n  - Antibiotics:\n\n    - <span class=\"drug\">Penicillin</span> or <span class=\"drug\">Clindamycin</span>\n    - <span class=\"drug\">Chlorhexidine</span> 0.1% rinses q2-3h\n\n- Dentist followup: \n- Generalist in 1-2 days\n\n- Definitive treatment: Oral Surgery\n\n## References\n\n- Nguyen DH, Martin JT. Common dental infections in the primary care setting. Am Fam Physician. 2008 Mar 15;77(6):797-802. [[PubMed](https://www.ncbi.nlm.nih.gov/pubmed/?term=18386594)]\n"
    }
  ]
}
```

