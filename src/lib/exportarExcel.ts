// Utilitário para exportar dados para Excel usando SheetJS
import * as XLSX from 'xlsx';

export function exportarParaExcel(dados: any[], nomeArquivo = 'relatorio.xlsx') {
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  XLSX.writeFile(wb, nomeArquivo);
}
