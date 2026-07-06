/** @vitest-environment jsdom */
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AiChatWidget } from "./ai-chat-widget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the API hooks
vi.mock("@workspace/api-client-react", () => ({
  useCreateGeminiConversation: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: "mock-id" }),
    isPending: false,
  }),
}));

vi.mock("@/hooks/use-gemini-stream", () => ({
  useGeminiStream: () => ({
    messages: [],
    input: "",
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
    isLoading: false,
    error: null,
    setMessages: vi.fn()
  })
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.join(" ")
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("AiChatWidget Component", () => {
  it("renders closed chat widget initially", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AiChatWidget persona="fan" />
      </QueryClientProvider>
    );

    expect(screen.getByPlaceholderText(/ask stadiumiq/i)).toBeDefined();
  });
});
