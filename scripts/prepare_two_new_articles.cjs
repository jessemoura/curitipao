const fs = require('fs');

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// -------------------------------------------------------------
// ARTIGO 1: SHOKUPAN (Alvo: 1.300 a 1.700 palavras)
// -------------------------------------------------------------
const shokupanBody = `À primeira vista, o shokupan pode lembrar um pão de forma tradicional. Entretanto, sua textura extremamente macia, o miolo delicado e a casca fina revelam características que o tornaram um dos pães mais reconhecidos da panificação japonesa.

Seu formato quadrado ou retangular, combinado a uma textura leve e ligeiramente elástica, faz dele presença habitual nas mesas japonesas, especialmente no café da manhã e no preparo de sanduíches. Mais do que um alimento cotidiano, o shokupan representa uma síntese entre técnicas ocidentais e o cuidado artesanal característico da culinária do Japão.

Ao partir uma fatia de shokupan fresco com as mãos, não se ouve o estalo crocante típico das cascas rústicas europeias. Em vez disso, os dedos afundam suavemente em uma massa que desfia em camadas sedosas, liberando aroma discreto de leite, manteiga e fermentação equilibrada. Essa experiência sensorial única tem despertado a curiosidade de apreciadores de panificação em todo o mundo.

## O que significa shokupan?

Para compreender a identidade desse pão, vale olhar para a língua japonesa. A palavra shokupan (食パン) é formada por dois termos: *shoku* (食), que se refere a comida ou alimentação, e *pan* (パン), vocábulo de origem portuguesa introduzido no Japão séculos atrás para designar o pão.

Em tradução direta, shokupan significa literalmente "pão para comer" ou "pão de alimentação". Essa denominação surgiu para diferenciar o pão salgado e neutro, destinado a acompanhar refeições cotidianas ou a compor sanduíches, de outros preparos doces ou recheados populares no Japão desde o século XIX, como o *anpan* (recheado com pasta de feijão azuki) e o *melonpan* (pão doce com crosta crocante).

Embora o termo seja amplamente associado aos pães de forma brancos assados em formas retangulares, o shokupan não designa obrigatoriamente uma única receita ou método de produção. Trata-se de uma categoria ampla de pães de mesa que abrange desde formulações clássicas enriquecidas com leite integral até receitas contemporâneas preparadas com fermentação natural, manteigas artesanais ou diferentes proporções de hidratação.

## A história do pão no Japão

A trajetória do pão no Japão remonta a meados do século XVI, quando navegadores portugueses desembarcaram no arquipélago, introduzindo armas de fogo, tabaco e alimentos ocidentais — entre eles, o pão de trigo. Foi dessa convivência que nasceu a palavra japonesa *pan*, preservada no vocabulário local até hoje.

No entanto, com o fechamento das fronteiras durante o Período Edo (1603-1867), o consumo de pão foi praticamente extinto entre a população local, restrito a entrepostos em Nagasaki. O renascimento da panificação aconteceu na segunda metade do século XIX, com a Restauração Meiji e a reabertura do Japão às trocas comerciais e culturais internacionais.

A partir desse momento, padeiros japoneses começaram a adaptar receitas ocidentais aos hábitos alimentares locais, que historicamente valorizavam preparos suaves, úmidos e de mastigação macia, em harmonia com a textura do arroz cozido. Em vez de cascas duras e miolos com alvéolos abertos e rústicos, a preferência popular consolidou-se em torno de massas aveludadas e de casca extremamente fina.

Após a Segunda Guerra Mundial, o pão de forma ganhou impulso decisivo. A escassez de arroz no pós-guerra e os programas de merenda escolar apoiados por suprimentos de farinha e leite em pó consolidaram o pão na rotina familiar japonesa. Nas décadas seguintes, o que começou como resposta prática a um período de carência evoluiu para uma cultura de refinamento técnico, impulsionando padarias artesanais dedicadas a aperfeiçoar cada detalhe do shokupan.

## O segredo de um miolo tão macio

A característica mais admirada do shokupan é a maciez prolongada e a sensação de um miolo sedoso, que se desfaz suavemente na boca. Essa textura resulta de decisões técnicas que envolvem hidratação, enriquecimento da massa e processos específicos de pré-gelatinização do amido.

Na panificação convencional, massas de alta hidratação podem se tornar pegajosas e difíceis de manusear. Na produção do shokupan, muitos padeiros recorrem ao método *tangzhong* (ou *water roux*), técnica que consiste em cozinhar previamente uma pequena fração da farinha de trigo com água ou leite (geralmente na proporção de 1 para 5) a cerca de 65 °C.

Nessa temperatura, o calor provoca a gelatinização do amido da farinha, permitindo que ela retenha muito mais líquido do que a farinha crua. Quando essa pasta cremosa é resfriada e incorporada aos demais ingredientes, a massa adquire excelente capacidade de reter umidade durante o forneamento e nos dias seguintes, preservando o miolo úmido e fofo sem aditivos químicos.

Outro método tradicional muito utilizado no Japão é o *yudane*, que consiste em escaldar farinha de trigo diretamente com água fervente na proporção de 1 para 1, deixando a mistura descansar e esfriar antes de incorporá-la à massa principal. Ambos os métodos compartilham o mesmo princípio: maximizar a retenção hídrica por meio da gelatinização térmica do amido.

Além da pré-gelatinização, o shokupan exige um desenvolvimento cuidadoso do glúten. A sova precisa ser completa para estruturar paredes finas e elásticas, capazes de inflar uniformemente com os gases da fermentação. O controle da temperatura e a modelagem clássica — enrolando cilindros de massa posicionados lado a lado na forma — garantem que o pão cresça com fibras alinhadas verticalmente, facilitando o característico movimento de desfiar a fatia.

## Shokupan e pão de leite são a mesma coisa?

Devido ao uso frequente de leite na composição, é comum associar o shokupan ao pão de leite tradicional ou ao brioche europeu. No entanto, existem diferenças conceituais e estruturais importantes entre essas receitas.

O brioche francês clássico é uma massa densamente enriquecida com proporções altas de ovos e manteiga (que podem chegar a 50% ou mais em relação à farinha), resultando em textura untuosa, sabor amanteigado pronunciado e casca dourada e brilhante. O shokupan mantém perfil de sabor suave e comedido. Embora utilize manteiga e leite integral, as quantidades são dosadas com equilíbrio para que o pão permaneça leve e neutro, ideal para consumo cotidiano.

Em relação ao pão de leite convencional brasileiro ou português, o shokupan difere na estrutura do miolo e no método de preparo. Enquanto o pão de leite comum costuma apresentar miolo mais esfarelado após o primeiro dia, o shokupan preserva flexibilidade e elasticidade, permitindo fatias grossas e íntegras.

Frente ao pão de forma industrializado de supermercado, a diferença é ainda mais nítida: enquanto o produto industrial depende de emulsificantes, conservantes e gorduras vegetais para simular maciez, o shokupan artesanal conquista sua leveza por meio do trabalho físico sobre o glúten, da fermentação paciente e da retenção natural de umidade permitida pelo tangzhong ou yudane.

## Como os japoneses consomem shokupan?

No Japão, a versatilidade do shokupan transformou-o em protagonista de cafés tradicionais (*kissaten*), lanchonetes modernas e refeições domésticas. As maneiras de servi-lo evidenciam a valorização de contrastes sutis de texturas.

Um dos formatos mais populares é a torrada grossa servida com manteiga. As fatias costumam ser cortadas com espessuras generosas — frequentemente de 3 a 4 centímetros —, recebendo cortes superficiais em grade antes de irem para a chapa ou tostadeira. Esse preparo garante uma crosta exterior dourada e estaladiça, enquanto o centro permanece macio, fumegante e receptivo à manteiga derretida.

Outro pilar do consumo são os sanduíches japoneses conhecidos como *sando*. Diferente de sanduíches ocidentais pesados, o sando preza pela simetria visual, leveza e corte milimétrico, frequentemente com as cascas aparadas:

- **Tamago sando:** o clássico sanduíche recheado com salada de ovos cozidos, maionese japonesa e toque suave de pimenta. A cremosidade dos ovos combina perfeitamente com a maciez elástica do miolo.
- **Fruit sando:** preparação que reúne fatias de morango, kiwi, manga ou uvas frescas envolvidas em creme chantilly fresco entre duas fatias de shokupan. Servido gelado e cortado diagonalmente para exibir as cores das frutas, funciona como sobremesa refrescante.
- **Katsu sando:** sanduíche de costeleta de porco empanada em farinha panko, repolho finamente fatiado e molho agridoce, criando contraste marcante entre o crocante da carne e a suavidade do pão.

No cotidiano das famílias, o shokupan é consumido no café da manhã e em lanches rápidos, acompanhado de chá verde, café ou geleias de frutas da estação.

## Como reconhecer um bom shokupan?

Reconhecer um shokupan de alta qualidade requer atenção a detalhes que o diferenciam de pães rústicos de crosta dura:

1. **Aparência e casca:** A casca deve ser muito fina, flexível e de cor dourada clara uniforme. Em pães assados em forma fechada (*Pullman*), os cantos devem ser simétricos e retos.
2. **Estrutura do miolo:** O miolo precisa ser branco, sedoso e com alvéolos minúsculos e homogêneos, com trama contínua semelhante a uma esponja delicada.
3. **Elasticidade e retorno:** Ao ser pressionado levemente com os dedos, o miolo deve ceder sem resistência e retornar suavemente à forma inicial, sem esfarelar.
4. **Desfiamento da massa:** Ao partir o pão com as mãos, a massa deve se separar em tiras longas e elásticas, atestando o correto desenvolvimento do glúten.
5. **Aroma e sabor:** O aroma deve ser limpo e discretamente lácteo, com notas suaves de manteiga fresca, sem excesso de açúcar que mascare o cereal.

## Uma tradição que inspira a panificação contemporânea

A valorização do shokupan no cenário gastronômico internacional evidencia um movimento crescente de interesse pela diversidade de técnicas e estilos da panificação mundial. Ao lado de pães de casca espessa e fermentação longa da tradição europeia, o pão japonês demonstra que a busca pela excelência também pode se manifestar na leveza, no conforto e na precisão técnica.

Para os leitores que acompanham a cultura do pão pelo CuritiPão, conhecer o shokupan é um convite para expandir horizontes e compreender como diferentes povos moldam farinha e água segundo sua própria sensibilidade estética e cultural. Cada tradição revela um olhar único sobre o ato de alimentar, e o shokupan traduz essa busca em uma fatia de pura maciez e elegância.

### Fontes

- Kikkoman Corporation — Food Culture and Traditions: Shokupan in Japanese Dining:  
  <https://www.kikkoman.com/en/culture/foodforum/>

- King Arthur Baking Company — The Wonders of Tangzhong and Japanese Milk Bread:  
  <https://www.kingarthurbaking.com/recipes/japanese-milk-bread-recipe>`;

// -------------------------------------------------------------
// ARTIGO 2: CORTES NA MASSA DO PÃO (Alvo: 1.300 a 1.700 palavras)
// -------------------------------------------------------------
const cortesBody = Os cortes realizados na superfície da massa antes de o pão entrar no forno não servem apenas para criar desenhos bonitos.

Embora tenham papel estético, eles desempenham função técnica fundamental: orientar a expansão da massa durante os primeiros minutos de forneamento. Um corte bem executado contribui de maneira decisiva para a abertura da crosta, o volume e o formato final do pão artesanal.

Na bancada, o gesto do padeiro ao empunhar a lâmina parece simples e rápido. Em poucos segundos, traços precisos riscam a superfície esticada da massa. Por trás dessa agilidade reside um domínio atento da física da panificação, da tensão superficial e do momento exato de levar a massa ao forno.

## O que acontece com o pão dentro do forno?

Para compreender a necessidade dos cortes, é preciso observar as transformações que ocorrem assim que a massa entra no forno quente. Esse intervalo inicial de cozimento, correspondente aos primeiros 10 a 15 minutos, é dominado pelo fenômeno conhecido como *oven spring*, ou "salto de forno".

Quando o pão é acomodado no lastro quente, o impacto térmico imediato dispara reações rápidas no interior da massa:

1. **Expansão térmica dos gases:** As bolhas de dióxido de carbono retidas no glúten se aquecem e expandem rapidamente em volume.
2. **Formação de vapor:** A água da massa começa a evaporar, gerando pressão interna de vapor que procura vias de escape.
3. **Atividade transitória das leveduras:** Antes que o miolo atinja 55 °C a 60 °C — temperatura que encerra a vida das leveduras —, os microrganismos passam por um pico final e intenso de fermentação, produzindo mais gás em poucos minutos.

Essa pressão acumulada empurra a estrutura da massa para cima e para fora. Ao mesmo tempo, o calor seca e coagula a superfície externa, formando uma casca rígida. Sem pontos de alívio prévios, a pressão romperá a massa de forma desordenada no ponto mais frágil que encontrar.

Os cortes funcionam como válvulas de escape programadas. Ao criar incisões na superfície, o padeiro orienta onde e como a casca deve se abrir, permitindo que a massa atinja sua expansão máxima sem comprometer o formato ou a aeração do miolo.

## O que acontece quando o pão não recebe cortes?

Quando uma massa de pão entra no forno sem cortes, o resultado expõe a força dos gases em busca de alívio. Na maioria das vezes, a casca superior endurece antes do término da expansão interna, aprisionando o vapor.

Sem um canal superior para crescer, a pressão interna busca áreas de menor resistência — quase sempre nas laterais inferiores, junto à base ou nas dobras de modelagem. O resultado são rupturas caóticas, estouros laterais conhecidos como "bocas de jacaré" e formatos irregulares.

Além do aspecto visual, a ausência de corte prejudica a textura da fatia. Sem liberdade para crescer para cima, a massa fica comprimida, gerando um miolo mais denso, compacto e pesado na base, com distribuição irregular de alvéolos.

Vale ressaltar que nem todos os pães necessitam de cortes. Pães enriquecidos com gordura e açúcar, como brioches ou pães de forma assados em formas fechadas, possuem cascas maleáveis que crescem uniformemente sem incisões. Da mesma forma, certos pães de centeio ou massas assadas com a costura de modelagem voltada para cima (*seam side up*) aproveitam as dobras naturais da massa para abrir de modo orgânico no forno.

Experimentos editoriais clássicos da King Arthur Baking demonstraram claramente essa dinâmica com baguetes: massas idênticas assadas lado a lado, com e sem cortes, revelaram que as baguetes cortadas alcançaram volume expressivamente maior, casca mais leve e miolo visivelmente mais aerado do que as peças sem corte, que permaneceram cilíndricas, densas e com rupturas desordenadas na base.

## Qual é o instrumento utilizado pelo padeiro?

O instrumento tradicionalmente utilizado para realizar cortes na massa é a lâmina de padeiro, internacionalmente conhecida pela palavra francesa *lame* (pronuncia-se "lâm").

Embora pareça uma lâmina de barbear fixada em uma haste, a lame foi desenvolvida para oferecer um fio fino com o menor atrito possível. Facas de cozinha comuns, por mais afiadas que estejam, possuem lâminas mais grossas, que tendem a arrastar e rasgar a massa delicada em vez de abrir uma incisão limpa.

Existem dois formatos principais de lâminas de padeiro:

- **Lâmina curva:** Montada de forma arqueada sobre o suporte, essa curvatura permite posicionar o fio em ângulo raso e cortar por baixo da camada superficial da massa, criando a aba levantada conhecida como orelha. É a ferramenta predileta para pães ovais (*bâtards*) e pães de fermentação natural de alta hidratação.
- **Lâmina reta:** Permanece plana. É indicada para incisões perpendiculares de alívio rápido (como em pães redondos com cortes em cruz), baguetes com cortes angulados ou detalhes decorativos que exigem traços retos e controlados.

## A profundidade e o ângulo fazem diferença?

A técnica de corte envolve muito mais do que encostar o fio na massa. O ângulo de inclinação e a profundidade da incisão alteram completamente a forma como a crosta reage ao forneamento:

### O ângulo da lâmina

Quando a lâmina é mantida perpendicularmente a 90° em relação à superfície da massa, o corte se abre de maneira simétrica para os dois lados, como as bordas de uma fenda que se alarga. Esse ângulo é ideal para pães redondos (*boules*) com padrões em grade ou cruz, nos quais se busca uma abertura equilibrada e regular.

Por outro lado, quando a lâmina é inclinada em ângulo agudo e raso — tipicamente entre 30° e 45° —, o corte cria uma aba assimétrica de massa por cima da incisão. Durante o salto de forno, a pressão interna empurra o miolo sob essa aba, fazendo com que a borda fina se levante e toste rapidamente, formando a orelha crocante.

### A profundidade do corte

A profundidade ideal varia conforme a consistência da massa, seu grau de hidratação e o estágio de fermentação:

- **Massas firmes e jovens:** toleram cortes mais profundos (cerca de 1 a 1,5 centímetro) para que a forte pressão de expansão encontre passagem desimpedida.
- **Massas de alta hidratação ou fermentação avançada:** exigem incisões mais rápidas e rasas (cerca de 0,5 centímetro). Um corte profundo demais em uma massa delicada pode desestruturar a malha de glúten e fazer o pão desinflar antes de firmar no calor.

## O que é a famosa orelha do pão artesanal?

Entre apreciadores de pão de fermentação natural, a chamada "orelha" (em inglês, *ear*; em francês, *grigne*) é uma das características mais celebradas. Trata-se da crista proeminente, erguida e crocante que se forma ao longo da linha de corte.

A formação da orelha depende do alinhamento de quatro fatores essenciais:

1. **Tensão superficial na modelagem:** O padeiro deve modelar a massa criando uma película exterior firme e esticada sob tensão elástica.
2. **Ângulo inclinado do corte:** O uso de lâmina curva inclinada a cerca de 30° separa uma aba fina de massa na superfície.
3. **Presença de vapor nos primeiros minutos:** O vapor injetado no forno condensa-se sobre a superfície da massa, mantendo a casca flexível enquanto o miolo cresce com força total.
4. **Calor de lastro adequado:** O calor vindo da base impulsiona a massa para cima, abrindo o corte antes que o topo seque.

Apesar do apelo visual e da textura estaladiça da orelha, sua presença não define, isoladamente, a qualidade de um pão. Excelentes receitas tradicionais apresentam aberturas suaves e arredondadas sem cristas pontiagudas, dependendo do formato e dos ingredientes.

## Cortes funcionais e cortes decorativos

Na panificação artesanal contemporânea, os cortes dividem-se em duas abordagens complementares:

### Cortes funcionais

São as incisões primárias, mais profundas e decididas, cuja função principal é garantir o salto de forno ordenado. Exemplos clássicos incluem o corte longitudinal único de um *bâtard*, as incisões diagonais de uma baguete francesa ou o corte em cruz no topo de um pão camponês.

### Cortes decorativos

São incisões superficiais, feitas com a ponta da lâmina apenas na camada externa da massa e da farinha, sem comprometer a estrutura interna. O objetivo é puramente estético, criando motivos botânicos e geométricos que se revelam durante o assamento: espigas de trigo estilizadas, ramos de folhas delicadas e padrões circulares ou geométricos.

Muitos padeiros polvilham uma camada leve de farinha branca sobre a massa fria antes de cortar. O contraste entre a farinha e os tons dourados que emergem das incisões produz um efeito visual refinado.

## Por que alguns cortes não abrem corretamente?

Mesmo utilizando uma lâmina de qualidade, é comum deparar-se com cortes que cicatrizam precocemente, desaparecem no forno ou rasgam de forma irregular. As causas costumam associar-se ao manejo da massa e do forno:

- **Fermentação excessiva (*overproofing*):** Quando a massa passa do ponto ideal, a malha de glúten enfraquece e as leveduras perdem força motriz. Ao ser cortada, a massa não tem força de *oven spring* para empurrar o corte e tende a achatar.
- **Fermentação insuficiente (*underproofing*):** A massa jovem retém energia excessiva. O corte rasga de maneira abrupta e surgem fendas laterais desordenadas.
- **Falta de tensão na modelagem:** Se a massa não foi modelada com firmeza, a superfície frouxa faz a lâmina arrastar e emperrar.
- **Falta de vapor no forno:** Sem umidade nos minutos iniciais, a casca endurece depressa demais, bloqueando a expansão do corte.
- **Hesitação no movimento:** Cortar massa requer decisão e velocidade. Movimentos lentos fazem a massa grudar na lâmina, gerando bordas denteadas.

## O trabalho artesanal por trás de cada pão

O corte na massa representa o último gesto manual do padeiro antes que o calor do forno assuma a transformação do pão. É o instante em que o conhecimento técnico se une à sensibilidade visual e ao respeito pelo tempo de fermentação.

Ao observar a crosta dourada e os desenhos talhados no próximo pão que você escolher em uma padaria, lembre-se de que cada traço carrega história, física e dedicação humana. Essa valorização do fazer artesanal e dos profissionais da panificação é o compromisso que orienta a curadoria editorial do CuritiPão.

### Fontes

- King Arthur Baking Company — The Art of Bread Scoring: Guides and Techniques:  
  <https://www.kingarthurbaking.com/blog/2017/11/17/scoring-bread>

- King Arthur Baking Company — Bread Scoring Experiments: Why Slashing Changes Crust and Crumb:  
  <https://www.kingarthurbaking.com/learn/guides/bread-scoring>;

const count1 = countWords(shokupanBody);
const count2 = countWords(cortesBody);

console.log('Shokupan word count:', count1, (count1 >= 1300 && count1 <= 1700) ? 'OK' : 'OUT OF RANGE');
console.log('Cortes word count:', count2, (count2 >= 1300 && count2 <= 1700) ? 'OK' : 'OUT OF RANGE');

fs.writeFileSync('scripts/draft_shokupan.txt', shokupanBody, 'utf8');
fs.writeFileSync('scripts/draft_cortes.txt', cortesBody, 'utf8');
