import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const CURSOS_POR_AREA = {
  administrativa: [
    "Gestão Administrativa",
    "Auxiliar Contábil",
    "Operador de Logística",
    "Empreendedorismo",
  ],
  comercial: [
    "Operador de Caixa",
    "Gestão de Vendas",
    "Marketing Digital",
  ],
  tecnologica: [
    "Informática",
    "Designer Gráfico",
    "Dominando Excel",
    "Pacote Office",
    "Programação",
    "Desenvolvimento de Games",
    "Desenvolvimento Web",
  ],
  idioma: [
    "Inglês - Básico",
    "Inglês - Intermediário",
    "Inglês - Avançado",
  ],
};

const AREAS = [
  { value: "administrativa", label: "Área Administrativa" },
  { value: "comercial", label: "Área Comercial" },
  { value: "tecnologica", label: "Área Tecnológica" },
  { value: "idioma", label: "Área de Idioma" },
];

const HORARIOS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export default function ScheduleTrial() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    area: "administrativa",
    curso: "",
    data: "",
    horario: "08:00",
    observacoes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const createTrialClass = trpc.trialClasses.create.useMutation();

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newArea = e.target.value;
    setFormData({
      ...formData,
      area: newArea,
      curso: "", // Reset curso quando area muda
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validar data
      if (!formData.data) {
        throw new Error("Por favor, selecione uma data");
      }

      if (!formData.curso) {
        throw new Error("Por favor, selecione um curso");
      }

      const dataAgendamento = new Date(formData.data);
      dataAgendamento.setHours(parseInt(formData.horario.split(":")[0]));
      dataAgendamento.setMinutes(parseInt(formData.horario.split(":")[1]));

      await createTrialClass.mutateAsync({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        curso: formData.curso,
        area: formData.area,
        dataAgendamento,
        horario: formData.horario,
        observacoes: formData.observacoes,
      });

      setSuccess(true);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        area: "administrativa",
        curso: "",
        data: "",
        horario: "08:00",
        observacoes: "",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao agendar aula");
    } finally {
      setIsSubmitting(false);
    }
  };

  const areaAtual = formData.area as 'administrativa' | 'comercial' | 'tecnologica' | 'idioma';
  const cursosDisponiveis = CURSOS_POR_AREA[areaAtual] || [];
  
  // Não permitir acesso se não estiver autenticado como admin
  // const isAdmin = user?.role === 'admin';

  // Data mínima é hoje
  const hoje = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              Agende sua Aula Experimental
            </h1>
            <p className="text-gray-600">
              Escolha o curso que deseja conhecer e reserve sua aula gratuita
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">
                ✓ Aula agendada com sucesso! Você será redirecionado em breve...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(85) 99999-9999"
                />
              </div>
            </div>

            {/* Seleção de Curso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Área de Interesse *
                </label>
                <select
                  value={formData.area}
                  onChange={handleAreaChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {AREAS.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Curso *
                </label>
                <select
                  value={formData.curso}
                  onChange={(e) =>
                    setFormData({ ...formData, curso: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione um curso</option>
                  {cursosDisponiveis.map((curso) => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data Desejada *
                </label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  min={hoje}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horário Preferido *
                </label>
                <select
                  value={formData.horario}
                  onChange={(e) =>
                    setFormData({ ...formData, horario: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {HORARIOS.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observações (Opcional)
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Deixe aqui qualquer informação adicional..."
                rows={4}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {isSubmitting ? "Agendando..." : "Agendar Aula"}
              </Button>
              <Button
                type="button"
                onClick={() => setLocation("/")}
                variant="outline"
                className="flex-1"
              >
                Voltar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

