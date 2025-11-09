
import { GoogleGenAI } from "@google/genai";
import type { TicketItem } from '../types';

// IMPORTANT: This key is a placeholder and should be handled via environment variables in a real application.
// For this environment, it's assumed `process.env.API_KEY` is available.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function getUpsellSuggestions(items: TicketItem[]): Promise<string> {
    if (!apiKey) {
        return "AI features are disabled because the API key is not configured.";
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
        console.error(`Error calling Gemini API: ${error}`);
        throw new Error('Failed to get suggestion from AI model.');
    }
}
