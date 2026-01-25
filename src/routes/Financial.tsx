import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { api } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Loader2, DollarSign } from "lucide-react";

export function Financial() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    month: 0,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const response = await api.get(
          `/ctes/reports/financial?month=${filter.month}&year=${filter.year}`,
        );
        console.log("Resposta do Servidor:", response.data); // ADICIONE ISSO

        const formatted = response.data.map((item: any) => ({
          name: item.accountable || "Não Informado",
          value: Number(item._sum.value) || 0,
          count: item._count.id,
        }));
        setData(formatted);
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [filter]);

  const totalGeral = data.reduce((acc, curr) => acc + curr.value, 0);

  // Cores seguindo o seu padrão
  const COLORS = ["#3b82f6", "#f97316", "#8b5cf6"]; // Azul (Adm), Laranja (Oper), Roxo (Outros)

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );

  return (
    <main className="w-full h-screen px-6 overflow-auto text-slate-50 pb-10 bg-slate-950">
      <Header
        title="Relatórios Analíticos"
        subtitle="Análise de custos e indenizações"
      />
      <div className="flex items-center justify-between">
        {/* Cards de Resumo */}
        <div className="w-fit mb-8 mt-6 ">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <DollarSign className="text-emerald-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase">
                  Total Indenizado
                </p>
                <h3 className="text-2xl font-bold">
                  {totalGeral.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h3>
              </div>
            </div>
          </div>
          {/* Outros cards (Qtd Total, Maior Ofensor, etc) */}
        </div>
        <div className="flex gap-4 mb-8 mt-6">
          <select
            value={filter.month}
            onChange={(e) =>
              setFilter({ ...filter, month: Number(e.target.value) })
            }
            className="bg-slate-900 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none focus:border-blue-500"
          >
            <option value={0}>Todos</option>
            <option value={1}>Janeiro</option>
            <option value={2}>Fevereiro</option>
            <option value={3}>Março</option>
            <option value={4}>Abril</option>
            <option value={5}>Maio</option>
            <option value={6}>Junho</option>
            <option value={7}>Julho</option>
            <option value={8}>Agosto</option>
            <option value={9}>Setembro</option>
            <option value={10}>Outubro</option>
            <option value={11}>Novembro</option>
            <option value={12}>Dezembro</option>
          </select>
          <select
            value={filter.year}
            onChange={(e) =>
              setFilter({ ...filter, year: Number(e.target.value) })
            }
            className="bg-slate-900 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none focus:border-blue-500"
          >
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Pizza */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-[400px]">
          <h3 className="font-bold mb-4">Distribuição por Causador</h3>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="95%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#f1f5f9" }}
                  // Ajuste aqui: definimos que o value pode ser number ou undefined
                  formatter={(value: number | string | undefined) => {
                    const numericValue = Number(value) || 0;
                    return numericValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    });
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              Nenhuma indenização registrada neste período.
            </div>
          )}
        </div>
        {/* Detalhamento em Lista */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl overflow-auto">
          <h3 className="font-bold mb-4">Detalhamento Financeiro</h3>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/30"
              >
                <div>
                  <p className="font-bold text-slate-200">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.count} ocorrências
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-slate-100">
                    {item.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p className="text-xs text-emerald-500">
                    {((item.value / totalGeral) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
