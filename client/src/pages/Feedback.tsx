import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const COURSES_LIST = [
  "Gestão Administrativa",
  "Auxiliar Contábil",
  "Operador de Logística",
  "Empreendedorismo",
  "Operador de Caixa",
  "Gestão de Vendas",
  "Marketing Digital",
  "Informática",
  "Designer Gráfico",
  "Dominando Excel",
  "Pacote Office",
  "Programação",
  "Desenvolvimento de Games",
  "Desenvolvimento Web",
  "Inglês Básico",
  "Inglês Intermediário",
  "Inglês Avançado",
];

export default function Feedback() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    curso: "",
    avaliacao: "",
    comentario: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createFeedback = trpc.feedbacks.create.useMutation({
    onSuccess: () => {
      setFormData({
        nome: "",
        email: "",
        curso: "",
        avaliacao: "",
        comentario: "",
      });
      alert("Obrigado pelo seu feedback! Sua avaliação será revisada em breve.");
    },
    onError: (error: any) => {
      alert(`Erro ao enviar feedback: ${error.message}`);
    },
  });

  const { data: approvedFeedbacks = [] } = trpc.feedbacks.listApproved.useQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.avaliacao) {
      alert("Por favor, selecione uma avaliação");
      return;
    }
    setIsSubmitting(true);
    try {
      await createFeedback.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStarColor = (rating: string) => {
    const num = parseInt(rating);
    if (num <= 2) return "text-red-500";
    if (num === 3) return "text-yellow-500";
    return "text-green-500";
  };

  const renderStars = (rating: string) => {
    const num = parseInt(rating);
    return "⭐".repeat(num);
  };

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
          <h1 className="text-4xl font-bold mb-2">Deixe seu Feedback</h1>
          <p className="text-blue-100 text-lg">Sua opinião é muito importante para nós!</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Feedback */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle>Enviar Feedback</CardTitle>
                <CardDescription>Compartilhe sua experiência conosco</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      className="border-blue-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="border-blue-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="curso">Curso *</Label>
                    <Select value={formData.curso} onValueChange={(value) => setFormData({ ...formData, curso: value })}>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {COURSES_LIST.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="avaliacao">Avaliação *</Label>
                    <Select value={formData.avaliacao} onValueChange={(value) => setFormData({ ...formData, avaliacao: value })}>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecione uma avaliação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">⭐ Péssimo</SelectItem>
                        <SelectItem value="2">⭐⭐ Ruim</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Bom</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Muito Bom</SelectItem>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="comentario">Comentário *</Label>
                    <textarea
                      id="comentario"
                      placeholder="Conte-nos sua experiência..."
                      value={formData.comentario}
                      onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Feedbacks Aprovados */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Avaliações de Alunos</h2>
              <p className="text-gray-600">Veja o que nossos alunos acham dos cursos</p>
            </div>

            {approvedFeedbacks.length === 0 ? (
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500 text-lg">Nenhuma avaliação aprovada ainda.</p>
                  <p className="text-gray-400 mt-2">Seja o primeiro a deixar um feedback!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {approvedFeedbacks.map((feedback) => (
                  <Card key={feedback.id} className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{feedback.nome}</h3>
                          <p className="text-sm text-gray-600">{feedback.curso}</p>
                        </div>
                        <div className={`text-2xl ${getStarColor(feedback.avaliacao)}`}>
                          {renderStars(feedback.avaliacao)}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-3">{feedback.comentario}</p>
                      <p className="text-xs text-gray-400 mt-3">
                        {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString("pt-BR") : "Data não disponível"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

