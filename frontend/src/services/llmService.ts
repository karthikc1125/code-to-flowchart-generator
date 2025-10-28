export interface LLMResponse {
    status: string;
    message: string;
    details?: string;
}

export class LLMService {
    private baseUrl = 'http://localhost:3000';

    async loadLLM(): Promise<LLMResponse> {
        const response = await fetch(`${this.baseUrl}/api/llm/load`, {
            method: 'POST',
        });
        return response.json();
    }

    async getLoadingStatus(): Promise<string> {
        const response = await fetch(`${this.baseUrl}/api/llm/status`);
        const data = await response.json();
        return data.status;
    }

    async getOutputBuffer(): Promise<string> {
        const response = await fetch(`${this.baseUrl}/api/llm/output`);
        const data = await response.json();
        return data.output;
    }

    async convertCodeToMermaid(code: string): Promise<string> {
        const response = await fetch(`${this.baseUrl}/api/llm/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        return data.diagram;
    }
}

export const llmService = new LLMService(); 