import { describe, expect, it } from "vitest";
import { shouldShowChatbot } from "./App";

describe("shouldShowChatbot", () => {
  it("shows the chatbot only on operator routes for operator users", () => {
    expect(shouldShowChatbot({ role: "Operator" }, "/operator/dashboard")).toBe(true);
  });

  it("hides the chatbot outside operator routes", () => {
    expect(shouldShowChatbot({ role: "Operator" }, "/accounts")).toBe(false);
    expect(shouldShowChatbot({ role: "Accountant" }, "/operator/dashboard")).toBe(false);
  });

  it("hides the chatbot for non-operator modules", () => {
    expect(shouldShowChatbot({ role: "Production Manager" }, "/production/dashboard")).toBe(false);
    expect(shouldShowChatbot({ role: "HR Manager" }, "/hr/dashboard")).toBe(false);
    expect(shouldShowChatbot({ role: "Store Manager" }, "/inventory/dashboard")).toBe(false);
  });
});
