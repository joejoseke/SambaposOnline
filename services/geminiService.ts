
import { GoogleGenAI } from "@google/genai";
import type { TicketItem } from '../types';

// FIX: Switched from `import.meta.env.VITE_API_KEY` to `process.env.API_KEY` to adhere to coding guidelines. This also resolves the TypeScript error.
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.error("API_KEY is not defined. Please set it in your environment variables.");
}

export async function getUpsellSuggestions(items: TicketItem[]): Promise<string> {
    if (!ai) {
      return "AI service is not configured. Please check your API key.";
    }

    const model = 'gemini-2.5-flash';
    
    const itemNames = items.map(item => `${item.quantity}x ${item.menuItem.name}`).join(', ');
    const prompt = `
        A customer has the following items in their order: ${itemNames}.
        Based on this order, provide one or two brief, friendly upselling suggestions.
        For example, suggest a drink that pairs well, a side dish, or a dessert.
        Keep the response concise and sound like a helpful server. Do not use markdown.
        Example response: "How about some crispy onion rings to go with that?" or "A slice of our rich chocolate cake would be a perfect finish!"
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error(`Error calling Gemini API:`, error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
            return "The provided API key is not valid. Please check your configuration.";
        }
        throw new Error('Failed to get suggestion from AI model.');
    }
}
