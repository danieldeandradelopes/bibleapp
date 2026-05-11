import { bibleBooks } from "@/lib/seed-data/books";

export type ChapterContextSeed = {
  bookSlug: string;
  chapterNumber: number;
  summary: string;
  author: string;
  historicalPeriod: string;
  audience: string;
  purpose: string;
  curiosities: string;
  sourceLabel?: string;
};

type ChapterGenre =
  | "law"
  | "history"
  | "wisdom"
  | "psalm"
  | "gospel"
  | "acts"
  | "epistle"
  | "prophecy"
  | "apocalyptic";

type ChapterPhase = "opening" | "middle" | "closing";

type BookContextProfile = {
  genre: ChapterGenre;
  author: string;
  historicalPeriod: string;
  audience: string;
  purpose: string;
  curiosities: string;
  emphasis: string;
  openingFocus: string;
  middleFocus: string;
  closingFocus: string;
};

const sourceLabel = "Base editorial automatica do BibleApp";

function createProfile(
  base: Omit<BookContextProfile, "openingFocus" | "middleFocus" | "closingFocus" | "emphasis">,
  overrides: Pick<
    BookContextProfile,
    "openingFocus" | "middleFocus" | "closingFocus" | "emphasis" | "purpose" | "curiosities"
  > &
    Partial<Pick<BookContextProfile, "author" | "historicalPeriod" | "audience">>,
): BookContextProfile {
  return {
    ...base,
    ...overrides,
  };
}

const lawBase = {
  genre: "law" as const,
  author: "Tradicionalmente atribuido a Moises.",
  historicalPeriod: "Formacao de Israel e memoria do Pentateuco.",
  audience: "Israel em formacao e leitores que precisavam entender a alianca.",
  purpose: "",
  curiosities: "",
};

const historyBase = {
  genre: "history" as const,
  author: "Tradicoes historicas do povo de Israel preservadas por autores e compiladores diversos.",
  historicalPeriod: "Historia de Israel entre a terra prometida, a monarquia, o exilio e o retorno.",
  audience: "O povo de Deus e leitores interessados no desenvolvimento da alianca ao longo da historia.",
  purpose: "",
  curiosities: "",
};

const wisdomBase = {
  genre: "wisdom" as const,
  author: "Colecao poetica e sapiencial ligada a autores e tradicoes diversas de Israel.",
  historicalPeriod: "Literatura sapiencial e poetica do Antigo Testamento.",
  audience: "Leitores em busca de sabedoria pratica, adoracao e reflexao sobre a vida diante de Deus.",
  purpose: "",
  curiosities: "",
};

const psalmBase = {
  genre: "psalm" as const,
  author: "Colecao de salmos ligados a Davi, Asafe, filhos de Core e outros compositores.",
  historicalPeriod: "Uso liturgico e devocional de Israel ao longo de varios periodos.",
  audience: "Comunidade de adoracao de Israel e leitores que transformam a fe em oracao.",
  purpose: "",
  curiosities: "",
};

const prophetBase = {
  genre: "prophecy" as const,
  author: "Profeta e circulo de transmissao ligados ao livro.",
  historicalPeriod: "Ministerio profetico em meio a crises politicas, espirituais e sociais de Israel e das nacoes.",
  audience: "Israel, Juda e, em alguns casos, nacoes vizinhas ou comunidades no exilio.",
  purpose: "",
  curiosities: "",
};

const gospelBase = {
  genre: "gospel" as const,
  author: "Evangelista da tradicao apostolica.",
  historicalPeriod: "Primeiro seculo, no contexto do ministerio de Jesus e da igreja primitiva.",
  audience: "Comunidades cristas que precisavam compreender quem Jesus e e como segui-lo.",
  purpose: "",
  curiosities: "",
};

const actsBase = {
  genre: "acts" as const,
  author: "Lucas.",
  historicalPeriod: "Expansao inicial da igreja apos a ressurreicao de Jesus.",
  audience: "Cristaos e interessados na origem do movimento cristao.",
  purpose: "",
  curiosities: "",
};

const paulBase = {
  genre: "epistle" as const,
  author: "Paulo.",
  historicalPeriod: "Correspondencia apostolica do primeiro seculo em meio as viagens missionarias e ao cuidado das igrejas.",
  audience: "Igrejas locais e lideres que precisavam de orientacao doutrinaria e pratica.",
  purpose: "",
  curiosities: "",
};

const generalLetterBase = {
  genre: "epistle" as const,
  author: "Autor da tradicao apostolica do primeiro seculo.",
  historicalPeriod: "Igreja primitiva enfrentando crescimento, oposicao e necessidade de amadurecimento.",
  audience: "Comunidades cristas dispersas ou destinatarios especificos ligados a rede apostolica.",
  purpose: "",
  curiosities: "",
};

const apocalypticBase = {
  genre: "apocalyptic" as const,
  author: "Joao.",
  historicalPeriod: "Fim do primeiro seculo, em ambiente de pressao imperial sobre a igreja.",
  audience: "Igrejas que precisavam perseverar com esperanca em meio a oposicao.",
  purpose: "",
  curiosities: "",
};

const bookProfiles: Record<string, BookContextProfile> = {
  genesis: createProfile(lawBase, {
    purpose: "Mostrar as origens da criacao, da humanidade, do pecado e da familia da alianca.",
    curiosities: "Genesis funciona como porta de entrada para toda a Biblia e explica varias bases da historia biblica.",
    emphasis: "Deus conduz a historia desde o inicio e preserva sua promessa",
    openingFocus: "as origens da criacao, da humanidade e da ruptura causada pelo pecado",
    middleFocus: "a trajetoria dos patriarcas e o amadurecimento da promessa feita por Deus",
    closingFocus: "a historia de Jose e a preservacao da familia da alianca no Egito",
  }),
  exodo: createProfile(lawBase, {
    purpose: "Narrar a libertacao do Egito e a formacao de Israel como povo da alianca.",
    curiosities: "Exodo combina narrativa historica, instituicoes de culto e memoria fundadora do povo.",
    emphasis: "Deus liberta, guia e organiza um povo para sua presenca",
    openingFocus: "a opressao no Egito e o inicio da libertacao conduzida por Deus",
    middleFocus: "o caminho no deserto, a alianca e as orientacoes dadas ao povo",
    closingFocus: "o tabernaculo e a preparacao para a presenca divina no meio da comunidade",
  }),
  levitico: createProfile(lawBase, {
    purpose: "Ensinar santidade, culto, pureza e vida consagrada diante de Deus.",
    curiosities: "Levitico parece tecnico, mas estrutura a vida espiritual, comunitaria e sacerdotal de Israel.",
    emphasis: "a relacao com Deus envolve santidade concreta e culto responsavel",
    openingFocus: "os sacrificios e a organizacao do culto no tabernaculo",
    middleFocus: "pureza, sacerdocio e limites que moldam a vida comunitaria",
    closingFocus: "santidade pratica, festas e compromissos da alianca no cotidiano",
  }),
  numeros: createProfile(lawBase, {
    purpose: "Registrar a caminhada no deserto, as crises do povo e a preparacao para entrar na terra.",
    curiosities: "Numeros alterna censos, organizacao do acampamento e episodios de murmuracao e disciplina.",
    emphasis: "Deus continua conduzindo o povo apesar das resistencias no deserto",
    openingFocus: "a organizacao do povo e a preparacao inicial para a jornada",
    middleFocus: "as crises, murmuracoes e respostas de Deus durante a travessia",
    closingFocus: "a nova geracao e os ajustes finais para a entrada na terra prometida",
  }),
  deuteronomio: createProfile(lawBase, {
    purpose: "Renovar a alianca antes da entrada na terra prometida por meio dos discursos finais de Moises.",
    curiosities: "Deuteronomio relembra leis e eventos passados com forte tom pastoral e exortativo.",
    emphasis: "lembrar a alianca e obedecer a Deus e decisivo para o futuro do povo",
    openingFocus: "a memoria da caminhada e a necessidade de ouvir novamente a alianca",
    middleFocus: "a renovacao dos mandamentos e a aplicacao deles a vida do povo",
    closingFocus: "as ultimas exortacoes, a despedida de Moises e a transicao de lideranca",
  }),
  josue: createProfile(historyBase, {
    purpose: "Mostrar a entrada na terra, a conquista inicial e a distribuicao da heranca.",
    curiosities: "Josue une campanhas militares, organizacao territorial e renovacao de compromisso com Deus.",
    emphasis: "a fidelidade de Deus a promessa exige resposta de obediencia",
    openingFocus: "a travessia e o inicio da ocupacao da terra prometida",
    middleFocus: "as conquistas, reparticoes e desafios ligados a permanencia na terra",
    closingFocus: "a reafirmacao da alianca e os apelos finais a fidelidade",
  }),
  juizes: createProfile(historyBase, {
    purpose: "Revelar os ciclos de queda, opressao, clamor e livramento vividos por Israel.",
    curiosities: "Juizes mostra como a falta de lideranca estavel aprofunda a crise espiritual e social.",
    emphasis: "sem fidelidade a Deus, a vida coletiva se deteriora rapidamente",
    openingFocus: "a instalacao incompleta na terra e os primeiros sinais de infidelidade",
    middleFocus: "os ciclos de libertadores e a repeticao das mesmas falhas do povo",
    closingFocus: "o agravamento da crise moral e a desordem geral em Israel",
  }),
  rute: createProfile(historyBase, {
    purpose: "Narrar uma historia de fidelidade, cuidado e restauracao dentro da linhagem davidia.",
    curiosities: "Rute mostra como uma historia cotidiana se conecta com a grande historia da redencao.",
    emphasis: "Deus trabalha tambem em historias discretas de lealdade e cuidado",
    openingFocus: "a perda familiar e a decisao fiel de permanecer ao lado de Noemi",
    middleFocus: "a provisao encontrada no cotidiano e o amadurecimento das relacoes",
    closingFocus: "a restauracao da familia e sua conexao com a linhagem de Davi",
  }),
  "1-samuel": createProfile(historyBase, {
    purpose: "Registrar a transicao dos juizes para a monarquia com destaque para Samuel, Saul e Davi.",
    curiosities: "O livro mostra como carater, lideranca e obediencia moldam o futuro de Israel.",
    emphasis: "Deus levanta e remove lideres segundo sua propria avaliacao",
    openingFocus: "o chamado de Samuel e os primeiros movimentos rumo a mudanca de lideranca",
    middleFocus: "o reinado de Saul e a ascensao gradual de Davi",
    closingFocus: "os conflitos finais de Saul e a preparacao para a mudanca de reinado",
  }),
  "2-samuel": createProfile(historyBase, {
    purpose: "Narrar o reinado de Davi, suas conquistas, crises e legado.",
    curiosities: "O livro combina triunfo politico, profundidade espiritual e crises familiares intensas.",
    emphasis: "mesmo em um grande reinado, pecado e responsabilidade continuam em jogo",
    openingFocus: "a consolidacao do reinado de Davi e a organizacao inicial do reino",
    middleFocus: "as tensoes do reinado, incluindo pecado, disciplina e conflitos internos",
    closingFocus: "os ultimos atos de Davi e a memoria de seu legado para Israel",
  }),
  "1-reis": createProfile(historyBase, {
    purpose: "Acompanhar o reino de Salomao e a divisao posterior entre norte e sul.",
    curiosities: "O livro destaca como sabedoria, idolatria e politica se misturam no destino do reino.",
    emphasis: "a fidelidade a Deus pesa mais do que brilho politico ou estabilidade aparente",
    openingFocus: "a sucessao de Davi e o auge inicial do reinado de Salomao",
    middleFocus: "a divisao do reino e os primeiros conflitos entre fidelidade e idolatria",
    closingFocus: "a repeticao de reis e o contraste entre profetas e governantes",
  }),
  "2-reis": createProfile(historyBase, {
    purpose: "Relatar o declinio dos reinos de Israel e Juda ate a queda e o exilio.",
    curiosities: "2 Reis alterna atos profeticos, reformas pontuais e a marcha persistente para o juizo.",
    emphasis: "o abandono da alianca cobra um preco historico real",
    openingFocus: "os primeiros desdobramentos da crise dos reinos e a atuacao profetica",
    middleFocus: "reis sucessivos, reformas insuficientes e agravamento espiritual do povo",
    closingFocus: "a queda de Samaria e Jerusalem e o impacto final do exilio",
  }),
  "1-cronicas": createProfile(historyBase, {
    purpose: "Recontar a historia de Israel com foco em genealogias, Davi e o culto.",
    curiosities: "Cronicas reorganiza a memoria nacional enfatizando templo, sacerdocio e adoracao.",
    emphasis: "identidade, culto e lideranca precisam estar alinhados ao proposito de Deus",
    openingFocus: "as genealogias e as bases da identidade do povo",
    middleFocus: "a consolidacao de Davi e a organizacao do culto",
    closingFocus: "os preparativos finais para o templo e o legado deixado para a proxima geracao",
  }),
  "2-cronicas": createProfile(historyBase, {
    purpose: "Recontar o periodo dos reis de Juda com destaque para templo, reformas e queda.",
    curiosities: "O livro ressalta como renovacao espiritual e adoração se conectam a estabilidade nacional.",
    emphasis: "a historia de Juda e lida a partir da fidelidade ao templo e a alianca",
    openingFocus: "Salomao, o templo e o auge inicial da monarquia em Jerusalem",
    middleFocus: "reformas, desvios e tensoes acumuladas no reino de Juda",
    closingFocus: "o declinio final, o exilio e a abertura para o retorno",
  }),
  esdras: createProfile(historyBase, {
    purpose: "Narrar o retorno do exilio, a restauracao do culto e o ensino da lei.",
    curiosities: "Esdras alterna listas, oposicao politica e renovacao espiritual do povo.",
    emphasis: "restauracao verdadeira envolve culto, identidade e obediencia renovada",
    openingFocus: "o retorno inicial e a retomada do altar e do templo",
    middleFocus: "os desafios administrativos e espirituais da reconstrucao",
    closingFocus: "a reorganizacao do povo ao redor da lei e da santidade comunitaria",
  }),
  neemias: createProfile(historyBase, {
    purpose: "Registrar a reconstrucao dos muros e a reorganizacao da comunidade restaurada.",
    curiosities: "Neemias une administracao pratica, lideranca corajosa e renovacao espiritual.",
    emphasis: "lideranca fiel organiza o povo para uma restauracao visivel e duradoura",
    openingFocus: "a visao inicial de reconstruir e reorganizar Jerusalem",
    middleFocus: "o trabalho em meio a oposicao e o fortalecimento da comunidade",
    closingFocus: "as reformas finais e a tentativa de consolidar a renovacao espiritual",
  }),
  ester: createProfile(historyBase, {
    author: "Tradicao judaica preservada em torno da festa de Purim.",
    historicalPeriod: "Periodo persa, entre os judeus que permaneceram fora da terra.",
    audience: "Comunidade judaica em dispersao e leitores atentos a providencia divina.",
    purpose: "Mostrar a preservacao do povo judeu em contexto de risco politico.",
    curiosities: "O nome de Deus nao aparece explicitamente no livro, mas a providencia atravessa toda a narrativa.",
    emphasis: "a providencia de Deus pode agir de forma discreta em cenarios politicos complexos",
    openingFocus: "o ambiente persa e os eventos que colocam Ester em posicao decisiva",
    middleFocus: "a ameaca contra os judeus e a elaboracao da resposta dentro do palacio",
    closingFocus: "a reversao do decreto e a memoria comunitaria do livramento",
  }),
  jo: createProfile(wisdomBase, {
    purpose: "Explorar sofrimento, justica divina, limite humano e perseveranca.",
    curiosities: "Jo alterna prologo narrativo, longos discursos poeticos e resposta final de Deus.",
    emphasis: "nem todo sofrimento cabe em explicacoes simples ou mecanicas",
    openingFocus: "a crise inicial de Jo e o impacto dela sobre sua vida",
    middleFocus: "os dialogos sobre sofrimento, culpa, sabedoria e limite humano",
    closingFocus: "a resposta divina, a humilhacao de Jo e a restauracao final",
  }),
  salmos: createProfile(psalmBase, {
    purpose: "Oferecer linguagem de oracao, louvor, lamento, gratidao e memoria da fe.",
    curiosities: "Salmos funciona como livro de oracoes da comunidade e do individuo.",
    emphasis: "a vida espiritual pode ser levada inteira a presenca de Deus em forma de oracao",
    openingFocus: "caminhos de sabedoria, confianca e adoracao na relacao com Deus",
    middleFocus: "clamor, memoria, justica, peregrinacao e renovacao da esperanca",
    closingFocus: "louvor crescente, gratidao e celebracao da fidelidade divina",
  }),
  proverbios: createProfile(wisdomBase, {
    purpose: "Ensinar sabedoria pratica para escolhas, relacionamentos, trabalho e fala.",
    curiosities: "Provbios combina discursos mais longos e colecoes de ditos curtos e memoraveis.",
    emphasis: "a sabedoria biblica nasce do temor do Senhor e se manifesta na vida diaria",
    openingFocus: "a introducao a sabedoria e os convites para seguir o caminho certo",
    middleFocus: "os contrastes praticos entre prudencia, tolice, fala e conduta",
    closingFocus: "os conselhos finais e a consolidacao da sabedoria para a vida comum",
  }),
  eclesiastes: createProfile(wisdomBase, {
    purpose: "Refletir sobre sentido, limite, tempo e dependencia de Deus.",
    curiosities: "O livro observa a vida debaixo do sol com realismo e tom provocativo.",
    emphasis: "sem referencia a Deus, a experiencia humana permanece limitada e incompleta",
    openingFocus: "as perguntas iniciais sobre vaidade, repeticao e busca de sentido",
    middleFocus: "as observacoes sobre trabalho, prazer, tempo, injustica e sabedoria",
    closingFocus: "a sintese final que recoloca o temor do Senhor no centro",
  }),
  canticos: createProfile(wisdomBase, {
    purpose: "Celebrar amor, beleza, desejo, fidelidade e admiracao mutua.",
    curiosities: "Canticos usa poesia intensa e imagens naturais para falar do amor humano.",
    emphasis: "o amor merece ser tratado com beleza, paciencia e profundidade",
    openingFocus: "o encanto inicial, a admiracao e o desejo entre os amantes",
    middleFocus: "o amadurecimento da relacao, a busca e os encontros marcantes",
    closingFocus: "a consolidacao da fidelidade e a forca simbolica do amor",
  }),
  isaias: createProfile(prophetBase, {
    author: "Isaias e o circulo profetico ligado ao seu ministerio.",
    historicalPeriod: "Crises politicas de Juda do oitavo seculo a.C. e ecos posteriores da restauracao.",
    audience: "Juda, Jerusalem e leitores que precisavam ouvir juizo e consolo.",
    purpose: "Denunciar pecado, anunciar juizo e sustentar esperança de restauracao e reino futuro.",
    curiosities: "Isaias combina forte denuncia, imagens grandiosas e expectativa messianica.",
    emphasis: "o Deus santo julga o pecado, mas tambem abre caminho para restauracao",
    openingFocus: "a denuncia inicial contra o pecado e o chamado a ouvir o Deus santo",
    middleFocus: "juizo sobre povos, crises politicas e promessas de esperanca messianica",
    closingFocus: "consolo, restauracao e visoes amplas da salvacao futura",
  }),
  jeremias: createProfile(prophetBase, {
    author: "Jeremias e seus escribas, com destaque para Baruque.",
    historicalPeriod: "Ultimas decadas de Juda antes da queda de Jerusalem e durante o exilio.",
    audience: "Juda em crise, sobreviventes da queda e exilados.",
    purpose: "Chamar ao arrependimento e explicar a queda de Jerusalem sem perder a esperanca.",
    curiosities: "Jeremias mistura confissoes pessoais, discursos publicos e narrativas historicas.",
    emphasis: "fidelidade a Deus continua sendo o eixo da esperanca mesmo no colapso nacional",
    openingFocus: "o chamado do profeta e os primeiros alertas a uma sociedade endurecida",
    middleFocus: "o conflito crescente entre a mensagem profetica, os lideres e o povo",
    closingFocus: "a queda de Jerusalem, as consequencias do juizo e a janela para nova alianca",
  }),
  lamentacoes: createProfile(prophetBase, {
    author: "Tradicionalmente associado a Jeremias, embora a autoria nao seja consensual.",
    historicalPeriod: "Depois da queda de Jerusalem em 586 a.C.",
    audience: "Sobreviventes da destruicao e comunidades marcadas pelo luto.",
    purpose: "Dar voz ao lamento e manter a memoria da queda diante de Deus.",
    curiosities: "Os poemas usam estruturas alfabeticas e imagens intensas de dor coletiva.",
    emphasis: "o sofrimento pode ser levado a Deus sem esconder a gravidade da perda",
    openingFocus: "a dor imediata da cidade destruida e do povo abalado",
    middleFocus: "o aprofundamento do lamento e a busca por sentido em meio a ruina",
    closingFocus: "a memoria persistente da dor e a insistencia em pedir restauracao",
  }),
  ezequiel: createProfile(prophetBase, {
    author: "Ezequiel.",
    historicalPeriod: "Exilio babilonico.",
    audience: "Exilados judeus tentando compreender o juizo e o futuro.",
    purpose: "Explicar o exilio, insistir na responsabilidade pessoal e anunciar restauracao.",
    curiosities: "O livro e marcado por visoes simbolicas, gestos dramatizados e imagens fortes.",
    emphasis: "o Deus soberano continua falando e agindo mesmo fora da terra",
    openingFocus: "visoes inaugurais e anuncio do juizo inevitavel",
    middleFocus: "responsabilidade, queda, critica aos lideres e promessas de restauracao",
    closingFocus: "a renovacao do povo, da terra e da visao do templo futuro",
  }),
  daniel: createProfile(prophetBase, {
    author: "Daniel e tradicoes ligadas ao seu testemunho.",
    historicalPeriod: "Exilio e dominio de imperios estrangeiros.",
    audience: "Comunidades que precisavam perseverar em fidelidade sob poder estrangeiro.",
    purpose: "Encorajar fidelidade e mostrar que os reinos humanos estao sob o governo de Deus.",
    curiosities: "Daniel combina narrativas de corte e visoes apocalipticas.",
    emphasis: "Deus governa acima dos imperios e sustenta os fieis em qualquer contexto",
    openingFocus: "a fidelidade de Daniel e seus companheiros em ambiente hostil",
    middleFocus: "o confronto entre reinos humanos e o governo soberano de Deus",
    closingFocus: "as visoes finais sobre crise, perseveranca e esperanca futura",
  }),
  oseias: createProfile(prophetBase, {
    author: "Oseias.",
    historicalPeriod: "Reino do Norte antes da queda de Samaria.",
    audience: "Israel do Norte e leitores que precisavam ouvir sobre infidelidade e retorno.",
    purpose: "Expor a infidelidade da alianca e anunciar a restauracao do amor de Deus.",
    curiosities: "A vida familiar do profeta se torna sinal vivo da mensagem anunciada.",
    emphasis: "o amor de Deus confronta a infidelidade sem desistir da restauracao",
    openingFocus: "o simbolismo inicial da vida do profeta e a acusacao contra a infidelidade",
    middleFocus: "a denuncia do pecado coletivo e os apelos insistentes ao retorno",
    closingFocus: "a perspectiva de cura, restauracao e renovacao da alianca",
  }),
  joel: createProfile(prophetBase, {
    author: "Joel.",
    historicalPeriod: "Contexto de crise nacional, com data discutida entre os estudiosos.",
    audience: "Juda e leitores convocados ao arrependimento coletivo.",
    purpose: "Interpretar a crise como chamado ao retorno e abrir horizonte de renovacao.",
    curiosities: "Joel parte de uma calamidade concreta e a expande para o tema do Dia do Senhor.",
    emphasis: "crise pode se tornar convite urgente ao arrependimento e a esperanca",
    openingFocus: "a calamidade inicial e o choque provocado sobre a terra e o povo",
    middleFocus: "o chamado comunitario ao jejum, arrependimento e busca por Deus",
    closingFocus: "a promessa de restauracao e do derramamento do Espirito",
  }),
  amos: createProfile(prophetBase, {
    author: "Amos.",
    historicalPeriod: "Prosperidade aparente no Reino do Norte, antes da queda.",
    audience: "Israel e especialmente suas elites acomodadas.",
    purpose: "Denunciar injustica, religiosidade vazia e falsa seguranca.",
    curiosities: "Amos vem do campo e fala com contundencia contra abusos sociais e culto hipocrita.",
    emphasis: "Deus exige justica concreta e nao aceita devocao divorciada da vida publica",
    openingFocus: "os anuncios iniciais de juizo contra as nacoes e contra Israel",
    middleFocus: "a denuncia direta da injustica, da opressao e da falsa religiosidade",
    closingFocus: "a reta final do juizo acompanhada de breve horizonte de restauracao",
  }),
  obadias: createProfile(prophetBase, {
    author: "Obadias.",
    historicalPeriod: "Depois de violencia sofrida por Juda, em contexto debatido.",
    audience: "Juda e leitores que precisavam ouvir sobre justica diante da arrogancia de Edom.",
    purpose: "Anunciar a queda de Edom e reafirmar a justica de Deus sobre os orgulhosos.",
    curiosities: "Obadias e o livro mais curto do Antigo Testamento.",
    emphasis: "arrogancia politica e violencia contra o irmao nao ficam sem resposta",
    openingFocus: "o anuncio direto do juizo contra Edom",
    middleFocus: "as razoes da condenacao e o contraste entre arrogancia e queda",
    closingFocus: "a restauracao de Siao e a afirmacao do reino de Deus",
  }),
  jonas: createProfile(prophetBase, {
    author: "Jonas na tradicao do livro.",
    historicalPeriod: "Cenario assirio, com narrativa profetica de forte valor pedagogico.",
    audience: "Israel e leitores que precisavam aprender sobre misericordia e missao.",
    purpose: "Mostrar a tensao entre justica, compaixao e resistencia humana a missao.",
    curiosities: "Jonas se destaca pela narrativa curta e pelo final aberto em tom de pergunta.",
    emphasis: "a misericordia de Deus alcanca pessoas e povos para alem das fronteiras esperadas",
    openingFocus: "a fuga do profeta diante do chamado missionario",
    middleFocus: "a disciplina, o retorno e a proclamacao em Ninive",
    closingFocus: "a reacao de Jonas e a licao final sobre misericordia",
  }),
  miqueias: createProfile(prophetBase, {
    author: "Miqueias.",
    historicalPeriod: "Oitavo seculo a.C., em contexto parecido com Isaias.",
    audience: "Juda, Samaria e leitores atentos a temas de justica e lideranca.",
    purpose: "Denunciar exploracao e corrupcao, enquanto aponta para restauracao futura.",
    curiosities: "Miqueias alterna acusacao forte contra lideres e uma visao esperancosa do futuro.",
    emphasis: "Deus requer justica, misericordia e humildade de seu povo",
    openingFocus: "os primeiros anuncios de juizo sobre Samaria e Jerusalem",
    middleFocus: "as denuncias contra lideres, exploradores e falsos porta-vozes",
    closingFocus: "a restauracao futura e a sintese de uma vida piedosa e justa",
  }),
  naum: createProfile(prophetBase, {
    author: "Naum.",
    historicalPeriod: "Antes da queda de Ninive.",
    audience: "Juda e leitores oprimidos pelo poder assirio.",
    purpose: "Anunciar a queda de Ninive e consolar quem sofreu sob opressao.",
    curiosities: "Naum funciona como contrapeso ao livro de Jonas, agora com foco no juizo sobre a Assiria.",
    emphasis: "Deus nao ignora por tempo indefinido a violencia dos imperios",
    openingFocus: "a apresentacao do juizo contra Ninive e do carater justo de Deus",
    middleFocus: "as imagens de queda e humilhacao do poder opressor",
    closingFocus: "a confirmacao da derrota de Ninive e o alivio para os oprimidos",
  }),
  habacuque: createProfile(prophetBase, {
    author: "Habacuque.",
    historicalPeriod: "Fim do reino de Juda, sob crescente ameaca babilonica.",
    audience: "Leitores perplexos com violencia, demora e juizo.",
    purpose: "Trabalhar a tensao entre perguntas honestas e confianca perseverante.",
    curiosities: "Habacuque registra um dialogo raro e muito direto entre profeta e Deus.",
    emphasis: "a fe perseverante continua possivel mesmo quando as respostas demoram",
    openingFocus: "as perguntas iniciais do profeta diante da violencia e do silencio",
    middleFocus: "as respostas divinas, os ais e a ampliacao do horizonte historico",
    closingFocus: "a oracao final de confianca apesar do cenario adverso",
  }),
  sofonias: createProfile(prophetBase, {
    author: "Sofonias.",
    historicalPeriod: "Periodo de reformas em Juda, antes da queda definitiva.",
    audience: "Juda e leitores advertidos sobre indiferenca espiritual.",
    purpose: "Anunciar o Dia do Senhor como juizo e purificacao, com esperanca para um remanescente.",
    curiosities: "O livro e curto, mas combina severidade e ternura com grande concentracao.",
    emphasis: "o juizo de Deus tambem prepara um povo humilde e restaurado",
    openingFocus: "o anuncio do Dia do Senhor e o impacto sobre uma sociedade acomodada",
    middleFocus: "a denuncia contra cidades, lideres e nacoes ao redor",
    closingFocus: "a purificacao do povo e a alegria da restauracao futura",
  }),
  ageu: createProfile(prophetBase, {
    author: "Ageu.",
    historicalPeriod: "Pos-exilio, no periodo persa.",
    audience: "Comunidade que retornou a Jerusalem e adiava a obra do templo.",
    purpose: "Chamar o povo a reorganizar prioridades e retomar a reconstrucao do templo.",
    curiosities: "Ageu e muito datado e objetivo, quase como uma agenda espiritual da restauracao.",
    emphasis: "prioridades espirituais moldam o ritmo e a saude da comunidade restaurada",
    openingFocus: "o confronto inicial com a negligencia em relacao ao templo",
    middleFocus: "o encorajamento para continuar a obra apesar de comparacoes e cansaco",
    closingFocus: "a promessa de estabilidade futura ligada a obediencia presente",
  }),
  zacarias: createProfile(prophetBase, {
    author: "Zacarias.",
    historicalPeriod: "Pos-exilio, ao lado do processo de reconstrucao do templo.",
    audience: "Comunidade restaurada que precisava de encorajamento e visao ampla.",
    purpose: "Sustentar a restauracao presente e ampliar a esperanca escatologica.",
    curiosities: "Zacarias combina visoes noturnas, simbolos sacerdotais e imagens do rei futuro.",
    emphasis: "Deus restaura seu povo e orienta a historia para um futuro maior",
    openingFocus: "as visoes iniciais que encorajam o retorno e a reconstrucao",
    middleFocus: "os temas de santidade, lideranca e renovacao comunitaria",
    closingFocus: "as imagens do rei, do sofrimento e da restauracao final",
  }),
  malaquias: createProfile(prophetBase, {
    author: "Malaquias.",
    historicalPeriod: "Pos-exilio, em periodo de desgaste espiritual.",
    audience: "Comunidade judaica restaurada, mas espiritualmente relaxada.",
    purpose: "Confrontar apatia no culto, nos relacionamentos e na fidelidade da alianca.",
    curiosities: "Malaquias usa perguntas e respostas curtas para expor justificativas do povo.",
    emphasis: "rotina religiosa sem fidelidade pratica esvazia a vida de alianca",
    openingFocus: "o confronto inicial com o culto negligente e a perda de reverencia",
    middleFocus: "as discussoes sobre alianca, lideranca e fidelidade cotidiana",
    closingFocus: "a expectativa do Dia do Senhor e da preparacao para sua chegada",
  }),
  mateus: createProfile(gospelBase, {
    author: "Mateus.",
    audience: "Leitores judaicos e comunidades que precisavam enxergar Jesus como cumprimento das promessas.",
    purpose: "Apresentar Jesus como Rei prometido, Mestre e Messias.",
    curiosities: "Mateus organiza muito do material de Jesus em grandes blocos de ensino.",
    emphasis: "Jesus cumpre as promessas e chama seus seguidores a uma justica profunda",
    openingFocus: "as origens de Jesus e a apresentacao do Rei prometido",
    middleFocus: "os ensinos, sinais e confrontos que revelam a identidade de Jesus",
    closingFocus: "a reta final em Jerusalem, a paixao, a ressurreicao e a missao",
  }),
  marcos: createProfile(gospelBase, {
    author: "Marcos, associado ao circulo apostolico de Pedro.",
    audience: "Cristaos que precisavam de um retrato direto e dinamico de Jesus.",
    purpose: "Retratar Jesus em acao, com autoridade e chamado ao discipulado.",
    curiosities: "Marcos usa ritmo acelerado e muita movimentacao de cenas.",
    emphasis: "seguir Jesus envolve enxergar sua autoridade e caminhar com ele ate a cruz",
    openingFocus: "a apresentacao veloz do inicio do ministerio e da autoridade de Jesus",
    middleFocus: "os sinais, confrontos e instrucoes sobre discipulado",
    closingFocus: "o caminho para a cruz, a paixao e a confirmacao da ressurreicao",
  }),
  lucas: createProfile(gospelBase, {
    author: "Lucas.",
    audience: "Leitores gentios e comunidades interessadas numa narracao cuidadosa e ordenada.",
    purpose: "Mostrar Jesus como Salvador compassivo para todos os povos.",
    curiosities: "Lucas destaca marginalizados, oracao, alegria e a acao do Espirito.",
    emphasis: "a boa noticia de Jesus alcanca toda gente com misericordia e verdade",
    openingFocus: "as origens de Jesus e a preparacao cuidadosa de sua missao",
    middleFocus: "o ensino de Jesus em movimento e seu cuidado com pessoas diversas",
    closingFocus: "a chegada a Jerusalem, a paixao, a ressurreicao e a continuidade da missao",
  }),
  joao: createProfile(gospelBase, {
    author: "Joao.",
    historicalPeriod: "Fim do primeiro seculo, com reflexao madura sobre a pessoa de Cristo.",
    audience: "Comunidades cristas que precisavam aprofundar identidade, fe e discernimento.",
    purpose: "Apresentar sinais e discursos que levem o leitor a crer em Jesus.",
    curiosities: "Joao seleciona sinais e conversas longas para aprofundar a identidade de Cristo.",
    emphasis: "Jesus e revelado como Filho enviado por Deus para gerar vida e fe",
    openingFocus: "a apresentacao de Jesus por meio de sinais iniciais e encontros marcantes",
    middleFocus: "os confrontos, discursos e sinais que exigem resposta de fe",
    closingFocus: "a despedida final, a cruz, a ressurreicao e o envio dos discipulos",
  }),
  atos: createProfile(actsBase, {
    purpose: "Narrar a expansao da igreja impulsionada pelo Espirito Santo.",
    curiosities: "Atos une discursos, viagens, conflitos internos e avancos missionarios.",
    emphasis: "o evangelho se expande guiado pelo Espirito apesar de oposicoes e transicoes",
    openingFocus: "a igreja em Jerusalem, a vinda do Espirito e os primeiros passos da missao",
    middleFocus: "a expansao para novos povos e a consolidacao da missao apostolica",
    closingFocus: "as viagens de Paulo e a chegada do testemunho cristao ao centro do imperio",
  }),
  romanos: createProfile(paulBase, {
    audience: "Cristaos de Roma, formados por judeus e gentios.",
    purpose: "Explicar o evangelho de forma ampla e suas implicacoes para a vida e para a igreja.",
    curiosities: "Romanos condensa argumento teologico forte e muita aplicacao comunitaria.",
    emphasis: "o evangelho transforma culpa, identidade, comunidade e pratica diaria",
    openingFocus: "o problema humano e a necessidade universal do evangelho",
    middleFocus: "a vida nova em Cristo, a historia de Israel e a misericordia de Deus",
    closingFocus: "as implicacoes praticas do evangelho para convivencia, servico e missao",
  }),
  "1-corintios": createProfile(paulBase, {
    audience: "Igreja de Corinto, marcada por dons, conflitos e imaturidades.",
    purpose: "Corrigir desordens e orientar uma igreja cheia de potencial e tensoes.",
    curiosities: "A carta responde problemas concretos do cotidiano da igreja local.",
    emphasis: "maturidade crista precisa aparecer tanto no culto quanto nas relacoes",
    openingFocus: "as divisoes e os primeiros problemas que exigiam correcoes",
    middleFocus: "os dons, o amor, a ordem no culto e a vida comunitaria",
    closingFocus: "a centralidade da ressurreicao e os ajustes finais da carta",
  }),
  "2-corintios": createProfile(paulBase, {
    audience: "Igreja de Corinto e comunidades proximas.",
    purpose: "Defender o ministerio apostolico e reconstruir a relacao com a igreja.",
    curiosities: "2 Corintios tem tom muito pessoal e alterna consolacao, defesa e exortacao.",
    emphasis: "fraqueza e sofrimento nao anulam o ministerio; podem revelar a graca de Deus",
    openingFocus: "o consolo em meio as lutas e a retomada do relacionamento com a igreja",
    middleFocus: "reconciliacao, generosidade e autenticidade do ministerio",
    closingFocus: "a defesa apostolica diante de oposicoes e suspeitas",
  }),
  galatas: createProfile(paulBase, {
    audience: "Igrejas da Galacia, pressionadas por ensinos distorcidos.",
    purpose: "Defender a liberdade do evangelho contra exigencias legalistas.",
    curiosities: "Galatas e uma das cartas mais incisivas de Paulo.",
    emphasis: "a vida com Deus se sustenta na graca e nao em sistemas de merecimento",
    openingFocus: "a defesa inicial do evangelho recebido por Paulo",
    middleFocus: "o contraste entre lei, promessa, liberdade e Espirito",
    closingFocus: "a aplicacao pratica da liberdade em amor e maturidade",
  }),
  efesios: createProfile(paulBase, {
    audience: "Igreja de Efeso e comunidades proximas.",
    purpose: "Mostrar a grandeza da obra de Deus em Cristo e seus efeitos na igreja.",
    curiosities: "Efesios alterna visao ampla da salvacao e aplicacoes bem concretas.",
    emphasis: "a igreja nasce da obra de Cristo e e chamada a viver unidade visivel",
    openingFocus: "a obra de Deus em Cristo e a nova identidade do povo de Deus",
    middleFocus: "a unidade da igreja e o crescimento para maturidade",
    closingFocus: "a vida pratica da nova humanidade e a firmeza no combate espiritual",
  }),
  filipenses: createProfile(paulBase, {
    audience: "Igreja de Filipos, parceira muito proxima do ministerio de Paulo.",
    purpose: "Encorajar alegria, humildade, firmeza e contentamento.",
    curiosities: "A carta e marcada por afeto pastoral e linguagem de parceria.",
    emphasis: "a alegria crista pode florescer mesmo em cenarios de pressao e limitacao",
    openingFocus: "a parceria no evangelho e a gratidao inicial de Paulo",
    middleFocus: "o exemplo de Cristo, a unidade e a perseveranca na caminhada",
    closingFocus: "o contentamento, os conselhos finais e a gratidao pelo apoio recebido",
  }),
  colossenses: createProfile(paulBase, {
    audience: "Igreja de Colossos e entorno.",
    purpose: "Reafirmar a centralidade de Cristo diante de ensinos confusos.",
    curiosities: "Colossenses e concisa, mas muito densa na visao sobre quem Cristo e.",
    emphasis: "Cristo e suficiente para sustentar identidade, maturidade e nova vida",
    openingFocus: "a apresentacao da supremacia de Cristo e da gratidao apostolica",
    middleFocus: "o combate a confusoes religiosas e a nova vida em Cristo",
    closingFocus: "as orientacoes para relacionamentos, servico e perseveranca",
  }),
  "1-tessalonicenses": createProfile(paulBase, {
    audience: "Igreja de Tessalonica, jovem e pressionada.",
    purpose: "Consolar e firmar uma comunidade recente na fe.",
    curiosities: "A carta mistura memoria pastoral, incentivo e esperanca futura.",
    emphasis: "esperanca e santidade ajudam a sustentar uma igreja em crescimento",
    openingFocus: "a gratidao inicial e a lembranca da conversao da comunidade",
    middleFocus: "o fortalecimento da santidade e das relacoes dentro da igreja",
    closingFocus: "o ensino sobre a volta de Cristo e os conselhos finais",
  }),
  "2-tessalonicenses": createProfile(paulBase, {
    audience: "Igreja de Tessalonica.",
    purpose: "Corrigir confusoes sobre o fim e estimular perseveranca responsavel.",
    curiosities: "A carta completa temas ja iniciados em 1 Tessalonicenses.",
    emphasis: "esperar Cristo nao elimina responsabilidade, sobriedade e trabalho",
    openingFocus: "o encorajamento a uma igreja que enfrenta perseguicoes",
    middleFocus: "os esclarecimentos sobre o tempo final e o erro de falsas expectativas",
    closingFocus: "a insistencia em disciplina, ordem e constancia no cotidiano",
  }),
  "1-timoteo": createProfile(paulBase, {
    audience: "Timoteo e a igreja em Efeso.",
    purpose: "Orientar lideranca, doutrina e ordem na vida da igreja.",
    curiosities: "1 Timoteo e muito pratica e pastoral na organizacao comunitaria.",
    emphasis: "igreja saudavel combina boa doutrina, lideranca fiel e piedade visivel",
    openingFocus: "as instrucoes iniciais sobre doutrina e protecao da igreja",
    middleFocus: "lideranca, culto e relacoes dentro da comunidade",
    closingFocus: "o cuidado pastoral com grupos especificos e a perseveranca do ministro",
  }),
  "2-timoteo": createProfile(paulBase, {
    audience: "Timoteo e lideres em formacao.",
    purpose: "Transmitir legado pastoral em contexto de sofrimento e despedida.",
    curiosities: "A carta tem forte tom de testamento espiritual de Paulo.",
    emphasis: "fidelidade ao evangelho e a Palavra vale a pena mesmo sob pressao",
    openingFocus: "o encorajamento inicial a manter coragem e lealdade",
    middleFocus: "o chamado a permanecer firme na Palavra e no ministerio",
    closingFocus: "as ultimas orientacoes, lembrancas pessoais e despedida apostolica",
  }),
  tito: createProfile(paulBase, {
    audience: "Tito e as igrejas em Creta.",
    purpose: "Organizar a vida da igreja e conectar doutrina com boas obras.",
    curiosities: "Tito e direta e focada em estrutura, testemunho e vida pratica.",
    emphasis: "boa doutrina precisa aparecer em comportamento e servico",
    openingFocus: "a organizacao inicial da lideranca nas igrejas",
    middleFocus: "o ensino que forma diferentes grupos da comunidade",
    closingFocus: "a graca que educa para boas obras e firmeza final",
  }),
  filemom: createProfile(paulBase, {
    audience: "Filemom e sua rede domestica de fe.",
    purpose: "Aplicar o evangelho a uma relacao pessoal marcada por tensao.",
    curiosities: "Mesmo curtissima, a carta e um caso concreto de reconciliacao cristã.",
    emphasis: "o evangelho muda relacoes pessoais de forma concreta e corajosa",
    openingFocus: "o apelo delicado de Paulo em favor de Onesimo",
    middleFocus: "a reconstrucao da relacao em bases fraternas",
    closingFocus: "a expectativa de resposta generosa e madura ao pedido apostolico",
  }),
  hebreus: createProfile(generalLetterBase, {
    author: "Autor nao identificado com certeza; a tradicao debate diferentes nomes.",
    audience: "Cristaos tentados a retroceder diante de cansaco e pressao.",
    purpose: "Mostrar a superioridade de Cristo e sustentar perseveranca na fe.",
    curiosities: "Hebreus combina leitura profunda do Antigo Testamento com forte tom pastoral.",
    emphasis: "Cristo e suficiente para sustentar fe madura e perseverante",
    openingFocus: "a grandeza inicial de Cristo e o chamado a ouvi-lo com seriedade",
    middleFocus: "o sacerdocio de Cristo, a perseveranca e o risco de endurecer o coracao",
    closingFocus: "a galeria da fe, a disciplina e os apelos finais a constancia",
  }),
  tiago: createProfile(generalLetterBase, {
    author: "Tiago, lider reconhecido da igreja em Jerusalem.",
    audience: "Cristaos dispersos por diferentes regioes.",
    purpose: "Formar uma fe pratica, madura e visivel no cotidiano.",
    curiosities: "Tiago lembra bastante a sabedoria do Antigo Testamento em chave crista.",
    emphasis: "fe verdadeira aparece em fala, atitude, paciencia e justica",
    openingFocus: "os testes iniciais da fe e o chamado a sabedoria pratica",
    middleFocus: "a relacao entre fe, obras, lingua e vida comunitaria",
    closingFocus: "a perseveranca, a oracao e os ajustes finais para uma fe madura",
  }),
  "1-pedro": createProfile(generalLetterBase, {
    author: "Pedro.",
    audience: "Cristaos em dispersao e sob pressao social.",
    purpose: "Encorajar santidade e esperanca em meio ao sofrimento.",
    curiosities: "1 Pedro combina identidade teologica forte e conselhos muito práticos.",
    emphasis: "quem foi alcancado pela graca pode permanecer firme mesmo sofrendo",
    openingFocus: "a identidade dos cristaos como povo escolhido e esperancoso",
    middleFocus: "a vida santa em relacionamentos e contextos de oposicao",
    closingFocus: "a firmeza diante do sofrimento e os conselhos finais aos lideres e a igreja",
  }),
  "2-pedro": createProfile(generalLetterBase, {
    author: "Pedro.",
    audience: "Comunidades cristas ameaçadas por falsos ensinos.",
    purpose: "Reforcar crescimento espiritual e discernimento contra distorcoes.",
    curiosities: "2 Pedro retoma temas de memoria, verdade e paciencia escatologica.",
    emphasis: "discernimento e maturidade protegem a igreja contra confusoes perigosas",
    openingFocus: "o chamado ao crescimento e a lembranca da vocacao cristã",
    middleFocus: "a denuncia de falsos mestres e seus efeitos destrutivos",
    closingFocus: "a espera pelo Dia do Senhor com sobriedade e santidade",
  }),
  "1-joao": createProfile(generalLetterBase, {
    author: "Joao.",
    audience: "Comunidades cristas em necessidade de discernimento e seguranca.",
    purpose: "Fortalecer certeza da fe, amor fraterno e discernimento da verdade.",
    curiosities: "1 Joao repete temas centrais em espiral, voltando a eles sob angulos diferentes.",
    emphasis: "verdade, amor e obediencia caminham juntos na vida com Deus",
    openingFocus: "a comunhao com Deus apresentada como vida na luz",
    middleFocus: "o discernimento entre verdade e erro e a pratica do amor fraterno",
    closingFocus: "a seguranca da vida eterna e os ultimos alertas pastorais",
  }),
  "2-joao": createProfile(generalLetterBase, {
    author: "Joao.",
    audience: "Uma destinataria simbolica ou comunidade local e seus filhos na fe.",
    purpose: "Incentivar amor e verdade, alertando contra enganadores.",
    curiosities: "A carta e curtissima, mas muito clara no equilibrio entre acolhimento e discernimento.",
    emphasis: "amor cristao precisa caminhar com fidelidade a verdade",
    openingFocus: "a alegria pela fidelidade da comunidade e o convite a permanecer no amor",
    middleFocus: "o alerta contra ensinos enganosos que comprometem o evangelho",
    closingFocus: "a expectativa de continuar o cuidado pastoral de forma pessoal",
  }),
  "3-joao": createProfile(generalLetterBase, {
    author: "Joao.",
    audience: "Gaio e sua rede de relacionamentos cristãos.",
    purpose: "Valorizar hospitalidade fiel e corrigir posturas autoritarias.",
    curiosities: "3 Joao oferece um retrato muito concreto da vida relacional entre lideres e igrejas.",
    emphasis: "fidelidade se mostra em generosidade, verdade e carater",
    openingFocus: "o elogio a uma vida fiel e hospitaleira",
    middleFocus: "o contraste entre lideranca saudavel e comportamento autoritario",
    closingFocus: "a recomendacao final e o desejo de contato pessoal",
  }),
  judas: createProfile(generalLetterBase, {
    author: "Judas.",
    audience: "Comunidades chamadas a defender a fe recebida.",
    purpose: "Alertar contra falsos mestres e estimular firmeza.",
    curiosities: "Judas usa varios exemplos do Antigo Testamento e da tradicao judaica para advertir seus leitores.",
    emphasis: "a fe recebida precisa ser protegida com discernimento e perseveranca",
    openingFocus: "o chamado urgente a lutar pela fe recebida",
    middleFocus: "a exposicao do carater e dos efeitos dos falsos mestres",
    closingFocus: "os conselhos para permanecer firme e a doxologia final",
  }),
  apocalipse: createProfile(apocalypticBase, {
    purpose: "Revelar o senhorio de Cristo sobre a historia e fortalecer a esperanca da igreja.",
    curiosities: "Apocalipse combina cartas, visoes, simbolos e ecos intensos do Antigo Testamento.",
    emphasis: "Cristo reina sobre a historia e conduz seu povo ate a renovacao final",
    openingFocus: "a visao inicial de Cristo e as mensagens as igrejas",
    middleFocus: "o conflito entre o reino de Deus e os poderes que resistem a ele",
    closingFocus: "a derrota final do mal e a visao da nova criacao",
  }),
};

const chapterOverrides: Partial<Record<string, Omit<ChapterContextSeed, "bookSlug" | "chapterNumber">>> = {
  "genesis:1": {
    summary:
      "A abertura da Biblia apresenta Deus como Criador soberano, trazendo ordem, vida e proposito ao universo em uma sequencia estruturada de atos criativos.",
    author: "Tradicionalmente atribuido a Moises.",
    historicalPeriod: "Memoria das origens do povo de Deus, registrada no contexto do Pentateuco.",
    audience: "Israel em formacao e leitores que precisavam compreender suas origens.",
    purpose: "Mostrar quem criou todas as coisas e estabelecer a base da relacao entre Deus, humanidade e criacao.",
    curiosities:
      "A repeticao de 'e viu Deus que era bom' reforca ordem e bondade. O capitulo tambem prepara o descanso sabatico do capitulo seguinte.",
    sourceLabel,
  },
  "salmos:23": {
    summary:
      "Davi descreve Deus como pastor cuidadoso e anfitriao fiel, usando imagens simples para transmitir seguranca, direcao e presenca em tempos tranquilos ou dificeis.",
    author: "Davi.",
    historicalPeriod: "Monarquia unida de Israel.",
    audience: "Comunidade de adoradores de Israel e leitores em busca de consolo.",
    purpose: "Fortalecer a confianca de que Deus conduz, protege e sustenta seu povo.",
    curiosities:
      "As imagens mudam de pastor para anfitriao no mesmo poema, ampliando a ideia de cuidado completo.",
    sourceLabel,
  },
  "mateus:5": {
    summary:
      "Jesus inicia o Sermao do Monte apresentando as bem-aventurancas, redefinindo felicidade, justica e piedade para quem vive no reino de Deus.",
    author: "Mateus.",
    historicalPeriod: "Ministerio de Jesus na Galileia, primeiro seculo.",
    audience: "Leitores judaicos e comunidades que queriam entender o ensino de Jesus.",
    purpose: "Mostrar os valores do reino e como a vida do discipulo deveria refletir a vontade de Deus.",
    curiosities:
      "Este capitulo reune alguns dos ensinos mais citados de Jesus, incluindo 'sal da terra' e 'luz do mundo'.",
    sourceLabel,
  },
  "marcos:1": {
    summary:
      "Marcos apresenta Jesus em ritmo acelerado: anuncio de Joao Batista, batismo, tentacao, inicio do ministerio e os primeiros sinais de autoridade.",
    author: "Marcos, associado ao circulo apostolico de Pedro.",
    historicalPeriod: "Igreja primitiva sob forte expansao missionaria.",
    audience: "Cristaos, provavelmente incluindo muitos gentios, que precisavam de um retrato objetivo de Jesus.",
    purpose: "Apresentar rapidamente quem Jesus e e como sua autoridade se manifesta em palavra e acao.",
    curiosities:
      "O evangelho de Marcos usa com frequencia a ideia de imediatismo, o que da senso de movimento ao relato.",
    sourceLabel,
  },
  "joao:3": {
    summary:
      "No dialogo com Nicodemos, Jesus explica a necessidade de novo nascimento e apresenta o amor de Deus como base da salvacao.",
    author: "Joao.",
    historicalPeriod: "Fim do primeiro seculo, com reflexao madura sobre a pessoa de Cristo.",
    audience: "Comunidades cristas que precisavam aprofundar a identidade de Jesus e a resposta da fe.",
    purpose: "Explicar que entrar no reino exige transformacao interior e fe no Filho enviado por Deus.",
    curiosities:
      "Joao 3:16 se tornou uma das sinteses mais conhecidas da mensagem crista em linguagem curta e memoravel.",
    sourceLabel,
  },
  "atos:2": {
    summary:
      "Lucas registra o Pentecostes, a descida do Espirito Santo, a primeira grande pregacao apostolica e o nascimento visivel da comunidade crista.",
    author: "Lucas.",
    historicalPeriod: "Primeiras semanas da igreja em Jerusalem, apos a ressurreicao de Jesus.",
    audience: "Cristaos e interessados na origem do movimento cristao.",
    purpose: "Mostrar como a missao da igreja nasce do agir do Espirito e da proclamacao publica de Jesus.",
    curiosities:
      "As varias linguas ouvidas no Pentecostes destacam o alcance universal da mensagem desde o inicio.",
    sourceLabel,
  },
  "romanos:8": {
    summary:
      "Paulo consolida a esperanca do evangelho ao falar sobre vida no Espirito, adocao, sofrimento presente e gloria futura.",
    author: "Paulo.",
    historicalPeriod: "Periodo missionario de Paulo, provavelmente a partir de Corinto.",
    audience: "Cristaos de Roma, formados por judeus e gentios.",
    purpose: "Mostrar a seguranca e a nova identidade de quem vive unido a Cristo.",
    curiosities:
      "O capitulo alterna linguagem pastoral e teologica com forte tom de encorajamento, especialmente na reta final.",
    sourceLabel,
  },
  "efesios:2": {
    summary:
      "Paulo relembra a antiga condicao humana e destaca que a salvacao e a reconciliacao entre povos acontecem pela graca de Deus em Cristo.",
    author: "Paulo.",
    historicalPeriod: "Correspondencia da prisao, primeiro seculo.",
    audience: "Igreja de Efeso e comunidades proximas.",
    purpose: "Unir a igreja em torno da graca, mostrando uma nova humanidade formada em Cristo.",
    curiosities:
      "A imagem de derrubar a parede de separacao comunica reconciliacao espiritual e comunitaria ao mesmo tempo.",
    sourceLabel,
  },
  "filipenses:4": {
    summary:
      "Paulo encerra a carta com apelos a unidade, alegria, oracao e contentamento, mesmo em contexto de limitacao e sofrimento.",
    author: "Paulo.",
    historicalPeriod: "Correspondencia da prisao, primeiro seculo.",
    audience: "Igreja de Filipos, parceira proxima do ministerio de Paulo.",
    purpose: "Encorajar estabilidade emocional, confianca em Deus e generosidade crista.",
    curiosities:
      "O famoso ensino sobre contentamento nasce de um contexto real de privacao, nao de conforto.",
    sourceLabel,
  },
  "hebreus:11": {
    summary:
      "O autor revisita personagens do Antigo Testamento para mostrar a fe como resposta perseverante a palavra e as promessas de Deus.",
    author: "Autor nao identificado com certeza; a tradicao debate diferentes nomes.",
    historicalPeriod: "Primeiro seculo, em contexto de pressao sobre cristaos.",
    audience: "Cristaos judeus e comunidades tentadas a retroceder diante das dificuldades.",
    purpose: "Fortalecer a perseveranca mostrando a continuidade entre promessa, fe e esperanca.",
    curiosities:
      "A lista nao busca ser exaustiva; ela funciona como uma galeria de testemunhas para motivar continuidade.",
    sourceLabel,
  },
  "tiago:1": {
    summary:
      "Tiago abre sua carta ligando provacao, sabedoria, constancia e pratica da palavra em uma espiritualidade muito concreta.",
    author: "Tiago, lider reconhecido da igreja em Jerusalem.",
    historicalPeriod: "Igreja primitiva em dispersao.",
    audience: "Cristaos dispersos por diferentes regioes.",
    purpose: "Formar uma fe pratica, madura e visivel no cotidiano.",
    curiosities:
      "A carta tem ritmo direto e lembra bastante a sabedoria do Antigo Testamento aplicada a comunidades cristas.",
    sourceLabel,
  },
  "apocalipse:21": {
    summary:
      "Joao apresenta a visao da nova criacao, em que Deus habita com seu povo e a dor antiga cede lugar a restauracao definitiva.",
    author: "Joao.",
    historicalPeriod: "Fim do primeiro seculo, em ambiente de pressao imperial.",
    audience: "Igrejas da Asia Menor e leitores perseguidos ou cansados.",
    purpose: "Renovar esperanca com a promessa de renovacao final e presenca plena de Deus.",
    curiosities:
      "A linguagem simbolica combina ecos do Genesis e dos profetas para descrever o futuro de forma rica e memoravel.",
    sourceLabel,
  },
};

function getChapterPhase(chapterNumber: number, totalChapters: number): ChapterPhase {
  if (totalChapters <= 2) {
    return chapterNumber === totalChapters ? "closing" : "opening";
  }

  const openingLimit = Math.max(2, Math.ceil(totalChapters * 0.25));
  const closingStart = Math.min(totalChapters - 1, Math.max(totalChapters - 2, Math.floor(totalChapters * 0.75)));

  if (chapterNumber <= openingLimit) return "opening";
  if (chapterNumber >= closingStart) return "closing";
  return "middle";
}

function pickWord(words: readonly string[], chapterNumber: number): string {
  return words[(chapterNumber - 1) % words.length] ?? words[0] ?? "";
}

function buildSummary(
  bookName: string,
  chapterNumber: number,
  totalChapters: number,
  profile: BookContextProfile,
): string {
  const phase = getChapterPhase(chapterNumber, totalChapters);
  const openerVerb = pickWord(["apresenta", "destaca", "introduz"], chapterNumber);
  const middleVerb = pickWord(["aprofunda", "desenvolve", "explora"], chapterNumber);
  const closingVerb = pickWord(["encaminha", "reune", "consolida"], chapterNumber);

  if (totalChapters === 1) {
    switch (profile.genre) {
      case "gospel":
        return `Como capitulo unico de ${bookName}, o texto ${openerVerb} ${profile.openingFocus}, destacando como ${profile.emphasis}.`;
      case "epistle":
        return `Como texto unico de ${bookName}, o autor ${openerVerb} ${profile.openingFocus} e reforca como ${profile.emphasis}.`;
      case "apocalyptic":
        return `Como capitulo unico de ${bookName}, a visao ${openerVerb} ${profile.openingFocus} e mostra como ${profile.emphasis}.`;
      default:
        return `Como capitulo unico de ${bookName}, o texto ${openerVerb} ${profile.openingFocus} e reforca como ${profile.emphasis}.`;
    }
  }

  switch (profile.genre) {
    case "law":
    case "history":
      if (phase === "opening") {
        return `No inicio de ${bookName}, o capitulo ${openerVerb} ${profile.openingFocus} e ajuda o leitor a perceber como ${profile.emphasis}.`;
      }
      if (phase === "middle") {
        return `No desenvolvimento de ${bookName}, o capitulo ${middleVerb} ${profile.middleFocus}, reforcando como ${profile.emphasis}.`;
      }
      return `Na reta final de ${bookName}, o capitulo ${closingVerb} ${profile.closingFocus} e prepara o encerramento do livro em torno de ${profile.emphasis}.`;
    case "wisdom":
    case "psalm":
      if (phase === "opening") {
        return `Nos primeiros movimentos de ${bookName}, este capitulo ${openerVerb} ${profile.openingFocus}, convidando o leitor a refletir sobre como ${profile.emphasis}.`;
      }
      if (phase === "middle") {
        return `Ao longo de ${bookName}, este capitulo ${middleVerb} ${profile.middleFocus} e reforca como ${profile.emphasis}.`;
      }
      return `Na parte final de ${bookName}, o capitulo ${closingVerb} ${profile.closingFocus}, encerrando o livro com enfase em como ${profile.emphasis}.`;
    case "gospel":
      if (phase === "opening") {
        return `No inicio de ${bookName}, o capitulo ${openerVerb} ${profile.openingFocus}, preparando o leitor para perceber como ${profile.emphasis}.`;
      }
      if (phase === "middle") {
        return `No centro de ${bookName}, o capitulo ${middleVerb} ${profile.middleFocus}, mostrando como ${profile.emphasis}.`;
      }
      return `Na parte final de ${bookName}, o capitulo ${closingVerb} ${profile.closingFocus} e conduz o relato para sua conclusao em torno de ${profile.emphasis}.`;
    case "acts":
      if (phase === "opening") {
        return `Nos primeiros capitulos de ${bookName}, o texto ${openerVerb} ${profile.openingFocus}, deixando claro como ${profile.emphasis}.`;
      }
      if (phase === "middle") {
        return `No desenvolvimento de ${bookName}, este capitulo ${middleVerb} ${profile.middleFocus}, reforcando como ${profile.emphasis}.`;
      }
      return `Na reta final de ${bookName}, o capitulo ${closingVerb} ${profile.closingFocus}, destacando como ${profile.emphasis}.`;
    case "epistle":
      if (phase === "opening") {
        return `No inicio de ${bookName}, o autor ${openerVerb} ${profile.openingFocus}, estabelecendo como ${profile.emphasis}.`;
      }
      if (phase === "middle") {
        return `No andamento de ${bookName}, o texto ${middleVerb} ${profile.middleFocus}, mostrando como ${profile.emphasis}.`;
      }
      return `Na conclusao de ${bookName}, o autor ${closingVerb} ${profile.closingFocus} e resume aplicacoes ligadas a como ${profile.emphasis}.`;
    case "prophecy":
      if (phase === "opening") {
        return `No inicio de ${bookName}, o profeta ${openerVerb} ${profile.openingFocus}, deixando evidente como ${profile.emphasis}.`;
      }
      if (phase === "middle") {
        return `Ao longo de ${bookName}, o capitulo ${middleVerb} ${profile.middleFocus}, reforcando como ${profile.emphasis}.`;
      }
      return `Na parte final de ${bookName}, o capitulo ${closingVerb} ${profile.closingFocus} e amplia a esperanca em torno de como ${profile.emphasis}.`;
    case "apocalyptic":
      if (phase === "opening") {
        return `No inicio de ${bookName}, a visao ${openerVerb} ${profile.openingFocus}, preparando o leitor para perceber como ${profile.emphasis}.`;
      }
      if (phase === "middle") {
        return `No desenvolvimento de ${bookName}, o capitulo ${middleVerb} ${profile.middleFocus}, mostrando como ${profile.emphasis}.`;
      }
      return `Na reta final de ${bookName}, o capitulo ${closingVerb} ${profile.closingFocus}, encaminhando o livro para a consumacao em torno de como ${profile.emphasis}.`;
  }
}

function buildChapterContextSeed(bookSlug: string, chapterNumber: number): ChapterContextSeed {
  const book = bibleBooks.find((item) => item.slug === bookSlug);
  if (!book) {
    throw new Error(`Book not found for chapter context generation: ${bookSlug}`);
  }

  const profile = bookProfiles[bookSlug];
  if (!profile) {
    throw new Error(`Missing chapter context profile for book: ${bookSlug}`);
  }

  const baseSeed: ChapterContextSeed = {
    bookSlug,
    chapterNumber,
    summary: buildSummary(book.name, chapterNumber, book.chapters, profile),
    author: profile.author,
    historicalPeriod: profile.historicalPeriod,
    audience: profile.audience,
    purpose: profile.purpose,
    curiosities: profile.curiosities,
    sourceLabel,
  };

  return {
    ...baseSeed,
    ...chapterOverrides[`${bookSlug}:${chapterNumber}`],
  };
}

export function generateChapterContextSeeds(): ChapterContextSeed[] {
  return bibleBooks.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => buildChapterContextSeed(book.slug, index + 1)),
  );
}

export const chapterContextSeeds: ChapterContextSeed[] = generateChapterContextSeeds();
