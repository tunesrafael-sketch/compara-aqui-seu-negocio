import React, { useState } from 'react';
import InputForm from './components/InputForm';
import AnalysisResult from './components/AnalysisResult';
import { BusinessData, BenchmarkResult, AppState } from './types';
import { analyzeCompetitors } from './services/geminiService';
import { Play } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [analysisRadius, setAnalysisRadius] = useState<string>('1km');

  const handleFormSubmit = async (data: BusinessData) => {
    setAnalysisRadius(data.radius); // Store the selected radius for loading UI
    setAppState(AppState.LOADING);
    setErrorMsg('');
    try {
      const benchmarkData = await analyzeCompetitors(
        data.businessName,
        data.address,
        data.segment,
        data.differentiators,
        data.gmbLink,
        data.instagramHandle,
        data.radius
      );
      setResult(benchmarkData);
      setAppState(AppState.RESULT);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Ocorreu um erro desconhecido.");
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setResult(null);
    setAppState(AppState.INPUT);
    setErrorMsg('');
    setAnalysisRadius('1km');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#333333] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#316bae] border-b-4 border-[#F06687] sticky top-0 z-10 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetApp}>
            {/* Title Replacement for Sebrae Play Logo */}
            <div className="flex items-center gap-2">
               <div className="bg-white p-2 rounded-lg text-[#316bae] group-hover:bg-gray-100 transition-colors shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column-stacked"><path d="M11 13H7"/><path d="M19 9h-4"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/><rect x="15" y="5" width="4" height="12" rx="1"/><rect x="7" y="8" width="4" height="9" rx="1"/></svg>
               </div>
               <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                 Compara Aqui <span className="text-[#F06687]">Negócios</span>
               </h1>
            </div>
          </div>

          {/* Right Side: Sebrae Play Logo SVG with Link */}
          <div>
            <a href="https://sebraeplay.com.br/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
              <img 
                src="https://sebraeplay.com.br/logotipo.svg" 
                alt="Sebrae Play" 
                className="h-10 md:h-12 object-contain filter brightness-100" 
              />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {appState === AppState.INPUT && (
          <div className="animate-fade-in py-6">
            <InputForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {appState === AppState.LOADING && (
          <div className="animate-fade-in py-6">
             {/* InputForm handles the visual loading state internally */}
             <InputForm onSubmit={() => {}} isLoading={true} loadingTextRadius={analysisRadius} />
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-md mx-auto bg-white border-l-4 border-[#E63946] rounded-r-xl shadow-md p-6 text-center animate-fade-in">
            <h3 className="text-[#E63946] font-bold text-lg mb-2">Ops! Algo deu errado.</h3>
            <p className="text-[#333333] mb-6">{errorMsg}</p>
            <button 
              onClick={resetApp}
              className="px-6 py-2 bg-white border border-[#CCCCCC] text-[#333333] font-bold rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {appState === AppState.RESULT && result && (
          <AnalysisResult data={result} onReset={resetApp} />
        )}

      </main>

      {/* Footer with Support Colors Strip */}
      <footer className="mt-auto">
        {/* Support Color Decorative Strip */}
        <div className="h-2 w-full flex">
          <div className="h-full w-1/4 bg-[#005EB8]"></div> {/* Blue */}
          <div className="h-full w-1/4 bg-[#FF8C00]"></div> {/* Orange */}
          <div className="h-full w-1/4 bg-[#00A859]"></div> {/* Green */}
          <div className="h-full w-1/4 bg-[#E63946]"></div> {/* Red */}
        </div>
        <div className="bg-white text-center text-[#666666] text-sm py-6 border-t border-[#CCCCCC]">
          &copy; {new Date().getFullYear()} Sebrae Play. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default App;