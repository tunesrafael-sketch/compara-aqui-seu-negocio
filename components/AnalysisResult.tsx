import React from 'react';
import { BenchmarkResult } from '../types';
import CompetitorChart from './CompetitorChart';
import { MapPin, ExternalLink, ArrowLeft, Download } from 'lucide-react';

interface AnalysisResultProps {
  data: BenchmarkResult;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
  // Simple function to format the markdown-like text from Gemini into safer HTML
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ') || line.startsWith('### ')) {
        // Sebrae Blue for headers
        return <h3 key={i} className="text-xl font-bold text-[#005EB8] mt-6 mb-3 border-b-2 border-[#F5F5F5] pb-2">{line.replace(/#/g, '')}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        // Orange bullets
        return <li key={i} className="ml-4 mb-2 text-[#333333] font-medium list-disc marker:text-[#FF8C00]">{line.substring(2)}</li>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
         return <p key={i} className="font-bold text-[#003D75] mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.trim() === '') return <br key={i} />;
      
      // Basic bold formatting within paragraph
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-2 text-[#333333] leading-relaxed font-medium">
          {parts.map((part, index) => {
             if (part.startsWith('**') && part.endsWith('**')) {
                 return <strong key={index} className="text-[#005EB8] font-bold">{part.replace(/\*\*/g, '')}</strong>;
             }
             return part;
          })}
        </p>
      );
    });
  };

  const mapLinks = data.groundingChunks.filter(chunk => chunk.maps?.uri);

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    // Type assertion for html2pdf which is loaded via CDN script
    const opt = {
      margin: 10,
      filename: `Analise_Compara_Aqui_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set(opt).from(element).save();
    } else {
      alert("Erro ao gerar PDF: Biblioteca não carregada.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Top Actions Bar */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onReset}
          className="flex items-center text-[#666666] hover:text-[#005EB8] transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nova Pesquisa
        </button>

        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-[#005EB8] hover:bg-[#004a91] text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          Baixar PDF
        </button>
      </div>

      {/* Content to be printed */}
      {/* FIX: Changed from grid to flex-col and added bg-white to ensure PDF generates correctly without blank/black pages */}
      <div id="pdf-content" className="flex flex-col gap-6 bg-white p-6 md:p-10 rounded-xl">
        {/* Header visible only on PDF usually, but good here too */}
        <div className="border-b border-[#CCCCCC] pb-4 mb-2 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#005EB8]">Relatório Compara Aqui</h2>
            <span className="text-sm text-[#666666]">{new Date().toLocaleDateString('pt-BR')}</span>
        </div>

        {/* Main Analysis */}
        <div className="space-y-6">
          <div className="bg-white">
            <h2 className="text-2xl font-bold text-[#005EB8] mb-6 border-b border-[#CCCCCC] pb-4">Análise Estratégica</h2>
            <div className="prose prose-blue max-w-none text-[#333333]">
              {formatText(data.analysisText)}
            </div>
          </div>
        </div>

        {/* Stats & Charts Section */}
        <div className="flex flex-col gap-6 mt-4">
           
           {/* Summary Stats Card - Green Background */}
           <div className="bg-[#00A859] rounded-xl shadow-sm p-6 text-white border-b-4 border-[#007F43]">
              <h4 className="text-white/80 text-sm font-bold uppercase tracking-wider mb-2">Concorrência Detectada</h4>
              <div className="text-4xl font-extrabold mb-1">{data.competitors.length}</div>
              <p className="text-white text-sm font-medium">Negócios analisados</p>
           </div>

          {/* Chart Card */}
          <CompetitorChart competitors={data.competitors} />

          {/* Competitors List / Map Links */}
          {mapLinks.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-[#CCCCCC] p-6">
              <h3 className="text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E63946]" /> {/* Red Icon */}
                Locais Encontrados
              </h3>
              <ul className="space-y-3">
                {mapLinks.map((chunk, idx) => (
                  <li key={idx}>
                    <a 
                      href={chunk.maps?.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-[#F5F5F5] hover:bg-blue-50 transition-colors group border border-[#CCCCCC] hover:border-[#005EB8]"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-[#333333] group-hover:text-[#005EB8] text-sm">
                          {chunk.maps?.title || "Local no Mapa"}
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#666666] group-hover:text-[#005EB8] mt-1" />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;