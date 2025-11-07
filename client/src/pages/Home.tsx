import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import "@/styles/animations.css";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    area: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      setFormData({ nome: "", email: "", telefone: "", area: "" });
      alert("Cadastro realizado com sucesso! Em breve entraremos em contato.");
    },
    onError: (error: any) => {
      alert(`Erro ao cadastrar: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createLead.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set(prev).add(entry.target.id));
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/aliar-logo.png" alt="Aliar Cursos" className="h-12 w-auto" />
          </a>
          <div className="flex gap-6 items-center">
            <a href="#sobre" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Sobre</a>
            <a href="#cursos" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Cursos</a>
            <a href="#cadastro" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Cadastro</a>
            <Button
              variant="outline"
              onClick={() => setLocation("/cursos")}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Ver Todos os Cursos
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/feedback")}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Feedback
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/nae")}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              NAE
            </Button>
            {user && (
              <Button
                variant="outline"
                onClick={() => setLocation("/admin")}
                className="ml-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Dashboard Admin
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative py-32 px-4 overflow-hidden"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-600/50"></div>
        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Transforme seu futuro com a Aliar Cursos
          </h1>
          <p className="text-2xl text-blue-100 mb-8 drop-shadow-md">
            Cursos profissionalizantes para você se destacar no mercado de trabalho.
          </p>
          <a
            href="https://wa.me/558535123554"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl animate-bounce"
          >
            Fale Conosco no WhatsApp
          </a>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div
              data-animate
              id="about-text"
              className={`transition-all duration-700 ${
                visibleElements.has("about-text") ? "animate-slide-in-left" : "opacity-0"
              }`}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nossa História</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                A Aliar Cursos nasceu com o objetivo de oferecer educação de qualidade e acessível, preparando nossos alunos para os desafios do mercado de trabalho.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nossa missão é ser um agente de transformação na vida das pessoas através do conhecimento, oferecendo cursos práticos e atualizados.
              </p>
            </div>
            <div
              data-animate
              id="about-image"
              className={`transition-all duration-700 ${
                visibleElements.has("about-image") ? "animate-slide-in-right" : "opacity-0"
              }`}
            >
              <img 
                src="/about-section.png" 
                alt="Estudantes colaborando" 
                className="rounded-2xl shadow-2xl hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cursos Section */}
      <section id="cursos" className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div
            data-animate
            id="courses-title"
            className={`text-center mb-16 transition-all duration-700 ${
              visibleElements.has("courses-title") ? "animate-fade-in" : "opacity-0"
            }`}
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
              Nossos Cursos
            </h2>
            <p className="text-xl text-gray-600">Explore nossas áreas de especialização</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Área Administrativa */}
            <div
              data-animate
              id="course-admin"
              className={`transition-all duration-700 ${
                visibleElements.has("course-admin") ? "animate-scale-up" : "opacity-0"
              }`}
            >
              <Card className="h-full card-hover border-0 shadow-lg hover:shadow-2xl">
                <CardHeader className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Área Administrativa</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Gestão Administrativa
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Operador de Caixa
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Liderança Eficaz
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Técnicas de Vendas
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Área Tecnológica */}
            <div
              data-animate
              id="course-tech"
              className={`transition-all duration-700 ${
                visibleElements.has("course-tech") ? "animate-scale-up delay-200" : "opacity-0"
              }`}
            >
              <Card className="h-full card-hover border-0 shadow-lg hover:shadow-2xl">
                <CardHeader className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Área Tecnológica</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Informática
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Desenvolvimento de Games
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Designer
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Marketing Digital
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Programação
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Desenvolvimento Web
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Outros Cursos */}
            <div
              data-animate
              id="course-other"
              className={`transition-all duration-700 ${
                visibleElements.has("course-other") ? "animate-scale-up delay-400" : "opacity-0"
              }`}
            >
              <Card className="h-full card-hover border-0 shadow-lg hover:shadow-2xl">
                <CardHeader className="bg-gradient-to-br from-sky-500 to-cyan-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Outros Cursos</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Inglês
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Youtuber
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Empreendedorismo
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Analista
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-blue-600 font-bold mr-3">✓</span>
                      Pacote Office
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Showcase */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div
              data-animate
              id="tech-image"
              className={`transition-all duration-700 ${
                visibleElements.has("tech-image") ? "animate-slide-in-left" : "opacity-0"
              }`}
            >
              <img 
                src="/tech-courses.png" 
                alt="Ambiente de tecnologia" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div
              data-animate
              id="tech-text"
              className={`transition-all duration-700 ${
                visibleElements.has("tech-text") ? "animate-slide-in-right" : "opacity-0"
              }`}
            >
              <h3 className="text-4xl font-bold mb-6">Tecnologia de Ponta</h3>
              <p className="text-lg text-blue-100 mb-4">
                Nossas aulas de tecnologia utilizam as ferramentas e linguagens mais atuais do mercado.
              </p>
              <p className="text-lg text-blue-100">
                Prepare-se para uma carreira de sucesso com conhecimentos práticos e aplicáveis no dia a dia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cadastro Section */}
      <section id="cadastro" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-2xl mx-auto">
          <div
            data-animate
            id="form-card"
            className={`transition-all duration-700 ${
              visibleElements.has("form-card") ? "animate-scale-up" : "opacity-0"
            }`}
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="text-3xl">Cadastre-se Agora</CardTitle>
                <CardDescription className="text-blue-100">
                  Preencha o formulário abaixo para que um de nossos consultores entre em contato.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="nome" className="text-gray-700 font-semibold">Nome Completo</Label>
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Seu Nome Completo"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-semibold">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Seu Melhor E-mail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone" className="text-gray-700 font-semibold">Telefone</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="Seu Telefone com DDD"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>

                  <div>
                    <Label htmlFor="area" className="text-gray-700 font-semibold">Área de Interesse</Label>
                    <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
                      <SelectTrigger id="area" disabled={isSubmitting} className="mt-2 border-2 border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrativa">Área Administrativa</SelectItem>
                        <SelectItem value="tecnologica">Área Tecnológica</SelectItem>
                        <SelectItem value="outros">Outros Cursos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Cadastro"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setLocation("/agendar")}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Agendar Aula Experimental
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-lg mb-4">&copy; 2025 Aliar Cursos. Todos os direitos reservados.</p>
          <p className="text-blue-200">Transformando vidas através da educação de qualidade</p>
        </div>
      </footer>
    </div>
  );
}

