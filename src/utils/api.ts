const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

interface StreamCallbacks {
  onChunk: (fullContent: string, delta: string) => void;
  onFinish: (fullContent: string) => void;
  onError: (error: string) => void;
}

interface ChatMessageLite {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessage(
  apiKey: string,
  messages: ChatMessageLite[],
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            callbacks.onFinish(accumulatedContent);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta && typeof delta === 'string') {
              accumulatedContent += delta;
              callbacks.onChunk(accumulatedContent, delta);
            }
          } catch {
            // 忽略无效 JSON
          }
        }
      }
    }

    callbacks.onFinish(accumulatedContent);
  } catch (error) {
    callbacks.onError(error instanceof Error ? error.message : '未知错误');
  }
}
