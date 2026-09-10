export interface WebMcpJsonSchema {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array'
  properties?: Record<
    string,
    {
      type: string
      description?: string
      enum?: string[]
      items?: { type: string }
    }
  >
  required?: string[]
  description?: string
}

export interface WebMcpTool {
  name: string
  description: string
  inputSchema: WebMcpJsonSchema
  handler: (params: any) => Promise<WebMcpToolResult> | WebMcpToolResult
}

export interface WebMcpToolResult {
  content: Array<{
    type: 'text' | 'json'
    text?: string
    data?: any
  }>
  isError?: boolean
}

export interface WebMcpRegistry {
  registerTool: (tool: WebMcpTool) => void
  unregisterTool: (name: string) => void
  listTools: () => Array<{
    name: string
    description: string
    inputSchema: WebMcpJsonSchema
  }>
  callTool: (name: string, params?: any) => Promise<WebMcpToolResult>
  hasTool: (name: string) => boolean
  clearTools: () => void
}

declare global {
  interface Window {
    wahalaMcp?: WebMcpRegistry
    __WAHALA_MCP__?: WebMcpRegistry
  }
  interface Navigator {
    modelContext?: {
      registerTool?: (tool: WebMcpTool) => void
      unregisterTool?: (name: string) => void
      listTools?: () => Array<{
        name: string
        description: string
        inputSchema: WebMcpJsonSchema
      }>
      callTool?: (name: string, params?: any) => Promise<WebMcpToolResult>
    }
  }
}
