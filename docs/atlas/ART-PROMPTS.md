# Atlas — AI Art Prompts for Every Wonder

Goal: one consistent, adorable illustration set. **Consistency beats
quality** — always use the same style block, generate in big batches, and
don't mix styles between rooms.

## The style block (paste before every subject)

> Cute flat vector sticker illustration for a children's museum game:
> **[SUBJECT]**. Soft rounded shapes, thick clean outlines, warm friendly
> colors, gentle soft glow, single centered subject, square composition,
> transparent background, no text, no letters, no watermark.

## Per-tool notes

- **ChatGPT (GPT-Image)** — best option. Ask for "transparent background
  PNG" explicitly (it truly supports transparency). Generate 8–10 per
  conversation and say "same exact style as the previous images" — it keeps
  style well within a session.
- **Gemini / Imagen** — same prompt; transparency support varies, so if
  backgrounds come back solid, use plain white and I'll strip them.
- **Midjourney** — append ` --niji 6 --ar 1:1` (Niji is ideal for this cute
  style). No transparency: change "transparent background" to "plain solid
  white background" and I'll remove it. To keep style locked, reuse
  `--seed <number>` from a result you like, or use `--sref` with your
  favorite image as the style reference.

## Workflow & file naming (important!)

Save each image as `<id>.png` — the id is in brackets below (e.g.
`octopus.png`, `blue-whale.png`). Put them all in one folder and hand the
folder to Claude; the app looks up art by those exact ids
(`public/wonders/<id>.png`), so correct names = zero manual wiring.

Start small: do **Ocean Hall** first (10 images), drop them in, see how it
feels in the app before committing to all 120. Her ⭐ favorites are the
highest-value upgrades after that.

---


## Animal Kingdom

- **Elephant** [`elephant`]: a gentle elephant lifting a peanut with its trunk
- **Cheetah** [`cheetah`]: a sleek cheetah in mid-sprint with speed lines
- **Honeybee** [`honeybee`]: a fuzzy honeybee doing a waggle dance with dotted trail
- **Owl** [`owl`]: a wise owl with huge round eyes, head slightly turned
- **Penguin** [`penguin`]: an emperor penguin dad balancing an egg on his feet
- **Chameleon** [`chameleon`]: a chameleon on a branch shooting its long tongue at a bug
- **Ant** [`ant`]: a strong ant proudly lifting a big green leaf overhead
- **Sloth** [`sloth`]: a smiling sloth hanging from a branch with tiny green algae in fur
- **Hummingbird** [`hummingbird`]: a hummingbird hovering at a red flower, blurred fast wings
- **Wolf** [`wolf`]: a wolf howling on a small hill under a full moon

## Dinosaur Hall

- **Tyrannosaurus Rex** [`trex`]: a friendly T. rex with tiny arms and a big toothy grin
- **Triceratops** [`triceratops`]: a triceratops with three horns and a big neck frill
- **Velociraptor** [`velociraptor`]: a small feathered velociraptor, turkey-sized, colorful feathers
- **Fossils** [`fossils`]: a fossil skeleton and ammonite spiral pressed in stone
- **Brachiosaurus** [`brachiosaurus`]: a tall long-necked brachiosaurus reaching high tree leaves
- **Stegosaurus** [`stegosaurus`]: a stegosaurus with back plates and a spiky tail
- **Pterosaurs** [`pterosaur`]: a flying pterosaur with wide wings soaring past clouds
- **The Great Asteroid** [`asteroid`]: a glowing asteroid streaking toward Earth seen from space
- **Dinosaur Eggs** [`dino-eggs`]: a nest of speckled dinosaur eggs, one cracking with tiny feet
- **Birds ARE Dinosaurs** [`birds-dinos`]: a proud chicken casting a T. rex shadow behind it

## Earth Lab

- **Volcano** [`volcano`]: a cartoon volcano gently erupting orange lava
- **Earthquake** [`earthquake`]: cracked ground with jagged crack lines and small rocks jumping
- **Crystals** [`crystals`]: a cluster of glowing purple and blue crystals
- **Rivers** [`rivers`]: a winding blue river carving through a green canyon valley
- **Mountains** [`mountains`]: a snowy mountain peak with a tiny flag on top
- **Caves** [`caves`]: a cave entrance with stalactites above and stalagmites below, warm torchlight
- **Desert** [`desert`]: golden sand dunes with one green cactus and bright sun
- **Glacier** [`glacier`]: a huge blue-white glacier ice wall by cold water
- **Geyser** [`geyser`]: a geyser shooting a tall spout of white water and steam
- **Soil & Earthworms** [`soil`]: a cross-section of brown soil with a happy pink earthworm tunneling

## Human Body Hall

- **Your Heart** [`heart`]: a strong happy cartoon heart flexing like a muscle
- **Your Brain** [`brain`]: a smiling pink brain with tiny electric spark ideas
- **Bones** [`bones`]: a friendly white bone and a small skeleton hand waving
- **Blood** [`blood`]: cheerful red blood cell characters riding through a tube
- **Your Stomach** [`stomach`]: a happy stomach character digesting with little bubbles
- **Lungs** [`lungs`]: a pair of pink lungs breathing sparkly fresh air
- **Skin** [`skin`]: a hand with a magnifying glass showing tiny skin layers
- **Sneezes** [`sneeze`]: a cartoon face mid-sneeze with 'achoo' motion lines (no text)
- **Sleep & Dreams** [`sleep`]: a cozy sleeping child with crescent moon and Zzz stars above
- **Taste Buds** [`taste`]: a happy tongue with tiny taste bud dots and a strawberry

## Inventors' Workshop

- **The Wheel** [`wheel`]: an ancient wooden cart wheel with spokes
- **Paper** [`paper`]: a rolled paper scroll with gentle curling edges
- **The Telescope** [`telescope`]: a brass telescope on a tripod pointed at stars
- **Steam Trains** [`steam-train`]: a cheerful old steam locomotive puffing round clouds
- **The Lightbulb** [`lightbulb`]: a glowing warm lightbulb with sparkle rays
- **The Telephone** [`telephone`]: an old-fashioned candlestick telephone, friendly style
- **The Airplane** [`airplane`]: the Wright brothers' early wooden biplane in flight
- **Computers** [`computer`]: a cute retro room-sized computer with spinning tape reels
- **Robots** [`robot`]: a friendly boxy robot waving hello
- **Velcro** [`velcro`]: a burr seed sticking to fluffy dog fur, magnified hooks

## Long Ago Hall

- **The Pyramids** [`pyramids`]: the great pyramids of Egypt at golden sunset with a camel
- **Mummies** [`mummies`]: a cute wrapped mummy waving, one bandage loose
- **Knights** [`knights`]: a small knight in shiny armor holding a shield
- **Castles** [`castles`]: a fairytale stone castle with towers and a drawbridge
- **Vikings** [`vikings`]: a viking longship with striped sail on wavy sea
- **Cave Paintings** [`cave-paintings`]: cave wall paintings of horses and small handprints, torchlight
- **The Colosseum** [`colosseum`]: the round Roman Colosseum with arches, warm light
- **The Great Wall** [`great-wall`]: the Great Wall of China winding over green mountains
- **Ancient Ships** [`ancient-ships`]: a Polynesian double canoe sailing under bright stars
- **The First Writing** [`writing`]: an ancient clay tablet with cute simple picture-symbols

## Ocean Hall

- **Octopus** [`octopus`]: a friendly orange octopus with big curious eyes, waving two arms
- **Blue Whale** [`blue-whale`]: a gentle giant blue whale swimming, tiny bubbles
- **Anglerfish** [`anglerfish`]: a round anglerfish in the dark with a glowing yellow lantern lure
- **Coral Reef** [`coral-reef`]: a colorful coral reef with pink and orange corals and a tiny fish
- **Seahorse** [`seahorse`]: a curled orange seahorse with a tiny crown fin
- **Great White Shark** [`great-white`]: a smiling (not scary) great white shark showing friendly teeth
- **Jellyfish** [`jellyfish`]: a pink translucent jellyfish with wavy tentacles and a sweet face
- **The Deep Sea** [`deep-sea`]: a deep dark ocean trench with one tiny glowing lantern fish far below
- **Sea Turtle** [`sea-turtle`]: a green sea turtle gliding through water
- **Dolphin** [`dolphin`]: a happy dolphin leaping with a splash

## Sky Gallery

- **Rain** [`rain`]: a smiling fluffy raincloud with falling blue raindrops
- **Rainbow** [`rainbow`]: a bright arched rainbow between two small clouds
- **Lightning** [`lightning`]: a storm cloud with a bold zigzag yellow lightning bolt
- **Clouds** [`clouds`]: three fluffy cumulus clouds, one wearing a sleepy smile
- **Wind** [`wind`]: a friendly swirl of wind carrying a few leaves
- **Snowflakes** [`snowflake`]: a single detailed six-sided snowflake, icy blue sparkle
- **Hurricane** [`hurricane`]: a swirling spiral storm seen from above with a calm eye in the middle
- **Fog** [`fog`]: a soft misty fog rolling over tiny hills, a beetle on a hill
- **Northern Lights** [`aurora`]: green and purple northern lights ribbons over snowy hills
- **Thunder** [`thunder`]: a dark cloud with sound waves booming out and a small flash

## Space Wing

- **The Sun** [`sun`]: a radiant smiling sun with wavy golden rays
- **The Moon** [`moon`]: a crescent moon with craters and one tiny astronaut bootprint
- **Mars** [`mars`]: the red planet Mars with a cute rover on its surface
- **Saturn** [`saturn`]: planet Saturn with wide sparkly ice rings
- **Stars** [`stars`]: a cluster of twinkling stars of different sizes on deep night blue
- **Black Hole** [`black-hole`]: a swirling black hole with a glowing orange ring of light
- **Comet** [`comet`]: a bright comet with a long sparkling blue-white tail
- **Astronauts** [`astronaut`]: a cute astronaut floating in a white space suit, waving
- **The Milky Way** [`milky-way`]: a spiral galaxy seen from above, glowing arms of stars
- **Jupiter** [`jupiter`]: giant planet Jupiter with orange bands and the Great Red Spot

## Tiny World

- **Atoms** [`atoms`]: a glowing atom with electrons orbiting a smiling nucleus
- **Cells** [`cells`]: round friendly cells with nuclei, like tiny smiling balloons
- **DNA** [`dna`]: a colorful twisted DNA double-helix ladder
- **Bacteria** [`bacteria`]: cute friendly bacteria characters of different shapes
- **Tardigrades** [`tardigrade`]: a chubby smiling tardigrade water bear with tiny claws
- **Plankton** [`plankton`]: tiny glowing plankton creatures drifting in blue water
- **Mold** [`mold`]: a slice of bread with fuzzy blue-green mold spots and a magnifying glass
- **Dust** [`dust`]: golden dust specks floating in a sunbeam through a window
- **The Microscope** [`microscope`]: a classic microscope with a glowing slide
- **Germs & Soap** [`germs`]: a happy soap bar with bubbles chasing away tiny germ characters

## Plant Conservatory (VAULT — not yet live)

- **Talking Trees** [`talking-trees`]: two big trees with roots connected by glowing underground threads
- **Sunflowers** [`sunflower`]: a tall sunflower turning its face toward the sun
- **Venus Flytrap** [`venus-flytrap`]: a venus flytrap plant with open toothy leaf-jaws, friendly not scary
- **Bamboo** [`bamboo`]: tall green bamboo stalks with a panda peeking from behind
- **Giant Sequoias** [`sequoia`]: a giant sequoia tree towering over tiny pine trees
- **Traveling Seeds** [`traveling-seeds`]: dandelion seeds parachuting on the wind
- **Leaf Kitchens** [`photosynthesis`]: a big green leaf with sun rays in and sparkly air out
- **Cactus** [`cactus`]: a plump saguaro cactus with arms up and a small flower
- **Mushrooms** [`mushroom`]: red-capped mushrooms with white spots glowing softly
- **The Oldest Tree** [`oldest-tree`]: an ancient gnarled bristlecone pine tree on a rocky hill

## World Wonders (VAULT — not yet live)

- **The Eiffel Tower** [`eiffel-tower`]: the Eiffel Tower sparkling at dusk
- **Statue of Liberty** [`statue-liberty`]: the green Statue of Liberty holding her torch high
- **The Taj Mahal** [`taj-mahal`]: the white marble Taj Mahal with reflecting pool
- **Machu Picchu** [`machu-picchu`]: Machu Picchu stone city on a misty green mountain with a llama
- **Venice** [`venice`]: a Venice canal with a black gondola and colorful houses
- **Big Ben** [`big-ben`]: the Big Ben clock tower with a glowing clock face
- **Golden Gate Bridge** [`golden-gate`]: the orange Golden Gate Bridge rising above fog
- **Petra** [`petra`]: the rose-red carved facade of Petra in a desert canyon
- **Sydney Opera House** [`opera-house`]: the Sydney Opera House with white sail-shaped roofs by blue water
- **The Amazon Rainforest** [`amazon`]: a lush rainforest with a colorful parrot and a tiny raincloud above the trees

---

120 wonders total. Full prompt = style block with [SUBJECT] replaced by the text after the id.
