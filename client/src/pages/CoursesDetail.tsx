import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";

const COURSES_DATA = {
  administrativa: [
    {
      id: 1,
      name: "Gestão Administrativa",
      description: "Desenvolva habilidades essenciais para gerenciar processos administrativos em qualquer empresa.",
      duration: "120 horas",
      target: "Profissionais que desejam atuar na área administrativa ou melhorar suas competências",
      objectives: [
        "Dominar técnicas de organização e planejamento",
        "Aprender sobre legislação trabalhista e tributária",
        "Desenvolver habilidades de comunicação empresarial",
        "Gerenciar documentos e arquivos"
      ],
      requirements: "Ensino médio completo",
      certificate: "Certificado de conclusão reconhecido",
      color: "bg-blue-50"
    },
    {
      id: 2,
      name: "Auxiliar Contábil",
      description: "Prepare-se para trabalhar como auxiliar contábil com conhecimentos práticos e teóricos.",
      duration: "160 horas",
      target: "Pessoas interessadas em contabilidade e gestão financeira",
      objectives: [
        "Entender fundamentos de contabilidade",
        "Aprender a usar softwares contábeis",
        "Dominar lançamentos contábeis",
        "Preparar relatórios financeiros básicos"
      ],
      requirements: "Ensino médio completo, conhecimento básico de matemática",
      certificate: "Certificado de Auxiliar Contábil",
      color: "bg-green-50"
    },
    {
      id: 3,
      name: "Operador de Logística",
      description: "Qualifique-se para trabalhar em centros de distribuição e operações logísticas.",
      duration: "100 horas",
      target: "Profissionais da área de logística e distribuição",
      objectives: [
        "Aprender sobre cadeia de suprimentos",
        "Dominar sistemas de gestão de estoque",
        "Conhecer normas de segurança e movimentação",
        "Otimizar processos logísticos"
      ],
      requirements: "Ensino médio completo",
      certificate: "Certificado de Operador de Logística",
      color: "bg-yellow-50"
    },
    {
      id: 4,
      name: "Empreendedorismo",
      description: "Transforme sua ideia em um negócio bem-sucedido com conhecimentos práticos de empreendedorismo.",
      duration: "80 horas",
      target: "Empreendedores iniciantes e pessoas com ideias de negócio",
      objectives: [
        "Desenvolver plano de negócio",
        "Aprender sobre gestão financeira",
        "Entender marketing e vendas",
        "Conhecer aspectos legais de um negócio"
      ],
      requirements: "Nenhum pré-requisito específico",
      certificate: "Certificado de Empreendedor",
      color: "bg-purple-50"
    }
  ],
  comercial: [
    {
      id: 5,
      name: "Operador de Caixa",
      description: "Domine as técnicas de atendimento e operação de caixa para varejo.",
      duration: "60 horas",
      target: "Pessoas interessadas em trabalhar no varejo e atendimento ao cliente",
      objectives: [
        "Aprender operação de sistemas de PDV",
        "Desenvolver habilidades de atendimento",
        "Conhecer técnicas de venda",
        "Dominar procedimentos de segurança"
      ],
      requirements: "Ensino médio completo",
      certificate: "Certificado de Operador de Caixa",
      color: "bg-pink-50"
    },
    {
      id: 6,
      name: "Gestão de Vendas",
      description: "Aprenda estratégias avançadas de vendas e gestão de equipes comerciais.",
      duration: "120 horas",
      target: "Vendedores, supervisores e gerentes de vendas",
      objectives: [
        "Dominar técnicas de vendas consultiva",
        "Aprender gestão de equipes",
        "Conhecer análise de mercado",
        "Desenvolver estratégias comerciais"
      ],
      requirements: "Experiência em vendas (desejável)",
      certificate: "Certificado de Gestor de Vendas",
      color: "bg-red-50"
    },
    {
      id: 7,
      name: "Marketing Digital",
      description: "Domine as ferramentas e estratégias de marketing digital para impulsionar negócios.",
      duration: "100 horas",
      target: "Profissionais de marketing, empreendedores e interessados em marketing digital",
      objectives: [
        "Aprender sobre estratégia digital",
        "Dominar redes sociais e publicidade",
        "Conhecer SEO e SEM",
        "Analisar métricas e ROI"
      ],
      requirements: "Conhecimento básico de internet",
      certificate: "Certificado de Especialista em Marketing Digital",
      color: "bg-orange-50"
    }
  ],
  tecnologica: [
    {
      id: 8,
      name: "Informática",
      description: "Aprenda o essencial sobre computadores e programas para o dia a dia profissional.",
      duration: "80 horas",
      target: "Iniciantes que desejam aprender o básico de informática",
      objectives: [
        "Conhecer componentes do computador",
        "Dominar Windows e Linux",
        "Aprender Office (Word, Excel, PowerPoint)",
        "Entender segurança da informação"
      ],
      requirements: "Nenhum pré-requisito específico",
      certificate: "Certificado de Informática Básica",
      color: "bg-cyan-50"
    },
    {
      id: 9,
      name: "Designer Gráfico",
      description: "Crie designs profissionais com as ferramentas mais utilizadas do mercado.",
      duration: "140 horas",
      target: "Pessoas interessadas em design e criatividade visual",
      objectives: [
        "Dominar Photoshop e Illustrator",
        "Aprender princípios de design",
        "Criar identidade visual",
        "Desenvolver portfólio profissional"
      ],
      requirements: "Conhecimento básico de computador",
      certificate: "Certificado de Designer Gráfico",
      color: "bg-indigo-50"
    },
    {
      id: 10,
      name: "Dominando Excel",
      description: "Torne-se um especialista em Excel com fórmulas avançadas e análise de dados.",
      duration: "90 horas",
      target: "Profissionais que trabalham com dados e análises",
      objectives: [
        "Dominar fórmulas e funções avançadas",
        "Criar gráficos e tabelas dinâmicas",
        "Analisar dados com Excel",
        "Automatizar processos"
      ],
      requirements: "Conhecimento básico de Excel",
      certificate: "Certificado de Especialista em Excel",
      color: "bg-emerald-50"
    },
    {
      id: 11,
      name: "Pacote Office",
      description: "Domine Word, Excel, PowerPoint e Outlook para aumentar sua produtividade.",
      duration: "110 horas",
      target: "Profissionais que usam Microsoft Office no dia a dia",
      objectives: [
        "Dominar Word para documentos profissionais",
        "Excel para análise de dados",
        "PowerPoint para apresentações impactantes",
        "Outlook para gerenciamento de email"
      ],
      requirements: "Conhecimento básico de computador",
      certificate: "Certificado de Pacote Office",
      color: "bg-slate-50"
    },
    {
      id: 12,
      name: "Programação",
      description: "Inicie sua carreira em desenvolvimento de software com linguagens modernas.",
      duration: "200 horas",
      target: "Pessoas interessadas em desenvolvimento de software",
      objectives: [
        "Aprender lógica de programação",
        "Dominar linguagens como Python e JavaScript",
        "Desenvolver aplicações web",
        "Entender banco de dados"
      ],
      requirements: "Lógica matemática básica",
      certificate: "Certificado de Programador",
      color: "bg-violet-50"
    },
    {
      id: 13,
      name: "Desenvolvimento de Games",
      description: "Crie seus próprios jogos com engines modernas como Unity e Unreal.",
      duration: "180 horas",
      target: "Entusiastas de games e aspirantes a desenvolvedores",
      objectives: [
        "Aprender game design",
        "Dominar Unity ou Unreal Engine",
        "Criar mecânicas de jogo",
        "Publicar jogos"
      ],
      requirements: "Conhecimento básico de programação",
      certificate: "Certificado de Desenvolvedor de Games",
      color: "bg-rose-50"
    },
    {
      id: 14,
      name: "Desenvolvimento Web",
      description: "Torne-se um desenvolvedor web full-stack com HTML, CSS, JavaScript e mais.",
      duration: "200 horas",
      target: "Pessoas interessadas em criar websites e aplicações web",
      objectives: [
        "Dominar HTML, CSS e JavaScript",
        "Aprender frameworks modernos",
        "Criar APIs REST",
        "Deploy de aplicações web"
      ],
      requirements: "Conhecimento básico de programação",
      certificate: "Certificado de Desenvolvedor Web",
      color: "bg-amber-50"
    }
  ],
  idioma: [
    {
      id: 15,
      name: "Inglês Básico",
      description: "Comece sua jornada no aprendizado de inglês do zero.",
      duration: "120 horas",
      target: "Iniciantes sem conhecimento prévio de inglês",
      objectives: [
        "Aprender vocabulário essencial",
        "Dominar gramática básica",
        "Desenvolver habilidades de listening",
        "Praticar conversação simples"
      ],
      requirements: "Nenhum pré-requisito específico",
      certificate: "Certificado de Inglês Básico",
      color: "bg-teal-50"
    },
    {
      id: 16,
      name: "Inglês Intermediário",
      description: "Avance seu inglês com conversação e gramática intermediária.",
      duration: "120 horas",
      target: "Pessoas com conhecimento básico de inglês",
      objectives: [
        "Expandir vocabulário",
        "Dominar tempos verbais complexos",
        "Melhorar compreensão auditiva",
        "Participar de conversas mais complexas"
      ],
      requirements: "Conhecimento de inglês básico",
      certificate: "Certificado de Inglês Intermediário",
      color: "bg-sky-50"
    },
    {
      id: 17,
      name: "Inglês Avançado",
      description: "Domine o inglês em nível avançado para comunicação fluida.",
      duration: "120 horas",
      target: "Pessoas com conhecimento intermediário de inglês",
      objectives: [
        "Alcançar fluência em conversação",
        "Dominar expressões idiomáticas",
        "Aprender inglês para negócios",
        "Preparar para certificações internacionais"
      ],
      requirements: "Conhecimento de inglês intermediário",
      certificate: "Certificado de Inglês Avançado",
      color: "bg-blue-50"
    }
  ]
};

export default function CoursesDetail() {
  const [, setLocation] = useLocation();
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  const areas = [
    { key: "administrativa", label: "Área Administrativa", icon: "📋" },
    { key: "comercial", label: "Área Comercial", icon: "💼" },
    { key: "tecnologica", label: "Área Tecnológica", icon: "💻" },
    { key: "idioma", label: "Área de Idioma", icon: "🌍" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="outline"
            className="mb-4 text-white border-white hover:bg-white hover:text-blue-600"
            onClick={() => setLocation("/")}
          >
            ← Voltar
          </Button>
          <h1 className="text-4xl font-bold mb-2">Nossos Cursos</h1>
          <p className="text-blue-100 text-lg">Explore todos os cursos disponíveis com informações detalhadas</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Abas por Área */}
        {areas.map((area) => (
          <div key={area.key} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">{area.icon}</span>
              <h2 className="text-3xl font-bold text-gray-900">{area.label}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COURSES_DATA[area.key as keyof typeof COURSES_DATA].map((course) => (
                <Card
                  key={course.id}
                  className={`${course.color} cursor-pointer transition-all hover:shadow-lg border-2 border-transparent hover:border-blue-400`}
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription className="text-base">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Carga Horária:</span>
                        <p className="text-gray-600">{course.duration}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Público-alvo:</span>
                        <p className="text-gray-600 text-xs">{course.target}</p>
                      </div>
                    </div>

                    {expandedCourse === course.id && (
                      <div className="space-y-4 border-t pt-4 mt-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Objetivos do Curso:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {course.objectives.map((obj, idx) => (
                              <li key={idx} className="text-sm text-gray-700">{obj}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="font-semibold text-gray-700">Pré-requisitos:</span>
                          <p className="text-sm text-gray-600">{course.requirements}</p>
                        </div>

                        <div>
                          <span className="font-semibold text-gray-700">Certificado:</span>
                          <p className="text-sm text-gray-600">{course.certificate}</p>
                        </div>

                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation("/agendar");
                          }}
                        >
                          Agendar Aula Experimental
                        </Button>
                      </div>
                    )}

                    {expandedCourse !== course.id && (
                      <p className="text-sm text-gray-500 italic">Clique para ver mais detalhes</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

