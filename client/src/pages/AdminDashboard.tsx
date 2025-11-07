import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNotes, setEditingNotes] = useState("");
  const [selectedTab, setSelectedTab] = useState<'leads' | 'aulas' | 'curriculos'>('leads');
  const [filterArea, setFilterArea] = useState<string>('todos');
  const [selectedCurriculo, setSelectedCurriculo] = useState<any>(null);

  // Fetch leads
  const { data: leads = [], isLoading, refetch } = trpc.leads.list.useQuery();
  
  // Fetch trial classes
  const { data: trialClasses = [], refetch: refetchTrialClasses } = trpc.trialClasses.list.useQuery();

  // Fetch currículos
  const { data: curriculos = [], refetch: refetchCurriculos } = trpc.curriculos.list.useQuery();

  // Mutations
  const updateLead = trpc.leads.update.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedLead(null);
      alert("Lead atualizado com sucesso!");
    },
    onError: (error: any) => {
      alert(`Erro ao atualizar: ${error.message}`);
    },
  });

  const deleteLead = trpc.leads.delete.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedLead(null);
      alert("Lead deletado com sucesso!");
    },
    onError: (error: any) => {
      alert(`Erro ao deletar: ${error.message}`);
    },
  });

  const updateCurriculo = trpc.curriculos.update.useMutation({
    onSuccess: () => {
      refetchCurriculos();
      setSelectedCurriculo(null);
      alert("Currículo atualizado com sucesso!");
    },
    onError: (error: any) => {
      alert(`Erro ao atualizar: ${error.message}`);
    },
  });

  const deleteCurriculo = trpc.curriculos.delete.useMutation({
    onSuccess: () => {
      refetchCurriculos();
      setSelectedCurriculo(null);
      alert("Currículo deletado com sucesso!");
    },
    onError: (error: any) => {
      alert(`Erro ao deletar: ${error.message}`);
    },
  });

  // Verificar se é admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrar leads
  const filteredLeads = leads.filter((lead: any) => {
    const matchesStatus = filterStatus === "todos" || lead.status === filterStatus;
    const matchesSearch = 
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Estatísticas
  const stats = {
    total: leads.length,
    novo: leads.filter((l: any) => l.status === "novo").length,
    contatado: leads.filter((l: any) => l.status === "contatado").length,
    interessado: leads.filter((l: any) => l.status === "interessado").length,
    matriculado: leads.filter((l: any) => l.status === "matriculado").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Bem-vindo, {user.name}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setLocation("/")}>
              Voltar ao Site
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                logout();
                setLocation("/");
              }}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Abas de navegação */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setSelectedTab('leads')}
            className={`px-4 py-2 font-semibold ${
              selectedTab === 'leads'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Leads de Cadastro
          </button>
          <button
            onClick={() => setSelectedTab('aulas')}
            className={`px-4 py-2 font-semibold ${
              selectedTab === 'aulas'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Aulas Agendadas
          </button>
          <button
            onClick={() => setSelectedTab('curriculos')}
            className={`px-4 py-2 font-semibold ${
              selectedTab === 'curriculos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Currículos NAE
          </button>
        </div>
        
        {selectedTab === 'leads' && (
        <>
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Novo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.novo}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Contatado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.contatado}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Interessado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.interessado}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Matriculado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.matriculado}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Buscar por nome, email ou telefone</Label>
                <Input
                  id="search"
                  placeholder="Digite aqui..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Filtrar por Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contatado">Contatado</SelectItem>
                    <SelectItem value="interessado">Interessado</SelectItem>
                    <SelectItem value="matriculado">Matriculado</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabela de Leads */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Leads ({filteredLeads.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Carregando...</div>
                ) : filteredLeads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhum lead encontrado</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold text-sm">Nome</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">Email</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">Status</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead: any) => (
                          <tr key={lead.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2 text-sm">{lead.nome}</td>
                            <td className="py-3 px-2 text-sm text-gray-600">{lead.email}</td>
                            <td className="py-3 px-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                lead.status === 'novo' ? 'bg-blue-100 text-blue-800' :
                                lead.status === 'contatado' ? 'bg-yellow-100 text-yellow-800' :
                                lead.status === 'interessado' ? 'bg-purple-100 text-purple-800' :
                                lead.status === 'matriculado' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setEditingNotes(lead.notas || "");
                                }}
                              >
                                Ver
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do Lead */}
          <div>
            {selectedLead ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Lead</CardTitle>
                  <CardDescription>{selectedLead.nome}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-500">Nome</Label>
                    <p className="font-semibold">{selectedLead.nome}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Email</Label>
                    <p className="font-semibold">{selectedLead.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Telefone</Label>
                    <p className="font-semibold">{selectedLead.telefone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Área</Label>
                    <p className="font-semibold">{selectedLead.area || "Não informada"}</p>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={selectedLead.status}
                      onValueChange={(status) => {
                        updateLead.mutate({ id: selectedLead.id, status: status as any });
                      }}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novo">Novo</SelectItem>
                        <SelectItem value="contatado">Contatado</SelectItem>
                        <SelectItem value="interessado">Interessado</SelectItem>
                        <SelectItem value="matriculado">Matriculado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      placeholder="Adicione notas sobre este lead..."
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        updateLead.mutate({ id: selectedLead.id, notas: editingNotes });
                      }}
                      disabled={updateLead.isPending}
                    >
                      Salvar Notas
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja deletar este lead?")) {
                          deleteLead.mutate(selectedLead.id);
                        }
                      }}
                      disabled={deleteLead.isPending}
                    >
                      Deletar
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedLead(null)}
                  >
                    Fechar
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Lead</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-center py-8">
                    Selecione um lead para ver os detalhes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        </>
        )}
        
        {selectedTab === 'aulas' && (
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Aulas Experimentais Agendadas</CardTitle>
              <CardDescription>
                Total: {trialClasses.length} aulas agendadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trialClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma aula agendada ainda
                </div>
              ) : (
                <div className="space-y-4">
                  {trialClasses.map((aula: any) => (
                    <div
                      key={aula.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{aula.nome}</h3>
                          <p className="text-sm text-gray-600">{aula.email}</p>
                          <p className="text-sm text-gray-600">{aula.telefone}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {aula.area}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600 text-xs">Curso:</span>
                          <p className="font-semibold">{aula.curso}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Data:</span>
                          <p className="font-semibold">
                            {new Date(aula.dataAgendamento).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Horario:</span>
                          <p className="font-semibold">{aula.horario}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Status:</span>
                          <p className="font-semibold text-green-600">Confirmado</p>
                        </div>
                      </div>
                      {aula.observacoes && (
                        <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                          <span className="text-gray-600 text-xs">Observacoes:</span>
                          <p>{aula.observacoes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        )}

        {selectedTab === 'curriculos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filtro por Área */}
          <div className="lg:col-span-3">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area">Filtrar por Área</Label>
                    <Select value={filterArea} onValueChange={setFilterArea}>
                      <SelectTrigger id="area">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas as Áreas</SelectItem>
                        <SelectItem value="Administrativa">Área Administrativa</SelectItem>
                        <SelectItem value="Comercial">Área Comercial</SelectItem>
                        <SelectItem value="Tecnológica">Área Tecnológica</SelectItem>
                        <SelectItem value="Idioma">Área de Idioma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Currículos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Currículos Recebidos ({curriculos.filter((c: any) => filterArea === 'todos' || c.area === filterArea).length})</CardTitle>
              </CardHeader>
              <CardContent>
                {curriculos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum currículo recebido ainda
                  </div>
                ) : (
                  <div className="space-y-3">
                    {curriculos
                      .filter((c: any) => filterArea === 'todos' || c.area === filterArea)
                      .map((curriculo: any) => (
                        <div
                          key={curriculo.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => setSelectedCurriculo(curriculo)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{curriculo.nome}</h3>
                              <p className="text-sm text-gray-600">{curriculo.email}</p>
                              <p className="text-sm text-gray-600">{curriculo.telefone}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${
                              curriculo.status === 'recebido' ? 'bg-blue-100 text-blue-800' :
                              curriculo.status === 'analisando' ? 'bg-yellow-100 text-yellow-800' :
                              curriculo.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {curriculo.status}
                            </span>
                          </div>
                          <div className="mt-3 flex justify-between items-center text-sm">
                            <div>
                              <span className="text-gray-600 text-xs">Área:</span>
                              <p className="font-semibold">{curriculo.area}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 text-xs">Arquivo:</span>
                              <p className="font-semibold text-blue-600">{curriculo.nomeArquivo}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 text-xs">Data:</span>
                              <p className="font-semibold">
                                {new Date(curriculo.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do Currículo */}
          <div>
            {selectedCurriculo ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Currículo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-600 text-xs">Nome</Label>
                    <p className="font-semibold">{selectedCurriculo.nome}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Email</Label>
                    <p className="font-semibold">{selectedCurriculo.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Telefone</Label>
                    <p className="font-semibold">{selectedCurriculo.telefone}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Área</Label>
                    <p className="font-semibold">{selectedCurriculo.area}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Arquivo</Label>
                    <p className="font-semibold text-blue-600">{selectedCurriculo.nomeArquivo}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Status</Label>
                    <Select 
                      value={selectedCurriculo.status} 
                      onValueChange={(value) => {
                        updateCurriculo.mutate({
                          id: selectedCurriculo.id,
                          status: value as any,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recebido">Recebido</SelectItem>
                        <SelectItem value="analisando">Analisando</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Notas</Label>
                    <Textarea
                      value={selectedCurriculo.notas || ''}
                      onChange={(e) => setSelectedCurriculo({ ...selectedCurriculo, notas: e.target.value })}
                      placeholder="Adicione notas sobre este currículo"
                      className="min-h-24"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        updateCurriculo.mutate({
                          id: selectedCurriculo.id,
                          notas: selectedCurriculo.notas,
                        });
                      }}
                      disabled={updateCurriculo.isPending}
                    >
                      Salvar Notas
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja deletar este currículo?")) {
                          deleteCurriculo.mutate(selectedCurriculo.id);
                        }
                      }}
                      disabled={deleteCurriculo.isPending}
                    >
                      Deletar
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedCurriculo(null)}
                  >
                    Fechar
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Currículo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-center py-8">
                    Selecione um currículo para ver os detalhes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        )}
      </main>
    </div>
  );
}

