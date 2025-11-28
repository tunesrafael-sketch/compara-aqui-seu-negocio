import { GoogleGenAI } from "@google/genai";
import { BenchmarkResult, Competitor, GroundingChunk } from "../types";

const processEnvApiKey = process.env.API_KEY;
if (!processEnvApiKey) {
  console.error("API_KEY is missing in the environment.");
}

const ai = new GoogleGenAI({ apiKey: processEnvApiKey || "" });

export const analyzeCompetitors = async (
  businessName: string,
  address: string,
  segment: string,
  differentiators: string,
  gmbLink: string,
  instagramHandle: string,
  radius: string
): Promise<BenchmarkResult> => {
  try {
    const prompt = `
      Atue como um consultor sênior de inteligência de mercado e benchmarking digital.
      
      Dados do MEU negócio (Cliente):
      - Nome: ${businessName}
      - Localização: ${address}
      - Segmento: ${segment}
      - Link Google Meu Negócio: ${gmbLink}
      - Instagram: ${instagramHandle}
      - Meus Diferenciais Competitivos declarados: ${differentiators}
      - Raio de Análise Desejado: ${radius}

      Objetivo da Análise:
      1. Use o Google Maps para mapear concorrentes diretos e indiretos deste segmento num raio de aproximadamente ${radius} a partir do endereço fornecido.
      2. Use o Google Search para realizar uma "Auditoria Digital" nos concorrentes encontrados. Busque especificamente por perfis de Instagram e sites oficiais deles.
      3. Identifique nomes, a nota média (estrelas) e o NÚMERO DE AVALIAÇÕES dos concorrentes no Google Maps.
      4. Compare meus diferenciais com o padrão do mercado local.
      5. ANÁLISE COMPARATIVA DIGITAL (Obrigatória):
         - Compare o meu Instagram (${instagramHandle}) com o dos concorrentes encontrados (busque por menções públicas, número aproximado de seguidores se disponível publicamente no Search, e qualidade visual percebida externamente).
         - Compare a minha presença no Google (baseado no link fornecido) com a densidade de reviews dos concorrentes.

      Formato de Resposta Obrigatório:
      Comece com uma análise textual rica, usando Markdown. Use títulos (##) para separar as seções.
      A seção "Presença Digital & Redes Sociais" deve ser detalhada, citando o @ dos concorrentes se encontrar.
      
      IMPORTANTE:
      No FINAL da sua resposta, adicione estritamente um bloco de dados oculto para eu processar via código, no seguinte formato (Nome|Nota|NumeroAvaliacoes):
      
      ---DATA_START---
      Nome do Concorrente 1|4.5|120
      Nome do Concorrente 2|3.8|45
      Nome do Concorrente 3|N/A|0
      ---DATA_END---
      
      (Se não encontrar a nota ou reviews, coloque 0. O terceiro campo é a quantidade numérica de reviews).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        temperature: 0.5,
      },
    });

    const text = response.text || "Não foi possível gerar a análise.";
    
    // Extract Grounding Metadata (Maps & Web Links)
    const candidates = response.candidates;
    let groundingChunks: GroundingChunk[] = [];
    if (candidates && candidates[0]?.groundingMetadata?.groundingChunks) {
      groundingChunks = candidates[0].groundingMetadata.groundingChunks;
    }

    // Parse text for the Data Block
    const competitors: Competitor[] = [];
    const dataBlockRegex = /---DATA_START---([\s\S]*?)---DATA_END---/;
    const match = text.match(dataBlockRegex);
    let cleanText = text;

    if (match && match[1]) {
      const dataLines = match[1].trim().split('\n');
      dataLines.forEach(line => {
        // Expected format: Name|Rating|Reviews
        const parts = line.split('|');
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const ratingStr = parts[1].trim();
          const reviewsStr = parts[2] ? parts[2].trim() : "0";
          
          if (name) {
            const rating = parseFloat(ratingStr);
            // Remove non-numeric chars for reviews just in case
            const reviews = parseInt(reviewsStr.replace(/[^0-9]/g, '')) || 0;
            
            competitors.push({
              name: name,
              rating: isNaN(rating) ? 0 : rating,
              reviews: reviews
            });
          }
        }
      });
      // Remove the data block from the visible text to keep it clean
      cleanText = text.replace(dataBlockRegex, '').trim();
    }

    return {
      analysisText: cleanText,
      competitors,
      groundingChunks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao analisar o mercado. Verifique o endereço e tente novamente.");
  }
};