angular.module('starter.services', ['ngTouch'])

.factory('wordSearchPuzzle', function() {
        /**
         * Word search puzzle
         * @param matrix
         * @param words
         * @constructor
         */
        function WordSearchPuzzle(matrix, words) {
            var maxRow = 0,
                maxCol = 0;
                
            /**
             * Matrix
             * @type {Array}
             */
            this.matrix = [];

            /**
             * Words
             * @type {Array}
             */
            this.words = [];

            /**
             * Is solved?
             * @type {Boolean}
             */
            this.solved = false;

            // parse matrix and words
            angular.forEach(matrix, function(letters, row) {
                angular.forEach(letters, function(letter, col) {
                    var item = {
                        letter: letter,
                        col: col,
                        row: row,
                        used: false
                    };
                    if (!this.matrix[row]) {
                        this.matrix[row] = [];
                    }
                    this.matrix[row].push(item);
                    maxCol = col;
                }, this);
                maxRow = row;
            }, this);
            angular.forEach(words, function(word) {
                this.words.push({
                    name: word
                });
            }, this);

            /**
             * Returns matrix item by coords
             * @param col
             * @param row
             * @return {*}
             */
            this.getItem = function(col, row) {
                return (this.matrix[row] ? this.matrix[row][col] : undefined);
            };

            /**
             * Returns matrix items by start/end coords
             * @param colFrom
             * @param rowFrom
             * @param colTo
             * @param rowTo
             * @return {Array}
             */
            this.getItems = function(colFrom, rowFrom, colTo, rowTo) {
                var items = [];

                if (rowTo > maxRow) {
                    rowTo = maxRow;
                }
                if (colTo > maxCol) {
                    colTo = maxCol;
                }

                if (this.getItem(colTo, rowTo) === undefined) {
                    return items;
                }

                if (colFrom === colTo || rowFrom === rowTo || Math.abs(colTo - colFrom) === Math.abs(rowTo - rowFrom)) {
                    var shiftX = (colFrom === colTo ? 0 : (colTo > colFrom ? 1 : -1)),
                        shiftY = (rowFrom === rowTo ? 0 : (rowTo > rowFrom ? 1 : -1)),
                        col = colFrom,
                        row = rowFrom;

                    items.push(this.getItem(col, row));
                    do {
                        col += shiftX;
                        row += shiftY;
                        items.push(this.getItem(col, row));
                    } while (col !== colTo || row !== rowTo);
                }

                return items;
            };

            /**
             * Check items - find word
             * @param items
             */
            this.lookup = function(items) {
                var wordcount=0;
                if (!items.length) {
                    return;
                }

                // create words
                var words = [''];
                angular.forEach(items, function(item) {
                    words[0] += item.letter;
                });
                words.push(words[0].split('').reverse().join(''));  // word in reverse order (when selecting)

                // check words
                this.solved = true;
                angular.forEach(this.words, function(word) {
                    if (word.found) {
                        return;
                    }
                    angular.forEach(words, function(itemWord) {
                        if (word.name === itemWord) {
                            word.found = true;
                            wordcount++;
                            angular.forEach(items, function(item) {
                                item.found = true;
                            });
                        }
                    });
                    if (!word.found) {
                        this.solved = false;
                    }
                }, this);
                this.wordcount = wordcount;
            };

            /**
             * Solves puzzle
             */
            this.solve = function() {
                var start = {},
                    directions = {
                        N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0],
                        NE: [1, -1], NW: [-1, -1], SE: [1, 1], SW: [-1, 1]
                    };

                // group items by letters for faster search
                angular.forEach(this.matrix, function(items) {
                    angular.forEach(items, function(item) {
                        if (!start[item.letter]) {
                            start[item.letter] = [];
                        }
                        start[item.letter].push(item);
                    });
                });

                angular.forEach(this.words, function(word) {
                    angular.forEach(start[word.name.charAt(0)], function(start) {
                        if (word.found) {
                            return;
                        }
                        angular.forEach(directions, function(shift) {
                            if (word.found) {
                                return;
                            }
                            this.lookup(this.getItems(
                                start.col, start.row,
                                start.col + (word.name.length - 1) * shift[0],
                                start.row + (word.name.length - 1) * shift[1]
                            ));
                        }, this);
                    }, this);
                }, this);
            };
        }

        return function(matrix, words) {
            return new WordSearchPuzzle(matrix, words);
        };
    })
.factory('Wordsmatrix', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var Wordsmatrix = [{
    id: 0,
    category: 'science',
    matrix: 'N I G O R Y G S T T A N O G G U L C O E P E A S I N N R M N O R I M E C T I A I O E G V R P V E C T T E D D L I C L I N E S J P U N E C S A T A J E O O L E I E A T C R N T V C E P J B V E E I I S I S S E S A A W R O O K S I M D E S J O I M R E L L O R T N O C D E',
    words: 'BINDING CONTROLLER DEPENDENCY DIRECTIVE GOOGLE IGOR INJECTION JAVASCRIPT MISKO MODULES SCENARIO SCOPE SERVICE TEMPLATE TESTING VOJTA'
  },
  {
    id: 1,
    category: 'science',
    matrix: 'L K T V L P Q O X R E Z P R Q V L F M V E C V J O E Y X O A Y S N H I R T C T I N L I A F U S E E R M Y S S T I E O W D N L D Z T S F M W K Y A T I G O I L Q U E I G I I D R S Z N B L A T R Y A G E N E R A T O R E E L R G O L J C B I X N R R E T E M M A F Q B E Q',
    words: 'AMMETER DYNAMO ENERGY FUSE GENERATOR POTENTIAL RESISTANCE RESISTOR VOLTMETER WIRE'
  },
  {
    id: 2,
    category: 'science',
    matrix: 'Y P R A B Y R Z O K L P T I F Q G R P P X L T H A A L E F F C T Y D N O I K P Y R F C H G D E S Z X F R T T P P E V I P J Q D C O O I E N O R H C H L O R O P L A S T O I M B O Y O T D I M U R T B L G Q C S G B S N U A H E D A S I L A P E S C W C M I N E R A L S R',
    words: 'CHLOROPHYLL CHLOROPLAST FERTILISER MINERALS NUTRIENT OXYGEN PALISADE PHOSPHORUS TAPROOT'
  },
  {
    id: 3,
    category: 'science',
    matrix: 'C M Y R C C D U V E H T I A H T A L P R C F H H T S F I I T B N A G C M S S R R H S A S I G T A A G G R I T N E G A S G L E U W S C W E M L S N E S G I K T T R D T B E T W S L U B R I C A N T O E Y K N G W Z O K K I R Y C N A Y O U B N I C Y M O B K I F L O A T L',
    words: 'AIR BUOYANCY DENSITY DRAG ELASTIC FLOAT FRICTION LUBRICANT MAGNETIC MASS RESISTANCE UPTHRUST WEIGHT'
  },
  {
    id: 4,
    category: 'animal',
    matrix: 'K M L S Q E O S K E D M K A E E K U P O E K Z A B A N A M I Z Z H R B C L I N G D A N C C A L C D S R E A A C B O H C R C F R D P R Z D G S J A O U M M J W O J O L K B D N I I Y F P O A Q V B M H A L L I G A T O R I C B L B E Z E B R A H T F O K O R L Z E L G A E',
    words: 'ALLIGATOR BIRD CAMEL CHIMPANZEE EAGLE GOAT KANGAROO RABBIT SEAL SHARK SNAKE SPIDER ZEBRA'
  },
  {
    id: 5,
    category: 'animal',
    matrix: 'E A G L E H E J V J E C J W J X Q L E E P G L C S U M A T O P O P P I H T E S R S R Q H T W D I N I U N N Q S M I D O C E T B V A I U P G S C K T D Q B F I A I E H O E T Q K D A N L V R A R N I W L Z D R S V H R C J K O K A N G A R O O E W G E F F A R I G V F Z L',
    words: 'CHICKEN CROCODILE EAGLE GIRAFFE GOLDFISH HIPPOPOTAMUS KANGAROO KITTEN PANDA RABBIT SNAIL SQUIRREL TIGER TURTLE'
  },
  {
    id: 6,
    category: 'music',
    matrix: 'W M C V R E V I O L A C S P G T G N Y D O L E M B T H R M O D U L A T E R L A V H T X L I P X E R E H C O I Y D F E N V M U S L C R U Y K O A X G H L O I A K P B J C O X E T C P B T M A N C K C P S Y T M O O C A E U X P J O H R O Y R B N R I O C T T R B C V D T J',
    words: 'ACCENT BANJO BARITONE CELLO COMPOSER LYRICS MELODY MODULATE RHYTHM STACCATO TROMBONE VIOLA'
  },
  {
    id: 7,
    category: 'music',
    matrix: 'X E T G F M E H N S V E S P U E H C C R I Y I V Y Q T Q N T Q G A G O A P N Q E I O N E R U L T U D D P M N R K F I A C L A B M Y C H G E T M O C A C C E N T C R A H Q R D Y B E Y W J E R B S F J A F G E G N O T E S P N F D D A D C F U V F D P X E I X H F A T K G',
    words: 'ACCENT BAND CADENCE CYMBAL GUITAR NOTES OCTAVE PITCH REFRAIN TECHNIQUE TENOR VIOLA'
  },
  {
    id: 8,
    category: 'food',
    matrix: 'P E A C H E D T A H P I U A T S A O T A P A I N I Z S O T A T O P M Z O N E K C I H C Z S B Z R P I N E A P P L E U A A S E K A C N A P C R G C O T I R R U B C X G T A H O T D O G H T M E J M A L E N T I L S F R K Y V J K A N G R A N O L A P J W I S C A L L O P S',
    words: 'BURRITO CHICKEN GRANOLA HAMBURGER HOTDOG LENTILS MACARONI PANCAKES PEACH PINEAPPLE PIZZA POTATO SCALLOPS TOAST ZUCCHINI'
  },
  {
    id: 9,
    category: 'food',
    matrix: 'D W M K X O C K R R W D A P M I R H S E R U A O E O A A I O G M W B F U R T N C M R M V X Q F G B G K T U N O C O C L H E E H B U R R I T O E N N W M E A T B A L L S U R A S Q U A S H Z U X T H N O M L A S W Q D B H G C O T A T O P E I H R N P E P P E R E A U T E',
    words: 'BREAD BURRITO CHICKEN COCONUT DOUGHNUT HAMBURGER MEATBALLS ORANGE PEPPER POTATO SALMON SHRIMP SQUASH WAFFLES'
  },
  {
    id: 10,
    category: 'flower',
    matrix: 'K F R E E S I A Y L I L L M A G N O L I A K D E R B A D A W W R F B Z S A E F C B U T E K M U T I G W Z S F V T R C T I L O D O F D P S S J U C E N U X L E M I P N L K M I U U O F B W U N I S A A C N W I F J Z N P E C X Y W H Y L A Q C B E A C I N O R E V S A R D',
    words: 'BEGONIA CAMELIA FREESIA HIBISCUS LILY MAGNOLIA PEONY SAFFLOWER TICKSEED TULIP VERONICA WISTERIA WOLFSBANE'
  },
  {
    id: 11,
    category: 'flower',
    matrix: 'S A U E E O N P N J V F U I D J W I D O J N P O C L J A S M I N E Z O N S E E N H T T P B Q I E I M F Z A L Z H A J N L B A F N P R I M R O S E I C R H Y D R A N G E A H A K V P J B T O R T C C I Z D E E S K C I T B H V N N P V Q A A F A E E N A B S F L O W W J U',
    words: 'CAMELIA CARNATION DAHLIA HIBISCUS HYDRANGEA JASMINE POINSETTA PRIMROSE TICKSEED WOLFSBANE'
  },
  {
    id: 12,
    category: 'fashion' ,
    matrix: 'A S O S S E R D Z D F R I T T I H B Y G I S F A D Y T T L Z L O M W O E E L B A N O I H S A F W M I Q T V C F V A T I H S S Z E V T L T H C A C V T S B R P F A R H H A D E S I G N E R S O M E T L H S H O E S A S P B H S N Z X N Z Q G C I F R E V O C Q K I F C S C',
    words: 'BEACHWEAR CLASSIC COVER DESIGNER DRESS FASHIONABLE GLOVES MEDIA PORTFOLIO SCARF SHIRT SHOES STYLIST WATCH'
  },
  {
    id: 13,
    category: 'fashion',
    matrix: 'I P R S O S F A L L T R D O Z E T Z V Y S B L A E P W A N Y U E C T E M R U H Q V G L L S N B P O L I G S I I I Y T A Q L A T U T E T S S O V F I R I X N F E X E T C P A T E T Q C I C A D P W T T C A L L B A C K H B R G N L N Y G J Z J W B L J T Y C S S E R P Q P',
    words: 'BELT CALLBACK CLIENT DESIGNER FALL FANCY HATS POPULAR PRESS RAMP STYLIST SUIT TAILORED TEXTILES VEST'
  },
  {
    id: 14,
    category: 'country',
    matrix: 'Z V B F A A M C T E J U C I U I L P L U M N A F G E R C A G R E E C E V L T K E M K D V G D C T U N I T E D S T A T E S E A N Y T A D A N A C Q C M A A A S G D N G U L N J F T U F O W T B Y M A C A R G T U N I S I A R E S A N I T N E G R A F V O G Y L X L B A P O',
    words: 'ARGENTINA BURKINAFASO CANADA FRANCE GREECE GUATEMALA TUNISIA TURKEY UNITEDSTATES VIETNAM'
  },
  {
    id: 15,
    category: 'country',
    matrix: 'I T A L Y G R X T M C F V I E T N A M K O J G D A P J W S N A Z J R C L E L P A I L A R T S U A C R E N P M C O I B S G E G E U B A C H R A Q U E B U I Z C N A Q N D T R E Q I O E Z Q X G W R G U S R N I N A B O O O E I O M L E B E C L N P P M A D A N A C V A P T',
    words: 'ANGOLA AUSTRALIA BENIN BRAZIL CANADA GREECE GUINEA ITALY JAPAN MOROCCO MOZAMBIQUE PORTUGAL VENEZUELA VIETNAM'
  },
  {
    id: 16,
    category: 'country',
    matrix: 'B P P C T B X L A W Z J S A H A L G E R I A B M E F I A C W X L N B X Q Q E L U L R B E A J Y V B C I Y A A L A Z R Y A E N P Y E I M K N Y U W L A P F H K X E A Y S S G R I C J O R U T A M N I F N A E N I U G A G C U Y E G Y P T X T T U Q M T S A O C Y R O V I G',
    words: 'ALGERIA BELARUS BELGIUM CHILE EGYPT FRANCE GUATEMALA GUINEA IVORYCOAST LIBYA PHILIPPINES TANZANIA TURKEY'
  },{
    id: 17,
    category: 'sports',
    matrix: 'E S L I M P X D Y E B Y R C O L O A I T S R I E O I K L A V R S Q S A K D T O A I B O A W Z T C E S B N R R Y V T V H O O A G P C A T E F H L H U N Q A Z G T L L S O L Z M L S I N N E T L N N W Y K A Y A K I N G O X V G S O C C E R K H Q V U C Q M V N E Y K Y L S',
    words: 'BIATHLON DIVING GYMNASTICS HOCKEY KARATE KAYAKING LACROSSE MARATHON POLO RODEO SOCCER TENNIS VOLLEYBALL'
  },
  {
    id: 18,
    category: 'sports',
    matrix: 'F D J M W Y G W P B B G A T S S M O K K B G A N C H J E L R W A Y Z S I G N I F R U S M R I K V R N S K I I N G N A E I U O I E V A Y N K X T D G O B L S G E X K V B E B M D T R T O L O P A P Y D I U M U I Z R C L A K C Z O J P C F C S L X S F T B C E Q K I V Q V',
    words: 'BASKETBALL CURLING DIVING GOLF GYMNASTICS JUDO KARATE POLO RUGBY SKIING SURFING TENNIS'
  },
  {
    id: 19,
    category: 'bird',
    matrix: 'A T E E K I R O L P R D R M J C P T L B M A E R R E N N U R D A O R K I O R H T Y C G G Y T C B H L V S E P K L Y R E T S I I T I E R O H I P N D N F E F F K A O D D A P T A R M I G A N G O Q S P A R R O W N R E O E N A C U O T Y S I A W G F A L C O N V G C K P C',
    words: 'ANTBIRD CUCKOO FALCON KINGFISHER LORIKEET MAGPIE MERLIN PARAKEET PARTRIDGE PTARMIGAN ROADRUNNER SPARROW SWIFT TOUCAN WOODPECKER'
  },
  {
    id: 20,
    category: 'bird',
    matrix: 'K C D Q T R T S L P Z V R O H R X U Z E A C T K O C T I A S R R P O I G T K D E C L A K R T Z R S A K H S K L R E F G O R T Q I E O A A U Y N U M O S E W P O D M A I S J O T W R I E G E K W E L L I B N R O H R E P A P I G E O N A A Y J A T H S U R H T L R A I L X',
    words: 'CHICKADEE COCKATOO GOOSE GROUSE HORNBILL KITE KIWI LAPWING LARK MALLARD PARAKEET PARROT PIGEON RAIL STORK THRUSH TURKEY'
  }

  ];


  return {
    all: function() {
      return friends;
    },
    get: function(Id) {
      // Simple index lookup
      return Wordsmatrix[Id];
    }
  }
});

