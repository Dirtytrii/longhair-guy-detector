import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("mobile quiz flow", () => {
  it("lets a user complete 24 NPC answers and reach the share-card result view", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /开始鉴定/ }));

    for (let index = 1; index <= 24; index += 1) {
      expect(await screen.findByText(`${String(index).padStart(2, "0")} / 24`)).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: /NPC/ }));
    }

    expect(await screen.findByText("人间烟火长发男", {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText("把烟火气过成地下艺术的长发男")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /生成图卡/ }));

    expect(screen.getByText("分享卡预览")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /保存 PNG/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /复制结果链接/ })).toBeInTheDocument();
  }, 15000);
});
