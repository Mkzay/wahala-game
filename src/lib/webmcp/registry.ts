import type {
  WebMcpTool,
  WebMcpToolResult,
  WebMcpRegistry,
} from './types'

export class WebMcpRegistryImpl implements WebMcpRegistry {
  private tools = new Map<string, WebMcpTool>()

  registerTool(tool: WebMcpTool): void {
    this.tools.set(tool.name, tool)
    this.dispatchChangeEvent()
  }

  unregisterTool(name: string): void {
    if (this.tools.delete(name)) {
      this.dispatchChangeEvent()
    }
  }

  hasTool(name: string): boolean {
    return this.tools.has(name)
  }

  clearTools(): void {
    this.tools.clear()
    this.dispatchChangeEvent()
  }

  listTools(): Array<{
    name: string
    description: string
    inputSchema: WebMcpTool['inputSchema']
  }> {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }))
  }

  async callTool(name: string, params: any = {}): Promise<WebMcpToolResult> {
    const tool = this.tools.get(name)
    if (!tool) {
      const errResult: WebMcpToolResult = {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Tool '${name}' not found. Available tools: ${Array.from(this.tools.keys()).join(', ')}`,
          },
        ],
      }
      this.dispatchCallEvent(name, params, errResult)
      return errResult
    }

    // Basic required properties validation
    if (tool.inputSchema.required && Array.isArray(tool.inputSchema.required)) {
      for (const req of tool.inputSchema.required) {
        if (params === undefined || params === null || params[req] === undefined) {
          const errResult: WebMcpToolResult = {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Missing required parameter '${req}' for tool '${name}'.`,
              },
            ],
          }
          this.dispatchCallEvent(name, params, errResult)
          return errResult
        }
      }
    }

    try {
      const result = await tool.handler(params)
      this.dispatchCallEvent(name, params, result)
      return result
    } catch (err: any) {
      const errResult: WebMcpToolResult = {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Error executing tool '${name}': ${err?.message ?? String(err)}`,
          },
        ],
      }
      this.dispatchCallEvent(name, params, errResult)
      return errResult
    }
  }

  private dispatchChangeEvent(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('webmcp:tools:changed', {
          detail: { tools: this.listTools() },
        })
      )
    }
  }

  private dispatchCallEvent(
    name: string,
    params: any,
    result: WebMcpToolResult
  ): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('webmcp:tool:called', {
          detail: { name, params, result },
        })
      )
    }
  }
}

export const webMcpRegistry = new WebMcpRegistryImpl()

// Install polyfill / globals if in browser context
if (typeof window !== 'undefined') {
  window.wahalaMcp = webMcpRegistry
  window.__WAHALA_MCP__ = webMcpRegistry

  if (typeof navigator !== 'undefined') {
    if (!navigator.modelContext) {
      // Polyfill navigator.modelContext with WebMCP draft spec shape
      ;(navigator as any).modelContext = {
        registerTool: (tool: WebMcpTool) => webMcpRegistry.registerTool(tool),
        unregisterTool: (name: string) => webMcpRegistry.unregisterTool(name),
        listTools: () => webMcpRegistry.listTools(),
        callTool: (name: string, params?: any) =>
          webMcpRegistry.callTool(name, params),
      }
    }
  }
}
