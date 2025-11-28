import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Award, Building2, Link as LinkIcon, Instagram, ChevronRight, ChevronLeft, HelpCircle, Share2, Loader2, Radius } from 'lucide-react';
import { BusinessData } from '../types';

interface InputFormProps {
  onSubmit: (data: BusinessData) => void;
  isLoading: boolean;
  loadingTextRadius?: string;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, loadingTextRadius }) => {
  // Wizard State
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form Data State
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [segment, setSegment] = useState('');
  const [radius, setRadius] = useState('1km'); // Default radius
  const [differentiators, setDifferentiators] = useState('');
  const [gmbLink, setGmbLink] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');

  // Helper State for Step 3 (Map Search)
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [showMapFrame, setShowMapFrame] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessName && address && segment && gmbLink && instagramHandle) {
      onSubmit({ 
        businessName, 
        address, 
        segment, 
        differentiators,
        gmbLink,
        instagramHandle,
        radius
      });
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Validation Logic per step
  const isStep2Valid = businessName.trim() !== '' && address.trim() !== '' && segment.trim() !== '';
  const isStep3Valid = gmbLink.trim() !== '';
  const isStep4Valid = instagramHandle.trim() !== '';

  // Styles
  const inputClasses = "w-full px-4 py-3 rounded-lg border border-[#CCCCCC] bg-[#F5F5F5] text-gray-900 placeholder-gray-600 focus:bg-white focus:ring-2 focus:ring-[#005EB8] focus:border-transparent transition-all outline-none font-medium";
  const labelClasses = "block text-sm font-bold text-[#333333] mb-2 flex items-center gap-2";
  const helperTextClasses = "text-xs text-[#666666] mt-1 font-normal";
  const buttonPrimaryClasses = "w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-0.5 bg-[#FF8C00] hover:bg-[#E67E00] shadow-orange-900/20 flex items-center justify-center gap-2";
  const buttonDisabledClasses = "w-full py-4 rounded-xl font-bold text-lg text-white bg-[#CCCCCC] cursor-not-allowed shadow-none text-[#666666] flex items-center justify-center gap-2";

  // Step 3 Helper Function
  const handleMapSearch = () => {
    if (mapSearchQuery) {
      setShowMapFrame(true);
    }
  };

  // RENDER LOADING STATE (Dedicate Slide)
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 border border-[#CCCCCC] text-center animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-[#005EB8] blur-xl opacity-20 rounded-full"></div>
           <Loader2 className="w-16 h-16 text-[#005EB8] animate-spin relative z-10" />
        </div>
        
        <h3 className="text-2xl font-bold text-[#005EB8] mb-4">
          Aguarde um momento
        </h3>
        <p className="text-[#333333] text-lg font-medium">
          Estamos analisando seus vizinhos num raio de {loadingTextRadius || radius} e comparando diferenciais...
        </p>
        <p className="text-[#666666] text-sm mt-4">
          Isso pode levar alguns segundos.
        </p>
      </div>
    );
  }

  // RENDER WIZARD FORM
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-[#CCCCCC] relative overflow-hidden">
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-[#CCCCCC] w-full">
        <div 
          className="h-full bg-[#00A859] transition-all duration-500 ease-in-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        
        {/* SLIDE 1: INTRO */}
        {step === 1 && (
          <div className="text-center space-y-8 animate-fade-in">
            <div>
              <p className="text-[#333333] font-extrabold text-3xl md:text-4xl leading-tight mb-4">
                Analise seus vizinhos e se destaque no mercado local!
              </p>
              <p className="text-[#666666] text-sm md:text-base font-medium max-w-lg mx-auto">
                Para quem já tem negócio ou deseja investigar um local para a abertura de um novo negócio
              </p>
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                className={buttonPrimaryClasses}
              >
                SEGUIR <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* SLIDE 2: BASIC INFO */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#005EB8] border-b border-[#CCCCCC] pb-2 mb-6">
              Dados do Negócio
            </h3>

            {/* Nome do Negócio */}
            <div>
              <label className={labelClasses}>
                <Building2 className="w-4 h-4 text-[#005EB8]" /> {/* Blue */}
                Nome do Negócio
              </label>
              <input
                type="text"
                className={inputClasses}
                placeholder="Ex: Café do João"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                autoFocus
              />
              <p className={helperTextClasses}>Do seu ou um já existente para sua pesquisa</p>
            </div>

            {/* Endereço */}
            <div>
              <label className={labelClasses}>
                <MapPin className="w-4 h-4 text-[#E63946]" /> {/* Red */}
                Endereço do Negócio
              </label>
              <input
                type="text"
                className={inputClasses}
                placeholder="Ex: Av. Paulista, 1000"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Segmento */}
            <div>
              <label className={labelClasses}>
                <Briefcase className="w-4 h-4 text-[#FFB800]" /> {/* Yellow/Gold */}
                Segmento de Atuação
              </label>
              <input
                type="text"
                className={inputClasses}
                placeholder="Ex: Cafeteria"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
              />
            </div>

            {/* Raio de Análise */}
            <div>
              <label className={labelClasses}>
                <Search className="w-4 h-4 text-[#00A859]" /> {/* Green */}
                Raio de Análise
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['1km', '5km', '10km'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    className={`py-3 rounded-lg font-bold text-sm transition-all border ${
                      radius === r
                        ? 'bg-[#005EB8] text-white border-[#005EB8] shadow-md'
                        : 'bg-[#F5F5F5] text-[#666666] border-[#CCCCCC] hover:bg-gray-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
               <button
                type="button"
                onClick={prevStep}
                className="px-6 py-4 rounded-xl font-bold text-[#666666] hover:bg-gray-100 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStep2Valid}
                className={isStep2Valid ? buttonPrimaryClasses : buttonDisabledClasses}
              >
                SEGUIR <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* SLIDE 3: GMB LINK */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
             <h3 className="text-xl font-bold text-[#005EB8] border-b border-[#CCCCCC] pb-2 mb-6">
              Presença no Google
            </h3>

            <div>
              <label className={labelClasses}>
                <LinkIcon className="w-4 h-4 text-[#00A859]" /> {/* Green */}
                Link Google Meu Negócio
              </label>
              <input
                type="url"
                className={inputClasses}
                placeholder="Ex: https://share.google OU https://maps.google..."
                value={gmbLink}
                onChange={(e) => setGmbLink(e.target.value)}
                autoFocus
              />
            </div>

            {/* Helper Section for Search */}
            <div className="bg-[#F5F5F5] p-4 rounded-lg border border-[#CCCCCC] mt-4">
              <label className="text-sm font-bold text-[#333333] mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#005EB8]" />
                Não sei meu link - digite aqui
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  className="flex-1 px-3 py-2 rounded-lg border border-[#CCCCCC] text-sm bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Nome do estabelecimento + Cidade"
                  value={mapSearchQuery}
                  onChange={(e) => setMapSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                />
                <button 
                  type="button"
                  onClick={handleMapSearch}
                  className="bg-[#005EB8] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#004a91]"
                >
                  Buscar
                </button>
              </div>
              
              {showMapFrame && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-[#666666] italic mb-1 flex items-start gap-1">
                    <span className="font-bold">1.</span> Localize o negócio no mapa.<br/>
                    <span className="font-bold">2.</span> Clique em "Ampliar mapa".<br/>
                    <span className="font-bold flex items-center gap-1">3. Copie o link do navegador ou botão compartilhar <Share2 className="w-3 h-3 inline"/> e cole no campo acima.</span>
                  </p>
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#CCCCCC]">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps?q=${encodeURIComponent(mapSearchQuery)}&output=embed`}
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
               <button
                type="button"
                onClick={prevStep}
                className="px-6 py-4 rounded-xl font-bold text-[#666666] hover:bg-gray-100 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStep3Valid}
                className={isStep3Valid ? buttonPrimaryClasses : buttonDisabledClasses}
              >
                SEGUIR <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* SLIDE 4: SOCIAL & FINAL */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-[#005EB8] border-b border-[#CCCCCC] pb-2 mb-6">
              Redes Sociais & Diferenciais
            </h3>

            <div>
              <label className={labelClasses}>
                <Instagram className="w-4 h-4 text-[#FF8C00]" /> {/* Orange */}
                Instagram (@usuario)
              </label>
              <input
                type="text"
                className={inputClasses}
                placeholder="@seu_perfil"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                autoFocus
              />
            </div>

            {/* Diferenciais (Opcional) */}
            <div>
              <label className={labelClasses}>
                <Award className="w-4 h-4 text-[#005EB8]" /> {/* Blue */}
                Seus Diferenciais (Opcional)
              </label>
              <textarea
                className={`${inputClasses} h-24 resize-none`}
                placeholder="Ex: Atendimento 24h, Produtos orgânicos, Estacionamento gratuito..."
                value={differentiators}
                onChange={(e) => setDifferentiators(e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
               <button
                type="button"
                onClick={prevStep}
                className="px-6 py-4 rounded-xl font-bold text-[#666666] hover:bg-gray-100 transition-colors"
              >
                Voltar
              </button>
              
              <button
                type="submit"
                disabled={isLoading || !isStep4Valid}
                className={isLoading || !isStep4Valid ? buttonDisabledClasses : buttonPrimaryClasses}
              >
                COMPARAR
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default InputForm;