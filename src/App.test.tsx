import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toPng } from "html-to-image";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";

vi.mock("html-to-image", () => ({
  toPng: vi.fn(),
}));

const mockedToPng = vi.mocked(toPng);

describe("mobile quiz flow", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
    mockedToPng.mockReset();
    mockedToPng.mockResolvedValue("data:image/png;base64,iVBORw0KGgo=");
  });

  it("lets a user complete 24 NPC answers and reach the share-card result view", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /开始鉴定/ }));

    for (let index = 1; index <= 24; index += 1) {
      expect(await screen.findByText(`${String(index).padStart(2, "0")} / 24`)).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: /NPC/ }));
    }

    expect(await screen.findByText("人间烟火长发男", {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText(/把烟火气过成地下艺术的长发男/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /生成图卡/ }));

    expect(screen.getByText("分享卡已生成")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /保存图片/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /重新生成文案/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /复制结果链接/ })).toBeInTheDocument();
  }, 15000);

  it("exposes the selected answer while moving to the next question", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /开始鉴定/ }));
    const npcAnswer = screen.getByRole("button", { name: /NPC/ });

    expect(npcAnswer).toHaveAttribute("aria-pressed", "false");
    await user.click(npcAnswer);
    expect(npcAnswer).toHaveAttribute("aria-pressed", "true");
  });

  it("clears the shared result URL when restarting from a direct result link", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/?result=OHBG");

    render(<App />);

    expect(await screen.findByText("人间烟火长发男")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /再测一次/ }));

    expect(screen.getByText("01 / 24")).toBeInTheDocument();
    expect(new URL(window.location.href).searchParams.has("result")).toBe(false);
  });

  it("saves the share card with a QR code and a downloadable filename", async () => {
    const user = userEvent.setup();
    const clickedAnchors: HTMLAnchorElement[] = [];
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");
    clickSpy.mockImplementation(function captureClick(this: HTMLAnchorElement) {
      clickedAnchors.push(this);
    });
    window.history.replaceState(null, "", "/?result=OHBG");

    render(<App />);

    expect(await screen.findByText("人间烟火长发男")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /生成图卡/ }));

    expect(screen.getByLabelText(/扫码进入 https:\/\/longhair-guy-detector\.pages\.dev\//)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /保存图片/ }));

    await waitFor(() => expect(mockedToPng).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(clickSpy).toHaveBeenCalledTimes(1));

    expect(clickedAnchors[0]?.download).toBe("longhair-guy-OHBG.png");
    expect(clickedAnchors[0]?.href).toMatch(/^(data:image\/png|blob:)/);
    expect(screen.getByText("已生成 1080x1350 PNG。如未自动下载，可点备用保存链接。")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "备用保存链接" })).toHaveAttribute("download", "longhair-guy-OHBG.png");

    clickSpy.mockRestore();
  });
});
