insert into public.organizations (id, name, slug, website_url, locale, timezone, is_demo, brand_config)
values ('11111111-1111-4111-8111-111111111111', 'GeoLia — démonstration', 'geolia-demo', null, 'fr', 'Europe/Brussels', true, '{"accent":"violet"}'::jsonb);

insert into public.business_profiles (organization_id, description, industries, target_customers, service_areas, disqualifiers, status)
values (
  '11111111-1111-4111-8111-111111111111',
  'Cabinet de géomètre-expert fictif utilisé pour la démonstration de Relay. Bornage, relevés topographiques, divisions, implantations et expertises.',
  array['Architectes et géomètres'],
  array['Propriétaires particuliers','Promoteurs','Architectes'],
  array['Waterloo','Braine-l’Alleud','Nivelles','Bruxelles','Brabant wallon'],
  '[{"id":"not_a_service","label":"Demande hors métier"}]'::jsonb,
  'ready'
);

insert into public.services (organization_id, name, description) values
 ('11111111-1111-4111-8111-111111111111','Bornage','Fixation officielle des limites de propriété.'),
 ('11111111-1111-4111-8111-111111111111','Relevé topographique','Relevé de terrain et plan coté.'),
 ('11111111-1111-4111-8111-111111111111','Division','Division parcellaire et lotissement.'),
 ('11111111-1111-4111-8111-111111111111','Implantation','Implantation de construction sur terrain.'),
 ('11111111-1111-4111-8111-111111111111','Expertise','Expertise technique et litiges de limites.');

insert into public.experiences (id, organization_id, name, slug, goal, status, branding)
values (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Demande de service GeoLia',
  'geolia-demo',
  'Structurer une demande de service en géomètre-expert.',
  'published',
  '{"displayName":"GeoLia — démonstration"}'::jsonb
);

insert into public.experience_versions (id, organization_id, experience_id, version_number, definition, qualification_rules, published_at)
values (
  '33333333-3333-4333-8333-333333333333',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  1,
  '{"schemaVersion":1,"goal":"Structurer une demande de service en géomètre-expert.","phases":[{"key":"besoin","label":"Votre besoin"},{"key":"projet","label":"Votre projet"},{"key":"details","label":"Derniers détails"},{"key":"contact","label":"Coordonnées"}],"fields":[{"key":"service","label":"Service souhaité","type":"choice","required":true,"sensitive":false,"inferable":true,"phase":"besoin","weight":5,"choices":[{"value":"Bornage","label":"Bornage"},{"value":"Relevé topographique","label":"Relevé topographique"},{"value":"Division","label":"Division"},{"value":"Implantation","label":"Implantation"},{"value":"Expertise","label":"Expertise"},{"value":"Je ne sais pas","label":"Je ne sais pas"}]},{"key":"location","label":"Localisation du projet","type":"address","required":true,"sensitive":false,"inferable":true,"phase":"projet","weight":4},{"key":"project_reason","label":"Objectif du projet","type":"text","required":true,"sensitive":false,"inferable":true,"phase":"projet","weight":3},{"key":"timeline","label":"Échéance","type":"choice","required":true,"sensitive":false,"inferable":true,"phase":"details","weight":3,"choices":[{"value":"Dès que possible","label":"Dès que possible"},{"value":"Ce mois-ci","label":"Ce mois-ci"},{"value":"Le mois prochain","label":"Le mois prochain"},{"value":"Dans 2 à 3 mois","label":"Dans 2 à 3 mois"},{"value":"Plus tard / à définir","label":"Plus tard, à définir"}]},{"key":"email","label":"Adresse e-mail","type":"email","required":true,"sensitive":true,"inferable":false,"phase":"contact","weight":5},{"key":"contact_name","label":"Nom","type":"text","required":false,"sensitive":true,"inferable":false,"phase":"contact","weight":2},{"key":"phone","label":"Téléphone","type":"phone","required":false,"sensitive":true,"inferable":false,"phase":"contact","weight":2},{"key":"documents_available","label":"Documents disponibles","type":"choice","required":false,"sensitive":false,"inferable":true,"phase":"details","weight":1,"choices":[{"value":"Oui","label":"Oui"},{"value":"Non","label":"Non"},{"value":"Je ne sais pas","label":"Je ne sais pas"}]}],"questions":[{"key":"q_need","phase":"besoin","targets":["service","location","project_reason","timeline"],"question":"De quoi avez-vous besoin ?","placeholder":"Expliquez votre situation avec vos propres mots…","input":"longtext","friction":2,"opening":true},{"key":"q_service","phase":"besoin","targets":["service"],"question":"Quel type de service semble correspondre ?","reason":"Cela oriente votre demande vers la bonne compétence.","input":"choice","choices":[{"value":"Bornage","label":"Bornage"},{"value":"Relevé topographique","label":"Relevé topographique"},{"value":"Division","label":"Division"},{"value":"Implantation","label":"Implantation"},{"value":"Expertise","label":"Expertise"},{"value":"Je ne sais pas","label":"Je ne sais pas"}],"friction":1},{"key":"q_location","phase":"projet","targets":["location"],"question":"Où se situe le projet ?","reason":"L’adresse détermine la faisabilité et le déplacement.","placeholder":"Rue, numéro et commune","input":"address","friction":1},{"key":"q_reason","phase":"projet","targets":["project_reason"],"question":"Qu’aimeriez-vous réaliser ou sécuriser ?","placeholder":"Par exemple : poser une clôture, vendre, construire…","input":"text","friction":2},{"key":"q_timeline","phase":"details","targets":["timeline"],"question":"Quand souhaitez-vous avancer ?","input":"choice","choices":[{"value":"Dès que possible","label":"Dès que possible"},{"value":"Ce mois-ci","label":"Ce mois-ci"},{"value":"Le mois prochain","label":"Le mois prochain"},{"value":"Dans 2 à 3 mois","label":"Dans 2 à 3 mois"},{"value":"Plus tard / à définir","label":"Plus tard, à définir"}],"friction":1},{"key":"q_email","phase":"contact","targets":["email"],"question":"À quelle adresse e-mail pouvons-nous transmettre la suite ?","reason":"C’est la seule façon de vous répondre.","placeholder":"vous@exemple.be","input":"email","friction":1}],"completionThreshold":1,"minimumContactFields":["email"],"maxQuestions":8,"maxClarifications":2,"intro":{"title":"Commençons simplement.","prompt":"De quoi avez-vous besoin ?","placeholder":"Expliquez votre situation avec vos propres mots…"},"completion":{"title":"Votre demande est prête.","body":"Elle a bien été transmise avec les informations affichées dans le récapitulatif."},"consentLabel":"J’accepte que ces informations soient transmises à l’entreprise afin de traiter ma demande."}'::jsonb,
  '{"ruleVersion":1,"weights":{"fit":0.35,"intent":0.3,"urgency":0.15,"completeness":0.2},"supportedServices":["Bornage","Relevé topographique","Division","Implantation","Expertise"],"serviceAreas":["Waterloo","Braine-l’Alleud","Nivelles","Bruxelles","Brabant wallon"],"urgentTimelines":["Dès que possible","Ce mois-ci","Le mois prochain"],"disqualifiers":[{"id":"not_a_service","label":"Demande hors métier","fieldKey":"service","values":["déménagement","plomberie","informatique"]}],"thresholds":{"highPriority":80,"standard":55,"minCompleteness":60}}'::jsonb,
  now()
);

update public.experiences set active_version_id = '33333333-3333-4333-8333-333333333333'
where id = '22222222-2222-4222-8222-222222222222';