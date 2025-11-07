import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import "@/styles/animations.css";

export default function NAE() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    area: "",
  });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCurriculo = trpc.curriculos.create.useMutation({
    onSuccess: () => {
      setFormData({ nome: "", email: "", telefone: "", area: "" });
      setArquivo(null);
      alert("Currículo enviado com sucesso! Analisaremos em breve.");
    },
    onError: (error: any) => {
      alert(`Erro ao enviar currículo: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const tiposPermitidos = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!tiposPermitidos.includes(file.type)) {
        alert("Por favor, envie um arquivo PDF ou Word (DOC/DOCX)");
        return;
      }
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo não pode ter mais de 5MB");
        return;
      }
      setArquivo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.telefone || !formData.area || !arquivo) {
      alert("Por favor, preencha todos os campos e selecione um arquivo");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular upload do arquivo (em produção, usar S3 ou similar)
      const caminhoArquivo = `/curriculos/${Date.now()}-${arquivo.name}`;
      
      await createCurriculo.mutateAsync({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        area: formData.area,
        nomeArquivo: arquivo.name,
        caminhoArquivo: caminhoArquivo,
        tamanhoArquivo: arquivo.size.toString(),
        tipoArquivo: arquivo.type,
      });
    } catch (error) {
      console.error("Erro ao enviar currículo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/aliar-logo.png" alt="Aliar Cursos" className="h-12 w-auto" />
          </a>
          <div className="flex gap-6 items-center">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Voltar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fadeIn">NAE - Centro de Estágio</h1>
          <p className="text-xl mb-8 animate-slideInUp">Oportunidades de estágio e desenvolvimento profissional</p>
        </div>
      </section>

      {/* Informações NAE */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="animate-slideInLeft">
              <CardHeader>
                <CardTitle className="text-blue-600">O que é o NAE?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  O NAE (Núcleo de Apoio ao Estagiário) é o centro de estágio da Aliar Cursos, responsável por conectar nossos alunos com oportunidades profissionais no mercado de trabalho.
                </p>
                <p className="text-gray-700">
                  Oferecemos suporte completo para o desenvolvimento de carreiras, desde a preparação do currículo até a colocação em empresas parceiras.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slideInRight">
              <CardHeader>
                <CardTitle className="text-blue-600">Benefícios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Oportunidades de estágio em empresas parceiras</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Orientação profissional personalizada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Desenvolvimento de habilidades práticas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Networking com profissionais da área</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Formulário de Cadastro de Currículo */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-slideInUp">
            <CardHeader>
              <CardTitle className="text-blue-600">Enviar Currículo</CardTitle>
              <CardDescription>Preencha o formulário abaixo para enviar seu currículo para análise</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-gray-700 font-semibold">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-gray-700 font-semibold">
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(85) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Área de Interesse (OBRIGATÓRIO) */}
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-gray-700 font-semibold">
                    Área de Interesse * <span className="text-red-500">(obrigatório)</span>
                  </Label>
                  <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Selecione uma área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrativa">Área Administrativa</SelectItem>
                      <SelectItem value="Comercial">Área Comercial</SelectItem>
                      <SelectItem value="Tecnológica">Área Tecnológica</SelectItem>
                      <SelectItem value="Idioma">Área de Idioma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Upload de Arquivo */}
                <div className="space-y-2">
                  <Label htmlFor="arquivo" className="text-gray-700 font-semibold">
                    Currículo (PDF, DOC ou DOCX) * <span className="text-red-500">(máximo 5MB)</span>
                  </Label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      id="arquivo"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="arquivo" className="cursor-pointer">
                      <div className="text-blue-600 font-semibold mb-2">
                        {arquivo ? arquivo.name : "Clique para selecionar arquivo"}
                      </div>
                      <p className="text-gray-500 text-sm">ou arraste o arquivo aqui</p>
                    </label>
                  </div>
                </div>

                {/* Botão Enviar */}
                <Button
                  type="submit"
                  disabled={isSubmitting || createCurriculo.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting || createCurriculo.isPending ? "Enviando..." : "Enviar Currículo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2025 Aliar Cursos. Todos os direitos reservados.</p>
          <p className="text-blue-300 mt-2">Transformando vidas através da educação profissional</p>
        </div>
      </footer>
    </div>
  );
}

