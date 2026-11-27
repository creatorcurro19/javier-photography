export interface SeriesTranslationEn {
  title: string;
  subtitle: string;
  discipline: string;
  location: string;
  description: string;
  statement: string[];
}

export interface WorkTranslationEn {
  title: string;
  alt: string;
  description: string;
  story?: string;
}

export const SERIES_EN: Record<string, SeriesTranslationEn> = {
  custodios: {
    title: "Custodians: Crafts & Traditions",
    subtitle: "Handcrafted workshops, neighborhood shops, and enduring local customs",
    discipline: "DOCUMENTARY",
    location: "Spain & Morocco",
    description:
      "A series on traditional trades and everyday scenes: inside a blacksmith's forge, spice stalls, sun-dried pepper lofts, and local markets.",
    statement: [
      "There are workshops, shops, and customs that have barely changed in decades. This series gathers places where work is still done by hand: a dimly lit forge, a textile alley, a corner greengrocer, or traditional sun-dried peppers.",
      "Every photograph was made using only the available light on site, without asking anyone to pose, letting the natural rhythm of the workshop or street set the tone.",
      "Technical note: In dark workshops and covered markets I shot between ISO 1600 and 6400 with the 18-150mm and 50mm lenses, working with firelight or narrow shafts of daylight without flash so as not to intrude.",
    ],
  },
  "entre-la-bruma-y-el-volcan": {
    title: "Between Mist & Volcano: Island Landscape",
    subtitle: "Mount Teide at dawn, Anaga laurel cloud forests, and the Atlantic coast",
    discipline: "LANDSCAPE",
    location: "Tenerife & Canary Islands",
    description:
      "A journey across the contrasts of Tenerife and the Canary Islands: from the snow-dusted peak of Mount Teide and the wet mist of Anaga to black basalt cliffs meeting the Atlantic.",
    statement: [
      "On an island, the landscape transforms completely within a few kilometers. High on Mount Teide, volcanic rock and crisp dawn cold dominate; mid-mountain, trade winds push mist through ancient twisted laurel trees.",
      "The series descends from those ridges to the shoreline, where late afternoon light settles over black cliffs and wet volcanic sand.",
      "Technical note: High on the summit I shot before sunrise stopped down for full slope detail; along Anaga's cloud trails the mist required careful highlight metering to preserve deep forest shadow.",
    ],
  },
  "trazadas-rally": {
    title: "Racing Lines & Paddock: Historic Rally",
    subtitle: "El Tanque stage, service park, and classics at the 52nd Rallye Orvecame Isla Tenerife Histórico",
    discipline: "MOTORSPORT",
    location: "52nd Rallye Orvecame Isla Tenerife Histórico · El Tanque, Tenerife",
    description:
      "Two sides of a classic rally: flat-out stage action—hard braking, slides, and three-wheel corners—alongside quiet preparation beneath the service tents.",
    statement: [
      "A rally begins long before the first car reaches turn one. In the service park the tempo shifts: mechanics tuning a classic engine, drivers checking pacenotes on the hood, chrome headlights, and weathered liveries.",
      "Pairing close paddock studies with 600mm stage frames captures both the mechanical beauty of historic rally cars and the people keeping them running.",
      "Technical note: On stage I alternate slow 1/60s panning shots for motion with 1/1000s frames at 600mm to freeze inside wheels lifting mid-corner.",
    ],
  },
  "silencio-del-desierto": {
    title: "Silence of the Desert",
    subtitle: "Dunes, wind patterns, and human scale at dusk in the Sahara",
    discipline: "LANDSCAPE",
    location: "Erg Chebbi, Sahara Desert, Morocco",
    description:
      "Wind-carved ripples across sand and tiny figures walking the ridges of the Sahara during the final minutes of sunlight.",
    statement: [
      "In the desert everything strips back to line, light, and proportion. Late in the afternoon, low sun ignites one slope of a dune in gold while plunging the other into deep shadow. Only when someone crosses the crest does the true scale reveal itself.",
    ],
  },
  "miradas-en-libertad": {
    title: "Wildlife Gazes: Observation at 600mm",
    subtitle: "Long-lens observation of mammals and birds across open terrain, parks, and sanctuaries",
    discipline: "WILDLIFE",
    location: "Iberian Peninsula & European Reserves",
    description:
      "600mm portraits and field moments of mammals and birdlife across open habitats, wildlife parks, and conservation centers—documenting real locations and conditions on every sheet.",
    statement: [
      "Working at distance with a 600mm telephoto lens is about waiting quietly for a natural gesture without disturbing the scene. This series brings together encounters in open mountain terrain, meadows, and wildlife sanctuaries, stating exact capture conditions on each work.",
    ],
  },
  "villanueva-de-la-vera": {
    title: "Villanueva de la Vera: Stone, Adobe & Timber",
    subtitle: "Vernacular Vera architecture, overhanging eaves, and village life beneath Gredos",
    discipline: "ARCHITECTURE",
    location: "Villanueva de la Vera, Cáceres",
    description:
      "A slow walk through the historic quarter of Villanueva de la Vera: granite arcades, timber-framed adobe houses, sun-cured peppers, and quiet shadowed alleys.",
    statement: [
      "Along the southern foothills of Sierra de Gredos, Villanueva de la Vera preserves distinctive vernacular architecture: ground floors built in heavy granite blocks topped by cantilevered timber and adobe upper stories.",
      "This series traces those textures—a weathered lintel, a wrought-iron lamp casting shadows on whitewash, clay pots by a threshold, strings of red peppers—as afternoon fades across the village.",
    ],
  },
  "medina-y-kasbah": {
    title: "Medina, Atlas & Kasbah",
    subtitle: "Souk workshops, tiled Marrakech courtyards, and High Atlas valleys",
    discipline: "DOCUMENTARY",
    location: "Marrakech & High Atlas, Morocco",
    description:
      "From the bustling lanes and artisans of Marrakech's Medina to the quiet symmetry of interior courtyards and High Atlas mountain passes.",
    statement: [
      "Within meters in Marrakech's Medina you step from lively covered souks—where shafts of sun stripe carpenters, weavers, and spice stalls—into cool inner courtyards lined with carved stucco and zellij tile.",
      "The series bridges those intimate urban spaces with red-earth kasbahs and palm oases rising toward the High Atlas.",
    ],
  },
  "biodiversidad-canaria": {
    title: "Macaronesia: Island Wildlife & Volcanic Coast",
    subtitle: "Birdlife over Anaga ridges and tidal life along Atlantic basalt",
    discipline: "WILDLIFE",
    location: "Tenerife & Canary Islands",
    description:
      "Island wildlife from mountain peaks to volcanic shore: Canary ravens gliding over Anaga ridges, bright red Sally Lightfoot crabs, turnstones, and Portuguese man-of-war on black basalt.",
    statement: [
      "Canarian nature is shaped by volcanic relief and the Atlantic. High in Anaga, ravens ride updrafts between misty rock pinnacles.",
      "Below at low tide on black lava pools, vivid colors cut against dark stone: crimson crabs, translucent blue Portuguese man-of-war, and shorebirds working the foam.",
    ],
  },
};

export const WORKS_EN: Record<string, WorkTranslationEn> = {
  "fn-01": {
    title: "Emerald Stillness",
    alt: "Rose-ringed parakeet perched quietly on a branch in warm late-afternoon light in Tenerife, shot at 600mm",
    description:
      "The day's last sunlight wraps the resting bird among the branches, blending emerald feathers into golden air.",
    story:
      "In the quiet of late afternoon, low light turned the background into a warm canvas where the silhouette hung still in silence.",
  },
  "fn-02": {
    title: "Green Pulse",
    alt: "Close profile of a rose-ringed parakeet showing emerald plumage and crimson beak against shadowed foliage at 600mm",
    description:
      "From woodland shadow emerge finely textured green feathers and a bright red beak, held in a moment of quiet attention.",
    story:
      "Between low shaded branches, a brief shaft of light revealed every feather barb and the alert gleam of its eye.",
  },
  "fn-03": {
    title: "Silk at Dawn",
    alt: "Great white egret preening in golden morning light against deep blue water at 600mm",
    description:
      "First morning light traces the curved neck of the egret above still, deep-blue water.",
    story:
      "The rising sun outlined white plumes like threads of silk while the pond still rested in blue shade.",
  },
  "fn-04": {
    title: "Amber Eyes",
    alt: "Eurasian lynx resting on a moss-covered woodland rock looking directly into the lens at 232mm",
    description:
      "Set against damp moss and weathered rock, two amber pupils hold the forest's stillness.",
    story:
      "Photographed at a wildlife sanctuary in Austria among moss-draped rocks under soft forest light.",
  },
  "fn-05": {
    title: "Wardens of the Cliff",
    alt: "Pair of griffon vultures watching over the canyon from a limestone crag in Monfragüe",
    description:
      "Two winged silhouettes keep watch along the limestone edge where the cliff drops into wind and open air.",
  },
  "fn-06": {
    title: "Poise on Stone",
    alt: "Spanish ibex descending a sheer granite cliff face with agility in Sierra de Gredos",
    description:
      "High above the granite drop, a light step meets the vertical face with effortless mountain grace.",
    story:
      "Along a sheer wall offering barely a foothold, it paused for an instant on the rock edge before leaping across.",
  },
  "fn-07": {
    title: "Sentinels of the Crag",
    alt: "Two Spanish ibex standing alert atop granite boulders in the Sierra de Gredos mountains",
    description:
      "Two motionless silhouettes perched on rough granite, merged with the silence of the high peaks.",
  },
  "fn-08": {
    title: "Shadow Through the Leaves",
    alt: "European wolf walking quietly across autumn leaf litter in deep forest shade at 600mm",
    description:
      "Silent paws across damp autumn leaves—an ancient presence drifting through woodland dusk.",
    story:
      "Observed from afar with a 600mm lens at an Alpine wildlife sanctuary in Austria along a leaf-strewn trail.",
  },
  "pd-01": {
    title: "Sentinels at Dusk",
    alt: "Two palm silhouettes framed against the Atlantic Ocean during a crimson and golden sunset in Tenerife",
    description:
      "Two dark silhouettes bid farewell to the day as the sky burns above a quiet Atlantic horizon.",
  },
  "pd-02": {
    title: "Dawn Over the Volcano",
    alt: "Snow-dusted volcanic cone of Mount Teide at sunrise above Tenerife's pine forest belt",
    description:
      "Snow on the summit wakes beneath rose and violet skies while the pine forest below still sleeps in shadow.",
    story:
      "Minutes before sunrise, high clouds caught soft pastel warmth above the snow cone while the pine belt stayed in deep twilight.",
  },
  "pd-03": {
    title: "Salt Wind",
    alt: "Backlit wooden coastal boardwalk facing the Atlantic Ocean with a kitesurf sail on the horizon",
    description:
      "The wooden walkway leads the eye straight toward sea glare and a solitary sail suspended in the sky.",
  },
  "pd-04": {
    title: "Golden Sea Mist",
    alt: "Volcanic coastal cliffs wrapped in ocean spray and golden sunset light on Tenerife's north shore",
    description:
      "Atlantic mist wraps black volcanic cliffs in salt and gold as evening settles over the water.",
  },
  "pd-05": {
    title: "Fire in Shadow",
    alt: "Bird of paradise flowers lit by grazing sunlight against a dark architectural wall in Tenerife",
    description:
      "Like tongues of living flame, orange petals ignite against a shadowed backdrop.",
  },
  "pd-06": {
    title: "Path of Light",
    alt: "Setting sun over the Atlantic casting a golden trail across wet black volcanic sand",
    description:
      "The sun sinks to touch the sea and lays a trail of liquid gold across wet volcanic sand.",
  },
  "pd-07": {
    title: "Wind Calligraphy",
    alt: "Wind-sculpted ripples and textures across warm Sahara sand dunes in low grazing light",
    description:
      "Delicate lines written and erased each day by desert wind across warm reddish sand.",
  },
  "pd-08": {
    title: "Age of Limestone",
    alt: "Sheer limestone mountain walls and winter forest beneath brooding storm skies",
    description:
      "Ancient stone faces where every fissure and fold holds the geological memory of the range.",
    story:
      "Under overcast winter skies, soft diffused light revealed every scar in the limestone wall without harsh shadow.",
  },
  "cr-01": {
    title: "Calm Before the Stage",
    alt: "Classic historic rally car parked in the service area beneath mountain ridges",
    description:
      "Beneath mountain peaks, the classic rally machine waits quietly before its engine roars back to life.",
  },
  "cr-02": {
    title: "Reflections of a Legend",
    alt: "Close-up of the chrome headlight and front fender on classic Porsche 911 #52 in the service tent",
    description:
      "Glass and chrome reflect the quiet pre-stage tension inside the shaded service tent.",
    story:
      "In the focused quiet of the service park, the curve of the fender and round headlamp captured an entire era of rallying.",
  },
  "cr-03": {
    title: "Waiting in the Tent",
    alt: "Symmetrical rear view of historic rally car #30 inside the service marquee during pre-stage checks",
    description:
      "Classic bodywork and rally numbers lined up in paddock twilight minutes before hitting the tarmac.",
  },
  "cr-04": {
    title: "On the Apex Limit",
    alt: "Classic rally car #29 carving a hairpin turn on three wheels with the inside front tire airborne",
    description:
      "With one tire suspended clear of the tarmac, the classic coupe leans hard through the heart of the bend.",
  },
  "cr-05": {
    title: "The Hand Ritual",
    alt: "Hands applying competition decals and rally numbers to bodywork before scrutineering",
    description:
      "Quiet attention to every number and stripe before the stage stopwatch begins.",
  },
  "cr-06": {
    title: "Period Spirit",
    alt: "Three-quarter view of classic rally car #5 with deep-dish red wheels in parc fermé",
    description:
      "Vintage colors standing in clean sunlight, keeping the character of classic tarmac stages alive.",
  },
  "cr-07": {
    title: "Committed Through the Bend",
    alt: "Classic Volkswagen Golf GTI Mk1 rally car leaning firmly through a tight mountain bend with auxiliary lamps",
    description:
      "Four round lamps lock onto the exit while the chassis settles cleanly onto the asphalt.",
  },
  "cr-08": {
    title: "Tension in the Hairpin",
    alt: "Historic rally car #77 under heavy braking compressing front suspension on hairpin entry",
    description:
      "The split second where brakes and scuffed tarmac decide the line through the tightest corner.",
  },
  "cr-09": {
    title: "Command Post",
    alt: "Classic rally cockpit seen through the side window showing suede steering wheel and analog gauges",
    description:
      "Through the window appear the dished wheel, dials, and stripped-back cabin where everything comes down to driver feel.",
  },
  "cr-10": {
    title: "Final Pacenotes",
    alt: "Driver and co-driver reviewing roadbook and pacenotes over the yellow hood of a rally car",
    description:
      "Spread across a warm hood, every upcoming bend is quietly rehearsed before the stage begins.",
  },
  "cr-11": {
    title: "Colors of Memory",
    alt: "Classic hatchback rally car in historic Martini Racing stripes cornering on a mountain tarmac stage",
    description:
      "Iconic racing stripes sweep across the mountain road like a living echo of another decade.",
  },
  "cr-12": {
    title: "Pulse of the Junction",
    alt: "Rally car #35 loading exterior suspension through a fast asphalt junction",
    description:
      "Full weight transfers onto the outer tire to carve the fast turn in a fraction of a second.",
  },
  "cr-13": {
    title: "Smoke & Asphalt",
    alt: "Controlled drift of rally car #50 sliding sideways out of an asphalt bend through tire smoke",
    description:
      "On corner exit, rear tires paint white smoke into the air while quick hands balance the slide.",
    story:
      "The moment power went down over rubber-marked tarmac, the tail stepped out cleanly into drifting smoke.",
  },
  "cr-14": {
    title: "Airborne Crest",
    alt: "600mm telephoto compression of a classic rally car lifting its inside front tire over a loaded crest",
    description:
      "Mid-transition, the inner wheel leaves the tarmac behind while the mountain horizon opens wide.",
    story:
      "From down the road, a sharp dip and camber change lifted the front tire clear of the asphalt for an instant.",
  },
  "au-01": {
    title: "Gold on Ceramic",
    alt: "Classic wrought-iron streetlamp illuminating historic facade tiles and balcony grille at night in El Puerto de Santa María, Cádiz",
    description:
      "A lit streetlamp wakes old glazed tiles and ironwork in the quiet of an Andalusian night.",
  },
  "au-02": {
    title: "Night Footsteps",
    alt: "Silhouettes of two pedestrians with a bicycle under warm streetlights along a cobbled street in El Puerto de Santa María, Cádiz",
    description:
      "Two figures drift under warm lamp light while damp cobblestones hold the quiet hum of conversation.",
    story:
      "Warm amber streetlamps turned wet paving stones into an intimate stage with silhouettes backlit against the glow.",
  },
  "au-03": {
    title: "Memory of the Forest",
    alt: "Symmetrical window openings inside a dark ruined structure framed by bright green laurel forest foliage",
    description:
      "Where roofs and voices once stood, luminous woodland pours through shadowed openings to reclaim its space.",
    story:
      "From the darkness inside the ruin, the twin open windows read like living paintings framed in green and sun.",
  },
  "au-04": {
    title: "Breath of the Forest",
    alt: "Narrow road winding through a mossy laurel forest tunnel shrouded in mist in Anaga, Tenerife",
    description:
      "A corridor draped in moss and cloud mist where ancient laurel trees seem to slow time itself.",
  },
  "au-05": {
    title: "Light Through Laurel Mist",
    alt: "Sunken trail carved between mossy rock banks beneath morning rays in the Anaga laurel forest",
    description:
      "Between damp rock walls cut into the mountainside, morning light filters through the green canopy.",
  },
  "au-06": {
    title: "Autumn Behind Iron",
    alt: "Symmetrical view through a wrought-iron brick-wall grille looking onto bright autumn foliage",
    description:
      "Through dark wrought-iron geometry, glowing autumn leaves signal the turn of the season.",
  },
  "au-07": {
    title: "Crescent Above the Walk",
    alt: "Tree-lined urban promenade lit by streetlamps beneath a crisp crescent moon at night",
    description:
      "Above glowing trees and receding streetlamps, a slender silver crescent watches over the night walk.",
  },
  "vc-01": {
    title: "Colors on the Corner",
    alt: "Vibrant neighborhood fruit shop display during morning market hours",
    description:
      "Simple neighborhood life distilled into bright seasonal fruit and unhurried morning conversation.",
  },
  "vc-02": {
    title: "Stillness by the Door",
    alt: "Elderly local resident resting beside an open doorway in slanted afternoon light along a historic lane",
    description:
      "Seated beside a familiar threshold as slanted afternoon sun slides quietly down the narrow street.",
  },
  "vc-03": {
    title: "Prayer in Gold",
    alt: "Dim church interior with worshippers gathered quietly before an illuminated baroque altarpiece during May Crosses in Los Realejos, Tenerife",
    description:
      "Inside the shadowed nave, warm candlelight on the gilded altarpiece gathers a moment of quiet devotion.",
  },
  "vc-04": {
    title: "Night of Vow & Fire",
    alt: "Nighttime religious procession beneath dramatic fireworks during the Cruces de Mayo festival in Los Realejos, Tenerife",
    description:
      "The procession moves across a sea of heads as May night sky erupts in fire and drifting smoke above Los Realejos.",
    story:
      "Every May in Los Realejos, quiet devotion in the street and thunderous fireworks overhead fuse into one unforgettable night.",
  },
  "vc-05": {
    title: "Smoke at Dusk",
    alt: "Backlit columns of charcoal grill smoke rising at dusk across Jemaa el-Fna Square in Marrakech",
    description:
      "Warm charcoal smoke rises into evening backlight as the square wakes beneath the distant minaret.",
  },
  "vc-06": {
    title: "Pearl of Water",
    alt: "Close-up of a mute swan against dark water with a single clear droplet hanging from its orange bill",
    description:
      "One clear drop trembles at the tip of the bill before returning to the dark mirror of the pond.",
  },
  "vc-07": {
    title: "Whisper in Fog",
    alt: "Great tit perched on a lichen-covered twig in minimalist composition against white morning fog",
    description:
      "On a lichen-coated branch, a tiny silhouette holds the white hush of a foggy morning.",
  },
  "vc-08": {
    title: "Calm in the Meadow",
    alt: "White stork photographed in profile at 600mm against lush blurred green grass in Germany's Black Forest",
    description:
      "Crisp white plumage stands quietly against a soft, deep green carpet of meadow grass.",
  },
  "vc-09": {
    title: "Thread of Light",
    alt: "Artisan seated at work in a narrow textile lane of the Marrakech souk surrounded by hanging fabrics",
    description:
      "A single shaft of sunlight falls straight onto the tailor's hands, carving calm amid hanging textiles.",
    story:
      "Inside the covered lane, one narrow roof opening lit only his hands and needle, untouched by passing foot traffic.",
  },
  "vc-10": {
    title: "Stream Mirror",
    alt: "Frog peering just above clear mountain stream water and submerged pebbles",
    description:
      "Flush with crystal mountain water, two still eyes break the surface among submerged granite stones.",
  },
  "vc-11": {
    title: "Shared Bread",
    alt: "Two young craftsmen sharing lunch on the threshold of a traditional workshop in the Medina of Marrakech",
    description:
      "At the workshop door, tools rest briefly for shared lunch and midday conversation.",
  },
  "vc-12": {
    title: "Crown of the Woodland",
    alt: "Iberian red deer stag with wide antlers standing tall on a dehesa ridge looking straight at camera",
    description:
      "At the crest of the slope, the royal silhouette of antlers rises cleanly against morning mist.",
  },
  "vc-13": {
    title: "Wild Nobility",
    alt: "Tight 600mm profile portrait of an Iberian red deer stag highlighting antlers in warm afternoon sun",
    description:
      "Warm late light traces the stag's profile and branching antlers against shadowed woodland.",
  },
  "vc-14": {
    title: "Toward the Setting Sun",
    alt: "Backlit silhouette of a hat-wearing walker casting a long shadow down sunlit cobblestones at dusk",
    description:
      "A lone silhouette walks straight into the day's final glare across bronze-lit cobblestones.",
    story:
      "As the sun reached the foot of the street, every cobblestone burned like bronze and the shadow stretched right to my lens.",
  },
  "vc-15": {
    title: "Sun-Cured Harvest",
    alt: "Strings of red peppers drying in autumn sunlight for smoked paprika in Villanueva de la Vera",
    description:
      "Suspended in crisp autumn air, deep red peppers ripen slowly beneath mountain sunshine.",
    story:
      "Late summer brings brilliant red garlands drying along balconies—unmistakable scent and color of La Vera's harvest.",
  },
  "vc-16": {
    title: "Carved Stillness",
    alt: "Symmetrical colonnade with zellij tilework, carved stucco, and arches in a Marrakech madrasa courtyard",
    description:
      "Marble, glazed tile, and carved cedar arrange into quiet harmony where afternoon light rests across the courtyard.",
  },
  "vc-17": {
    title: "Bronze Sculpture",
    alt: "Macro side profile of a grasshopper perched on granite stone revealing fine exoskeleton texture",
    description:
      "Close to warm stone, light reveals the miniature sculpted armor of a life that usually goes unseen.",
  },
  "vc-18": {
    title: "Shadow & Whitewash",
    alt: "Wrought-iron lantern casting sharp geometric shadow onto a whitewashed facade in Villanueva de la Vera",
    description:
      "Afternoon sun sketches the crisp shadow twin of wrought iron across a limewashed wall.",
  },
  "vc-19": {
    title: "Stone Lane",
    alt: "Cobbled country track flanked by mossy dry-stone granite walls in Villanueva de la Vera",
    description:
      "Centuries-old granite walls and trailing ivy border the lane where village gives way to open countryside.",
  },
  "vc-20": {
    title: "Toward the Bell Tower",
    alt: "Cobbled alley framed by timber eaves leading to the sunlit church bell tower in Villanueva de la Vera",
    description:
      "From the cool shade of cobbled walls, overhanging timber eaves guide the eye straight to the sunlit tower.",
  },
  "vc-21": {
    title: "Granite Threshold",
    alt: "Side light raking across a dressed granite lintel and weathered timber door in Villanueva de la Vera",
    description:
      "Raking light grazes hand-cut stone and timber grain on a door crossed by generations.",
  },
  "vc-22": {
    title: "Clay & Granite",
    alt: "Traditional earthenware clay jugs and potted plants arranged on a sunlit stone wall in Villanueva de la Vera",
    description:
      "Earthenware jars and courtyard blooms soften a granite wall like a small street-side garden.",
  },
  "vc-23": {
    title: "Geometry of Time",
    alt: "Traditional half-timbered and adobe houses with cantilevered balconies lining a cobbled street in Villanueva de la Vera",
    description:
      "Timber beams, whitewash, and overhanging balconies lean together over cobblestones keeping local memory intact.",
  },
  "vc-24": {
    title: "When Evening Falls",
    alt: "Golden sunset light bathing stone-and-timber homes in Villanueva de la Vera with a local resident walking uphill",
    description:
      "Low sunlight washes timber and stone in warm honey tones as quiet footsteps head up the lane.",
  },
  "vc-25": {
    title: "Scents of the Earth",
    alt: "Merchant seated inside his Marrakech souk stall surrounded by woven baskets filled with spices, herbs, and dried rosebuds",
    description:
      "Among woven baskets brimming with dried petals, roots, and ground spice, the market preserves the colors of the south.",
  },
  "vc-26": {
    title: "Pages of Earth & Salt",
    alt: "Layered volcanic strata cliffs beside the sea illuminated by warm afternoon sun in the Canary Islands",
    description:
      "Ancient volcanic ash strata carved by ocean wind, lit gold by low afternoon light.",
  },
  "vc-27": {
    title: "Sky Between Eaves",
    alt: "Low-angle upward view of overhanging wooden roof eaves nearly meeting over whitewashed facades in Villanueva de la Vera",
    description:
      "Looking straight up, wide timber eaves nearly touch overhead, leaving only a bright ribbon of blue sky.",
  },
  "vc-28": {
    title: "Beneath the Beams",
    alt: "View from inside a timber-and-granite colonnade looking onto a festive decorated street in Villanueva de la Vera",
    description:
      "From cool timbered shade beneath granite pillars, the street opens bright with banners and daylight.",
  },
  "vc-29": {
    title: "Stone & Clay Lacework",
    alt: "Architectural close-up of glazed zellij geometric mosaic and carved plaster arch in a historic Marrakech courtyard",
    description:
      "Thousands of hand-cut tiles and carved stucco come together in a patient geometry of shadow and light.",
  },
  "vc-30": {
    title: "Festival Day",
    alt: "Calle Real in Villanueva de la Vera lined with timber-framed houses adorned with balconies, flowers, and bunting",
    description:
      "Paper bunting and flower-filled balconies stretch across old timber facades under clear midday light.",
  },
  "vc-31": {
    title: "Red on Whitewash",
    alt: "Garlands of red drying peppers hanging beside an iron balcony over a whitewashed wall in Villanueva de la Vera",
    description:
      "Beside wrought-iron railings, strings of crimson peppers strike a bright note against quiet whitewash.",
  },
  "cr-15": {
    title: "Little Giant",
    alt: "Classic Autobianchi A112 Abarth rally car #78 lifting its inside rear wheel mid-corner on tarmac",
    description:
      "One rear tire dangling clear of the road, compact agility turns straight into pure cornering speed.",
  },
  "vc-33": {
    title: "Heart of the Village",
    alt: "Arcaded Plaza Mayor of Villanueva de la Vera with granite colonnades and traditional balconies beneath Gredos",
    description:
      "Granite arcades and timber balconies frame the town square where daily life keeps its unhurried pace.",
    story:
      "Those granite pillars have carried the cool shade of the arcades and generations of village conversation.",
  },
  "vc-34": {
    title: "Sunlight on the Rooftops",
    alt: "Chiaroscuro contrast between shaded cobbled street below and sunlit upper timber stories in Villanueva de la Vera",
    description:
      "While cobblestones keep their evening coolness, the day's last sunlight catches upper balconies.",
  },
  "vc-35": {
    title: "Still Hour",
    alt: "Quiet perspective down an empty cobbled lane in historic Villanueva de la Vera at dusk",
    description:
      "Once the heat fades and the lane empties, ancient flagstones seem to exhale in silence.",
  },
  "vc-36": {
    title: "Scale of Time",
    alt: "Single figure climbing the monumental symmetrical stone staircase of a traditional kasbah in Morocco",
    description:
      "One solitary figure crossing the wide steps gives quiet measure to monumental earth walls.",
  },
  "vc-37": {
    title: "Green Among Granite",
    alt: "Narrow passage between rough granite masonry walls brightened by neighborhood flowerpots in Villanueva de la Vera",
    description:
      "In the tightest stone alley, potted greenery tended by neighbors softens rough-hewn granite.",
  },
  "vc-38": {
    title: "Facing Vastness",
    alt: "Two human silhouettes standing on a shadowed dune ridge against the giant setting sun in the Sahara",
    description:
      "Two small figures pause along the dark sand crest facing an immense sun sinking over the desert.",
  },
  "vc-39": {
    title: "Waves of Gold",
    alt: "Endless sweep of golden sand dunes at sunset in the Sahara with tiny figures along a distant crest",
    description:
      "Sand ridges roll outward like a motionless ocean under the last golden light of afternoon.",
  },
  "vc-40": {
    title: "Amber Veil",
    alt: "Layered Sahara dunes and distant desert ridges dissolving into warm amber twilight haze",
    description:
      "Successive planes of sand and stone dissolve into golden haze as dusk closes across the desert.",
    story:
      "With the sun almost down and fine sand suspended in the air, the horizon flattened into soft painted layers.",
  },
  "vc-41": {
    title: "Footsteps in Vastness",
    alt: "Vertical composition emphasizing the towering scale of a Sahara sand dune beneath two hikers on the ridge",
    description:
      "The sheer sweep of the great dune reduces two walking figures to a faint whisper along its crest.",
  },
  "vc-42": {
    title: "Last Gleam Over the Erg",
    alt: "Final sunbeam dipping behind distant mountains over shaded wind ripples in the Sahara Desert",
    description:
      "Sun drops behind distant mountains while evening shadow glides smoothly across wind-rippled sand.",
  },
  "vc-44": {
    title: "Where Sparks Fly",
    alt: "Ironworker shaping glowing metal inside a dark Marrakech smithy lit by a shower of hot sparks",
    description:
      "Inside the ancestral darkness of the forge, a burst of sparks lights hands and glowing iron for an instant.",
    story:
      "In the dim workshop you heard only hammer on anvil; each strike lit drifting smoke and lifetime tools in orange fire.",
  },
  "au-08": {
    title: "From Shadow to Sun",
    alt: "Monumental shaded horseshoe arch framing busy sunlit street life in the Medina of Marrakech",
    description:
      "Deep shadow inside the arch opens like a bright window onto golden stone and passing life.",
  },
  "au-11": {
    title: "Stained-Glass Light",
    alt: "Lone figure walking past courtyard pillars seen through an open carved timber door crowned with stained glass in Marrakech",
    description:
      "Through carved wood and colored glass, jewel tones frame a quiet figure crossing the tiled courtyard.",
  },
  "vc-45": {
    title: "Dance of Cedar",
    alt: "Master woodturner shaping cedar wood using a bow lathe and hand chisel in his Marrakech souk stall",
    description:
      "Amid fragrant cedar shavings and well-worn gouges, raw wood spins cleanly into shape by hand.",
    story:
      "Working in a tiny street-level nook, the lathe spun effortlessly at the pace of a craft learned since childhood.",
  },
  "vc-46": {
    title: "Rain of Light in the Souk",
    alt: "Shafts of sunlight cutting through reed roofing slats onto pedestrians and cobblestones in a Marrakech souk lane",
    description:
      "Sunlight pierces overhead reed slats to paint bright bars of gold and dust over old paving stones.",
  },
  "pd-10": {
    title: "Folds of the Earth",
    alt: "Folded mountain ridges and deep ravines across the High Atlas range carved by late afternoon sun",
    description:
      "Low afternoon sun sculpts folded ridges and deep mineral gorges across the High Atlas mountains.",
  },
  "pd-11": {
    title: "At the Foot of Snows",
    alt: "Green palm oasis and red-earth adobe village resting before snowcapped High Atlas peaks in Morocco",
    description:
      "From red mud walls and palm canopy, the horizon climbs straight to snowcapped Atlas ridges.",
  },
  "pd-12": {
    title: "The Sun's Edge",
    alt: "Sinuous crest line of a giant Sahara dune dividing its sunlit golden slope from cool blue shadow",
    description:
      "A single winding razor edge splits burning afternoon gold from deep cool shadow.",
  },
  "fn-14": {
    title: "Dance in the Rain",
    alt: "White stork striding across a green meadow through a curtain of falling rain droplets at 600mm in Germany's Black Forest",
    description:
      "Through curtains of suspended raindrops, calm white strides cross the rain-soaked meadow.",
  },
  "fn-15": {
    title: "Warden of the Ridges",
    alt: "Canary Islands raven perched in the foreground overlooking volcanic rock spires and misty gorges in Anaga, Tenerife",
    description:
      "Black feathers look across emerald ravines while trade-wind mist wraps Anaga's volcanic peaks.",
  },
  "fn-16": {
    title: "Wind Fan",
    alt: "Canary Islands raven spreading primary flight feathers against mountain wind on a volcanic Anaga crest",
    description:
      "Jet-black primaries fan wide against moist summit wind in a single gesture of strength and lift.",
  },
  "fn-17": {
    title: "Sail of Glass",
    alt: "Macro detail of the translucent blue and violet float of a Portuguese man-of-war resting on wet volcanic rock in the Canary Islands",
    description:
      "A translucent flash of cobalt and violet, cast ashore by Atlantic swell like delicate glass on wet lava.",
  },
  "fn-18": {
    title: "Crimson on Basalt",
    alt: "Close frontal view of a vivid red-and-violet Sally Lightfoot crab on wet intertidal black basalt in Tenerife",
    description:
      "Freshly washed by ocean swell on black lava rock, crimson armor glows against volcanic stone.",
  },
  "fn-19": {
    title: "Sunlit Stained Glass",
    alt: "Monarch butterfly wings backlit by natural sunlight among garden foliage in Tenerife",
    description:
      "Sunlight passes straight through open wings, turning them into a delicate stained-glass mosaic.",
  },
  "fn-20": {
    title: "Stroke on Cobalt",
    alt: "Minimalist profile portrait of a yellow-legged gull set cleanly against deep cobalt Atlantic sky",
    description:
      "Clean white wing and bill suspended in the stillness of an unbroken cobalt sky.",
  },
  "fn-21": {
    title: "Edge of the Atlantic",
    alt: "Ruddy turnstone standing on black coastal lava with silver Atlantic glare blurred behind at 600mm",
    description:
      "Between silver sea spray and dark basalt, a brief pause beside Atlantic surf.",
  },
  "fn-22": {
    title: "Gaze Among Holm Oaks",
    alt: "Young fallow deer pausing between Mediterranean holm oaks to look toward the 600mm telephoto lens",
    description:
      "Its step pauses for a second in woodland shade to trade one clear, curious glance.",
  },
  "cr-16": {
    title: "Amber Stare",
    alt: "Low symmetrical front view of a classic BMW E30 rally car with yellow headlights glowing over damp tarmac at dusk",
    description:
      "Four warm amber lamps cut through damp dusk tarmac, ready for the closing stage.",
  },
  "vc-47": {
    title: "Faith & Breath",
    alt: "Chiaroscuro portrait of a bearer beneath heavy procession floats during the nighttime Cruces de Mayo in Los Realejos, Tenerife",
    description:
      "Out of festival darkness, one shaft of warm light reveals weight, effort, and quiet devotion.",
  },
  "pd-13": {
    title: "Sea of Silence & Sand",
    alt: "Rolling sea of golden dunes and soft evening shadows across the Sahara Desert — photograph by Javier Espinosa",
    description:
      "An ocean of golden curves where desert wind and fading afternoon sun sculpt endless horizons.",
    story:
      "From the top of the main crest, the dunes stretched away like frozen waves lit sideways by sunset.",
  },
  "pd-14": {
    title: "Along the Razor of Light",
    alt: "Solitary figure atop the winding crest of a vast Sahara dune dividing sunlight and deep shadow — photograph by Javier Espinosa",
    description:
      "Human scale set against immense sand, suspended on the thin line between burning gold and night shadow.",
    story:
      "The crest curve split the dune cleanly in half—deep darkness to one side, living gold to the other, and one lone silhouette.",
  },
  "pd-15": {
    title: "Memory of the Wind",
    alt: "Warm sunset backlight raking across wind ripples at the foot of Sahara sand dunes — photograph by Javier Espinosa",
    description:
      "Low sun drops behind high crests and grazes fine sand ripples, dressing the desert in antique gold.",
  },
  "pd-16": {
    title: "Halo of the Full Moon",
    alt: "Full moon at 600mm ringed by a silver atmospheric halo in night mist above Puerto de la Cruz, Tenerife — photograph by Javier Espinosa",
    description:
      "The full moon opens a silver ring inside drifting night clouds, suspended in deep cobalt hush.",
    story:
      "At 600mm, a thin veil of high cloud left lunar craters crisp while wrapping the disk in a glowing silver crown.",
  },
  "fn-23": {
    title: "Emerald in Half-Light",
    alt: "Minimalist parakeet portrait against dark neutral shade highlighting vivid green feathers and red bill — photograph by Javier Espinosa",
    description:
      "A bright splash of emerald emerges from quiet shadow in the split second before taking flight.",
  },
  "fn-24": {
    title: "Golden Stillness",
    alt: "Great white egret standing motionless in profile beside calm golden water reflections at 600mm",
    description:
      "Still along the shoreline, a white silhouette waits quietly above golden water reflections.",
  },
  "fn-25": {
    title: "Watchman in the Palms",
    alt: "Male rose-ringed parakeet facing forward on a dried palm frond showing its black neck ring against soft green blur at 600mm",
    description:
      "Perched atop a weathered palm frond, the parakeet keeps quiet watch against deep green canopy blur.",
  },
  "pd-17": {
    title: "Gold on Volcanic Spires",
    alt: "Volcanic spires of Roques de García bathed in low golden sunset light beneath Mount Teide in Tenerife",
    description:
      "Late afternoon sunlight kindles the volcanic spires of Roques de García as twilight rises across Mount Teide's slope.",
    story:
      "Waiting out the last minutes of sun above the viewpoint turned weathered lava towers into warm copper against the calm caldera.",
  },
  "au-12": {
    title: "Three Brass Lanterns",
    alt: "Three gilded street lanterns with ornamental metalwork arranged in minimalist rhythm against clear blue sky in Marrakech",
    description:
      "Three gilded brass lanterns with pierced scrollwork ascend cleanly against unbroken blue sky, distilling the avenue to pure rhythm.",
    story:
      "Looking up at 115mm stopped down to f/8 isolated all three bronze arms in calm geometry with nothing behind them but open sky.",
  },
};
